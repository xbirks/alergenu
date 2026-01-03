'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, collection, writeBatch, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { GoogleRegistrationModal } from '@/components/auth/GoogleRegistrationModal';
// La importación de loadStripe y stripePromise ya no es necesaria aquí
// import { loadStripe } from '@stripe/stripe-js';
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

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
}

// Function to find a unique slug
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

const pricingPlans = [
  {
    id: 'gratuito',
    name: 'Plan gratuito',
    price: null,
    details: '3 meses gratis',
    priceId: null,
  },
  {
    id: 'autonomia',
    name: 'Plan Autonomía',
    price: '12€',
    details: 'Mensual, IVA inc.',
    // ¡IMPORTANTE!: Asegúrate de que este Price ID sea de tu MODO DE PRUEBA de Stripe
    // O bien, cámbialo a tu price_live_ID cuando vayas a producción.
    priceId: 'price_1STO8NH4esVSm5sUhD9EWIlh',
  },
  {
    id: 'premium',
    name: 'Plan Premium',
    price: '79€',
    details: 'Mensual, IVA inc.',
    priceId: 'price_1Sa1FNH4esVSm5sUs2oVES7q',
  },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantNameRef = useRef<HTMLInputElement>(null);

  const [selectedPlan, setSelectedPlan] = useState('gratuito');
  const [restaurantName, setRestaurantName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [userIp, setUserIp] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submissionAttempted, setSubmissionAttempted] = useState(false);

  // Google Sign-In states
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleUser, setGoogleUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/get-ip').then(res => res.json()).then(data => setUserIp(data.ip || 'IP not found'));
    const planFromUrl = searchParams.get('plan');
    if (planFromUrl && ['gratuito', 'autonomia', 'premium'].includes(planFromUrl)) {
      setSelectedPlan(planFromUrl);
    }
  }, [searchParams]);

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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

      await sendEmailVerification(user);

      const baseSlug = slugify(restaurantName);
      const uniqueSlug = await findUniqueSlug(db, baseSlug);

      const batch = writeBatch(db);
      const restaurantRef = doc(db, 'restaurants', user.uid);
      const userRef = doc(db, 'users', user.uid);
      const legalRef = doc(db, 'legalAcceptances', user.uid);

      const initialStatus = selectedPlan === 'gratuito' ? 'trialing' : 'incomplete';
      const trialEndDate = selectedPlan === 'gratuito' ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) : null;

      // 1. Restaurant Document
      batch.set(restaurantRef, {
        uid: user.uid,
        restaurantName,
        slug: uniqueSlug,
        ownerName,
        email: user.email,
        selectedPlan,
        subscriptionStatus: initialStatus,
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
        userId: user.uid, version: '1.0.0', acceptedAt: serverTimestamp(), ipAddress: userIp,
      });

      // 4. Default Categories
      const categoriesCollectionRef = collection(db, 'restaurants', user.uid, 'categories');
      const defaultCategories = [
        { name_i18n: { es: 'Entrantes', en: 'Starters' }, order: 1 },
        { name_i18n: { es: 'Platos Principales', en: 'Main Courses' }, order: 2 },
        { name_i18n: { es: 'Postres', en: 'Desserts' }, order: 3 },
        { name_i18n: { es: 'Bebidas', en: 'Drinks' }, order: 4 },
      ];
      defaultCategories.forEach(cat => batch.set(doc(categoriesCollectionRef), cat));

      await batch.commit();

      // Send Discord notification for new registration
      try {
        await fetch('/api/discord-notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'registration',
            metadata: { email: user.email, displayName: ownerName }
          })
        });
      } catch (discordError) {
        console.error('Failed to send Discord notification:', discordError);
        // Don't block registration if Discord notification fails
      }

      // --- Plan-specific redirection ---
      const planDetails = pricingPlans.find(p => p.id === selectedPlan);

      if (planDetails && planDetails.priceId) {
        // Paid plan: Redirect to Stripe Checkout
        const res = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.uid,
            userEmail: user.email,
            userName: ownerName,
            priceId: planDetails.priceId
          }),
        });

        const { url, error: apiError } = await res.json(); // Ahora esperamos 'url' en lugar de 'sessionId'

        if (apiError) throw new Error(apiError);
        if (!url) throw new Error('Could not retrieve a checkout session URL.');

        // Redirigir directamente a la URL proporcionada por el backend
        window.location.href = url;

      } else {
        // Free plan: Redirect to email verification page
        router.push('/auth/verify-email');
      }

    } catch (error: any) {
      console.error("Registration or Checkout Error:", error);
      let errorMessage = 'Ocurrió un error al crear la cuenta.';
      if (error.code === 'auth/email-already-in-use') errorMessage = 'Este correo electrónico ya está en uso.';
      else if (error.message) errorMessage = error.message;
      setError(errorMessage);
      setLoading(false);
    }
    // Note: setLoading(false) is not called on successful paid plan redirection because the page unloads.
  };

  const handleGoogleSignIn = async (user: any) => {
    setLoading(true);
    setError('');

    try {
      // Check if user already exists in Firestore
      const restaurantRef = doc(db, 'restaurants', user.uid);
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

    const user = googleUser;
    const baseSlug = slugify(restaurantName);
    const uniqueSlug = await findUniqueSlug(db, baseSlug);

    const batch = writeBatch(db);
    const restaurantRef = doc(db, 'restaurants', user.uid);
    const userRef = doc(db, 'users', user.uid);
    const legalRef = doc(db, 'legalAcceptances', user.uid);

    const initialStatus = selectedPlan === 'gratuito' ? 'trialing' : 'incomplete';
    const trialEndDate = selectedPlan === 'gratuito' ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) : null;

    // 1. Restaurant Document
    batch.set(restaurantRef, {
      uid: user.uid,
      restaurantName,
      slug: uniqueSlug,
      ownerName: user.displayName || '',
      email: user.email,
      selectedPlan,
      subscriptionStatus: initialStatus,
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
      userId: user.uid, version: '1.0.0', acceptedAt: serverTimestamp(), ipAddress: userIp,
    });

    // 4. Default Categories
    const categoriesCollectionRef = collection(db, 'restaurants', user.uid, 'categories');
    const defaultCategories = [
      { name_i18n: { es: 'Entrantes', en: 'Starters' }, order: 1 },
      { name_i18n: { es: 'Platos Principales', en: 'Main Courses' }, order: 2 },
      { name_i18n: { es: 'Postres', en: 'Desserts' }, order: 3 },
      { name_i18n: { es: 'Bebidas', en: 'Drinks' }, order: 4 },
    ];
    defaultCategories.forEach(cat => batch.set(doc(categoriesCollectionRef), cat));

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
            displayName: user.displayName || '',
            source: 'register-google'
          }
        })
      });
    } catch (discordError) {
      console.error('Failed to send Discord notification:', discordError);
    }

    // --- Plan-specific redirection ---
    const planDetails = pricingPlans.find(p => p.id === selectedPlan);

    if (planDetails && planDetails.priceId) {
      // Paid plan: Redirect to Stripe Checkout
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName || '',
          priceId: planDetails.priceId
        }),
      });

      const { url, error: apiError } = await res.json();

      if (apiError) throw new Error(apiError);
      if (!url) throw new Error('Could not retrieve a checkout session URL.');

      window.location.href = url;
    } else {
      // Free plan: Redirect to dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="flex items-start justify-center pt-2 pb-10 px-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white">
            <div className="text-center">
              <Image src='/alergenu.png' alt='Alergenu Logo' width={180} height={48} className="mx-auto mt-16 mb-10" />
              <h1 className="text-2xl font-bold tracking-tight mb-1">Crea tu cuenta</h1>
              <p className="text-muted-foreground text-sm">Elige tu plan y empieza a crear tu carta digital.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 mt-10">
              {/* Pricing Plans Selection */}
              <div>
                <div className="space-y-4">
                  {pricingPlans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    return (
                      <button
                        type="button"
                        key={plan.id}
                        onClick={() => handlePlanSelection(plan.id)}
                        className={`w-full flex justify-between items-center px-6 rounded-full transition-all duration-200 h-16 ${isSelected ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
                        <span className={`font-semibold text-base`}>{plan.name}</span>
                        <div className="flex items-center gap-x-4">
                          {plan.price ? (
                            <div className="text-right">
                              <p className={`font-bold text-lg`}>{plan.price}</p>
                              <p className={`text-xs ${isSelected ? 'text-gray-300' : 'text-muted-foreground'} -mt-1`}>{plan.details}</p>
                            </div>
                          ) : <div className='text-lg font-bold'>Gratis</div>}
                          {isSelected && <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Seleccionado</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-start items-center gap-2 pt-4 px-2">
                  <p className="text-sm text-gray-600">Pagos seguros gestionados por</p>
                  <Image src="/icons/web_icons/stripe.svg" alt="Stripe Logo" width={48} height={20} />
                </div>
              </div>

              {/* Google Sign-In - Primera opción */}
              <div className="mt-8">
                <GoogleSignInButton
                  onSuccess={handleGoogleSignIn}
                  onError={(error) => {
                    setError(error.message);
                  }}
                  disabled={loading}
                />
              </div>

              {/* Separator */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-sm text-muted-foreground">o regístrate con tu email</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <hr className="!my-10 border-gray-200" />

              {/* Form Inputs */}
              <div className="space-y-5">
                <div>
                  <Label htmlFor='restaurant-name' className="text-base font-bold text-gray-800 pb-2 inline-block pl-4">Nombre del restaurante*</Label>
                  <Input
                    ref={restaurantNameRef}
                    id='restaurant-name'
                    required value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    className={`h-12 px-5 text-base rounded-full ${submissionAttempted && !restaurantName ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor='owner-name' className="text-base font-bold text-gray-800 pb-2 inline-block pl-4">Tu nombre y apellidos*</Label>
                  <Input
                    id='owner-name'
                    required value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className={`h-12 px-5 text-base rounded-full ${submissionAttempted && !ownerName ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor='email' className="text-base font-bold text-gray-800 pb-2 inline-block pl-4">Correo electrónico*</Label>
                  <Input
                    id='email' type='email' required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`h-12 px-5 text-base rounded-full ${submissionAttempted && !email ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor='password' className="text-base font-bold text-gray-800 pb-2 inline-block pl-4">Contraseña*</Label>
                  <div className="relative"><Input
                    id='password' type={showPassword ? 'text' : 'password'} required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`h-12 px-5 text-base rounded-full pr-12 ${submissionAttempted && !password ? 'border-red-500' : ''}`}
                    disabled={loading}
                  /><button type='button' onClick={() => setShowPassword(p => !p)} className="absolute right-1 top-1 h-10 w-10 flex items-center justify-center text-muted-foreground bg-white rounded-full"><EyeOff className="h-5 w-5" /></button></div>
                </div>
                <div>
                  <Label htmlFor='confirm-password' className="text-base font-bold text-gray-800 pb-2 inline-block pl-4">Repite tu contraseña*</Label>
                  <div className="relative"><Input
                    id='confirm-password' type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`h-12 px-5 text-base rounded-full pr-12 ${submissionAttempted && !confirmPassword ? 'border-red-500' : ''}`}
                    disabled={loading}
                  /><button type='button' onClick={() => setShowConfirmPassword(p => !p)} className="absolute right-1 top-1 h-10 w-10 flex items-center justify-center text-muted-foreground bg-white rounded-full"><EyeOff className="h-5 w-5" /></button></div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className={`pt-4 space-y-4 rounded-lg ${submissionAttempted && !termsAccepted ? 'ring-2 ring-red-500' : ''}`}>
                <div className="flex items-center gap-4 px-2">
                  <Switch id="terms" checked={termsAccepted} onCheckedChange={setTermsAccepted} disabled={loading} />
                  <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                    Acepto los <Link href="/legal/terms-of-service" className="underline">términos y condiciones</Link>.*
                  </Label>
                </div>
              </div>

              {error && (
                <p className='text-center text-sm text-red-600 bg-red-50 p-3 rounded-md mt-4'>{error}</p>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button type='submit' size="lg" className="w-full rounded-full h-14 text-lg font-bold" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : 'Crear cuenta y continuar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Google Registration Modal */}
      <GoogleRegistrationModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onComplete={completeGoogleRegistration}
        userDisplayName={googleUser?.displayName}
      />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
