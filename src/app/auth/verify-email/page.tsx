'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { MailCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { sendEmailVerification } from 'firebase/auth';

export default function VerifyEmailPage() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResendEmail = async () => {
    if (!currentUser) {
      setError('No se ha encontrado ningún usuario. Por favor, intenta iniciar sesión de nuevo.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      await sendEmailVerification(currentUser);
      setMessage('¡Correo reenviado! Revisa tu bandeja de entrada.');
    } catch (error: any) {
      console.error("Error al reenviar email:", error);
      if (error.code === 'auth/too-many-requests') {
        setError('Has solicitado el correo demasiadas veces. Por favor, espera unos minutos antes de volver a intentarlo.');
      } else {
        setError('Ocurrió un error al reenviar el correo. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md mx-auto text-center">
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg">
                <MailCheck className="mx-auto h-16 w-16 text-green-500 mb-6" />
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">¡Un último paso!</h1>
                <p className="text-muted-foreground text-base mb-8">
                    Te hemos enviado un correo de confirmación. Por favor, revisa tu bandeja de entrada (y la carpeta de spam) para verificar tu cuenta.
                </p>
                <p className="text-sm text-gray-600 mb-8">
                    Una vez verificada, podrás iniciar sesión sin problemas.
                </p>
                
                <div className="space-y-4">
                    <Button asChild size="lg" className="w-full rounded-full h-14 text-lg font-bold" style={{ backgroundColor: '#2563EB' }}>
                        <Link href="/login">Ir a Iniciar Sesión</Link>
                    </Button>

                    <Button 
                        onClick={handleResendEmail}
                        variant="outline"
                        size="lg" 
                        className="w-full rounded-full h-14 text-lg font-semibold border-gray-300"
                        disabled={loading}
                    >
                        {loading ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Reenviando...</>
                        ) : (
                            'Reenviar correo'
                        )}
                    </Button>
                </div>

                {message && <p className='text-center text-sm text-green-600 bg-green-50 p-3 rounded-full mt-6'>{message}</p>}
                {error && <p className='text-center text-sm text-red-600 bg-red-50 p-3 rounded-full mt-6'>{error}</p>}

            </div>
        </div>
      </main>
    </div>
  );
}
