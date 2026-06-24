import { cookies } from "next/headers";

// Server-side admin-verifiering. Detta är det RIKTIGA säkerhetsskiktet —
// proxy.ts är bara ett UX-skydd (avkodar JWT utan kryptoverifiering).
// Här verifieras token kryptografiskt med Admin SDK och rollen läses från
// Firestore. Används av både /admin-sidan och alla admin-API-routes.
export interface AdminUser {
  uid: string;
  displayName: string;
  username: string;
}

export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("__session")?.value;
    if (!token) return null;

    const { adminAuth, adminDb } = await import("@/lib/firebase/admin");
    if (!adminAuth || !adminDb) return null;

    // Kryptografisk verifiering — en angripare kan inte förfalska en giltig
    // Firebase ID-token. (Cookien är inte httpOnly, men det spelar ingen roll
    // när vi verifierar signaturen server-side.)
    const decoded = await adminAuth.verifyIdToken(token);

    const snap = await adminDb.collection("profiles").doc(decoded.uid).get();
    if (!snap.exists) return null;
    const data = snap.data();
    if (!data || data.role !== "admin") return null;

    return {
      uid: decoded.uid,
      displayName: data.displayName ?? "",
      username: data.username ?? "",
    };
  } catch {
    // Ogiltig/utgången token, admin ej initialiserad, etc. → inte admin.
    return null;
  }
}
