import type { Metadata } from 'next';
import { db } from '@/lib/firebase/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';

interface Props {
  params: { restaurantId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const restaurantsRef = collection(db, 'restaurants');
    const q = query(restaurantsRef, where("slug", "==", params.restaurantId), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const restaurant = querySnapshot.docs[0].data();
      const restaurantName = restaurant.restaurantName || 'Restaurante';

      return {
        title: `${restaurantName} - Carta Digital | ALERGENU`,
        description: `Consulta la carta digital de ${restaurantName} con información detallada de alérgenos y filtros personalizados.`,
        openGraph: {
          title: `${restaurantName} - Carta Digital`,
          description: `Consulta la carta de ${restaurantName} con filtro de alérgenos`,
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: `${restaurantName} - Carta Digital`,
          description: `Consulta la carta de ${restaurantName} con filtro de alérgenos`,
        },
        robots: {
          index: true,
          follow: true,
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  // Fallback metadata
  return {
    title: 'Carta Digital | ALERGENU',
    description: 'Consulta nuestra carta digital con información de alérgenos.',
  };
}

export default function MenuRestaurantLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
