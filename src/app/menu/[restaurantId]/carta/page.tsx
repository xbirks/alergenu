export const revalidate = 0;

import { notFound } from 'next/navigation';
import { PublicMenuClient } from '@/components/menu/public-menu-client';
import { GET as getMenuApi } from '@/app/api/menu/[restaurantSlug]/route';
import { Restaurant, Category, MenuItem, Allergen } from '@/lib/types';

interface MenuData {
  restaurant: Restaurant;
  restaurantId: string;
  categories: Category[];
  items: MenuItem[];
  customAllergens: Allergen[];
}

async function getMenuData(slug: string): Promise<MenuData> {
  try {
    const request = new Request(`http://dummyurl/api/menu/${slug}`);
    const response = await getMenuApi(request, { params: { restaurantSlug: slug } });

    if (response.status === 404) {
      notFound();
    }

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[DIAGNOSIS] API route returned an error. Status: ${response.status}, Body: ${errorBody}`);
      throw new Error(`API route failed with status ${response.status}`);
    }

    return response.json();

  } catch (error) {
    console.error('\n', '* '.repeat(20));
    console.error('[DIAGNOSIS] CRITICAL ERROR IN getMenuData:', error);
    console.error('* '.repeat(20), '\n');
    throw error;
  }
}

export default async function PublicMenuPage({ params }: { params: { restaurantId: string } }) {
  const { restaurantId } = params;
  try {
    const menuData = await getMenuData(restaurantId);

    return (
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {JSON.stringify(menuData, null, 2)}
      </pre>
    );
  } catch (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-destructive">Error de Carga</h2>
          <p className="text-muted-foreground mt-2">No se pudo cargar la información. Por favor, inténtalo más tarde.</p>
        </div>
      </div>
    );
  }
}