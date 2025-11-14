
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ManageSubscriptionButtonProps {
  userId: string;
  isSubscribed: boolean; // Indica si el usuario alguna vez tuvo una suscripción activa o de pago
}

export default function ManageSubscriptionButton({ userId, isSubscribed }: ManageSubscriptionButtonProps) {
  const [portalLoading, setPortalLoading] = useState(false);
  const { toast } = useToast();

  const handleManageSubscription = async () => {
    if (!userId) {
      toast({ title: 'Error', description: 'ID de usuario no disponible.', variant: 'destructive' });
      return;
    }
    setPortalLoading(true);

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
      console.error("Error al gestionar la suscripción:", err);
      toast({ title: 'Error', description: err.message || 'Ocurrió un error al gestionar la suscripción.', variant: 'destructive' });
      setPortalLoading(false);
    }
  };

  // Solo mostramos el botón si el usuario ya ha realizado un pago o está en un estado de suscripción relevante
  if (!isSubscribed) {
    return null;
  }

  return (
    <div className="border-t pt-12 mt-12">
      <h2 className="text-3xl font-bold tracking-tight mb-8">Facturación y Suscripción</h2>
      <p className="text-muted-foreground mt-1 mb-6">Accede al portal de Stripe para ver tu plan actual, actualizar métodos de pago o revisar facturas.</p>
      <Button 
        onClick={handleManageSubscription} 
        disabled={portalLoading}
        size="lg" 
        className="h-16 text-lg font-bold rounded-full w-full sm:w-auto px-10"
      >
        {portalLoading ? (
          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Redirigiendo... </> 
        ) : (
          <><CreditCard className="mr-2 h-5 w-5" /> Gestionar Suscripción y Facturación</>
        )}
      </Button>
      <p className="text-xs text-muted-foreground pt-4 max-w-xl">
        Serás redirigido a una página segura de Stripe para gestionar tus datos de pago, ver facturas o cancelar tu plan.
      </p>
    </div>
  );
}
