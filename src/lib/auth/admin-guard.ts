import { cookies } from "next/headers";
import { verifyFirebaseToken } from "@/lib/auth/verify-token";

// Server-side admin-verifiering. Detta är det RIKTIGA säkerhetsskiktet —
// proxy.ts är bara ett UX-skydd (avkodar JWT utan kryptoverifiering).
//
// Använder verifyFirebaseToken (jose via dynamisk import, ESM-säker) istället
// för adminAuth.verifyIdToken — admin-auth.ts drar in firebase-admin/auth som
// kan krascha med ERR_REQUIRE_ESM i Vercels serverless-runtime.
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

    // Kryptografisk verifiering mot Googles JWKS — ESM-säker, ingen firebase-admin/auth.
    const verified = await verifyFirebaseToken(token);
    if (!verified) return null;

    const { adminDb } = await import("@/lib/firebase/admin");
    if (!adminDb) return null;

    const snap = await adminDb.collection("profiles").doc(verified.uid).get();
    if (!snap.exists) return null;
    const data = snap.data();
    if (!data || data.role !== "admin") return null;

    return {
      uid: verified.uid,
      displayName: data.displayName ?? "",
      username: data.username ?? "",
    };
  } catch {
    return null;
  }
}
