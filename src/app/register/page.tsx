'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase'; 
import { PublicHeader } from '@/components/layout/PublicHeader';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const initialEmail = searchParams.get('email');
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialEmail && !email) {
      setEmail(initialEmail);
    }
  }, [initialEmail, email]);

  useEffect(() => {
    // Focus on the email input if it is empty
    if (emailInputRef.current && !email) {
      emailInputRef.current.focus();
    }
  }, [email]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, 'restaurants', user.uid), {
        owner_uid: user.uid,
        restaurant_name: restaurantName,
        email: user.email,
        subscription_plan: 'free', 
        stripe_customer_id: null,
        created_at: new Date(),
      });

      setVerificationSent(true);

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado. Intenta iniciar sesión.');
      } else if (error.code === 'auth/invalid-email') {
        setError('El correo electrónico no es válido.');
      } else {
        setError('Ocurrió un error durante el registro.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
        <div className="min-h-screen bg-background">
            <PublicHeader />
            <main className="flex items-center justify-center py-20 px-4">
                <div className="w-full max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-lg">
                    <Image src='/alergenu.png' alt='Alergenu Logo' width={180} height={48} className="mx-auto mb-8" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">¡Revisa tu correo!</h1>
                    <p className="text-gray-600 mb-6">
                        Te hemos enviado un enlace de verificación a <strong>{email}</strong>. Por favor, haz clic en el enlace para activar tu cuenta y poder iniciar sesión.
                    </p>
                    <p className="text-sm text-gray-500">No olvides revisar tu carpeta de spam si no lo encuentras.</p>
                    <div className="mt-8">
                        <Button asChild size="lg" className="w-full rounded-full h-14 text-lg font-bold" style={{ backgroundColor: '#2563EB' }}>
                            <Link href="/login">Volver a inicio de sesión</Link>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="flex items-center justify-center pb-20 pt-2 px-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white">
          <div className="text-center">
                <Image src='/alergenu.png' alt='Alergenu Logo' width={180} height={48} className="mx-auto mt-16 mb-10" />
                <h1 className="text-2xl font-bold tracking-tight mb-1">Crea tu cuenta gratis</h1>
                <p className="text-muted-foreground text-sm">
                    Empieza a gestionar tu carta de alérgenos en minutos.
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-10">
            <div>
                <Label htmlFor='restaurantName' className="text-base font-bold text-gray-800 pb-2 inline-block pl-4">¿Cómo se llama tu restaurante?</Label>
                <Input
                  id='restaurantName'
                  type='text'
                  placeholder='Ej: Restaurante La Buena Mesa'
                  required
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="h-12 px-5 text-base rounded-full text-blue-600"
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor='email' className="text-base font-bold text-gray-800 pb-2 inline-block pl-4">Tu correo electrónico</Label>
                <Input
                  ref={emailInputRef}
                  id='email'
                  type='email'
                  placeholder='Escribe tu correo'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 px-5 text-base rounded-full text-blue-600"
                  disabled={loading}
                />
              </div>
              <div>
              <Label htmlFor='password' className="text-base font-bold text-gray-800 pb-2 inline-block pl-4">Crea una contraseña</Label>
                <div className="relative flex items-center">
                    <Input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Mínimo 6 caracteres'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 px-5 text-base rounded-full pr-12 text-blue-600"
                        disabled={loading}
                    />
                    <button type='button' onClick={() => setShowPassword(p => !p)} className="absolute right-1 h-10 w-10 flex items-center justify-center text-muted-foreground bg-white rounded-full">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
              </div>

              {error && (
                <p className='text-center text-sm text-red-600 bg-red-50 p-3 rounded-full'>{error}</p>
              )}

              <div className="pt-4">
                  <Button type='submit' size="lg" className="w-full rounded-full h-14 text-lg font-bold" style={{ backgroundColor: '#2563EB' }} disabled={loading}>
                      {loading ? (
                          <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Creando cuenta...</>
                      ) : (
                          'Crear mi cuenta gratis'
                      )}
                  </Button>
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  ¿Ya tienes cuenta? <Link href="/login" className="font-semibold text-blue-600 hover:underline">Inicia sesión aquí</Link>
                </p>
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
      <RegisterFormContent />
    </Suspense>
  );
}