'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLocalStorage } from '@/hooks/use-local-storage';

const staticTexts = {
  pageTitle: { es: 'Tu Carta Ha Expirado', en: 'Your Menu Has ExPIRED' },
  callToAction: {
    es: 'Tu prueba gratuita ha terminado. ¡Elige un plan para que tu carta vuelva a estar online y sigue ofreciendo la mejor experiencia a tus clientes!',
    en: 'Your free trial has ended. Choose a plan to bring your menu back online and continue offering the best experience to your customers!'
  },
  loadingMessage: { es: 'Cargando estado de la suscripción...', en: 'Loading subscription status...' },
  backToHome: { es: 'Volver al inicio', en: 'Back to home' },
  choosePlan: { es: 'Elegir Plan', en: 'Choose Plan' },
  planAutonomia: { es: 'Plan Autonomía', en: 'Autonomy Plan' },
  planPremium: { es: 'Plan Premium', in: 'Premium Plan' },
  processing: { es: 'Procesando pago...', en: 'Processing payment...' },
  checkoutError: { es: 'Error al iniciar el proceso de pago. Por favor, inténtalo de nuevo.', en: 'Error starting payment process. Please try again.'},
  noUserData: { es: 'No se pudo obtener la información del usuario para iniciar el pago.', en: 'Could not get user information to start payment.'},
};

// Los price IDs de Stripe deben coincidir con los de tu archivo src/app/register/page.tsx
const PRICING_PLANS = {
  autonomia: {
    id: 'autonomia',
    priceId: 'price_1STO8NH4esVSm5sUhD9EWIlh', // ¡Actualiza con tu Price ID de Stripe para Autonomía!
  },
  premium: {
    id: 'premium',
    priceId: 'price_1STOPmH4esVSm5sUds8f7y0t', // ¡Actualiza con tu Price ID de Stripe para Premium!
  },
};

export default function TrialExpiredPage() {
  const [loading, setLoading] = useState(true);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [userDataForCheckout, setUserDataForCheckout] = useState<{ userId: string; userEmail: string; userName: string } | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [lang] = useLocalStorage<string>('selectedLang', 'es');

  const testRestaurantSlug = 'restaurante-ejemplo'; // Asegúrate de que este slug esté expirado en Firebase

  useEffect(() => {
    const checkTrialStatus = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/menu/${testRestaurantSlug}`);

        if (response.status === 403) {
          const errorData = await response.json();
          setIsTrialExpired(true);
          setCurrentMessage(errorData.message || staticTexts.callToAction[lang]);
          // Captura los datos del usuario para el checkout
          setUserDataForCheckout({
            userId: errorData.userId || null,
            userEmail: errorData.userEmail || null,
            userName: errorData.userName || null,
          });
        } else if (response.ok) {
          // Si recibimos un 200 OK, la prueba NO expiró o no se detectó
          setIsTrialExpired(false);
          setCurrentMessage("La API devolvió un 200 OK. La prueba NO expiró o la lógica de expiración no se aplicó en la API.");
        } else {
          // Otros errores HTTP (400, 500, etc.)
          const errorData = await response.text();
          setIsTrialExpired(false);
          setCurrentMessage(`Error inesperado (${response.status}): ${errorData}`);
        }

      } catch (err) {
        console.error("Error fetching menu data:", err);
        setIsTrialExpired(false);
        setCurrentMessage(`${staticTexts.pageTitle[lang]}: Error de red o del servidor al intentar cargar el estado de la prueba.`);
      } finally {
        setLoading(false);
      }
    };

    checkTrialStatus();
  }, [lang]);

  const handleChoosePlan = async (planId: 'autonomia' | 'premium') => {
    setIsRedirecting(true);
    setCurrentMessage(null); // Clear any previous messages

    if (!userDataForCheckout || !userDataForCheckout.userId || !userDataForCheckout.userEmail || !userDataForCheckout.userName) {
      setCurrentMessage(staticTexts.noUserData[lang]);
      setIsRedirecting(false);
      return;
    }

    const planDetails = PRICING_PLANS[planId];

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        window.location.href = data.url; // Redirect to Stripe Checkout
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D1117] text-white">
       <header className="absolute top-0 left-0 right-0 z-40 bg-transparent">
          <div className="flex h-20 max-w-5xl mx-auto items-center justify-between px-4 sm:px-6 lg:px-8">
              <Link href={`/`}><Image src="/alergenu.png" alt="Alergenu Logo" width={120} height={36} /></Link>
               <LanguageSwitcher lang={lang} onLangChange={() => {}} theme="dark" />
          </div>
      </header>
      <div className="text-center p-8 max-w-md">
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-white mb-4" />
            <p className="font-regular text-muted-foreground">{staticTexts.loadingMessage[lang]}</p>
          </div>
        ) : (
          <>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4 text-white">{staticTexts.pageTitle[lang]}</h1>
            <p className="font-regular text-muted-foreground mt-2">{currentMessage}</p>
            
            {isTrialExpired && (
              <div className="mt-8 flex flex-col gap-4 w-full">
                <p className="font-regular text-muted-foreground">{staticTexts.choosePlan[lang]}:</p>
                <Button
                  size="lg"
                  className="w-full h-14 rounded-full text-lg font-bold text-white"
                  style={{ backgroundColor: '#2563EB' }}
                  onClick={() => handleChoosePlan('autonomia')}
                  disabled={isRedirecting || !userDataForCheckout}
                >
                  {isRedirecting ? staticTexts.processing[lang] : staticTexts.planAutonomia[lang]}
                </Button>
                <Button
                  size="lg"
                  className="w-full h-14 rounded-full text-lg font-bold text-white"
                  style={{ backgroundColor: '#2563EB' }}
                  onClick={() => handleChoosePlan('premium')}
                  disabled={isRedirecting || !userDataForCheckout}
                >
                  {isRedirecting ? staticTexts.processing[lang] : staticTexts.planPremium[lang]}
                </Button>
              </div>
            )}

            {!isTrialExpired && (
              <Link href={`/`} passHref className="w-full">
                <Button size="lg" className="w-full h-14 rounded-full text-lg font-bold text-white mt-8"
                  style={{ backgroundColor: '#2563EB' }}
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
