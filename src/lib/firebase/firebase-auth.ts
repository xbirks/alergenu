
// src/lib/firebase/firebase-auth.ts
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase/firebase-admin'; // We need a way to get the initialized admin app

interface AuthenticatedUser {
    currentUser: import('firebase-admin/auth').UserRecord | null;
    token: import('firebase-admin/auth').DecodedIdToken | null;
}

/**
 * A server-side utility to get the currently authenticated user based on the
 * session cookie.
 *
 * It verifies the session cookie and fetches the full user record and decoded token.
 *
 * @returns {Promise<AuthenticatedUser>} An object containing `currentUser` and `token`.
 * They will be `null` if the user is not authenticated or the cookie is invalid.
 */
export async function getAuthenticatedAppForUser(): Promise<AuthenticatedUser> {
    const session = cookies().get('__session')?.value || '';

    // If no session cookie is present, the user is not logged in.
    if (!session) {
        return { currentUser: null, token: null };
    }

    try {
        const adminApp = getAdminApp(); // Initialize admin app
        const auth = getAuth(adminApp);

        // Verify the session cookie. This checks for expiry and integrity.
        const decodedIdToken = await auth.verifySessionCookie(session, true /** checkRevoked */);

        // Get the full user record from the UID in the token.
        const currentUser = await auth.getUser(decodedIdToken.uid);

        return {
            currentUser,
            token: decodedIdToken,
        };
    } catch (error) {
        console.warn('[Auth] Could not verify session cookie:', error.message);
        // If the cookie is invalid (e.g., expired), treat the user as logged out.
        return { currentUser: null, token: null };
    }
}
