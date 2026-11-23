import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAijb3EsfvMQNmlvfwme456GIEwfaDGVZA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nama-kertas.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nama-kertas",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nama-kertas.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "836974106637",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:836974106637:web:f9e2523db650db8bf21d44",
};

export const isFirebaseConfigured = true;

const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

export { app, db, auth };
