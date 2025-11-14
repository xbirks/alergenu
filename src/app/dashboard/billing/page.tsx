'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SubscriptionData {
  selectedPlan: string;
  subscriptionStatus: string;
  trialEndsAt?: { seconds: number; nanoseconds: number; };
  currentPeriodEnd?: { seconds: number; nanoseconds: number; };
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const restaurantDocRef = doc(db, 'restaurants', user.uid);
          const docSnap = await getDoc(restaurantDocRef);

          if (docSnap.exists()) {
            setSubscription(docSnap.data() as SubscriptionData);
          } else {
            setError('No se encontraron datos de suscripción.');
          }
        } catch (err) {
          console.error(err);
          setError('No se pudo cargar la información de la suscripción.');
        } finally {
          setLoading(false);
        }
      } else {
        setUserId(null);
        setLoading(false);
        router.push('/login'); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  const handleManageSubscription = async () => {
    if (!userId) return;
    setPortalLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const { url, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No se pudo obtener la URL del portal de cliente.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error al gestionar la suscripción.');
      setPortalLoading(false);
    }
  };

  const renderSubscriptionDetails = () => {
    if (!subscription) return <p>No hay datos del plan.</p>;

    const { selectedPlan, subscriptionStatus, trialEndsAt, currentPeriodEnd } = subscription;

    let statusText = 'Desconocido';
    let dateText = '';

    switch (subscriptionStatus) {
      case 'trialing':
        statusText = 'En período de prueba';
        if (trialEndsAt) {
          dateText = `Tu prueba finaliza el ${new Date(trialEndsAt.seconds * 1000).toLocaleDateString()}`;
        }
        break;
      case 'active':
        statusText = 'Activo';
         if (currentPeriodEnd) {
          dateText = `Tu plan se renueva el ${new Date(currentPeriodEnd.seconds * 1000).toLocaleDateString()}`;
        }
        break;
      case 'canceled':
        statusText = 'Cancelado';
         if (currentPeriodEnd) {
          dateText = `El acceso finaliza el ${new Date(currentPeriodEnd.seconds * 1000).toLocaleDateString()}`;
        }
        break;
      case 'incomplete':
        statusText = 'Pago Incompleto';
        dateText = 'Por favor, finaliza tu pago para activar la suscripción.';
        break;
       case 'past_due':
        statusText = 'Pago Vencido';
        dateText = 'Hubo un problema con tu último pago. Por favor, actualiza tus datos.';
        break;
      default:
        statusText = subscriptionStatus;
    }

    return (
      <>
        <p className="text-2xl font-bold capitalize">{selectedPlan}</p>
        <p className="text-lg font-semibold text-blue-600">{statusText}</p>
        {dateText && <p className="text-muted-foreground mt-1">{dateText}</p>}
      </>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Suscripción</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tu Plan Actual</CardTitle>
          <CardDescription>Aquí puedes ver los detalles de tu suscripción actual y gestionar tu facturación.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-gray-50 rounded-lg">
            {renderSubscriptionDetails()}
          </div>
          <Button 
            onClick={handleManageSubscription} 
            disabled={portalLoading}
            className="w-full md:w-auto"
          >
            {portalLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redirigiendo... </> 
            ) : (
              'Gestionar mi Suscripción y Facturación'
            )}
          </Button>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
           <p className="text-xs text-muted-foreground pt-4">
            Serás redirigido a una página segura de Stripe para gestionar tus datos de pago, ver facturas o cancelar tu plan.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
