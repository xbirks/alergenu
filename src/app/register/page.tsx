'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { auth, db } from '@/lib/firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { PublicHeader } from '@/components/layout/PublicHeader';

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

const pricingPlans = [
    {
      id: 'gratuito',
      name: 'Plan gratuito',
      price: null,
      details: '3 meses gratis',
    },
    {
      id: 'autonomia',
      name: 'Plan Autonomía',
      price: '19€',
      details: 'Mensual, IVA inc.',
    },
    {
      id: 'premium',
      name: 'Plan Premium',
      price: '49€',
      details: 'Mensual, IVA inc.',
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submissionAttempted, setSubmissionAttempted] = useState(false);

  // State for managing placeholder visibility
  const [placeholders, setPlaceholders] = useState({
    restaurantName: 'Ej: Restaurante Pepe',
    ownerName: 'Ej: María Pérez Fernández',
    email: 'Ej: mariaperez@gmail.com',
  });

  const handleFocus = (field: keyof typeof placeholders) => {
    setPlaceholders(prev => ({ ...prev, [field]: '' }));
  };

  const handleBlur = (field: keyof typeof placeholders, originalPlaceholder: string, value: string) => {
    if (!value) {
      setPlaceholders(prev => ({ ...prev, [field]: originalPlaceholder }));
    }
  };

  useEffect(() => {
    const planFromUrl = searchParams.get('plan');
    if (planFromUrl && ['gratuito', 'autonomia', 'premium'].includes(planFromUrl)) {
      setSelectedPlan(planFromUrl);
    }
  }, [searchParams]);
  
  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
    if (planId === 'gratuito' && restaurantNameRef.current) {
      restaurantNameRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const isFormComplete = restaurantName && ownerName && email && password && confirmPassword;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmissionAttempted(true);
    setError('');

    if (!isFormComplete || !termsAccepted) {
        setError('Por favor, rellena todos los campos obligatorios y acepta los términos.');
        return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const restaurantSlug = slugify(restaurantName);

      await setDoc(doc(db, 'restaurants', user.uid), {
        uid: user.uid,
        restaurantName,
        slug: restaurantSlug, 
        ownerName,
        email: user.email,
        selectedPlan: selectedPlan,
        createdAt: new Date(),
        termsAcceptedAt: new Date(),
      });

      const categoriesCollectionRef = collection(db, 'restaurants', user.uid, 'categories');
      const defaultCategories = [
        { name: 'Entrantes', order: 1 },
        { name: 'Platos Principales', order: 2 },
        { name: 'Postres', order: 3 },
        { name: 'Bebidas', order: 4 },
      ];

      for (const category of defaultCategories) {
        await addDoc(categoriesCollectionRef, category);
      }

      router.push('/dashboard');

    } catch (error: any) {
      let errorMessage = 'Ocurrió un error al crear la cuenta.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo electrónico ya está en uso.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico no es válido.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white">
                <div className="text-center">
                    <Image src='/alergenu.png' alt='Alergenu Logo' width={180} height={48} className="mx-auto mt-16 mb-10" />
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Crea tu cuenta</h1>
                    <p className="text-muted-foreground text-sm">
                        Introduce tus datos y en menos de 2 minutos estarás creando tu carta.
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5 mt-10">
                    {/* Plan Selector */}
                    <div>
                        <div className="space-y-4">
                            {pricingPlans.map((plan) => {
                                const isSelected = selectedPlan === plan.id;
                                return (
                                <button
                                    type="button"
                                    key={plan.id}
                                    onClick={() => handlePlanSelection(plan.id)}
                                    className={`w-full flex justify-between items-center px-6 rounded-full transition-all duration-200 h-16`}
                                    style={isSelected ? { backgroundColor: '#959595' } : { backgroundColor: '#f3f4f6' }}
                                >
                                    <span className={`font-semibold text-base ${isSelected ? 'text-white' : 'text-gray-800'}`}>{plan.name}</span>
                                    <div className="flex items-center gap-x-4">
                                        {plan.price && (
                                            <div className="text-right">
                                                <p className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-gray-900'}`}>{plan.price}</p>
                                                <p className={`text-xs ${isSelected ? 'text-gray-200' : 'text-muted-foreground'} -mt-1`}>{plan.details}</p>
                                            </div>
                                        )}
                                        {isSelected && (
                                            <span className="bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-full">
                                                Seleccionado
                                            </span>
                                        )}
                                    </div>
                                </button>
                                );
                            })}
                        </div>

                        <div className="flex justify-start items-center gap-2 pt-4 px-2">
                            <p className="text-sm text-gray-600">Tus pagos seguros con</p>
                            <Image src="/icons/web_icons/stripe.svg" alt="Stripe Logo" width={48} height={20} />
                        </div>
                    </div>
                    
                    <hr className="!my-12 border-gray-200" />

                    {/* Form Inputs */}
                    <div className="space-y-5">
                        <div>
                            <Label htmlFor='restaurant-name' className="text-base font-medium text-gray-800 pb-2 inline-block pl-4">Nombre del restaurante*</Label>
                            <Input
                                ref={restaurantNameRef}
                                id='restaurant-name'
                                placeholder={placeholders.restaurantName}
                                onFocus={() => handleFocus('restaurantName')}
                                onBlur={() => handleBlur('restaurantName', 'Ej: Restaurante Pepe', restaurantName)}
                                required value={restaurantName}
                                onChange={(e) => setRestaurantName(e.target.value)}
                                className={`h-12 px-5 text-base rounded-full text-blue-600 ${submissionAttempted && !restaurantName ? 'border-2 border-red-500' : ''}`}
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground mt-2 px-4">
                            *Asegúrate que el nombre es correcto, más adelante no se podrá modificar. Va relacionado con tu QR.
                            </p>
                        </div>
                        <div>
                            <Label htmlFor='owner-name' className="text-base font-medium text-gray-800 pb-2 inline-block pl-4">Tu nombre y apellidos</Label>
                            <Input
                                id='owner-name'
                                placeholder={placeholders.ownerName}
                                onFocus={() => handleFocus('ownerName')}
                                onBlur={() => handleBlur('ownerName', 'Ej: María Pérez Fernández', ownerName)}
                                required value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                                className={`h-12 px-5 text-base rounded-full text-blue-600 ${submissionAttempted && !ownerName ? 'border-2 border-red-500' : ''}`}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <Label htmlFor='email' className="text-base font-medium text-gray-800 pb-2 inline-block pl-4">Correo electrónico</Label>
                            <Input
                                id='email'
                                type='email'
                                placeholder={placeholders.email}
                                onFocus={() => handleFocus('email')}
                                onBlur={() => handleBlur('email', 'Ej: mariaperez@gmail.com', email)}
                                required value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`h-12 px-5 text-base rounded-full text-blue-600 ${submissionAttempted && !email ? 'border-2 border-red-500' : ''}`}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <Label htmlFor='password' className="text-base font-medium text-gray-800 pb-2 inline-block pl-4">Contraseña</Label>
                            <div className="relative flex items-center">
                                <Input
                                    id='password'
                                    type={showPassword ? 'text' : 'password'}
                                    required value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`h-12 px-5 text-base rounded-full pr-12 text-blue-600 ${submissionAttempted && !password ? 'border-2 border-red-500' : ''}`}
                                    disabled={loading}
                                />
                                <button type='button' onClick={() => setShowPassword(p => !p)} className="absolute right-1 h-10 w-10 flex items-center justify-center text-muted-foreground bg-white rounded-full">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                         <div>
                            <Label htmlFor='confirm-password' className="text-base font-medium text-gray-800 pb-2 inline-block pl-4">Repite tu contraseña</Label>
                            <div className="relative flex items-center">
                                <Input
                                    id='confirm-password'
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`h-12 px-5 text-base rounded-full pr-12 text-blue-600 ${submissionAttempted && !confirmPassword ? 'border-2 border-red-500' : ''}`}
                                    disabled={loading}
                                />
                                <button type='button' onClick={() => setShowConfirmPassword(p => !p)} className="absolute right-1 h-10 w-10 flex items-center justify-center text-muted-foreground bg-white rounded-full">
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className={`pt-4 space-y-4 rounded-lg ${submissionAttempted && !termsAccepted ? 'ring-2 ring-red-500' : ''}`}>
                        <div className="flex justify-between items-center px-2">
                            <Label htmlFor="terms" className="text-sm font-normal leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 max-w-[85%]">
                                Por favor, lee nuestros <Link href="/legal/terms-of-service" className="text-blue-600 underline">términos y condiciones</Link> y luego haz click para aceptarlas.*
                            </Label>
                             <Switch id="terms" checked={termsAccepted} onCheckedChange={setTermsAccepted} disabled={loading} />
                        </div>
                         <p className="text-xs text-muted-foreground px-4">
                            *¡Importante! NO recibirás publicidad de ningún tipo ni se compartirán tus datos sensibles con empresas externas.
                        </p>
                    </div>
                    
                    {error && (
                        <p className='text-center text-sm text-red-600 bg-red-50 p-3 rounded-full mt-4'>{error}</p>
                    )}
                    
                    <div className="pt-4">
                        <Button type='submit' size="lg" className="w-full rounded-full h-14 text-lg font-bold" style={{ backgroundColor: '#2563EB' }} disabled={loading}>
                            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
      </main>
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
