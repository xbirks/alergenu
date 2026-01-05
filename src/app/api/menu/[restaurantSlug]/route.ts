import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { Restaurant, Category, MenuItem, Allergen } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { restaurantSlug: string } }
) {
  try {
    const adminDb = getAdminDb();
    const slug = params.restaurantSlug;

    if (!slug) {
      console.log('[API][Menu] Restaurant slug is missing.');
      return NextResponse.json({ message: 'Restaurant slug is required' }, { status: 400 });
    }

    const restaurantsRef = adminDb.collection('restaurants');
    const restaurantQuery = await restaurantsRef.where('slug', '==', slug).limit(1).get();

    if (restaurantQuery.empty) {
      console.log(`[API][Menu] Restaurant with slug "${slug}" not found.`);
      return NextResponse.json({ message: 'Restaurant not found' }, { status: 404 });
    }

    const restaurantDoc = restaurantQuery.docs[0];
    const restaurantData = restaurantDoc.data() as Restaurant;
    const restaurantId = restaurantDoc.id;
    const restaurantDocRef = adminDb.collection('restaurants').doc(restaurantId);

    // === Lógica para verificar el estado de la suscripción ===
    const now = new Date();
    const trialEndsAtDate = restaurantData.trialEndsAt instanceof Timestamp ? restaurantData.trialEndsAt.toDate() : null;
    const currentPeriodEndDate = restaurantData.currentPeriodEnd instanceof Timestamp ? restaurantData.currentPeriodEnd.toDate() : null;

    // Diagnostic logs
    console.log(`[API][Menu][TrialCheck] --- Diagnóstico de "${slug}" ---`);
    console.log(`[API][Menu][TrialCheck] subscriptionStatus: ${restaurantData.subscriptionStatus}`);
    console.log(`[API][Menu][TrialCheck] trialEndsAt (Firestore): ${restaurantData.trialEndsAt?.toDate().toISOString() || 'N/A'}`);
    console.log(`[API][Menu][TrialCheck] trialEndsAtDate (parsed): ${trialEndsAtDate?.toISOString() || 'N/A'}`);
    console.log(`[API][Menu][TrialCheck] currentPeriodEnd: ${currentPeriodEndDate?.toISOString() || 'N/A'}`);
    console.log(`[API][Menu][TrialCheck] Current server time (now): ${now.toISOString()}`);
    console.log(`[API][Menu][TrialCheck] now > trialEndsAtDate: ${trialEndsAtDate ? now > trialEndsAtDate : 'N/A (trialEndsAtDate is null)'}`);

    // ✅ CORREGIDO: Permitir acceso a usuarios cancelados hasta currentPeriodEnd
    let hasAccess = true;
    let blockReason = '';

    // 1. Trial expirado
    const isTrialExpired =
      restaurantData.subscriptionStatus === 'trial_expired' ||
      (restaurantData.subscriptionStatus === 'trialing' && trialEndsAtDate && now > trialEndsAtDate);

    if (isTrialExpired) {
      hasAccess = false;
      blockReason = 'trial_expired';
    }

    // 2. Usuario cancelado - verificar si aún tiene acceso
    if (restaurantData.subscriptionStatus === 'canceled' && currentPeriodEndDate) {
      if (now > currentPeriodEndDate) {
        hasAccess = false;
        blockReason = 'canceled_period_ended';
      } else {
        console.log(`[API][Menu] Canceled user "${slug}" still has access until: ${currentPeriodEndDate.toISOString()}`);
      }
    }

    // 3. Otros estados sin acceso
    if (['past_due', 'incomplete'].includes(restaurantData.subscriptionStatus || '')) {
      hasAccess = false;
      blockReason = restaurantData.subscriptionStatus || 'unknown';
    }

    console.log(`[API][Menu][TrialCheck] hasAccess (final result): ${hasAccess}, reason: ${blockReason || 'N/A'}`);
    console.log(`[API][Menu][TrialCheck] ----------------------------------`);

    if (!hasAccess) {
      console.log(`[API] Restaurant "${slug}" access blocked. Reason: ${blockReason}. Returning 403.`);
      return NextResponse.json(
        {
          message: 'La prueba gratuita ha expirado. Para que tu carta vuelva a estar visible, activa una suscripción.',
          userId: restaurantData.ownerId || null,
          userEmail: restaurantData.email || null,
          userName: restaurantData.ownerName || null,
        },
        { status: 403 }
      );
    }
    // =========================================================

    restaurantDocRef.update({ qrScans: FieldValue.increment(1) }).catch(err => {
      console.error('[API] Failed to increment QR scan count:', err);
    });

    const [categoriesSnapshot, menuItemsSnapshot, allergensSnapshot] = await Promise.all([
      restaurantDocRef.collection('categories').orderBy('order', 'asc').get(),
      restaurantDocRef.collection('menuItems').orderBy('order', 'asc').get(),
      restaurantDocRef.collection('allergens').get(),
    ]);

    const categoryNameToIdMap = new Map<string, string>();
    let allCategories = categoriesSnapshot.docs.map(doc => {
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

    // === Lógica de filtrado por temporizador de categorías ===
    // Forcing to Spain timezone (Madrid) to match potential user expectations or dashboard settings
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'Europe/Madrid' };
    const formatter = new Intl.DateTimeFormat('es-ES', options);
    const [hourStr, minuteStr] = formatter.format(now).split(':');
    const currentHours = parseInt(hourStr, 10);
    const currentMinutes = parseInt(minuteStr, 10);
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;

    // console.log(`[API] Current time in Madrid: ${currentHours}:${currentMinutes} (${currentTimeInMinutes} minutes past midnight)`);

    const visibleCategoryIds = new Set<string>();

    const filteredCategories = allCategories.filter(category => {
      const hasTimer = !!(category.startTime && category.endTime);
      let isVisibleByTime = true;

      if (hasTimer) {
        const [startH, startM] = category.startTime!.split(':').map(Number);
        const [endH, endM] = category.endTime!.split(':').map(Number);

        const startTimeInMinutes = startH * 60 + startM;
        const endTimeInMinutes = endH * 60 + endM;

        // Debug logs for each category's timer
        // console.log(`[API] Category "${category.name_i18n.es}" (ID: ${category.id}) timer: ${category.startTime} - ${category.endTime}`);
        // console.log(`[API]   -> Start: ${startTimeInMinutes}, End: ${endTimeInMinutes}`);

        if (startTimeInMinutes <= endTimeInMinutes) {
          // Normal time range, e.g., 08:00 - 12:00
          isVisibleByTime = currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
        } else {
          // Overnight time range, e.g., 22:00 - 02:00
          isVisibleByTime = currentTimeInMinutes >= startTimeInMinutes || currentTimeInMinutes <= endTimeInMinutes;
        }
        // console.log(`[API]   -> Is visible by time: ${isVisibleByTime}`);
      }

      if (isVisibleByTime) {
        visibleCategoryIds.add(category.id);
      }

      // console.log(`[API] Final visibility for category "${category.name_i18n.es}": ${isVisibleByTime}`);
      return isVisibleByTime;
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
    }).filter(item => item.isAvailable && (item.categoryId ? visibleCategoryIds.has(item.categoryId) : true)); // Filter menu items by visible categories

    const customAllergens = allergensSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Allergen));

    const menuData = {
      restaurant: restaurantData,
      restaurantId: restaurantId,
      categories: filteredCategories, // Use filtered categories
      items: menuItems,
      customAllergens: customAllergens,
    };

    return NextResponse.json(menuData, { status: 200 });

  } catch (error) {
    console.error(`[API] CRITICAL ERROR fetching menu for ${params.restaurantSlug}:`, error);
    return NextResponse.json({ message: 'Failed to fetch menu data' }, { status: 500 });
  }
}
