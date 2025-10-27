
// This script is intended to be run from the command line, e.g., "node scripts/set-admin.js"
// It gives a specific user 'admin' privileges by setting a custom claim.

// It securely loads credentials from your .env.local file instead of a separate JSON key file.
require('dotenv').config({ path: './.env.local' });

const { getAuth } = require('firebase-admin/auth');
const { initializeApp, cert } = require('firebase-admin/app');

// --- Main Configuration ---
// The email of the user you want to make an admin
const emailToMakeAdmin = 'andres03ortega@gmail.com';
// --- End Configuration ---


// Construct the service account object from environment variables
const serviceAccount = {
  type: "service_account",
  project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  // The private key can have newline characters. In the .env file, they should be
  // represented as `\n`. We need to replace them back to actual newlines `\n`.
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

// Check if the service account credentials are valid
if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
  console.error('> Error: Missing required Firebase Admin credentials in .env.local file.');
  console.error('> Please ensure NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL are set.');
  process.exit(1);
}

try {
  const adminApp = initializeApp({
    credential: cert(serviceAccount)
  });

  async function setAdminClaim() {
    try {
      const user = await getAuth(adminApp).getUserByEmail(emailToMakeAdmin);
      if (user.customClaims && user.customClaims.admin === true) {
        console.log(`> ✅ Already an admin. No changes made for ${emailToMakeAdmin}`);
        return;
      }
  
      await getAuth(adminApp).setCustomUserClaims(user.uid, { admin: true });
      console.log(`> ✅ Success! ${emailToMakeAdmin} has been made an admin.`);
  
    } catch (error) {
      console.error(`> ❌ Error setting custom claim for ${emailToMakeAdmin}:`, error.message);
    } finally {
      // The script will hang without this, as the Firebase connection remains open.
      process.exit(0);
    }
  }
  
  setAdminClaim();

} catch (e) {
    console.error('> ❌ CRITICAL ERROR initializing Firebase Admin SDK:');
    if (e.code === 'app/invalid-credential') {
        console.error('> The service account credentials in your .env.local file are invalid.');
        console.error('> Please double-check the values, especially the private key.');
    } else {
        console.error('>', e.message);
    }
    process.exit(1);
}
