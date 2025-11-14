
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/firebase';

interface SubscriptionState {
  subscriptionStatus: string | null;
  isLoading: boolean;
  error: string | null;
}

// This hook checks the user's auth state and listens to their subscription status in real-time.
// It can be used to protect routes and show UI elements based on subscription status.
export function useSubscription() {
  const router = useRouter();
  const [state, setState] = useState<SubscriptionState>({
    subscriptionStatus: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const restaurantDocRef = doc(db, 'restaurants', user.uid);
        
        // Use onSnapshot for real-time subscription status updates
        const docUnsubscribe = onSnapshot(restaurantDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const status = data.subscriptionStatus;
            const trialEndsAt = data.trialEndsAt?.seconds * 1000;

            let finalStatus = status;

            // Automatically update status if trial has ended
            if (status === 'trialing' && trialEndsAt && new Date() > new Date(trialEndsAt)) {
              finalStatus = 'trial_expired'; 
            }
            
            setState({ subscriptionStatus: finalStatus, isLoading: false, error: null });

          } else {
            setState({ subscriptionStatus: null, isLoading: false, error: 'Subscription data not found.' });
          }
        }, (err) => {
          console.error('Error listening to subscription document:', err);
          setState({ subscriptionStatus: null, isLoading: false, error: 'Failed to load subscription status.' });
        });

        return () => docUnsubscribe(); // Cleanup Firestore listener on user change

      } else {
        // If no user is logged in, they have no subscription.
        setState({ subscriptionStatus: null, isLoading: false, error: null });
        router.push('/login'); // Redirect non-logged-in users to login
      }
    });

    return () => authUnsubscribe(); // Cleanup auth listener on component unmount
  }, [router]);

  return state;
}

// --- Example of how to protect a page ---
/*
'use client';
import { useSubscription } from '@/hooks/useSubscription';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { subscriptionStatus, isLoading } = useSubscription();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && subscriptionStatus !== 'active') {
      // You can add more nuanced logic here, e.g. allowing 'trialing'
      router.push('/dashboard/billing');
    }
  }, [isLoading, subscriptionStatus, router]);

  if (isLoading) {
    return <div>Loading subscription details...</div>;
  }

  if (subscriptionStatus === 'active') {
      return <div>Welcome to your protected content!</div>;
  }

  return null; // Or a message indicating redirection
}
*/
