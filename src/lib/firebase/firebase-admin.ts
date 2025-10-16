
import admin from 'firebase-admin';
import { Firestore } from 'firebase-admin/firestore';

let db: Firestore;

function getAdminDb(): Firestore {
  if (!db) {
    try {
      if (!admin.apps.length) {
        // When deployed to App Hosting, the service account is automatically provided.
        // For local development, it will use Application Default Credentials.
        // You must run `gcloud auth application-default login` in your terminal for this to work locally.
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
          const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
          const serviceAccount = JSON.parse(serviceAccountString);
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          });
        } else {
          console.log("FIREBASE_SERVICE_ACCOUNT not set. Initializing with Application Default Credentials for local development.");
          admin.initializeApp({
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          });
        }
      }
      db = admin.firestore();
    } catch (error) {
      console.error('Firebase Admin initialization error:', error);
      if (!process.env.FIREBASE_SERVICE_ACCOUNT && !process.env.FUNCTIONS_EMULATOR) {
        console.error("CRITICAL: This is likely because you are running locally without Application Default Credentials. Please run 'gcloud auth application-default login' in your terminal and try again.");
      }
      throw error;
    }
  }
  return db;
}

export { getAdminDb };
