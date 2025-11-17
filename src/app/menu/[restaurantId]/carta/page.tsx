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
    // We create a dummy request object as the API route handler expects it.
    const request = new Request(`http://dummyurl/api/menu/${slug}`);
    const response = await getMenuApi(request, { params: { restaurantSlug: slug } });

    if (response.status === 404) {
      notFound();
    }

    if (!response.ok) {
      console.error(`[PublicPage] API responded with status ${response.status}`);
      throw new Error('Failed to fetch menu data');
    }

    return response.json();

  } catch (error) {
    console.error('[PublicPage] Critical error in getMenuData:', error);
    throw error; // Let Next.js handle the final error boundary
  }
}

export default async function PublicMenuPage({ params }: { params: { restaurantId: string } }) {
  const { restaurantId } = params;
  try {
    const menuData = await getMenuData(restaurantId);

    // --- Time-based Category Filtering --- //
    const now = new Date();
    const timeInMadrid = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
    const currentHours = timeInMadrid.getHours().toString().padStart(2, '0');
    const currentMinutes = timeInMadrid.getMinutes().toString().padStart(2, '0');
    const currentTime = `${currentHours}:${currentMinutes}`;

    const hiddenCategoryIds = new Set(
      menuData.categories
        .filter(category => {
          const { startTime, endTime } = category;
          if (!startTime || !endTime) {
            return false; // NOT hidden if no schedule is set
          }
          // Handle overnight schedule (e.g., 22:00 to 05:00)
          if (startTime > endTime) {
            // Hidden if current time is NOT in the active overnight period
            return !(currentTime >= startTime || currentTime <= endTime);
          }
          // Handle normal schedule (e.g., 12:00 to 16:00)
          // Hidden if current time is outside the active period
          return !(currentTime >= startTime && currentTime <= endTime);
        })
        .map(c => c.id)
    );

    // Filter categories and items based on the hidden IDs
    const visibleCategories = menuData.categories.filter(category => !hiddenCategoryIds.has(category.id));
    const visibleItems = menuData.items.filter(item => !hiddenCategoryIds.has(item.categoryId));

    // --- Last Updated Timestamp Calculation --- //
    let lastUpdatedAt: string | null = null;
    if (menuData.items && menuData.items.length > 0) {
        // @ts-ignore - Firestore Timestamp can be tricky, this handles it safely
        const latestTimestamp = menuData.items.reduce((latest, item) => {
            if (item.updatedAt && item.updatedAt.seconds > latest.seconds) {
                return item.updatedAt;
            }
            return latest;
        }, { seconds: 0, nanoseconds: 0 });

        if (latestTimestamp.seconds > 0) {
            lastUpdatedAt = new Date(latestTimestamp.seconds * 1000).toISOString();
        }
    }

    return (
      <PublicMenuClient 
        restaurant={menuData.restaurant}
        restaurantId={menuData.restaurantId}
        initialCategories={visibleCategories}
        initialItems={visibleItems}
        customAllergens={menuData.customAllergens}
        lastUpdatedAt={lastUpdatedAt}
      />
    );
  } catch (error) {
    // This is a top-level error boundary for the page.
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-destructive">Error de Carga</h2>
          <p className="text-muted-foreground mt-2">No se pudo cargar la información del menú. Por favor, inténtalo más tarde.</p>
        </div>
      </div>
    );
  }
}
