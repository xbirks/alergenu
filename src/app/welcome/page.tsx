'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WelcomePage() {
  const router = useRouter();

  const handleAllergicClick = () => {
    router.push('/m/1?alergias=true');
  };

  const handleNotAllergicClick = () => {
    // Clear allergens from local storage before navigating
    localStorage.removeItem('lilunch-allergens');
    router.push('/m/1');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      <header className="flex justify-center items-center py-4">
        <span className="text-lg font-medium">Lilunch</span>
      </header>

      <main className="flex-1 flex flex-col justify-center text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">
            Cuidamos tu <span className="font-bold">salud</span> en cualquier restaurante
          </h1>
          <p className="text-base text-muted-foreground max-w-sm mx-auto">
            ¿Tienes alguna alergia o intolerancia alimentaria?
          </p>
        </div>
      </main>

      <footer className="w-full max-w-sm mx-auto pb-4">
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full h-14 text-base font-medium rounded-full"
            onClick={handleAllergicClick}
          >
            Soy alérgico
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full h-14 text-base font-medium rounded-full bg-muted hover:bg-muted/80 text-muted-foreground"
            onClick={handleNotAllergicClick}
          >
            No soy alérgico
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-6 px-4">
          Al continuar, aceptas nuestras{' '}
          <Link href="#" className="underline">
            Condiciones de Servicio
          </Link>{' '}
          y{' '}
          <Link href="#" className="underline">
            Política de Privacidad
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}
