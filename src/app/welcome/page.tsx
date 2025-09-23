import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Salad } from 'lucide-react';

export default function WelcomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
      <div className="text-center max-w-lg">
        <Salad className="w-16 h-16 mx-auto mb-6 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
          Bienvenido a Lilunch
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Antes de empezar, dinos si quieres configurar tus preferencias de alérgenos. Podrás cambiarlas más tarde en cualquier momento.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/m/1?alergias=true" className="w-full sm:w-auto">
            <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              Soy alérgico
            </Button>
          </Link>
          <Link href="/m/1" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full h-14 text-lg font-semibold rounded-full border-2">
              Ver menú directamente
            </Button>
          </Link>
        </div>
      </div>
       <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-xs text-muted-foreground">
          <p>La información sobre alérgenos es proporcionada por el restaurante.</p>
          <p>Por favor, confirma con el personal en caso de duda.</p>
        </footer>
    </main>
  );
}
