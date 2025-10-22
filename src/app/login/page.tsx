import type { Metadata } from 'next';

// Metadatos para SEO y redes sociales
export const metadata: Metadata = {
  // SEO Básico
  title: 'Inicia sesión en tu cuenta | ALERGENU',
  description: 'Inicia sesión y empieza a editar tu carta de forma simple y sencilla.',
  keywords: ['inicio sesión', 'iniciar sesión alergenu', 'carta alérgenos', 'software hostelería', 'Alergenu'],

  // Para WhatsApp, Facebook, etc. (Open Graph)
  openGraph: {
    title: 'Inicia sesión en tu cuenta | ALERGENU',
    description: 'Inicia sesión y empieza a editar tu carta de forma simple y sencilla.',
    url: 'https://www.alergenu.com/login', // Asegúrate de que esta es tu URL de producción
    siteName: 'Alergenu',
    images: [
      {
        url: 'https://alergenu.com/seo/alergenu_meta-1200x630.jpg', // Debes crear y subir esta imagen a tu carpeta /public
        width: 1200,
        height: 630,
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },

  // Para cuando se comparta en Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Inicia sesión en tu cuenta | ALERGENU',
    description: 'Inicia sesión y empieza a editar tu carta de forma simple y sencilla.',
    images: ['https://alergenu.com/seo/alergenu_twitter-1200x600.jpg'], // Debes crear y subir esta imagen a tu carpeta /public
  },
};

'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { PublicHeader } from '@/components/layout/PublicHeader';

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        setError('Tu cuenta no está verificada. Te hemos reenviado un correo, revisa tu bandeja de entrada (y spam).');
        await auth.signOut();
        setLoading(false);
        return; 
      }

      router.push('/dashboard');

    } catch (error: any) {
      let errorMessage = 'Ocurrió un error al iniciar sesión.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Correo o contraseña incorrectos.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico no es válido.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Has intentado iniciar sesión demasiadas veces. Inténtalo más tarde.';
      }
      setError(errorMessage);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="flex items-center justify-center pb-20 pt-2 px-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white">
            <div className="text-center">
                <Image src='/alergenu.png' alt='Alergenu Logo' width={180} height={48} className="mx-auto mt-16 mb-10" />
                <h1 className="text-2xl font-bold tracking-tight mb-1">Accede a tu cuenta</h1>
                <p className="text-muted-foreground text-sm">
                    Introduce tu correo y contraseña para entrar en tu panel.
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-10">
              <div>
                <Label htmlFor='email' className="text-base font-bold text-gray-800 pb-2 inline-block pl-4">Correo electrónico</Label>
                <Input
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
                <div className="flex justify-between items-center pb-2 pl-4">
                    <Label htmlFor='password' className="text-base font-bold text-gray-800">Contraseña</Label>
                    <Link href="/auth/forgot-password" className="text-sm font-semibold text-blue-600 hover:underline">
                        ¿Has olvidado tu contraseña?
                    </Link>
                </div>
                <div className="relative flex items-center">
                    <Input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Escribe tu contraseña'
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
                          <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Iniciando sesión...</>
                      ) : (
                          'Iniciar sesión'
                      )}
                  </Button>
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground mb-2">
                  ¿No tienes cuenta?
                </p>
                <Button asChild size="lg" className="w-full rounded-full h-14 text-lg font-bold" style={{ backgroundColor: '#2563EB' }}>
                  <Link href="/register">Regístrate aquí</Link>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <LoginForm />
        </Suspense>
    );
}
