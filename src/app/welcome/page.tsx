'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function WelcomePage() {
  const router = useRouter();

  const handleAllergicClick = () => {
    localStorage.setItem('lilunch-show-allergens', 'true');
    router.push('/m/1');
  };

  const handleNotAllergicClick = () => {
    localStorage.removeItem('lilunch-show-allergens');
    router.push('/m/1');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">¡Hola!</h1>
        <p className="text-lg text-muted-foreground">
          Para empezar, ¿tienes alguna alergia o intolerancia alimentaria?
        </p>
      </div>
      <div className="w-full max-w-md mt-8 space-y-4">
        <Button size="lg" className="w-full" onClick={handleAllergicClick}>
          Soy alérgico
        </Button>
        <Button size="lg" className="w-full" variant="outline" onClick={handleNotAllergicClick}>
          No soy alérgico
        </Button>
      </div>
    </div>
  );
}
