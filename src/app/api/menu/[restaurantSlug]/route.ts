import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { Restaurant, Category, MenuItem, Allergen } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { restaurantSlug: string } }
) {
  try {
    const adminDb = getAdminDb();
    const slug = params.restaurantSlug;

    if (!slug) {
      return NextResponse.json({ message: 'Restaurant slug is required' }, { status: 400 });
    }

    const restaurantsRef = adminDb.collection('restaurants');
    const restaurantQuery = await restaurantsRef.where('slug', '==', slug).limit(1).get();

    if (restaurantQuery.empty) {
      return NextResponse.json({ message: 'Restaurant not found' }, { status: 404 });
    }

    const restaurantDoc = restaurantQuery.docs[0];
    const restaurantData = restaurantDoc.data() as Restaurant;
    const restaurantId = restaurantDoc.id;
    const restaurantDocRef = adminDb.collection('restaurants').doc(restaurantId);

    restaurantDocRef.update({ qrScans: FieldValue.increment(1) }).catch(err => {
      console.error('[API] Failed to increment QR scan count:', err);
    });

    const [categoriesSnapshot, menuItemsSnapshot, allergensSnapshot] = await Promise.all([
      restaurantDocRef.collection('categories').orderBy('order', 'asc').get(),
      restaurantDocRef.collection('menuItems').orderBy('order', 'asc').get(),
      restaurantDocRef.collection('allergens').get(),
    ]);

    const categoryNameToIdMap = new Map<string, string>();
    let categories = categoriesSnapshot.docs.map(doc => {
        const data = doc.data();
        const name_i18n = data.name_i18n || {};
        const name = name_i18n.es || data.name || '';
        
        categoryNameToIdMap.set(name, doc.id);

        return { 
          id: doc.id, 
          order: data.order,
          name: name,
          name_i18n: name_i18n,
          startTime: data.startTime || null,
          endTime: data.endTime || null,
        } as Category;
    });

    // === Lógica de filtrado por temporizador ===
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;

    categories = categories.filter(category => {
      // Si no hay temporizador, la categoría siempre es visible
      if (!category.startTime || !category.endTime) {
        return true;
      }

      const [startH, startM] = category.startTime.split(':').map(Number);
      const [endH, endM] = category.endTime.split(':').map(Number);

      const startTimeInMinutes = startH * 60 + startM;
      const endTimeInMinutes = endH * 60 + endM;

      // Caso normal: el temporizador no cruza la medianoche (ej: 08:00 - 11:30)
      if (startTimeInMinutes <= endTimeInMinutes) {
        return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
      } else {
        // Caso en que el temporizador cruza la medianoche (ej: 22:00 - 02:00)
        return currentTimeInMinutes >= startTimeInMinutes || currentTimeInMinutes <= endTimeInMinutes;
      }
    });
    // ===========================================
    
    const menuItems = menuItemsSnapshot.docs.map(doc => {
        const data = doc.data();
        const allergenData = data.allergens || {};
        const contains: string[] = [];
        const traces: string[] = [];

        for (const key in allergenData) {
            if (allergenData[key] === 'yes') contains.push(key);
            else if (allergenData[key] === 'traces') traces.push(key);
        }

        const name_i18n = data.name_i18n || { es: data.name || '' };
        const description_i18n = data.description_i18n || { es: data.description || '' };
        
        const categoryNameForGrouping = (data.category_i18n && data.category_i18n.es) 
            ? data.category_i18n.es 
            : (data.category || 'Varios');

        let categoryId = data.categoryId;
        if (!categoryId) {
          categoryId = categoryNameToIdMap.get(categoryNameForGrouping);
        }

        return {
            id: doc.id,
            price: data.price,
            isAvailable: data.isAvailable,
            allergens: contains,
            traces: traces,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            order: data.order,
            categoryId: categoryId,
            category: categoryNameForGrouping,
            name_i18n: name_i18n,
            description_i18n: description_i18n,
            extras: data.extras || [],
        } as MenuItem;
    }).filter(item => item.isAvailable);

    const customAllergens = allergensSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Allergen));

    const menuData = {
      restaurant: restaurantData,
      restaurantId: restaurantId,
      categories: categories,
      items: menuItems,
      customAllergens: customAllergens,
    };

    return NextResponse.json(menuData, { status: 200 });

  } catch (error) {
    console.error(`[API] CRITICAL ERROR fetching menu for ${params.restaurantSlug}:`, error);
    return NextResponse.json({ message: 'Failed to fetch menu data' }, { status: 500 });
  }
}
