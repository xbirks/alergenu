'use client';

import React, { useState } from 'react';
import { Loader2, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { auth, db } from '@/lib/firebase/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, collection, writeBatch, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { GoogleRegistrationModal } from '@/components/auth/GoogleRegistrationModal';

import { DetectedMenuItem } from '@/ai/menuPhotoAnalysis';

interface ConversionModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemCount: number;
    analyzedItems: DetectedMenuItem[];
    analyzedCategories: string[];
}

const slugify = (text: string) => {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
    const p = new RegExp(a.split('').join('|'), 'g');

    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(p, c => b.charAt(a.indexOf(c)))
        .replace(/&/g, '-and-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

const findUniqueSlug = async (db: any, baseSlug: string): Promise<string> => {
    const restaurantsRef = collection(db, 'restaurants');
    let currentSlug = baseSlug;
    let counter = 2;
    let isUnique = false;

    while (!isUnique) {
        const q = query(restaurantsRef, where("slug", "==", currentSlug));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            isUnique = true;
        } else {
            currentSlug = `${baseSlug}-${counter}`;
            counter++;
        }
    }
    return currentSlug;
};

export function ConversionModal({ isOpen, onClose, itemCount, analyzedItems, analyzedCategories }: ConversionModalProps) {
    const router = useRouter();
    const [restaurantName, setRestaurantName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [submissionAttempted, setSubmissionAttempted] = useState(false);

    // Google Sign-In states
    const [showGoogleModal, setShowGoogleModal] = useState(false);
    const [googleUser, setGoogleUser] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmissionAttempted(true);
        setError('');

        if (!restaurantName || !ownerName || !email || !password || !confirmPassword || !termsAccepted) {
            setError('Por favor, rellena todos los campos obligatorios y acepta los términos.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // We still send the verification email, but we don't block the user
            try {
                await sendEmailVerification(user);
            } catch (verError) {
                console.warn("Could not send verification email", verError);
            }

            const baseSlug = slugify(restaurantName);
            const uniqueSlug = await findUniqueSlug(db, baseSlug);

            const batch = writeBatch(db);
            const restaurantRef = doc(db, 'restaurants', user.uid);
            const userRef = doc(db, 'users', user.uid);
            const legalRef = doc(db, 'legalAcceptances', user.uid);

            const trialEndDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

            // 1. Restaurant Document
            batch.set(restaurantRef, {
                uid: user.uid,
                restaurantName,
                slug: uniqueSlug,
                ownerName,
                email: user.email,
                selectedPlan: 'gratuito',
                subscriptionStatus: 'trialing',
                trialEndsAt: trialEndDate,
                createdAt: serverTimestamp(),
                termsAcceptedAt: serverTimestamp(),
                hasSeenWelcomeVideo: false,
            });

            // 2. User Document
            batch.set(userRef, {
                email: user.email,
                displayName: ownerName,
                createdAt: serverTimestamp(),
            });

            // 3. Legal Acceptance Document
            batch.set(legalRef, {
                userId: user.uid,
                version: '1.0.0',
                acceptedAt: serverTimestamp(),
                ipAddress: 'landing-conversion',
            });

            // 4. Categories & Menu Items
            const categoriesCollectionRef = collection(db, 'restaurants', user.uid, 'categories');
            const menuItemsCollectionRef = collection(db, 'restaurants', user.uid, 'menuItems');

            // Category tracking to avoid duplicates and map specific items
            const categoryMap: Record<string, string> = {}; // Name -> ID

            // If we have analyzed categories, use them. Otherwise default.
            const categoriesToCreate = analyzedCategories.length > 0
                ? analyzedCategories.map((name, idx) => ({
                    name_i18n: { es: name, en: '' }, // AI might have translated usage, but for now base name
                    order: idx + 1
                }))
                : [
                    { name_i18n: { es: 'Entrantes', en: 'Starters' }, order: 1 },
                    { name_i18n: { es: 'Platos Principales', en: 'Main Courses' }, order: 2 },
                    { name_i18n: { es: 'Postres', en: 'Desserts' }, order: 3 },
                    { name_i18n: { es: 'Bebidas', en: 'Drinks' }, order: 4 },
                ];

            for (const cat of categoriesToCreate) {
                const catDocRef = doc(categoriesCollectionRef);
                batch.set(catDocRef, cat);
                // Store ID for item mapping (assuming 'es' name matches analyzed category string)
                if (cat.name_i18n.es) {
                    categoryMap[cat.name_i18n.es] = catDocRef.id;
                }
            }

            // 5. Save Analyzed Menu Items
            if (analyzedItems.length > 0) {
                analyzedItems.forEach((item, index) => {
                    const itemRef = doc(menuItemsCollectionRef);
                    const categoryId = categoryMap[item.category] || '';

                    // Simple confidence check logic (mock)
                    // If prices are 0 or allergens empty, we flag it
                    const needsReview = item.price === 0 || !item.allergens || item.allergens.length === 0;

                    // Aggressive sanitization to prevent Firestore undefined errors
                    const safeNameEs = item.name_i18n?.es || 'Sin nombre';
                    const safeNameEn = item.name_i18n?.en || '';
                    const safeDescEs = item.description_i18n?.es || '';
                    const safeDescEn = item.description_i18n?.en || '';
                    const safeCategory = item.category || 'Sin categoría';

                    const itemData = {
                        name_i18n: {
                            es: safeNameEs,
                            en: safeNameEn
                        },
                        description_i18n: {
                            es: safeDescEs,
                            en: safeDescEn
                        },
                        price: Math.round((item.price || 0) * 100), // Validate price
                        categoryId: categoryId || '',
                        category: safeCategory,
                        category_i18n: {
                            es: safeCategory,
                            en: ''
                        },
                        // Ensure allergens is never undefined/null before reduce
                        allergens: (Array.isArray(item.allergens) ? item.allergens : []).reduce((acc, all) => ({ ...acc, [all]: 'yes' }), {}),
                        isAvailable: true,
                        reviewStatus: 'pending',
                        confidence: needsReview ? 'low' : 'high',
                        order: (typeof index === 'number') ? index : 0,
                        createdAt: serverTimestamp(),
                    };

                    batch.set(itemRef, itemData);
                });
            }

            await batch.commit();

            // Send Discord notification
            try {
                await fetch('/api/discord-notify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'registration',
                        metadata: {
                            email: user.email,
                            displayName: ownerName,
                            source: 'foto-a-carta',
                            itemsCount: analyzedItems.length
                        }
                    })
                });
            } catch (discordError) {
                console.error('Failed to send Discord notification:', discordError);
            }

            toast.success('¡Cuenta creada con éxito!');

            // REDIRECT TO BULK REVIEW instead of Verify Email
            // This is the key change requested
            router.push('/dashboard/menu/review');

        } catch (error: any) {
            console.error("Registration Error:", error);
            let errorMessage = 'Ocurrió un error al crear la cuenta.';
            if (error.code === 'auth/email-already-in-use') errorMessage = 'Este correo electrónico ya está en uso.';
            else if (error.message) errorMessage = error.message;
            setError(errorMessage);
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async (user: any) => {
        setLoading(true);
        setError('');

        try {
            // Check if user already exists in Firestore
            const restaurantDoc = await getDocs(query(collection(db, 'restaurants'), where('__name__', '==', user.uid)));

            if (!restaurantDoc.empty) {
                // User already exists, redirect to dashboard
                router.push('/dashboard');
                return;
            }

            // New user - show modal to collect restaurant name
            setGoogleUser(user);
            setShowGoogleModal(true);
            setLoading(false);

        } catch (error: any) {
            console.error('Google Sign-In Error:', error);
            setError('Error al iniciar sesión con Google. Por favor, inténtalo de nuevo.');
            setLoading(false);
        }
    };

    const completeGoogleRegistration = async (restaurantName: string, termsAccepted: boolean) => {
        if (!googleUser) return;

        setLoading(true);

        try {
            const user = googleUser;

            const baseSlug = slugify(restaurantName);
            const uniqueSlug = await findUniqueSlug(db, baseSlug);

            const batch = writeBatch(db);
            const restaurantRef = doc(db, 'restaurants', user.uid);
            const userRef = doc(db, 'users', user.uid);
            const legalRef = doc(db, 'legalAcceptances', user.uid);

            const trialEndDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

            // 1. Restaurant Document
            batch.set(restaurantRef, {
                uid: user.uid,
                restaurantName,
                slug: uniqueSlug,
                ownerName: user.displayName || '',
                email: user.email,
                selectedPlan: 'gratuito',
                subscriptionStatus: 'trialing',
                trialEndsAt: trialEndDate,
                createdAt: serverTimestamp(),
                termsAcceptedAt: serverTimestamp(),
                hasSeenWelcomeVideo: false,
            });

            // 2. User Document
            batch.set(userRef, {
                email: user.email,
                displayName: user.displayName || '',
                createdAt: serverTimestamp(),
            });

            // 3. Legal Acceptance Document
            batch.set(legalRef, {
                userId: user.uid,
                version: '1.0.0',
                acceptedAt: serverTimestamp(),
                ipAddress: 'landing-conversion-google',
            });

            // 4. Categories & Menu Items
            const categoriesCollectionRef = collection(db, 'restaurants', user.uid, 'categories');
            const menuItemsCollectionRef = collection(db, 'restaurants', user.uid, 'menuItems');

            const categoryMap: Record<string, string> = {};

            const categoriesToCreate = analyzedCategories.length > 0
                ? analyzedCategories.map((name, idx) => ({
                    name_i18n: { es: name, en: '' },
                    order: idx + 1
                }))
                : [
                    { name_i18n: { es: 'Entrantes', en: 'Starters' }, order: 1 },
                    { name_i18n: { es: 'Platos Principales', en: 'Main Courses' }, order: 2 },
                    { name_i18n: { es: 'Postres', en: 'Desserts' }, order: 3 },
                    { name_i18n: { es: 'Bebidas', en: 'Drinks' }, order: 4 },
                ];

            for (const cat of categoriesToCreate) {
                const catDocRef = doc(categoriesCollectionRef);
                batch.set(catDocRef, cat);
                if (cat.name_i18n.es) {
                    categoryMap[cat.name_i18n.es] = catDocRef.id;
                }
            }

            // 5. Save Analyzed Menu Items
            if (analyzedItems.length > 0) {
                analyzedItems.forEach((item, index) => {
                    const itemRef = doc(menuItemsCollectionRef);
                    const categoryId = categoryMap[item.category] || '';
                    const needsReview = item.price === 0 || !item.allergens || item.allergens.length === 0;

                    const safeNameEs = item.name_i18n?.es || 'Sin nombre';
                    const safeNameEn = item.name_i18n?.en || '';
                    const safeDescEs = item.description_i18n?.es || '';
                    const safeDescEn = item.description_i18n?.en || '';
                    const safeCategory = item.category || 'Sin categoría';

                    const itemData = {
                        name_i18n: {
                            es: safeNameEs,
                            en: safeNameEn
                        },
                        description_i18n: {
                            es: safeDescEs,
                            en: safeDescEn
                        },
                        price: Math.round((item.price || 0) * 100),
                        categoryId: categoryId || '',
                        category: safeCategory,
                        category_i18n: {
                            es: safeCategory,
                            en: ''
                        },
                        allergens: (Array.isArray(item.allergens) ? item.allergens : []).reduce((acc, all) => ({ ...acc, [all]: 'yes' }), {}),
                        isAvailable: true,
                        reviewStatus: 'pending',
                        confidence: needsReview ? 'low' : 'high',
                        order: (typeof index === 'number') ? index : 0,
                        createdAt: serverTimestamp(),
                    };

                    batch.set(itemRef, itemData);
                });
            }

            await batch.commit();

            // Send Discord notification
            try {
                await fetch('/api/discord-notify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'registration',
                        metadata: {
                            email: user.email,
                            displayName: user.displayName,
                            source: 'foto-a-carta-google',
                            itemsCount: analyzedItems.length
                        }
                    })
                });
            } catch (discordError) {
                console.error('Failed to send Discord notification:', discordError);
            }

            router.push('/dashboard/menu/review');

        } catch (error: any) {
            console.error('Google Registration Completion Error:', error);
            setError('Error al completar el registro. Por favor, inténtalo de nuevo.');
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-3 pb-4 sr-only">
                    <DialogTitle className="text-2xl font-bold tracking-tight text-center">
                        Crea tu cuenta
                    </DialogTitle>
                    <DialogDescription className="text-center text-sm text-muted-foreground">
                        Elige tu plan y empieza a crear tu carta digital.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Motivational Title */}
                    <div className="text-center pb-2">
                        <h3 className="text-4xl font-bold text-gray-900">
                            Estás a un paso de <span className="text-blue-600">digitalizar tu carta</span>
                        </h3>
                        <p className="text-lg text-gray-600 mt-2">
                            Comienza con <strong className="text-blue-600">3 meses gratis</strong> sin compromiso
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                        <div className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-lg text-gray-700">
                                Carta digital con <strong>filtros de alérgenos</strong>
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-lg text-gray-700">
                                <strong>Traducción automática</strong> a inglés
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-lg text-gray-700">
                                Sin compromiso ni tarjeta de crédito
                            </p>
                        </div>
                    </div>

                    {/* Google Sign-In - Primera opción */}
                    <div className="mt-6">
                        <GoogleSignInButton
                            onSuccess={handleGoogleSignIn}
                            onError={(error) => {
                                setError(error.message);
                            }}
                            disabled={loading}
                        />
                    </div>

                    {/* Separator */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="text-sm text-muted-foreground">o regístrate con tu email</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    <hr className="!my-8 border-gray-200" />

                    {/* Form Inputs - EXACT from /register */}
                    <div className="space-y-5">
                        <div>
                            <Label htmlFor='restaurant-name' className="text-base font-bold text-gray-800 pb-2 inline-block pl-4">
                                Nombre del restaurante*
                            </Label>
                            <Input
                                id='restaurant-name'
                                required
                                value={restaurantName}
                                onChange={(e) => setRestaurantName(e.target.value)}
                                className={`h-12 px-5 text-base rounded-full ${restaurantName ? 'text-blue-600 font-medium border-blue-200 bg-blue-50/50' : ''} ${submissionAttempted && !restaurantName ? 'border-red-500' : ''}`}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <Label htmlFor='owner-name' className="text-base font-bold text-gray-800 pb-2 inline-block pl-4">
                                Tu nombre y apellidos*
                            </Label>
                            <Input
                                id='owner-name'
                                required
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                                className={`h-12 px-5 text-base rounded-full ${ownerName ? 'text-blue-600 font-medium border-blue-200 bg-blue-50/50' : ''} ${submissionAttempted && !ownerName ? 'border-red-500' : ''}`}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <Label htmlFor='email' className="text-base font-bold text-gray-800 pb-2 inline-block pl-4">
                                Correo electrónico*
                            </Label>
                            <Input
                                id='email'
                                type='email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`h-12 px-5 text-base rounded-full ${email ? 'text-blue-600 font-medium border-blue-200 bg-blue-50/50' : ''} ${submissionAttempted && !email ? 'border-red-500' : ''}`}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <Label htmlFor='password' className="text-base font-bold text-gray-800 pb-2 inline-block pl-4">
                                Contraseña*
                            </Label>
                            <div className="relative">
                                <Input
                                    id='password'
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`h-12 px-5 text-base rounded-full pr-12 ${password ? 'text-blue-600 font-medium border-blue-200 bg-blue-50/50' : ''} ${submissionAttempted && !password ? 'border-red-500' : ''}`}
                                    disabled={loading}
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(p => !p)}
                                    className="absolute right-1 top-1 h-10 w-10 flex items-center justify-center text-muted-foreground bg-white rounded-full"
                                >
                                    <EyeOff className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor='confirm-password' className="text-base font-bold text-gray-800 pb-2 inline-block pl-4">
                                Repite tu contraseña*
                            </Label>
                            <div className="relative">
                                <Input
                                    id='confirm-password'
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`h-12 px-5 text-base rounded-full pr-12 ${confirmPassword ? 'text-blue-600 font-medium border-blue-200 bg-blue-50/50' : ''} ${submissionAttempted && !confirmPassword ? 'border-red-500' : ''}`}
                                    disabled={loading}
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowConfirmPassword(p => !p)}
                                    className="absolute right-1 top-1 h-10 w-10 flex items-center justify-center text-muted-foreground bg-white rounded-full"
                                >
                                    <EyeOff className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Terms and Conditions - EXACT from /register */}
                    <div className={`pt-4 space-y-4 rounded-lg ${submissionAttempted && !termsAccepted ? 'ring-2 ring-red-500' : ''}`}>
                        <div className="flex items-center gap-4 px-2">
                            <Switch
                                id="terms"
                                checked={termsAccepted}
                                onCheckedChange={setTermsAccepted}
                                disabled={loading}
                            />
                            <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                                Acepto los <Link href="/legal/terms-of-service" className="underline">términos y condiciones</Link>.*
                            </Label>
                        </div>
                    </div>

                    {error && (
                        <p className='text-center text-lg text-red-600 bg-red-50 p-3 rounded-md mt-4'>
                            {error}
                        </p>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button
                            type='submit'
                            size="lg"
                            className="w-full rounded-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : 'Continuar'}
                        </Button>
                    </div>
                </form>

                {/* Google Registration Modal */}
                <GoogleRegistrationModal
                    isOpen={showGoogleModal}
                    onClose={() => setShowGoogleModal(false)}
                    onComplete={completeGoogleRegistration}
                    userDisplayName={googleUser?.displayName}
                />
            </DialogContent>
        </Dialog>
    );
}