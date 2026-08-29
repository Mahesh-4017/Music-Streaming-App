import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDCELxKgANTSJxz6_-E8KQNV2RTd5cDMpY",
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "music-app-cdccf.firebaseapp.com",
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "music-app-cdccf",
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "music-app-cdccf.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "862450190021",
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:862450190021:web:37c56221451b4fb55b12ac",
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-T0CS2J9SBL"
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth & Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics safely on client side
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// ─── Firebase Helper Functions ───────────────────────────────────────────────

/**
 * Sign in or sign up with Google popup using Firebase
 */
export async function signInWithGoogleFirebase() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Firebase Google Auth Error:", err);
    return { user: null, error: err.message || "Firebase Google Auth failed" };
  }
}

/**
 * Register user with Email & Password using Firebase
 */
export async function registerWithEmailFirebase(email: string, pass: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Firebase Register Error:", err);
    return { user: null, error: err.message };
  }
}

/**
 * Login user with Email & Password using Firebase
 */
export async function loginWithEmailFirebase(email: string, pass: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Firebase Login Error:", err);
    return { user: null, error: err.message };
  }
}

export default app;
