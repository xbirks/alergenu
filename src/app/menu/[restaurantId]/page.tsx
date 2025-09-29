'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebase/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Restaurant {
  restaurantName: string;
}

export default function SelectionPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantSlug = params.restaurantId as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantSlug) return;

    const fetchRestaurant = async () => {
      setLoading(true);
      try {
        const restaurantsRef = collection(db, 'restaurants');
        const q = query(restaurantsRef, where("slug", "==", restaurantSlug), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError('Este restaurante no existe o la URL no es correcta.');
          return;
        }

        const restaurantDoc = querySnapshot.docs[0];
        setRestaurant(restaurantDoc.data() as Restaurant);

      } catch (err) {
        console.error("Error al cargar el restaurante: ", err);
        setError('No se pudo cargar la información. Por favor, inténtalo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantSlug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-destructive">Error</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans flex flex-col">
       <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm">
        <div className="container flex h-16 max-w-2xl items-center justify-between px-4">
          <a href="/">
            <Image src="/icon_alergenu.png" alt="Alergenu Logo" width={36} height={36} />
          </a>
        </div>
      </header>
      <main className="flex flex-col items-center text-center p-6 md:p-10 pt-20 md:pt-28">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          {restaurant?.restaurantName || 'Bienvenido'}
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-md">
          ¿Tienes alguna alergia o intolerancia alimenticia?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <Link href={`/menu/${restaurantSlug}/carta?alergico=true`} passHref className="w-full">
            <Button size="lg" className="w-full text-lg h-14 rounded-full bg-blue-600 hover:bg-blue-700">
              Sí, tengo alergias
            </Button>
          </Link>
          <Link href={`/menu/${restaurantSlug}/carta`} passHref className="w-full">
            <Button size="lg" className="w-full text-lg h-14 rounded-full" variant="outline">
              No, ver la carta
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
