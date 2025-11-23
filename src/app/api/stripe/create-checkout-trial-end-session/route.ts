import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

export const runtime = 'nodejs';

// ---------- Firebase Admin ----------
if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
}

const db = getFirestore();

// ---------- Stripe ----------
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    // Del front solo necesitamos userId y priceId
    const body = await req.json();
    const userId: string | undefined = body.userId;
    const priceId: string | undefined = body.priceId;

    if (!userId || !priceId) {
      return NextResponse.json(
        { error: 'Missing required fields (userId, priceId)' },
        { status: 400 }
      );
    }

    // 1) Documento de restaurante por UID
    const restaurantRef = db.collection('restaurants').doc(userId);
    const doc = await restaurantRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Restaurant not found in Firestore' },
        { status: 404 }
      );
    }

    const data = doc.data() || {};

    // ✅ Campos según tu ejemplo Firestore
    const userEmail: string | undefined = data.email;
    const userName: string | undefined = data.ownerName || data.restaurantName;

    if (!userEmail || !userName) {
      return NextResponse.json(
        { error: 'Missing email or ownerName in Firestore' },
        { status: 400 }
      );
    }

    let stripeCustomerId: string | undefined = data.stripeCustomerId;

    // 2) Si hay stripeCustomerId, verificar que exista en Stripe
    //    Si no existe (test/live o borrado), lo recreamos
    if (stripeCustomerId) {
      try {
        await stripe.customers.retrieve(stripeCustomerId);
      } catch (err: any) {
        if (err?.code === 'resource_missing') {
          stripeCustomerId = undefined;
        } else {
          throw err;
        }
      }
    }

    // 3) Si no hay customer válido, crear uno y guardar
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        name: userName,
        metadata: {
          firebaseUid: userId,
          restaurantSlug: data.slug || '',
        },
      });

      stripeCustomerId = customer.id;

      await restaurantRef.set(
        { stripeCustomerId },
        { merge: true }
      );
    }

    // 4) Crear sesión de checkout
    const origin =
      req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL;

    if (!origin) {
      return NextResponse.json(
        { error: 'Missing origin / NEXT_PUBLIC_APP_URL' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard/billing?success=true`,
      cancel_url: `${origin}/dashboard/pricing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('[API/STRIPE/CHECKOUT-TRIAL-END-SESSION]', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
