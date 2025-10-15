import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountString) {
      throw new Error('The FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
    }

    const serviceAccount = JSON.parse(serviceAccountString);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    // In a development environment, you might want to fall back to default credentials
    // if you have `gcloud auth application-default login` configured.
    // However, for production/deployment, we want it to fail loudly if the service account is misconfigured.
    if (process.env.NODE_ENV !== 'production') {
        try {
            console.log('Attempting to initialize with default credentials for development...')
            admin.initializeApp({
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            });
        } catch(e) {
            console.error('Fallback initialization failed:', e)
        }
    } else {
        // Re-throw the original error in production to make sure the build fails clearly
        throw error;
    }
  }
}

export const adminDb = admin.firestore();
