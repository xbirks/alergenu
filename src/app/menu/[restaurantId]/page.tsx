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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D1117]">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D1117]">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-500">Error de Carga</h2>
          <p className="text-[#ABABAB] mt-2">{error}</p>
           <Link href={`/`} passHref className="w-full">
            <Button size="lg" className="w-full text-lg h-14 rounded-full bg-blue-600 hover:bg-blue-700 mt-8">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0D1117] min-h-screen font-sans flex flex-col items-center justify-center text-white px-4">
      <main className="flex flex-col items-center text-center w-full max-w-md">
        
        <p className="text-[12pt]" style={{color: '#F5F5F5'}}>
          Bienvenido a la carta digital de
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mt-1 mb-10">
          {restaurant?.restaurantName || 'Restaurante'}
        </h1>

        <div className="w-full border-t border-white/20 my-12"></div>

        <p className="text-[16pt] text-white mb-8">
          ¿Eres alérgico / intolerante a algún alimento?
        </p>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Link href={`/menu/${restaurantSlug}/carta?alergico=true`} passHref className="w-full">
            <Button size="lg" className="w-full text-lg h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              Sí, tengo alergias
            </Button>
          </Link>
          <Link href={`/menu/${restaurantSlug}/carta`} passHref className="w-full">
            <Button size="lg" className="w-full text-lg h-14 rounded-full bg-white hover:bg-gray-200 text-[#0D1117] font-semibold" variant="outline">
              No, ver carta completa
            </Button>
          </Link>
        </div>

        <p className="text-sm mt-12 max-w-xs" style={{color: '#ABABAB'}}>
          Ninguno de tus datos sensibles se almacenan en nuestras bases de datos. Puedes estar completamente tranquilo.
        </p>
      </main>
    </div>
  );
}
