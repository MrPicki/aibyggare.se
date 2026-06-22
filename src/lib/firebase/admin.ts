import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function createAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!key) throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY saknas i env");

  return initializeApp({
    credential: cert(JSON.parse(key)),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

// Wrapped at module level so import never throws — pages' try/catch handles null.
let _adminAuth: ReturnType<typeof getAuth> | null = null;
let _adminDb: ReturnType<typeof getFirestore> | null = null;
let _adminStorage: ReturnType<typeof getStorage> | null = null;

try {
  const app = createAdminApp();
  _adminAuth = getAuth(app);
  _adminDb = getFirestore(app);
  _adminStorage = getStorage(app);
} catch (e) {
  console.error("[firebase/admin] Initialisering misslyckades:", e);
}

export const adminAuth = _adminAuth;
export const adminDb = _adminDb;
export const adminStorage = _adminStorage;
