'use client';

import { useState } from 'react';
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

export default function RegisterPage() {
  // Input values
  const [restaurantName, setRestaurantName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Validate that passwords match
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    // Clear error if validation passes
    setError('');
    // TODO: Implement actual user registration logic
    console.log('Submitting form:', { restaurantName, ownerName, email });
    alert('¡Cuenta lista para ser creada! (Lógica de backend pendiente)');
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-background p-4'>
      <div className='w-full max-w-md'>
        <Link href='/' className='flex justify-center mb-6'>
          <Image src='/alergenu.png' alt='Alergenu Logo' width={150} height={50} />
        </Link>
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className='text-center space-y-2'>
              <CardTitle className='text-2xl'>Crea tu cuenta</CardTitle>
              <CardDescription>
                Introduce tus datos para empezar a digitalizar tu carta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='restaurant-name'>
                    Nombre del restaurante
                  </Label>
                  <Input
                    id='restaurant-name'
                    placeholder='Ej: La Buena Tapa'
                    required
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='owner-name'>Tu nombre</Label>
                  <Input
                    id='owner-name'
                    placeholder='Ej: María López'
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='maria@ejemplo.com'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className='grid gap-2 relative'>
                  <Label htmlFor='password'>Contraseña</Label>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='absolute bottom-0 right-2 h-7 w-7'
                    onClick={() => setShowPassword((prev) => !prev)}
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
                <div className='grid gap-2 relative'>
                  <Label htmlFor='confirm-password'>Confirmar contraseña</Label>
                  <Input
                    id='confirm-password'
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='absolute bottom-0 right-2 h-7 w-7'
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                    <span className='sr-only'>
                      {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                    </span>
                  </Button>
                </div>
                {error && (
                  <p className='px-1 text-sm text-destructive'>{error}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className='flex flex-col items-center gap-4'>
              <Button type='submit' className='w-full'>
                Crear cuenta
              </Button>
              <p className='text-xs text-muted-foreground text-center'>
                Al crear una cuenta, aceptas nuestros{' '}
                <Link
                  href='/legal/terms-of-service'
                  className='underline underline-offset-4 hover:text-primary'
                >
                  Términos del Servicio
                </Link>{' '}
                y{' '}
                <Link
                  href='/legal/privacy-policy'
                  className='underline underline-offset-4 hover:text-primary'
                >
                  Política de Privacidad
                </Link>
                .
              </p>
            </CardFooter>
          </form>
        </Card>
        <div className='mt-4 text-center text-sm'>
          ¿Ya tienes una cuenta?{' '}
          <Link href='/login' className='underline'>
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
