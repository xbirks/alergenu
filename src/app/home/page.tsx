'use client';

import { PublicHeader } from '@/components/layout/PublicHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="flex flex-col items-center text-center p-4 pt-20 md:pt-28">
        <div className="w-full max-w-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Cuidamos la <span className="text-blue-600">salud</span> de todos los comensales
          </h1>
          <p className="text-base text-muted-foreground mb-8">
            La forma más fácil de digitalizar tu carta y proteger a tus clientes con alergias. Crea, gestiona y comparte tu menú en minutos.
          </p>
          <div className="space-y-4 w-full max-w-xs mx-auto">
            <Button asChild size="lg" className="w-full rounded-full h-14 text-lg">
              <Link href="/register">Crear una cuenta</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full rounded-full h-14 text-lg">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
