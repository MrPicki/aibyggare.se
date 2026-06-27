/**
 * Deployer firestore.rules till Firebase via REST API + service account.
 * Används eftersom firebase CLI inte är inloggat.
 *
 * Kör med:
 *   npx dotenv-cli -e .env.local -- npx tsx scripts/deploy-rules.ts
 *
 * Tar bort sig själv efter körning: nej — detta är ett verktygs-skript,
 * inte en route. Det lägger inga hemligheter i ett HTTP-endpoint.
 */

import { readFileSync } from "fs";
import { GoogleAuth } from "google-auth-library";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const SERVICE_KEY = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!PROJECT_ID || !SERVICE_KEY) {
  console.error("NEXT_PUBLIC_FIREBASE_PROJECT_ID eller FIREBASE_SERVICE_ACCOUNT_KEY saknas.");
  process.exit(1);
}

const rulesSource = readFileSync("firestore.rules", "utf-8");

async function main() {
  const credentials = JSON.parse(SERVICE_KEY!);
  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();
  const token = (await client.getAccessToken()).token;
  if (!token) throw new Error("Kunde inte hämta access token.");

  const base = `https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // 1. Skapa ny ruleset
  console.log("Skapar ny ruleset…");
  const rulesetRes = await fetch(`${base}/rulesets`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      source: {
        files: [{ name: "firestore.rules", content: rulesSource }],
      },
    }),
  });
  if (!rulesetRes.ok) {
    const text = await rulesetRes.text();
    throw new Error(`Skapande av ruleset misslyckades: ${text}`);
  }
  const ruleset = (await rulesetRes.json()) as { name: string };
  console.log(`Ruleset skapad: ${ruleset.name}`);

  // 2. Hämta befintlig release för cloud.firestore
  const releaseName = `${base}/releases/cloud.firestore`;
  const releaseRes = await fetch(releaseName, { headers });
  let patchMethod = "PATCH";
  let releaseBody;

  // 3. Uppdatera eller skapa release
  console.log("Uppdaterar release…");
  const releaseResource = {
    name: `projects/${PROJECT_ID}/releases/cloud.firestore`,
    rulesetName: ruleset.name,
  };
  const updateRes = await fetch(
    releaseRes.ok ? releaseName : `${base}/releases`,
    {
      method: releaseRes.ok ? "PATCH" : "POST",
      headers,
      body: JSON.stringify(releaseRes.ok ? { release: releaseResource } : releaseResource),
    }
  );
  if (!updateRes.ok) {
    const text = await updateRes.text();
    throw new Error(`Release-uppdatering misslyckades: ${text}`);
  }
  console.log("✅ Firestore-reglerna deployades.");
}

main().catch((e) => {
  console.error("Deploy misslyckades:", e);
  process.exit(1);
});
