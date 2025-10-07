'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
        setError('Por favor, introduce tu correo electrónico.');
        setLoading(false);
        return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      router.push('/auth/reset-email-sent');
    } catch (error: any) {
      console.error("Error en sendPasswordResetEmail (ignorado para el usuario):", error.code);
      router.push('/auth/reset-email-sent');
    } 
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg">
            <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Recupera tu contraseña</h1>
                <p className="text-muted-foreground text-base mb-8">
                    Introduce tu correo electrónico y te enviaremos un enlace para que puedas restablecerla.
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-base font-bold text-gray-800 pb-2 inline-block pl-4">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Escribe tu correo"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 px-5 text-base rounded-full text-blue-600"
                  disabled={loading}
                />
              </div>

              {error && (
                <p className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-full">{error}</p>
              )}

              <div className="pt-4">
                  <Button type="submit" size="lg" className="w-full rounded-full h-14 text-lg font-bold flex items-center justify-center" style={{ backgroundColor: '#2563EB' }} disabled={loading}>
                      {loading ? (
                          <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Enviando...</>
                      ) : (
                          'Enviar enlace de recuperación'
                      )}
                  </Button>
              </div>

              <div className="text-center pt-4">
                <Link href="/login" className="text-sm font-semibold text-blue-600 hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft size={16} />
                    Volver a Iniciar Sesión
                </Link>
            </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
