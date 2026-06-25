// Verifierar en Firebase ID-token UTAN firebase-admin/auth.
//
// firebase-admin/auth drar in jwks-rsa → jose@6 via require() och kraschar med
// ERR_REQUIRE_ESM på Vercels runtime. Här använder vi jose direkt via dynamisk
// import() (ESM-säkert) och verifierar token kryptografiskt mot Googles
// publika Firebase-nycklar. Fungerar på alla Node-versioner.

const FIREBASE_JWKS_URL =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

export interface VerifiedToken {
  uid: string;
  email?: string;
}

export async function verifyFirebaseToken(token: string): Promise<VerifiedToken | null> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!token || !projectId) return null;

  try {
    const { jwtVerify, createRemoteJWKSet } = await import("jose");
    const JWKS = createRemoteJWKSet(new URL(FIREBASE_JWKS_URL));

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });

    const uid = (payload.sub ?? payload.user_id) as string | undefined;
    if (!uid) return null;

    return { uid, email: typeof payload.email === "string" ? payload.email : undefined };
  } catch (e) {
    // Ogiltig signatur, utgången token, fel issuer/audience, etc.
    console.error("[verify-token] Verifiering misslyckades:", (e as Error)?.message ?? e);
    return null;
  }
}
