'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { auth } from '@/lib/firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  // Input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // On success, redirect to the dashboard.
      router.push('/dashboard');
    } catch (error: any) {
      // Handle Firebase errors
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
      console.error('Error during login:', error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-background p-4'>
      <div className='w-full max-w-md'>
        <Link href='/home' className='flex justify-center mb-6'>
          <Image src='/alergenu.png' alt='Alergenu Logo' width={150} height={50} />
        </Link>
        <Card className='rounded-2xl'>
          <form onSubmit={handleSubmit}>
            <CardHeader className='text-center space-y-2'>
              <CardTitle className='text-2xl'>Inicia sesión</CardTitle>
              <CardDescription>
                Introduce tus credenciales para acceder a tu panel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='maria@ejemplo.com'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='rounded-full'
                    disabled={loading}
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='password'>Contraseña</Label>
                  <div className='relative flex items-center'>
                    <Input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='rounded-full pr-10'
                      disabled={loading}
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='absolute right-2 h-7 w-7'
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                      <span className='sr-only'>
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                      </span>
                    </Button>
                  </div>
                </div>
                {error && (
                  <p className='px-1 py-2 font-medium text-sm text-destructive text-center bg-red-50 border border-destructive rounded-full'>
                    {error}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className='flex flex-col items-center gap-4'>
              <Button
                type='submit'
                className='w-full rounded-full'
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <div className='mt-4 text-center text-sm'>
          ¿No tienes una cuenta?{' '}
          <Link href='/register' className='underline'>
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}
