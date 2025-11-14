
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAdminDb } from '@/lib/firebase/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const db = getAdminDb();
    const userDoc = await db.collection('users').doc(userId).get();
    const stripeCustomerId = userDoc.data()?.stripeCustomerId;

    if (!stripeCustomerId) {
      // This is a special case. The user exists in Firebase but not in Stripe.
      // This can happen for users on a free/trial plan who never initiated a payment.
      // We will create a Stripe Customer for them now, so they can see pricing.
      const userRecord = await db.collection('restaurants').doc(userId).get();
      const userEmail = userRecord.data()?.email;
      const userName = userRecord.data()?.ownerName;

      if (!userEmail) {
        return NextResponse.json({ error: 'User email not found, cannot create Stripe customer.' }, { status: 404 });
      }

      const customer = await stripe.customers.create({
          email: userEmail,
          name: userName,
          metadata: {
            firebaseUID: userId,
          },
      });

      await db.collection('users').doc(userId).update({ stripeCustomerId: customer.id });
      await db.collection('restaurants').doc(userId).update({ stripeCustomerId: customer.id });
      
      const newStripeCustomerId = customer.id;

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: newStripeCustomerId,
        return_url: `${baseUrl}/dashboard/billing`, 
      });
      return NextResponse.json({ url: portalSession.url });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${baseUrl}/dashboard/billing`, // The URL users will be sent to after managing their subscription
    });

    return NextResponse.json({ url: portalSession.url });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error creating Stripe portal session: ${errorMessage}`);
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}

export { handler as POST };
