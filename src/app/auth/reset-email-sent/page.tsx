'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/layout/PublicHeader';
// import { MailUp } from 'lucide-react'; // Temporalmente comentado para diagnóstico

export default function ResetEmailSentPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md mx-auto text-center">
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg">
                {/* <MailUp className="mx-auto h-16 w-16 text-blue-500 mb-6" /> */}{/* Temporalmente comentado para diagnóstico */}
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">¡Revisa tu correo!</h1>
                <p className="text-muted-foreground text-base mb-8">
                    Si tu dirección de correo electrónico está registrada en nuestro sistema, recibirás un enlace para restablecer tu contraseña en unos minutos.
                </p>
                <p className="text-sm text-gray-600 mb-8">
                    Asegúrate de revisar también tu carpeta de spam.
                </p>
                <Button asChild size="lg" className="w-full rounded-full h-14 text-lg font-bold" style={{ backgroundColor: '#2563EB' }}>
                    <Link href="/login">Volver a Iniciar Sesión</Link>
                </Button>
            </div>
        </div>
      </main>
    </div>
  );
}
