
"use server";

import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase/firebase-admin';

// Asegurarnos de que la App de Admin está inicializada
getAdminApp();

/**
 * Server Action to create a custom sign-in token for a given user ID (UID).
 * This allows an admin to impersonate a user.
 * @param uid The user ID to impersonate.
 * @returns An object with the custom token or an error message.
 */
export async function createImpersonationToken(uid: string): Promise<{ token: string | null; error: string | null; }> {
    if (!uid) {
        return { token: null, error: "User ID is missing." };
    }

    try {
        const auth = getAuth();
        const customToken = await auth.createCustomToken(uid);
        console.log(`[Server Action] Generated impersonation token for UID: ${uid}`);
        return { token: customToken, error: null };
    } catch (error: any) {
        console.error("Error creating custom token:", error);
        return { token: null, error: `Failed to create token: ${error.message}` };
    }
}
