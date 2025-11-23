'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useParams } from 'next/navigation'; // Importar useParams

const staticTexts = {
  pageTitle: {
    es: 'Tus 3 meses de prueba han terminado',
    en: 'Your 3-month trial has ended',
  },
  callToAction: {
    es: 'Elige una suscripción y sigue disfrutando de todos los beneficios que Aporta Alergenu a tu restaurante.',
    en: 'Choose a subscription to keep enjoying all the benefits Alergenu brings to your restaurant.',
  },
  loadingMessage: { es: 'Cargando estado de la suscripción...', en: 'Loading subscription status...' },
  backToHome: { es: 'Volver al inicio', en: 'Back to home' },
  planAutonomia: { es: 'Plan Autonomía', en: 'Autonomy Plan' },
  planPremium: { es: 'Plan Premium', en: 'Premium Plan'},
  processing: { es: 'Procesando pago...', en: 'Processing payment...' },
  checkoutError: {
    es: 'Error al iniciar el proceso de pago. Por favor, inténtalo de nuevo.',
    en: 'Error starting payment process. Please try again.',
  },
  noUserData: {
    es: 'No se pudo obtener la información del usuario para iniciar el pago.',
    en: 'Could not get user information to start payment.',
  },
};

const PRICING_PLANS = {
  autonomia: {
    id: 'autonomia',
    priceId: 'price_1STO8NH4esVSm5sUhD9EWIlh',
  },
  premium: {
    id: 'premium',
    priceId: 'price_1STOPmH4esVSm5sUds8f7y0t',
  },
};

export default function TrialExpiredPage() {
  const [loading, setLoading] = useState(true);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [userDataForCheckout, setUserDataForCheckout] = useState<{
    userId: string;
    userEmail: string;
    userName: string;
  } | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [lang] = useLocalStorage<string>('selectedLang', 'es');
  const params = useParams(); // Usar useParams para obtener el slug
  const restaurantSlug = params.slug as string; // Obtener el slug

  useEffect(() => {
    const checkTrialStatus = async () => {
      setLoading(true);
      if (!restaurantSlug) { // Verificar si el slug existe
        setCurrentMessage("Falta el slug del restaurante.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/menu/${restaurantSlug}`); // Usar restaurantSlug

        if (response.status === 403) {
          const errorData = await response.json();
          setIsTrialExpired(true);
          setCurrentMessage(errorData.message || staticTexts.callToAction[lang]);
          setUserDataForCheckout({
            userId: errorData.userId || null,
            userEmail: errorData.userEmail || null,
            userName: errorData.userName || null,
          });
        } else if (response.ok) {
          setIsTrialExpired(false);
          setCurrentMessage(
            "La API devolvió un 200 OK. La prueba NO expiró o la lógica no se aplicó."
          );
        } else {
          const errorData = await response.text();
          setIsTrialExpired(false);
          setCurrentMessage(`Error inesperado (${response.status}): ${errorData}`);
        }
      } catch (err) {
        console.error('Error fetching menu data:', err);
        setIsTrialExpired(false);
        setCurrentMessage(
          `${staticTexts.pageTitle[lang]}: Error de red o del servidor al intentar cargar el estado de la prueba.`
        );
      } finally {
        setLoading(false);
      }
    };

    checkTrialStatus();
  }, [lang, restaurantSlug]); // Añadir restaurantSlug a las dependencias

  const handleChoosePlan = async (planId: 'autonomia' | 'premium') => {
    setIsRedirecting(true);
    setCurrentMessage(null);

    if (
      !userDataForCheckout ||
      !userDataForCheckout.userId ||
      !userDataForCheckout.userEmail ||
      !userDataForCheckout.userName
    ) {
      setCurrentMessage(staticTexts.noUserData[lang]);
      setIsRedirecting(false);
      return;
    }

    const planDetails = PRICING_PLANS[planId];

    try {
      const response = await fetch('/api/stripe/create-checkout-trial-end-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userDataForCheckout.userId,
          userEmail: userDataForCheckout.userEmail,
          userName: userDataForCheckout.userName,
          priceId: planDetails.priceId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create Stripe Checkout session');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Could not retrieve a checkout session URL.');
      }
    } catch (error) {
      console.error('Error initiating Stripe Checkout:', error);
      setCurrentMessage(staticTexts.checkoutError[lang]);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="px-4 py-10 flex flex-col items-center"> 
      <div className="w-full max-w-md mx-auto"> 
        {loading ? (
          <div className="mt-20 flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-500 text-sm">{staticTexts.loadingMessage[lang]}</p>
          </div>
        ) : (
          <>
            {/* Título */}
            <h1 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-snug">
              {lang === 'es' ? (
                <>
                  Tus <span className="text-blue-600">3 meses de prueba</span> han terminado
                </>
              ) : (
                <>
                  Your <span className="text-blue-600">3-month trial</span> has ended
                </>
              )}
            </h1>

            {/* Subtítulo */}
            <p className="mt-4 text-center text-gray-600 text-base leading-relaxed">
              {currentMessage || staticTexts.callToAction[lang]}
            </p>

            {isTrialExpired ? (
              <div className="mt-10 space-y-6">
                {/* Card Autonomía */}
                <div className="rounded-2xl bg-gray-100 border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    {staticTexts.planAutonomia[lang]}
                  </h3>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-blue-600">12€</span>
                    <span className="text-sm font-semibold text-blue-600">/ mes</span>
                    <span className="text-xs text-red-500 ml-1">Antes 19€/mes</span>
                  </div>

                  <p className="mt-4 text-gray-900 font-semibold leading-snug">
                    Ideal si quieres control total y no necesitas ayuda.
                  </p>

                  <Button
                    size="lg"
                    className="mt-6 w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    onClick={() => handleChoosePlan('autonomia')}
                    disabled={isRedirecting || !userDataForCheckout}
                  >
                    {isRedirecting ? staticTexts.processing[lang] : 'Suscribirse'}
                  </Button>
                </div>

                {/* Card Premium */}
                <div className="rounded-2xl bg-gray-100 border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    {staticTexts.planPremium[lang]}
                  </h3>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-blue-600">79€</span>
                    <span className="text-sm font-semibold text-blue-600">/ mes</span>
                  </div>

                  <p className="mt-4 text-gray-900 font-semibold leading-snug">
                    Ideal si no tienes tiempo. Nos encargamos de todo.
                  </p>

                  <ul className="mt-4 space-y-2 list-disc pl-5 marker:text-gray-900">
                    <li className="text-sm text-blue-600 font-medium">
                      Delega la gestión de la carta y los alérgenos para que la trabaje nuestro equipo.
                    </li>
                    <li className="text-sm text-gray-700">
                      Personalización avanzada de la carta.
                    </li>
                    <li className="text-sm text-gray-700">
                      Atención al cliente prioritaria, por teléfono y Whatsapp.
                    </li>
                    <li className="text-sm text-gray-700">
                      Uso ilimitado de la IA en el menú del día.
                    </li>
                  </ul>

                  <Button
                    size="lg"
                    className="mt-6 w-full h-12 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold"
                    onClick={() => handleChoosePlan('premium')}
                    disabled={isRedirecting || !userDataForCheckout}
                  >
                    {isRedirecting ? staticTexts.processing[lang] : 'Suscribirse'}
                  </Button>
                </div>
              </div>
            ) : (
              <Link href="/" className="block mt-8">
                <Button
                  size="lg"
                  className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  {staticTexts.backToHome[lang]}
                </Button>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
