'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase/firebase';
import { applyActionCode } from 'firebase/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Loader2, MailCheck, ShieldAlert } from 'lucide-react';

function ActionHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [error, setError] = useState('');

  useEffect(() => {
    const mode = searchParams.get('mode');
    const actionCode = searchParams.get('oobCode');

    if (!mode || !actionCode) {
      setStatus('error');
      setError('Faltan parámetros en la solicitud. No se puede procesar.');
      return;
    }

    const handleAction = async (mode: string, actionCode: string) => {
      try {
        switch (mode) {
          case 'verifyEmail':
            await applyActionCode(auth, actionCode);
            setStatus('success');
            break;
          // Puedes añadir otros modos aquí en el futuro, como 'resetPassword'
          default:
            throw new Error('Modo no soportado.');
        }
      } catch (err: any) {
        setStatus('error');
        if (err.code === 'auth/invalid-action-code') {
          setError('El enlace de verificación no es válido o ya ha expirado. Por favor, solicita uno nuevo.');
        } else {
          setError('Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.');
        }
        console.error(err);
      }
    };

    handleAction(mode, actionCode);
  }, [searchParams]);

  useEffect(() => {
    if (status === 'success') {
      // Después de verificar, Firebase loguea al usuario automáticamente.
      // Lo redirigimos al dashboard tras una breve pausa.
      const timer = setTimeout(() => {
        router.push('/dashboard?first_login=true');
      }, 3000); // 3 segundos de espera

      return () => clearTimeout(timer);
    }
  }, [status, router]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-blue-500 mb-6" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Verificando...</h1>
            <p className="text-muted-foreground text-base">
              Estamos procesando tu solicitud. Por favor, espera un momento.
            </p>
          </>
        );
      case 'success':
        return (
          <>
            <MailCheck className="mx-auto h-16 w-16 text-green-500 mb-6" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">¡Correo verificado!</h1>
            <p className="text-muted-foreground text-base mb-8">
              Tu cuenta ha sido activada. Serás redirigido a tu panel de control en unos segundos...
            </p>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
          </>
        );
      case 'error':
        return (
          <>
            <ShieldAlert className="mx-auto h-16 w-16 text-red-500 mb-6" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Error en la verificación</h1>
            <p className="text-red-600 bg-red-50 p-4 rounded-lg mb-8">
              {error}
            </p>
            <Button asChild size="lg" className="w-full rounded-full h-14 text-lg font-bold" style={{ backgroundColor: '#2563EB' }}>
               <Link href="/login">Volver a inicio</Link>
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md mx-auto text-center">
          <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AuthActionPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <ActionHandler />
        </Suspense>
    );
}
