'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebase/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface Restaurant {
  restaurantName: string;
  slug: string;
}

const staticTexts = {
  welcomeTo: { es: 'Bienvenido a la carta digital de', en: 'Welcome to the digital menu of' },
  restaurantDefault: { es: 'Restaurante', en: 'Restaurant' },
  allergyQuestion: { es: '¿Eres alérgico / intolerante a algún alimento?', en: 'Do you have any food allergies or intolerances?' },
  yesAllergies: { es: 'Sí, tengo alergias', en: 'Yes, I have allergies' },
  noSeeFullMenu: { es: 'No, ver carta completa', en: 'No, see full menu' },
  privacyNotice: { es: 'Ninguno de tus datos sensibles se almacenan en nuestras bases de datos. Puedes estar completamente tranquilo.', en: 'None of your sensitive data is stored in our databases. You can be completely at ease.' },
  errorTitle: { es: 'Error de Carga', en: 'Loading Error' },
  errorRestaurantNotFound: { es: 'Este restaurante no existe o la URL no es correcta.', en: 'This restaurant does not exist or the URL is incorrect.' },
  errorLoadInfo: { es: 'No se pudo cargar la información. Por favor, inténtalo más tarde.', en: 'Could not load information. Please try again later.' },
  backToHome: { es: 'Volver al inicio', en: 'Back to home' },
};

export default function SelectionPage() {
  const params = useParams();
  const restaurantSlug = params.restaurantId as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useLocalStorage<string>('selectedLang', 'es');

  useEffect(() => {
    if (!restaurantSlug) return;

    const fetchRestaurant = async () => {
      setLoading(true);
      try {
        const restaurantsRef = collection(db, 'restaurants');
        const q = query(restaurantsRef, where("slug", "==", restaurantSlug), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError(staticTexts.errorRestaurantNotFound[lang]);
          return;
        }

        setRestaurant(querySnapshot.docs[0].data() as Restaurant);

      } catch (err) {
        console.error("Error fetching restaurant: ", err);
        setError(staticTexts.errorLoadInfo[lang]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantSlug, lang]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D1117]">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D1117] text-white">
        <header className="absolute top-0 left-0 right-0 z-40 bg-transparent">
          <div className="flex h-20 max-w-5xl mx-auto items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href={`/`}>
              <Image src="/icon_alergenu.png" alt="Alergenu Logo" width={36} height={36} priority />
            </Link>
            <LanguageSwitcher lang={lang} onLangChange={setLang} theme="dark" />
          </div>
        </header>
        <div className="text-center p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-500">{staticTexts.errorTitle[lang]}</h2>
          <p className="text-[#ABABAB] mt-2">{error}</p>
          <Link href={`/`} passHref className="w-full">
            <Button size="lg" className="w-full text-lg h-14 rounded-full bg-blue-600 hover:bg-blue-700 mt-8">
              {staticTexts.backToHome[lang]}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0D1117] min-h-screen font-sans flex flex-col items-center text-white px-4">
      <header className="absolute top-0 left-0 right-0 z-40 bg-transparent">
        <div className="flex h-20 max-w-5xl mx-auto items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={`/`}>
            <Image src="/icon_alergenu.png" alt="Alergenu Logo" width={36} height={36} priority />
          </Link>
          <LanguageSwitcher lang={lang} onLangChange={setLang} theme="dark" />
        </div>
      </header>

      <main className="flex flex-col items-center text-center w-full max-w-md pt-32">

        <p className="text-[12pt]" style={{ color: '#F5F5F5' }}>
          {staticTexts.welcomeTo[lang]}
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mt-1 mb-10">
          {restaurant?.restaurantName || staticTexts.restaurantDefault[lang]}
        </h1>

        <div className="w-full border-t border-white/20 my-12"></div>

        <p className="text-[16pt] text-white mb-8">
          {staticTexts.allergyQuestion[lang]}
        </p>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Link href={`/menu/${restaurantSlug}/carta?alergico=true`} passHref className="w-full">
            <Button size="lg" className="w-full text-lg h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              {staticTexts.yesAllergies[lang]}
            </Button>
          </Link>
          <Link href={`/menu/${restaurantSlug}/carta`} passHref className="w-full">
            <Button size="lg" className="w-full text-lg h-14 rounded-full bg-white hover:bg-gray-200 text-[#0D1117] font-semibold" variant="outline">
              {staticTexts.noSeeFullMenu[lang]}
            </Button>
          </Link>
        </div>

        <p className="text-sm mt-12 max-w-xs" style={{ color: '#ABABAB' }}>
          {staticTexts.privacyNotice[lang]}
        </p>
      </main>
    </div>
  );
}
