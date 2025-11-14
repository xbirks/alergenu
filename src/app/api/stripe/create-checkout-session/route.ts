
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAdminDb } from '@/lib/firebase/firebase-admin';

// Log the secret key value to debug environment variable loading
console.log('[Stripe Checkout API] STRIPE_SECRET_KEY from env:', process.env.STRIPE_SECRET_KEY ? '*****' + process.env.STRIPE_SECRET_KEY.slice(-4) : 'NOT_SET');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const { userId, userEmail, priceId, userName } = await req.json();

    if (!userId || !userEmail || !priceId) {
      return NextResponse.json({ error: 'Missing required parameters: userId, userEmail, or priceId' }, { status: 400 });
    }

    const db = getAdminDb(); 
    const userRef = db.collection('users').doc(userId);
    const restaurantRef = db.collection('restaurants').doc(userId);

    const userDoc = await userRef.get();
    let stripeCustomerId = userDoc.data()?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        name: userName,
        metadata: {
          firebaseUID: userId,
        },
      });
      stripeCustomerId = customer.id;

      await userRef.update({ stripeCustomerId: stripeCustomerId });
      await restaurantRef.update({ stripeCustomerId: stripeCustomerId });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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

    if (session.id) {
      return NextResponse.json({ sessionId: session.id });
    } else {
      return NextResponse.json({ error: 'Failed to create Stripe session' }, { status: 500 });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error creating checkout session: ${errorMessage}`);
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}

export { handler as POST };
