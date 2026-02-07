// Minimal Firebase initialization and helpers (stubs for a first build)
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with real config in your environment
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    console.error('Firebase sign-in error', e);
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (e) {
    console.error('Firebase sign-out error', e);
  }
};

export const onAuth = (cb: (u: User | null) => void) => {
  return onAuthStateChanged(auth, cb);
};
