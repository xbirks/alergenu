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
        console.log(`[Server Action - Impersonation] Attempting to get auth for UID: ${uid}`);
        const auth = getAuth();
        const customToken = await auth.createCustomToken(uid);
        console.log(`[Server Action - Impersonation] Generated impersonation token for UID: ${uid}`);
        return { token: customToken, error: null };
    } catch (error: any) {
        console.error("[Server Action - Impersonation] Error creating custom token:", error);
        return { token: null, error: `Failed to create token: ${error.message}` };
    }
}

/**
 * Server Action to manually assign a subscription plan to a user.
 * This sets their subscription status to 'active' and sets a very distant end date.
 * @param userId The ID of the user (restaurant owner) to assign the plan to.
 * @param newPlan The ID of the plan to assign ('autonomia', 'premium'). Note: 'gratuito' will now be handled by startFreeTrial.
 * @returns An object with a success message or an error message.
 */
export async function assignSubscriptionPlan(userId: string, newPlan: 'autonomia' | 'premium'): Promise<{ success: boolean; message: string; }> {
    if (!userId) {
        return { success: false, message: "User ID is missing." };
    }
    if (!['autonomia', 'premium'].includes(newPlan)) {
        return { success: false, message: "Invalid plan specified. Only 'autonomia' and 'premium' can be assigned manually." };
    }

    try {
        console.log(`[Server Action - AssignPlan] Attempting to get Admin DB for user: ${userId}`);
        const db = getAdminDb();
        const restaurantRef = db.collection('restaurants').doc(userId);
        console.log(`[Server Action - AssignPlan] Got restaurantRef. Attempting to update for user: ${userId} with plan: ${newPlan}`);

        // Set currentPeriodEnd far into the future (e.g., 10 years from now)
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 10);

        await restaurantRef.update({
            selectedPlan: newPlan,
            subscriptionStatus: 'active', // Manually assigned plans are always active
            trialEndsAt: null, // No trial period for manual 'active' assignments
            currentPeriodEnd: Timestamp.fromDate(futureDate), // Set end date for manual plans
            stripeSubscriptionId: 'manual_assignment', // Indicate it's a manual override
            stripeCustomerId: 'manual_assignment', // Indicate it's a manual override
        });

        console.log(`[Server Action - AssignPlan] Successfully assigned plan ${newPlan} to user ${userId} manually.`);
        return { success: true, message: `Plan ${newPlan} asignado manualmente al usuario ${userId}.` };
    } catch (error: any) {
        console.error("[Server Action - AssignPlan] Error assigning subscription plan:", error);
        return { success: false, message: `Failed to assign plan: ${error.message}` };
    }
}

/**
 * Server Action to start a 3-month free trial for a restaurant.
 * @param userId The ID of the user (restaurant owner) to start the trial for.
 * @returns An object with a success message or an error message.
 */
export async function startFreeTrial(userId: string): Promise<{ success: boolean; message: string; }> {
    if (!userId) {
        return { success: false, message: "User ID is missing." };
    }

    try {
        console.log(`[Server Action - FreeTrial] Attempting to get Admin DB for user: ${userId}`);
        const db = getAdminDb();
        const restaurantRef = db.collection('restaurants').doc(userId);
        console.log(`[Server Action - FreeTrial] Got restaurantRef. Attempting to update for user: ${userId}`);

        const trialEndDate = new Date();
        trialEndDate.setMonth(trialEndDate.getMonth() + 3); // 3 months from now

        await restaurantRef.update({
            selectedPlan: 'gratuito',
            subscriptionStatus: 'trialing',
            trialEndsAt: Timestamp.fromDate(trialEndDate),
            currentPeriodEnd: null, // No current period end for a trial
            stripeSubscriptionId: null, // No Stripe subscription for a manual trial
            stripeCustomerId: null,     // No Stripe customer for a manual trial
        });

        console.log(`[Server Action - FreeTrial] Started 3-month free trial for user ${userId}.`);
        return { success: true, message: `Prueba gratuita de 3 meses iniciada para el usuario ${userId}.` };
    } catch (error: any) {
        console.error("[Server Action - FreeTrial] Error starting free trial:", error);
        return { success: false, message: `Error al iniciar la prueba gratuita: ${error.message}` };
    }
}

/**
 * Server Action to delete a user and their associated data.
 * @param uid The user ID to delete.
 */
export async function deleteUserAction(uid: string): Promise<{ success: boolean; message: string }> {
    if (!uid) return { success: false, message: "No User ID provided" };

    try {
        const auth = getAuth();
        const db = getAdminDb();

        console.log(`[Admin Delete] Deleting user ${uid}...`);

        // 1. Delete from Firebase Auth
        try {
            await auth.deleteUser(uid);
            console.log(`[Admin Delete] Auth user ${uid} deleted.`);
        } catch (e: any) {
            console.warn(`[Admin Delete] Auth user deletion warning: ${e.message}`);
            // Continue even if auth delete fails (maybe already deleted)
        }

        // 2. Delete Firestore Documents
        // We delete the main documents. Subcollections (like menuItems) are technically orphaned in Firestore 
        // unless recursively deleted. For this use case, deleting the parent 'restaurants/{uid}' is often enough 
        // to "hide" it, but for a true clean we might want recursive. 
        // Given complexity, we'll request the main paths deletion:

        await db.collection('restaurants').doc(uid).delete();
        await db.collection('users').doc(uid).delete();
        await db.collection('legalAcceptances').doc(uid).delete();

        // Manual cleanup of subcollections is expensive without a cloud function or recursive tool. 
        // For now, this effectively removes the user from the app.

        console.log(`[Admin Delete] Firestore data for ${uid} deleted.`);
        return { success: true, message: "Usuario eliminado correctamente" };

    } catch (error: any) {
        console.error("[Admin Delete] Error:", error);
        return { success: false, message: `Error al eliminar: ${error.message}` };
    }
}
