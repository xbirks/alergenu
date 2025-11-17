import { initializeApp, getApps, App, cert } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getStorage, Storage } from "firebase-admin/storage";
import type { ServiceAccount } from "firebase-admin";

let adminApp: App | undefined;
let adminDb: Firestore | undefined;
let adminStorage: Storage | undefined;

function initializeFirebaseAdmin() {
  // Check if an app is already initialized by the Admin SDK.
  // This prevents re-initialization errors in hot-reloading environments or multiple imports.
  if (getApps().length === 0) {
    console.log("[Firebase Admin SDK] No app initialized. Attempting to initialize now...");
    try {
      if (process.env.NODE_ENV === 'development') {
        const serviceAccount: ServiceAccount = {
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        };

        if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
          throw new Error("Firebase Admin SDK: Missing credentials in .env.local for development environment.");
        }

        adminApp = initializeApp({ credential: cert(serviceAccount) });
        console.log("[Firebase Admin SDK] DEVELOPMENT environment initialization successful.");

      } else {
        adminApp = initializeApp();
        console.log("[Firebase Admin SDK] PRODUCTION environment initialization successful (using ADC).");
      }
      
      adminDb = getFirestore(adminApp);
      adminStorage = getStorage(adminApp);

    } catch (error) {
      console.error("CRITICAL: Firebase Admin SDK initialization failed!", error);
      // Re-throw to ensure the application doesn't proceed with a broken Admin SDK
      throw new Error(`Could not initialize Firebase Admin SDK: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    // If apps exist, ensure we're using the first one, which should be the admin app if only one is meant to be initialized.
    if (!adminApp) { // Only re-assign if adminApp hasn't been set yet (e.g., from a previous module load)
      adminApp = getApps()[0];
      console.log("[Firebase Admin SDK] App already initialized. Assigning existing app.");
      adminDb = getFirestore(adminApp);
      adminStorage = getStorage(adminApp);
    } else {
        console.log("[Firebase Admin SDK] App already initialized. Using existing instance.");
    }
  }
}

// Call initialization once when the module is first loaded
initializeFirebaseAdmin();

export const getAdminApp = (): App => {
  if (!adminApp) {
    console.error("[Firebase Admin SDK] getAdminApp called when adminApp is undefined. Attempting re-initialization.");
    initializeFirebaseAdmin(); // Attempt to re-initialize defensively
    if (!adminApp) { // If still not initialized, throw a fatal error
        throw new Error("Firebase Admin SDK: Admin app is not initialized and could not be initialized defensively.");
    }
  }
  return adminApp;
};

export const getAdminDb = (): Firestore => {
  if (!adminDb) {
    console.error("[Firebase Admin SDK] getAdminDb called when adminDb is undefined. Attempting re-initialization.");
    initializeFirebaseAdmin(); // Attempt to re-initialize defensively
    if (!adminDb) { // If still not initialized, throw a fatal error
        throw new Error("Firebase Admin SDK: Firestore DB is not initialized and could not be initialized defensively.");
    }
  }
  return adminDb;
};

export const getAdminStorage = (): Storage => {
  if (!adminStorage) {
    console.error("[Firebase Admin SDK] getAdminStorage called when adminStorage is undefined. Attempting re-initialization.");
    initializeFirebaseAdmin(); // Attempt to re-initialize defensively
    if (!adminStorage) { // If still not initialized, throw a fatal error
        throw new Error("Firebase Admin SDK: Storage is not initialized and could not be initialized defensively.");
    }
  }
  return adminStorage;
};

// For full backwards compatibility, also export the instances directly (though functions are safer)
export { adminDb as db, adminStorage as storage };
