import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// VIKTIGT: Denna modul importerar ALDRIG `firebase-admin/auth`.
// Auth-kedjan (firebase-admin/auth → jwks-rsa → jose@6, ESM-only) kraschar med
// ERR_REQUIRE_ESM på Vercels serverless-runtime. Genom att hålla Firestore +
// Storage helt fria från den importen fungerar all server-side dataläsning
// (projekt, profiler, prompts, guider) oavsett runtime. Token-verifiering som
// faktiskt behöver Auth ligger isolerad i `admin-auth.ts`.

export function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];

  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!key) throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY saknas i env");

  return initializeApp({
    credential: cert(JSON.parse(key)),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

let _adminDb: ReturnType<typeof getFirestore> | null = null;
let _adminStorage: ReturnType<typeof getStorage> | null = null;

try {
  const app = getAdminApp();
  _adminDb = getFirestore(app);
  _adminStorage = getStorage(app);
} catch (e) {
  console.error("[firebase/admin] Firestore/Storage-init misslyckades:", e);
}

export const adminDb = _adminDb;
export const adminStorage = _adminStorage;
