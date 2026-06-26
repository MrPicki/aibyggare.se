import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";
import { verifyFirebaseToken } from "@/lib/auth/verify-token";
import { adminDb } from "@/lib/firebase/admin";
import { FOUNDING_MEMBER_LIMIT } from "@/lib/founding";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Tilldelar (idempotent) Founding Member-status till den inloggade användaren
// om hen är bland de N första riktiga registreringarna.
//
// Säkerhet/robusthet:
//  - uid från kryptografiskt verifierad token (jose).
//  - Räknaren ligger i meta/stats och uppdateras ENBART här (Admin SDK), så
//    klienten kan aldrig manipulera antalet eller ge sig själv status.
//  - Transaktion → race-säkert. Seed-användare går aldrig hit → tar inga platser.
export async function POST() {
  const token = (await cookies()).get("__session")?.value;
  if (!token) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  const verified = await verifyFirebaseToken(token);
  if (!verified) return NextResponse.json({ error: "Ogiltig token" }, { status: 401 });
  if (!adminDb) return NextResponse.json({ error: "Databasen ej tillgänglig" }, { status: 503 });

  const uid = verified.uid;
  const profileRef = adminDb.collection("profiles").doc(uid);
  const statsRef = adminDb.collection("meta").doc("stats");

  try {
    const result = await adminDb.runTransaction(async (tx) => {
      const profileSnap = await tx.get(profileRef);
      if (!profileSnap.exists) return { foundingMember: false, foundingNumber: null };

      const data = profileSnap.data() ?? {};
      // Idempotent: redan avgjort → returnera utan att röra räknaren.
      if (typeof data.foundingMember === "boolean") {
        return {
          foundingMember: data.foundingMember,
          foundingNumber: data.foundingNumber ?? null,
        };
      }

      const statsSnap = await tx.get(statsRef);
      const count = statsSnap.exists ? (statsSnap.data()?.foundingCount ?? 0) : 0;

      if (count < FOUNDING_MEMBER_LIMIT) {
        const number = count + 1;
        tx.set(statsRef, { foundingCount: number }, { merge: true });
        tx.update(profileRef, {
          foundingMember: true,
          foundingNumber: number,
          updatedAt: FieldValue.serverTimestamp(),
        });
        return { foundingMember: true, foundingNumber: number };
      }

      tx.update(profileRef, {
        foundingMember: false,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return { foundingMember: false, foundingNumber: null };
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error("[founding/claim] Misslyckades:", e);
    return NextResponse.json({ error: "Kunde inte avgöra status" }, { status: 500 });
  }
}
