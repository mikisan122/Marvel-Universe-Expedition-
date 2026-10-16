import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, type Firestore } from 'firebase/firestore';
import appletConfig from '../../firebase-applet-config.json';

// Configuration priority:
// 1. Environment variables (VITE_FIREBASE_*)
// 2. Pre-provisioned firebase-applet-config.json (AI Studio runtime)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || appletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || appletConfig.appId,
};

const databaseId = appletConfig.firestoreDatabaseId || '(default)';

// Initialize Firebase App
export const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);

// Initialize Cloud Firestore with the provisioned database ID
export const db: Firestore = databaseId && databaseId !== '(default)'
  ? getFirestore(app, databaseId)
  : getFirestore(app);

// Connectivity validator required by Firebase Integration Skill
let isConnected = false;

export async function testFirestoreConnection(): Promise<boolean> {
  try {
    // Tests connection to server without throwing unhandled exceptions
    await getDocFromServer(doc(db, 'test', 'connection'));
    isConnected = true;
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline. Check network connection or configuration.');
      isConnected = false;
      return false;
    }
    // Permission denied on 'test/connection' is expected because security rules protect all paths,
    // which confirms the server is reachable and active!
    isConnected = true;
    return true;
  }
}

// Initial boot check
testFirestoreConnection().catch(() => {
  // Graceful boot handling
});

export const getFirebaseMetadata = () => ({
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  databaseId,
  isConfigured: Boolean(firebaseConfig.apiKey && firebaseConfig.projectId),
  isConnected,
});
