
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { getAdminDb } from '@/lib/firebase/firebase-admin';

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

// The webhook signing secret, also from environment variables
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

async function handler(req: NextRequest) {
  const buf = await req.text();
  const sig = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  // Verify the event came from Stripe
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  console.log(`✅ Stripe Webhook Received: ${event.type}`);

  const db = getAdminDb();

  try {
    // Handle the event
    switch (event.type) {
      // --- SUBSCRIPTION COMPLETED ---
      // Occurs when the first payment is made for a new subscription
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const firebaseUID = session.metadata?.firebaseUID;
        
        if (!firebaseUID) {
          console.error('❌ Metadata (firebaseUID) missing in checkout session');
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        const restaurantRef = db.collection('restaurants').doc(firebaseUID);
        await restaurantRef.update({
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          subscriptionStatus: 'active',
          plan: 'autonomia', // Or derive this from the price ID if needed
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        });
        
        console.log(`✅ Firestore updated for user ${firebaseUID}: Subscription ACTIVATED.`);
        break;
      }

      // --- SUBSCRIPTION DELETED ---
      // Occurs when a subscription is canceled by the user or by Stripe
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeCustomerId = subscription.customer as string;

        // Find the user in Firestore by their Stripe Customer ID
        const query = db.collection('restaurants').where('stripeCustomerId', '==', stripeCustomerId);
        const snapshot = await query.get();
        
        if (snapshot.empty) {
            console.error(`❌ No restaurant found with Stripe Customer ID: ${stripeCustomerId}`);
            break;
        }

        const doc = snapshot.docs[0];
        await doc.ref.update({
          subscriptionStatus: 'canceled',
        });

        console.log(`✅ Firestore updated for user ${doc.id}: Subscription CANCELED.`);
        break;
      }

      // You can add more event handlers here in the future
      // case 'invoice.payment_failed':
      //   // ... handle failed renewal payments
      //   break;

      default:
        // console.log(`🤷‍♀️ Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ received: true, error: "Webhook processing failed." }, { status: 500 });
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}

export { handler as POST };

