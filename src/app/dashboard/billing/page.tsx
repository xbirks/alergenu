'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  ownerName?: string;
  email?: string;
}

const pricingPlans = [
  {
    id: 'autonomia',
    name: 'Plan Autonomía',
    price: '12€',
    priceId: 'price_1STO8NH4esVSm5sUhD9EWIlh',
  },
  {
    id: 'premium',
    name: 'Plan Premium',
    price: '79€',
    priceId: 'price_1Sa1FNH4esVSm5sUs2oVES7q',
  },
];

export default function BillingPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
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

  const handleSubscribeToPlan = async (planId: string) => {
    if (!userId || !subscription) return;

    setCheckoutLoading(planId);
    setError(null);

    try {
      const plan = pricingPlans.find(p => p.id === planId);
      if (!plan) throw new Error('Plan no encontrado');

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          userEmail: subscription.email || auth.currentUser?.email,
          userName: subscription.ownerName || '',
          priceId: plan.priceId
        }),
      });

      const { url, error: apiError } = await response.json();

      if (apiError) {
        throw new Error(apiError);
      }

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No se pudo obtener la URL de checkout.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error al procesar la suscripción.');
      setCheckoutLoading(null);
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

  const isPaidPlan = subscription?.selectedPlan === 'autonomia' || subscription?.selectedPlan === 'premium';

  // Verificar si el usuario tiene un plan manual (sin Stripe)
  // Debe verificar que stripeCustomerId existe Y tiene un valor válido (no vacío)
  const stripeCustomerId = (subscription as any)?.stripeCustomerId;
  console.log('DEBUG stripeCustomerId:', stripeCustomerId, 'type:', typeof stripeCustomerId);
  // Un plan es manual si NO tiene stripeCustomerId válido O si tiene el valor especial 'manual_assignment'
  const hasStripeCustomer = !!(stripeCustomerId && typeof stripeCustomerId === 'string' && stripeCustomerId.trim().length > 0 && stripeCustomerId !== 'manual_assignment');
  const isManualPlan = isPaidPlan && !hasStripeCustomer;
  console.log('DEBUG isPaidPlan:', isPaidPlan, 'hasStripeCustomer:', hasStripeCustomer, 'isManualPlan:', isManualPlan);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Suscripción</h1>

      {isPaidPlan ? (
        // Usuario con plan de pago - Mostrar gestión de suscripción
        <Card>
          <CardHeader>
            <CardTitle>Tu Plan Actual</CardTitle>
            <CardDescription>Aquí puedes ver los detalles de tu suscripción actual{!isManualPlan && ' y gestionar tu facturación'}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              {renderSubscriptionDetails()}
            </div>

            {isManualPlan ? (
              // Plan asignado manualmente (lifetime, etc.)
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">🎉</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-900 mb-2">¡Eres un cliente especial!</h3>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      Por ser un cliente valioso y de confianza, te hemos otorgado acceso completo a Alergenu de forma gratuita.
                      Disfruta de todas las funcionalidades premium sin preocuparte por pagos ni suscripciones.
                    </p>
                    <p className="text-sm text-blue-700 mt-3 italic">
                      Si tienes alguna duda o necesitas ayuda, nuestro equipo está siempre disponible para ti.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Plan con Stripe - mostrar botón de gestión
              <>
                <Button
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  className="w-full md:w-auto"
                >
                  {portalLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redirigiendo... </>
                  ) : (
                    'Gestionar Suscripción'
                  )}
                </Button>
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                <p className="text-xs text-muted-foreground pt-4">
                  Serás redirigido a una página segura de Stripe para gestionar tus datos de pago, ver facturas o cancelar tu plan.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        // Usuario con plan gratuito - Mostrar planes disponibles
        <div className="space-y-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Mejora tu Plan</h2>
            <p className="text-muted-foreground">
              Actualmente estás en el plan gratuito. Elige el plan que mejor se adapte a tus necesidades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Plan Autonomía */}
            <div className="relative p-[3px] rounded-2xl bg-gradient-to-br from-blue-300 via-blue-500 to-blue-700 shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full">
                <span className="text-xs font-bold text-white tracking-wide uppercase">
                  Recomendado
                </span>
              </div>
              <div className="rounded-2xl p-8 bg-white">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                  Plan Autonomía
                </h3>

                <div className="mt-3 flex items-end gap-2">
                  <span className="text-4xl font-extrabold tracking-tight text-blue-600">
                    12€
                  </span>
                  <span className="text-base font-semibold text-blue-600">/ mes</span>
                  <span className="ml-2 text-sm text-red-500 line-through">
                    Antes 19€ /mes
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">IVA incluido</p>

                <p className="mt-6 text-lg font-semibold text-gray-900">
                  Ideal si quieres control total y no te importa dedicarle un rato al principio.
                </p>

                <p className="mt-8 text-base text-gray-700 underline underline-offset-4 decoration-gray-300">
                  Funcionalidades incluidas:
                </p>

                <ul className="mt-4 space-y-2 list-disc pl-5 marker:text-gray-900">
                  <li className="text-base text-gray-700">
                    Crea platos y bebidas de forma ilimitada.
                  </li>
                  <li className="text-base text-gray-700">
                    Generador de QR para la carta.
                  </li>
                  <li className="text-base text-blue-600">
                    Filtro de alérgenos con IA incluido.
                  </li>
                  <li className="text-base text-gray-700">
                    Gestión 100% autónoma del menú y los alérgenos.
                  </li>
                  <li className="text-base text-gray-700">
                    Atención al cliente por e-mail.
                  </li>
                  <li className="text-base text-gray-700">
                    Crea la carta en 2 idiomas diferentes.
                  </li>
                </ul>

                <Button
                  onClick={() => handleSubscribeToPlan('autonomia')}
                  disabled={checkoutLoading !== null}
                  size="lg"
                  className="mt-10 h-14 w-full rounded-full bg-blue-600 text-lg font-semibold text-white hover:bg-blue-700"
                >
                  {checkoutLoading === 'autonomia' ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesando...</>
                  ) : (
                    'Suscribirse'
                  )}
                </Button>
              </div>
            </div>

            {/* Plan Premium */}
            <div className="rounded-2xl p-8 bg-gray-50 border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                Plan Premium
              </h3>

              <div className="mt-3 flex items-end gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-blue-600">
                  79€
                </span>
                <span className="text-base font-semibold text-blue-600">/ mes</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">IVA incluido</p>

              <p className="mt-6 text-lg font-semibold text-gray-900">
                Ideal si no tienes tiempo. Nos envías tu carta y nosotros nos encargamos de todo.
              </p>

              <p className="mt-8 text-base text-gray-700 underline underline-offset-4 decoration-gray-300">
                Todas las funcionalidades del <strong>plan autonomía</strong>{" "}
                incluidas. Y además:
              </p>

              <ul className="mt-4 space-y-2 list-disc pl-5 marker:text-gray-900">
                <li className="text-base text-blue-600">
                  Delega la gestión de la carta y los alérgenos para que la trabaje nuestro equipo.
                </li>
                <li className="text-base text-gray-700">
                  Personalización avanzada de la carta.
                </li>
                <li className="text-base text-gray-700">
                  Atención al cliente prioritaria, por teléfono y Whatsapp.
                </li>
                <li className="text-base text-gray-700">Idiomas ilimitados.</li>
              </ul>

              <Button
                onClick={() => handleSubscribeToPlan('premium')}
                disabled={checkoutLoading !== null}
                size="lg"
                className="mt-10 h-14 w-full rounded-full bg-gray-900 text-lg font-semibold text-white hover:bg-gray-900/90"
              >
                {checkoutLoading === 'premium' ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesando...</>
                ) : (
                  'Suscribirse'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
