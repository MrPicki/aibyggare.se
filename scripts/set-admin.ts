/**
 * One-off script: gör en Firebase-användare till admin.
 *
 * Kör med:
 *   npx dotenv -e .env.local -- npx tsx scripts/set-admin.ts
 *
 * Scriptet sätter role="admin" på profiles/{uid} via Admin SDK (kringgår
 * Firestore Security Rules — avsiktligt, detta är den enda rätta vägen att
 * skapa den allra första admin utan en hönan-och-ägget-situation).
 *
 * För att lägga till fler admins EFTER den första: använd admin-dashen på /admin.
 */

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const TARGET_EMAIL = "christoffer.nolet@gmail.com";

const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!key) {
  console.error("FIREBASE_SERVICE_ACCOUNT_KEY saknas. Kör med: npx dotenv -e .env.local -- npx tsx scripts/set-admin.ts");
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({ credential: cert(JSON.parse(key)) });
}

const auth = getAuth();
const db = getFirestore();

async function main() {
  console.log(`Letar upp användare med e-post: ${TARGET_EMAIL}`);

  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(TARGET_EMAIL);
  } catch {
    console.error(`Hittade ingen Firebase Auth-användare med e-post ${TARGET_EMAIL}.`);
    console.error("Användaren måste ha registrerat sig innan scriptet körs.");
    process.exit(1);
  }

  const uid = userRecord.uid;
  console.log(`Hittade användare: uid=${uid}, displayName=${userRecord.displayName ?? "(saknas)"}`);

  const profileRef = db.collection("profiles").doc(uid);
  const profileSnap = await profileRef.get();

  if (!profileSnap.exists) {
    console.error(`Inget profile-dokument för uid=${uid}. Användaren kanske inte slutfört onboarding.`);
    process.exit(1);
  }

  const current = profileSnap.data();
  if (current?.role === "admin") {
    console.log("Användaren är redan admin. Inget att göra.");
    process.exit(0);
  }

  await profileRef.update({ role: "admin" });
  console.log(`✅ role="admin" satt på profiles/${uid} (${TARGET_EMAIL}).`);
}

main().catch((e) => {
  console.error("Scriptet misslyckades:", e);
  process.exit(1);
});
