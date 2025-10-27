
import { initializeApp, getApps, App, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// It's safer to import the type rather than asserting it inline.
import type { ServiceAccount } from "firebase-admin";

let app: App;

if (!getApps().length) {
  console.log("Firebase Admin SDK: No app initialized. Attempting to initialize now...");
  try {
    // When running locally (NODE_ENV is 'development'), we use the service account credentials from .env.local
    // In the deployed App Hosting environment, initializeApp() with no arguments is sufficient
    if (process.env.NODE_ENV === 'development') {
      const serviceAccount: ServiceAccount = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        // The private key can have literal \n characters in the .env file. We need to replace them with actual newlines.
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };

      // A simple check to ensure the essential variables are loaded.
      if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
        throw new Error("Firebase Admin SDK: Missing credentials in .env.local for the development environment. Please check your environment variables.");
      }

      app = initializeApp({
        credential: cert(serviceAccount)
      });
      console.log("Firebase Admin SDK: Initialization successful for DEVELOPMENT environment.");

    } else {
      // For production on App Hosting, use Application Default Credentials.
      // This requires no configuration and is the recommended approach.
      app = initializeApp();
      console.log("Firebase Admin SDK: Initialization successful for PRODUCTION environment.");
    }
    
  } catch (error) {
    console.error("CRITICAL: Firebase Admin SDK initialization failed!", error);
    throw new Error("Could not initialize Firebase Admin SDK. The application cannot start.");
  }
} else {
  console.log("Firebase Admin SDK: App already initialized. Getting existing app.");
  app = getApps()[0];
}

// Pass the initialized app instance to getFirestore and getStorage
const db = getFirestore(app);
const storage = getStorage(app);

// Export a function to get the initialized app instance, used by other server-side modules
export const getAdminApp = () => app;

// These are the primary exports for accessing Firestore and Storage
export const getAdminDb = () => db;
export const getAdminStorage = () => storage;

// For full backwards compatibility, also export the instances directly.
export { db, storage };
