import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// If the app is not already initialized, initialize it.
// This will automatically use the service account credentials of the
// runtime environment (the ...compute@... service account).
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();
const storage = getStorage();

export { db, storage };
