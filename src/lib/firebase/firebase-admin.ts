import { initializeApp, getApps, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let app: App;

// Check if the app is already initialized
if (!getApps().length) {
  console.log("Firebase Admin SDK: No app initialized. Attempting to initialize now...");
  try {
    // initializeApp() with no arguments will use the Application Default Credentials
    // which are automatically available in App Hosting.
    app = initializeApp();
    console.log("Firebase Admin SDK: Initialization successful.");
  } catch (error) {
    console.error("CRITICAL: Firebase Admin SDK initialization failed!", error);
    // If initialization fails, we must not proceed.
    // Throwing an error here will prevent the application from starting with a broken state.
    throw new Error("Could not initialize Firebase Admin SDK. The application cannot start.");
  }
} else {
  console.log("Firebase Admin SDK: App already initialized. Getting existing app.");
  app = getApps()[0];
}

// Pass the initialized app instance to getFirestore and getStorage
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

// For backwards compatibility with the rest of the code that still uses the old name
export const getAdminDb = () => db;
export const getAdminStorage = () => storage;
