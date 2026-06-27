/**
 * Säkerhetstest: verifierar att en autentiserad icke-admin-användare INTE kan
 * (a) läsa admin-skyddad data i Firestore
 * (b) skriva role:"admin" på sin egen profil
 * (c) anropa /api/admin/manage-admins
 *
 * Skapar ett temporärt testkonto, kör testerna, raderar kontot.
 *
 * Kör med:
 *   npx dotenv-cli -e .env.local -- npx tsx scripts/test-auth-security.ts
 */

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const SERVICE_KEY = process.env.FIREBASE_SERVICE_ACCOUNT_KEY!;
const WEB_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const SITE_URL = "https://aibyggare.se";

if (!SERVICE_KEY || !WEB_API_KEY || !PROJECT_ID) {
  console.error("Env-variabler saknas.");
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({ credential: cert(JSON.parse(SERVICE_KEY)) });
}

const adminAuth = getAuth();
const adminDb = getFirestore();

const TEST_EMAIL = `sectest-${Date.now()}@aibyggare-test.invalid`;
const TEST_PASSWORD = "Testl0sen#" + Math.random().toString(36).slice(2);

function pass(label: string, detail: string) {
  console.log(`  ✅ BLOCKERAD — ${label}: ${detail}`);
}
function fail(label: string, detail: string) {
  console.error(`  ❌ LÄCKA — ${label}: ${detail}`);
}

async function main() {
  // ── 1. Skapa temporärt testkonto ─────────────────────────────────────────
  console.log(`\n[setup] Skapar testkonto: ${TEST_EMAIL}`);
  const user = await adminAuth.createUser({ email: TEST_EMAIL, password: TEST_PASSWORD });
  const testUid = user.uid;
  console.log(`[setup] uid=${testUid}`);

  // Skapa minimalt profile-dokument (utan role → default "user")
  await adminDb.collection("profiles").doc(testUid).set({
    displayName: "Security Test",
    username: "sectest",
    role: "user",
    bio: "",
    avatarUrl: "",
    totalXp: 0,
    level: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log(`[setup] Profile skapad med role="user"\n`);

  // ── 2. Hämta ID-token via Firebase Auth REST API ──────────────────────────
  console.log("[auth] Loggar in med e-post/lösenord för att få ID-token...");
  const signInRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${WEB_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD, returnSecureToken: true }),
    }
  );
  if (!signInRes.ok) {
    const err = await signInRes.text();
    throw new Error(`Kunde inte logga in: ${err}`);
  }
  const { idToken } = await signInRes.json() as { idToken: string };
  console.log(`[auth] ID-token erhållen (${idToken.slice(0, 40)}...)\n`);

  const firestoreBase = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

  // ── Test (a): Läs admin-skyddad Firestore-collection (reports) ────────────
  console.log("TEST (a): Försök läsa reports-collection som autentiserad icke-admin");
  const readRes = await fetch(`${firestoreBase}/reports`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  const readBody = await readRes.json() as { error?: { code: number; message: string } };
  if (readRes.status === 403 || readBody.error?.code === 403) {
    pass("READ reports", `HTTP ${readRes.status} — ${readBody.error?.message ?? "nekad"}`);
  } else {
    fail("READ reports", `HTTP ${readRes.status} — fick svar: ${JSON.stringify(readBody).slice(0, 120)}`);
  }

  // ── Test (b): Skriv role:"admin" på sin egen profil ───────────────────────
  console.log("\nTEST (b): Försök skriva role=admin på sin egen profil som autentiserad icke-admin");
  const writeRes = await fetch(
    `${firestoreBase}/profiles/${testUid}?updateMask.fieldPaths=role`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields: { role: { stringValue: "admin" } } }),
    }
  );
  const writeBody = await writeRes.json() as { error?: { code: number; message: string }; fields?: unknown };
  if (writeRes.status === 403 || writeBody.error?.code === 403) {
    pass("WRITE role=admin", `HTTP ${writeRes.status} — ${writeBody.error?.message ?? "nekad"}`);
  } else {
    // Kolla om role faktiskt ändrades
    fail("WRITE role=admin", `HTTP ${writeRes.status} — svar: ${JSON.stringify(writeBody).slice(0, 200)}`);
  }

  // Dubbelkoll: läs tillbaka role-fältet direkt via Admin SDK
  const profileSnap = await adminDb.collection("profiles").doc(testUid).get();
  const actualRole = profileSnap.data()?.role;
  if (actualRole === "user") {
    console.log(`  → Admin SDK-kontroll: role="${actualRole}" (oförändrad) ✅`);
  } else {
    console.error(`  → Admin SDK-kontroll: role="${actualRole}" (!!! ÄNDRADES — ALLVARLIG LÄCKA !!!)`);
  }

  // ── Test (c): Anropa /api/admin/manage-admins med giltig token ────────────
  console.log("\nTEST (c): Försök anropa /api/admin/manage-admins med giltig icke-admin-token");
  const apiRes = await fetch(`${SITE_URL}/api/admin/manage-admins`, {
    headers: { Cookie: `__session=${idToken}` },
  });
  const apiBody = await apiRes.json() as { error?: string; admins?: unknown };
  if (apiRes.status === 403) {
    pass("API /manage-admins", `HTTP 403 — "${apiBody.error ?? "nekad"}"`);
  } else {
    fail("API /manage-admins", `HTTP ${apiRes.status} — ${JSON.stringify(apiBody).slice(0, 120)}`);
  }

  // ── Städning ──────────────────────────────────────────────────────────────
  console.log("\n[cleanup] Tar bort testkonto och profil...");
  await adminDb.collection("profiles").doc(testUid).delete();
  await adminAuth.deleteUser(testUid);
  console.log("[cleanup] Klart. Inget skräp kvar i databasen.\n");
}

main().catch((e) => {
  console.error("Skriptet kraschade:", e);
  process.exit(1);
});
