import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAdminDb } from '@/lib/firebase/firebase-admin';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const { userId, userEmail, userName, priceId } = await req.json();

    console.log('[Stripe Checkout API] Received request with:', { userId, userEmail, userName, priceId });

    if (!userId || !userEmail || !userName || !priceId) {
      console.error('[Stripe Checkout API] Missing required fields:', { userId, userEmail, userName, priceId });
      return NextResponse.json({ error: 'Missing required fields for checkout session' }, { status: 400 });
    }

    const db = getAdminDb();
    const restaurantRef = db.collection('restaurants').doc(userId);
    const restaurantDoc = await restaurantRef.get();

    if (!restaurantDoc.exists) {
      console.error('[Stripe Checkout API] Restaurant not found for userId:', userId);
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const restaurantData = restaurantDoc.data();
    let stripeCustomerId = restaurantData?.stripeCustomerId || null;

    // Si no existe un cliente de Stripe, creamos uno nuevo
    if (!stripeCustomerId) {
      console.log('[Stripe Checkout API] No existing Stripe customer. Creating new customer for', userEmail);
      const customer = await stripe.customers.create({
        email: userEmail,
        name: userName,
        metadata: { firebaseUID: userId },
      });
      stripeCustomerId = customer.id;
      // Guardar el nuevo customerId en el documento del restaurante en Firestore
      await restaurantRef.update({ stripeCustomerId: stripeCustomerId });
      console.log('[Stripe Checkout API] New Stripe customer created and saved:', stripeCustomerId);
    } else {
      console.log('[Stripe Checkout API] Existing Stripe customer found:', stripeCustomerId);
    }

    // Obtener la URL base para las redirecciones
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.headers.get('origin');
    console.log('[Stripe Checkout API] Base URL for redirects:', baseUrl);

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${baseUrl}/dashboard?payment_success=true`,
      cancel_url: `${baseUrl}/register?payment_canceled=true`,
      metadata: {
        firebaseUID: userId,
      },
    });

    // Corregido: Devolver la URL de la sesión de Checkout
    if (session.url) {
      console.log('[Stripe Checkout API] Checkout session created. URL:', session.url);
      return NextResponse.json({ url: session.url });
    } else {
      console.error('[Stripe Checkout API] Failed to retrieve checkout session URL for session ID:', session.id);
      return NextResponse.json({ error: 'Failed to retrieve Stripe checkout session URL' }, { status: 500 });
    }

  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Stripe Checkout API] Error creating checkout session: ${errorMessage}`, error);
    // Devuelve un error más detallado si es un error de Stripe
    if (error.type === 'StripeCardError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
