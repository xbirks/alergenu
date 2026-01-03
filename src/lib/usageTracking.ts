import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase/firebase';

/**
 * Usage tracking for menu photo analysis
 * Structure: users/{userId}/usage/menuPhotoAnalysis
 */

export interface MenuPhotoUsage {
    freeLimit: number; // Always 5
    used: number; // Lifetime counter
    purchased: number; // Additional credits purchased
    lastUsed?: Date;
    history: {
        timestamp: Date;
        itemsDetected: number;
        success: boolean;
    }[];
}

/**
 * Check if user can upload a menu photo
 * Returns remaining credits and whether upload is allowed
 */
export async function checkUsageLimit(userId: string): Promise<{
    canUpload: boolean;
    remaining: number;
    total: number;
    used: number;
}> {
    try {
        const usageRef = doc(db, 'users', userId, 'usage', 'menuPhotoAnalysis');
        const usageDoc = await getDoc(usageRef);

        if (!usageDoc.exists()) {
            // First time user - initialize with 5 free credits
            const initialUsage: MenuPhotoUsage = {
                freeLimit: 5,
                used: 0,
                purchased: 0,
                history: [],
            };

            await setDoc(usageRef, initialUsage);

            return {
                canUpload: true,
                remaining: 5,
                total: 5,
                used: 0,
            };
        }

        const usage = usageDoc.data() as MenuPhotoUsage;
        const total = usage.freeLimit + usage.purchased;
        const remaining = total - usage.used;

        return {
            canUpload: remaining > 0,
            remaining: Math.max(0, remaining),
            total,
            used: usage.used,
        };
    } catch (error) {
        console.error('[usageTracking] Error checking usage limit:', error);
        // On error, deny upload to be safe
        return {
            canUpload: false,
            remaining: 0,
            total: 5,
            used: 0,
        };
    }
}

/**
 * Increment usage counter after successful analysis
 */
export async function incrementUsage(
    userId: string,
    itemsDetected: number,
    success: boolean = true
): Promise<void> {
    try {
        const usageRef = doc(db, 'users', userId, 'usage', 'menuPhotoAnalysis');

        await updateDoc(usageRef, {
            used: increment(1),
            lastUsed: new Date(),
            history: [
                {
                    timestamp: new Date(),
                    itemsDetected,
                    success,
                },
            ],
        });

        console.log(`[usageTracking] Incremented usage for user ${userId}`);
    } catch (error) {
        console.error('[usageTracking] Error incrementing usage:', error);
        throw error;
    }
}

/**
 * Add purchased credits to user account
 * Called after successful Stripe payment
 */
export async function addPurchasedCredits(
    userId: string,
    amount: number
): Promise<void> {
    try {
        const usageRef = doc(db, 'users', userId, 'usage', 'menuPhotoAnalysis');

        await updateDoc(usageRef, {
            purchased: increment(amount),
        });

        console.log(`[usageTracking] Added ${amount} purchased credits to user ${userId}`);
    } catch (error) {
        console.error('[usageTracking] Error adding purchased credits:', error);
        throw error;
    }
}

/**
 * Get usage statistics for a user
 */
export async function getUsageStats(userId: string): Promise<MenuPhotoUsage | null> {
    try {
        const usageRef = doc(db, 'users', userId, 'usage', 'menuPhotoAnalysis');
        const usageDoc = await getDoc(usageRef);

        if (!usageDoc.exists()) {
            return null;
        }

        return usageDoc.data() as MenuPhotoUsage;
    } catch (error) {
        console.error('[usageTracking] Error getting usage stats:', error);
        return null;
    }
}

/**
 * For anonymous users (not logged in), track by IP
 * Structure: menuPhotoUploads/{ip_hash}
 */
export async function checkAnonymousUsageLimit(ipHash: string): Promise<{
    canUpload: boolean;
    remaining: number;
}> {
    try {
        const uploadRef = doc(db, 'menuPhotoUploads', ipHash);
        const uploadDoc = await getDoc(uploadRef);

        if (!uploadDoc.exists()) {
            // First time - allow upload
            await setDoc(uploadRef, {
                count: 0,
                limit: 9999, // TODO: REDUCE TO 5 BEFORE PRODUCTION!
                createdAt: new Date(),
            });

            return {
                canUpload: true,
                remaining: 9999, // TODO: REDUCE TO 5 BEFORE PRODUCTION!
            };
        }

        const data = uploadDoc.data();
        const remaining = data.limit - data.count;

        return {
            canUpload: remaining > 0,
            remaining: Math.max(0, remaining),
        };
    } catch (error) {
        console.error('[usageTracking] Error checking anonymous usage:', error);
        return {
            canUpload: false,
            remaining: 0,
        };
    }
}

/**
 * Increment anonymous usage counter
 */
export async function incrementAnonymousUsage(ipHash: string): Promise<void> {
    try {
        const uploadRef = doc(db, 'menuPhotoUploads', ipHash);

        await updateDoc(uploadRef, {
            count: increment(1),
            lastUsed: new Date(),
        });

        console.log(`[usageTracking] Incremented anonymous usage for IP hash ${ipHash}`);
    } catch (error) {
        console.error('[usageTracking] Error incrementing anonymous usage:', error);
        throw error;
    }
}
