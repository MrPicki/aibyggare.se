import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "@/lib/firebase/admin";

// ISOLERAD auth-modul. Importerar `firebase-admin/auth`, vilket drar in den
// ESM-only jose-kedjan som kan krascha med ERR_REQUIRE_ESM på äldre Node-
// runtimes. Importera ENBART härifrån i kod som verkligen behöver verifiera
// ID-tokens (admin-guard). All vanlig dataläsning använder `admin.ts` direkt
// och rör aldrig den här modulen.

let _adminAuth: ReturnType<typeof getAuth> | null = null;

try {
  _adminAuth = getAuth(getAdminApp());
} catch (e) {
  console.error("[firebase/admin-auth] Auth-init misslyckades:", e);
}

export const adminAuth = _adminAuth;
