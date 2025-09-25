'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function AllergenProfilePage() {
  const router = useRouter();

  const handleAllergicClick = () => {
    router.push('/restest/allergies');
  };

  const handleNotAllergicClick = () => {
    router.push('/restest/menu');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <header className="w-full absolute top-0 flex justify-center p-6">
         <Image src="/alergenu.png" alt="Alergenu Logo" width={180} height={45} />
      </header>

      <main className="w-full max-w-md flex flex-col items-center gap-6">
        <div className="grid gap-2">
            <h1 className="text-5xl font-extrabold tracking-tight">Cuidamos tu <span className="text-blue-600">salud</span> en cualquier restaurante</h1>
            <p className="text-xl text-muted-foreground">
            ¿Tienes alguna alergia o intolerancia alimentaria?
            </p>
        </div>

        <div className="w-full space-y-4 pt-4">
          <Button 
            size="lg"
            className="w-full text-lg font-bold rounded-full h-14"
            onClick={handleAllergicClick}
          >
            Soy alérgico
          </Button>
          <Button 
            size="lg"
            variant="outline" // <-- Aplicado el borde con 'outline'
            className="w-full text-lg font-regular rounded-full h-14"
            onClick={handleNotAllergicClick}
          >
            No soy alérgico
          </Button>
        </div>
      </main>
    </div>
  );
}
