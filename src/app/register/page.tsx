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
import { auth, db } from '@/lib/firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';

// Helper function to create a URL-friendly slug from a string
const slugify = (text: string) => {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export default function RegisterPage() {
  const router = useRouter();
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

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
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Create a slug from the restaurant name
      const restaurantSlug = slugify(restaurantName);

      // 3. Save additional user data in Firestore
      await setDoc(doc(db, 'restaurants', user.uid), {
        uid: user.uid,
        restaurantName,
        slug: restaurantSlug, 
        ownerName,
        email: user.email,
        createdAt: new Date(),
      });

      // 4. Create default categories
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

      // 5. Redirect to welcome page on success
      router.push('/welcome');

    } catch (error: any) {
      let errorMessage = 'Ocurrió un error al crear la cuenta.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo electrónico ya está en uso.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico no es válido.';
      }
      setError(errorMessage);
      console.error("Error during registration:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const isFormComplete = restaurantName && ownerName && email && password && confirmPassword;

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-background p-4'>
      <div className='w-full max-w-md'>
        <Link href='/home' className='flex justify-center mb-6'>
          <Image src='/alergenu.png' alt='Alergenu Logo' width={150} height={50} />
        </Link>
        <Card className="rounded-2xl">
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
                    className="rounded-full"
                    disabled={loading}
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='owner-name'>Nombre y apellido</Label>
                  <Input
                    id='owner-name'
                    placeholder='Ej: María López'
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="rounded-full"
                    disabled={loading}
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
                    className="rounded-full"
                    disabled={loading}
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='password'>Contraseña</Label>
                  <div className="relative flex items-center">
                    <Input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-full pr-10"
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
                <div className='grid gap-2'>
                  <Label htmlFor='confirm-password'>Confirmar contraseña</Label>
                   <div className="relative flex items-center">
                    <Input
                      id='confirm-password'
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="rounded-full pr-10"
                      disabled={loading}
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='absolute right-2 h-7 w-7'
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      disabled={loading}
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
                </div>
                {error && (
                  <p className='px-1 py-2 font-medium text-sm text-destructive text-center bg-red-50 border border-destructive rounded-full'>{error}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className='flex flex-col items-center gap-4'>
              <Button type='submit' className='w-full rounded-full' disabled={!isFormComplete || loading}>
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </Button>
              <p className='text-xs text-muted-foreground text-center'>
                Al crear una cuenta, aceptas nuestros{' '}
                <Link
                  href='/legal/terms-of-service'
                  className='underline underline-offset-4 hover:text-primary'
                >
                  Términos y Condiciones
                </Link>
                {' y nuestra '}
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
