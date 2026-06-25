import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyFirebaseToken } from "@/lib/auth/verify-token";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Raderar den inloggade användarens ALLA Firestore-data:
//  - profilen (inkl. xpEvents-subcollection, via recursiveDelete)
//  - alla byggen + deras kommentarer
//  - alla hjälpfrågor/prompts + deras svar
// Auth-kontot raderas client-side (firebase/auth deleteUser) efter detta —
// firebase-admin/auth används inte här (ESM-kraschar på Vercels runtime).
export async function POST() {
  const token = (await cookies()).get("__session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  const verified = await verifyFirebaseToken(token);
  if (!verified) {
    return NextResponse.json({ error: "Ogiltig token" }, { status: 401 });
  }
  if (!adminDb) {
    return NextResponse.json({ error: "Databasen ej tillgänglig" }, { status: 503 });
  }

  const uid = verified.uid;

  try {
    // Användarens egna byggen (recursiveDelete tar med comments-subcollection).
    const projects = await adminDb.collection("projects").where("userId", "==", uid).get();
    for (const d of projects.docs) {
      await adminDb.recursiveDelete(d.ref);
    }

    // Användarens egna inlägg (hjälpfrågor + prompts) med svar/kommentarer.
    const posts = await adminDb.collection("posts").where("userId", "==", uid).get();
    for (const d of posts.docs) {
      await adminDb.recursiveDelete(d.ref);
    }

    // Profilen sist — recursiveDelete tar med xpEvents-subcollection.
    await adminDb.recursiveDelete(adminDb.collection("profiles").doc(uid));

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[account/delete] Misslyckades:", e);
    return NextResponse.json({ error: "Kunde inte radera kontot" }, { status: 500 });
  }
}
