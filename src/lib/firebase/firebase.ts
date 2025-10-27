
// src/lib/firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    onIdTokenChanged, 
    IdTokenResult 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * This is the core of the client-side authentication management.
 * It listens for changes in the user's sign-in state (sign-in, sign-out, token refresh)
 * and synchronizes the ID token with a server-side session cookie.
 */
onIdTokenChanged(auth, async (user) => {
    if (user) {
        // User is signed in or token has been refreshed.
        console.log('[Auth State] User is signed in. Refreshing token and setting session cookie...');

        // Force a token refresh to get the latest custom claims (like 'admin').
        // This is crucial for the admin role to be recognized immediately after it's granted.
        const tokenResult: IdTokenResult = await user.getIdTokenResult(true); 

        // Send the fresh token to the server to be stored in a session cookie.
        // The server will verify this token and create a secure, httpOnly cookie.
        try {
            await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenResult.token}`,
                },
            });
            console.log('[Auth State] Session cookie set successfully.');
        } catch (error) {
            console.error('[Auth State] Error setting session cookie:', error);
        }
    } else {
        // User is signed out.
        // Inform the server to clear the session cookie.
        console.log('[Auth State] User is signed out. Clearing session cookie...');
        try {
            await fetch('/api/auth', { method: 'DELETE' });
            console.log('[Auth State] Session cookie cleared successfully.');
        } catch (error) {
            console.error('[Auth State] Error clearing session cookie:', error);
        }
    }
});

export { app, auth, db };
