import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword as firebaseSignInWithEmail, 
  createUserWithEmailAndPassword as firebaseCreateUserWithEmail, 
  signInWithPopup as firebaseSignInWithPopup, 
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth';

// Check if Firebase environment variables are available
const hasFirebaseConfig = !!(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

// Use environment variables if available, otherwise use demo config that won't crash
const firebaseConfig = hasFirebaseConfig ? {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
} : {
  // Demo configuration - replace with your actual Firebase config
  apiKey: "demo-api-key-replace-with-real-one",
  authDomain: "notemon-demo.firebaseapp.com",
  projectId: "notemon-demo",
  storageBucket: "notemon-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase with error handling
let app;
let auth;
let googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (error) {
  console.warn('Firebase initialization failed. Using demo mode:', error);
  auth = null;
  googleProvider = null;
}

// Export Firebase instances
export { auth, googleProvider };

// Custom auth wrapper functions with better error handling
export const signInWithEmailAndPassword = async (authInstance: any, email: string, password: string) => {
  if (!hasFirebaseConfig) {
    throw new Error('🔧 Firebase not configured yet!\n\nTo enable authentication:\n1. Create a Firebase project\n2. Add your Firebase config to environment variables\n3. Restart the development server');
  }
  return firebaseSignInWithEmail(authInstance, email, password);
};

export const createUserWithEmailAndPassword = async (authInstance: any, email: string, password: string) => {
  if (!hasFirebaseConfig) {
    throw new Error('🔧 Firebase not configured yet!\n\nTo enable authentication:\n1. Create a Firebase project\n2. Add your Firebase config to environment variables\n3. Restart the development server');
  }
  return firebaseCreateUserWithEmail(authInstance, email, password);
};

export const signInWithPopup = async (authInstance: any, provider: any) => {
  if (!hasFirebaseConfig) {
    throw new Error('🔧 Firebase not configured yet!\n\nTo enable authentication:\n1. Create a Firebase project\n2. Add your Firebase config to environment variables\n3. Restart the development server');
  }
  return firebaseSignInWithPopup(authInstance, provider);
};

export const signOut = async (authInstance: any) => {
  if (!hasFirebaseConfig || !authInstance) {
    return Promise.resolve();
  }
  return firebaseSignOut(authInstance);
};

// Export the config status for debugging
export { hasFirebaseConfig };

export default app;