
"use server";

import { getAuth } from 'firebase-admin/auth';
import { getAdminApp, getAdminDb } from '@/lib/firebase/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

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

/**
 * Server Action to manually assign a subscription plan to a user.
 * This sets their subscription status to 'active' and sets a very distant end date.
 * @param userId The ID of the user (restaurant owner) to assign the plan to.
 * @param newPlan The ID of the plan to assign ('autonomia', 'premium', 'gratuito').
 * @returns An object with a success message or an error message.
 */
export async function assignSubscriptionPlan(userId: string, newPlan: 'gratuito' | 'autonomia' | 'premium'): Promise<{ success: boolean; message: string; }> {
    if (!userId) {
        return { success: false, message: "User ID is missing." };
    }
    if (!['gratuito', 'autonomia', 'premium'].includes(newPlan)) {
        return { success: false, message: "Invalid plan specified." };
    }

    const db = getAdminDb();
    const restaurantRef = db.collection('restaurants').doc(userId);

    try {
        // Set currentPeriodEnd far into the future (e.g., 10 years from now)
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 10);

        await restaurantRef.update({
            selectedPlan: newPlan,
            subscriptionStatus: 'active', // Manually assigned plans are always active
            // For 'gratuito' manually assigned, it's effectively a lifetime active plan
            trialEndsAt: newPlan === 'gratuito' ? Timestamp.fromDate(futureDate) : null, // Set trial end for free manual plans
            currentPeriodEnd: Timestamp.fromDate(futureDate), // Set end date for paid manual plans
            stripeSubscriptionId: 'manual_assignment', // Indicate it's a manual override
            stripeCustomerId: 'manual_assignment', // Indicate it's a manual override
        });

        console.log(`[Server Action] Assigned plan ${newPlan} to user ${userId} manually.`);
        return { success: true, message: `Plan ${newPlan} asignado manualmente al usuario ${userId}.` };
    } catch (error: any) {
        console.error("Error assigning subscription plan:", error);
        return { success: false, message: `Failed to assign plan: ${error.message}` };
    }
}
