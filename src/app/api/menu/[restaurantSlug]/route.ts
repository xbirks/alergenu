import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebase-admin';
import { FieldValue, FieldPath } from 'firebase-admin/firestore';
import { Restaurant, Category, MenuItem, Allergen } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { restaurantSlug: string } }
) {
  try {
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
      restaurantDocRef.collection('menuItems').orderBy(FieldPath.documentId(), 'asc').get(),
      restaurantDocRef.collection('allergens').get(),
    ]);

    // Se envían las categorías con su objeto i18n garantizado
    const categories = categoriesSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data, 
          name_i18n: data.name_i18n || { es: data.name || '' },
          name: data.name // Mantener el nombre simple para el mapa de categorías del frontend
        } as Category;
    });
    
    // *** CORRECCIÓN DEFINITIVA ***
    const menuItems = menuItemsSnapshot.docs.map(doc => {
        const data = doc.data();
        const allergenData = data.allergens || {};
        const contains: string[] = [];
        const traces: string[] = [];

        for (const key in allergenData) {
            if (allergenData[key] === 'yes') contains.push(key);
            else if (allergenData[key] === 'traces') traces.push(key);
        }

        // 1. Garantizamos que los objetos de traducción existan.
        const name_i18n = data.name_i18n || { es: data.name || '' };
        const description_i18n = data.description_i18n || { es: data.description || '' };
        
        // 2. Extraemos el nombre de la categoría en español para usarlo como clave estable para agrupar.
        // ESTA ES LA SOLUCIÓN AL BUG DE "VARIOS".
        const categoryNameForGrouping = (data.category_i18n && data.category_i18n.es) 
            ? data.category_i18n.es 
            : (data.category || 'Varios');

        return {
            id: doc.id,
            price: data.price,
            isAvailable: data.isAvailable,
            allergens: contains,
            traces: traces,
            createdAt: data.createdAt,

            // 3. Devolvemos la clave de agrupación y los objetos de traducción completos.
            category: categoryNameForGrouping,
            name_i18n: name_i18n,
            description_i18n: description_i18n,
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
