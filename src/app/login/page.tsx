'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { auth } from '@/lib/firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // State for managing placeholder visibility
  const [emailPlaceholder, setEmailPlaceholder] = useState('Ej: mariaperez@gmail.com');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      let errorMessage = 'Email o contraseña incorrectos.';
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        errorMessage = 'El correo electrónico o la contraseña no son válidos.';
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
                    <h1 className="text-2xl font-bold tracking-tight mb-1">Iniciar sesión</h1>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                        Introduce tu correo y contraseña para poder editar la carta de tu restaurante.
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5 mt-10">
                    <div className="space-y-5">
                        <div>
                            <Label htmlFor='email' className="text-base font-bold text-gray-800 pb-2 inline-block pl-4">Correo electrónico</Label>
                            <Input
                                id='email'
                                type='email'
                                placeholder={emailPlaceholder}
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setEmailPlaceholder('')}
                                onBlur={() => {
                                    if (!email) {
                                        setEmailPlaceholder('Ej: mariaperez@gmail.com');
                                    }
                                }}
                                className="h-12 px-5 text-base rounded-full text-blue-600"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <Label htmlFor='password' className="text-base font-bold text-gray-800 pb-2 inline-block pl-4">Contraseña</Label>
                            <div className="relative flex items-center">
                                <Input
                                    id='password'
                                    type={showPassword ? 'text' : 'password'}
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
                    </div>

                    {error && (
                        <p className='text-center text-sm text-red-600 bg-red-50 p-3 rounded-full mt-4'>{error}</p>
                    )}
                    
                    <div className="pt-4">
                        <Button type='submit' size="lg" className="w-full rounded-full h-14 text-lg font-bold" style={{ backgroundColor: '#2563EB' }} disabled={loading}>
                            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        </Button>
                    </div>
                </form>

                <div className="relative my-12">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <h2 className="text-xl font-semibold text-gray-800">¿No tienes cuenta?</h2>
                    <div className="mt-6">
                        <Button asChild size="lg" className="w-full rounded-full h-14 text-lg font-bold" style={{ backgroundColor: '#2563EB' }}>
                            <Link href="/register">Regístrate gratis aquí</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
