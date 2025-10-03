
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// --- INICIO: CÓDIGO DE DEPURACIÓN ---
// Este bloque es para verificar si las variables de entorno se están cargando correctamente.
// Estos mensajes aparecerán en la consola del navegador (F12 en Chrome/Firefox).
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.error("FIREBASE CLIENT ERROR: ¡La variable de entorno NEXT_PUBLIC_FIREBASE_API_KEY no está definida!");
  console.log("Esto confirma que la configuración de 'apphosting.yaml' no está llegando al navegador.");
}
console.log("Estado de la configuración de Firebase (cliente):", {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✔️ Cargada" : "❌ NO CARGADA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "❌ No cargado",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "❌ No cargado",
});
// --- FIN: CÓDIGO DE DEPURACIÓN ---

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
