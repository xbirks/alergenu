import type { Metadata } from 'next';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

interface Restaurant {
  restaurantName: string;
  slug: string;
}

export async function generateMetadata({ params }: { params: { restaurantId: string } }): Promise<Metadata> {
  const restaurantSlug = params.restaurantId as string;

  if (!restaurantSlug) {
    return {
      title: 'Menú Digital | Alergenu',
      description: 'Descubre cartas digitales interactivas con información de alérgenos.',
    };
  }

  try {
    const restaurantsRef = collection(db, 'restaurants');
    const q = query(restaurantsRef, where("slug", "==", restaurantSlug), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        title: 'Restaurante no encontrado | Alergenu',
        description: 'El restaurante que buscas no existe o la URL es incorrecta.',
      };
    }

    const restaurant = querySnapshot.docs[0].data() as Restaurant;
    const restaurantName = restaurant.restaurantName || 'Restaurante';

    return {
      title: `${restaurantName} - Menú Digital | Alergenu`,
      description: `Descubre la carta digital de ${restaurantName} en Alergenu. Consulta platos, precios e información sobre alérgenos de forma fácil y segura.`,
      openGraph: {
        title: `${restaurantName} - Menú Digital | Alergenu`,
        description: `Descubre la carta digital de ${restaurantName} en Alergenu. Consulta platos, precios e información sobre alérgenos de forma fácil y segura.`,
        images: [
          {
            url: '/seo/alergenu_meta-1200x630.jpg',
            width: 1200,
            height: 630,
            alt: `Menú de ${restaurantName}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${restaurantName} - Menú Digital | Alergenu`,
        description: `Descubre la carta digital de ${restaurantName} en Alergenu. Consulta platos, precios e información sobre alérgenos de forma fácil y segura.`,
        images: ['/seo/alergenu_twiiter-1200x630.jpg'],
      },
    };
  } catch (error) {
    console.error("Error fetching restaurant for metadata: ", error);
    return {
      title: 'Error al cargar el menú | Alergenu',
      description: 'Hubo un error al cargar la información del restaurante.',
    };
  }
}

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
