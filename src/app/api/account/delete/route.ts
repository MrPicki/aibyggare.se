import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyFirebaseToken } from "@/lib/auth/verify-token";
import { adminDb, adminStorage } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Raderar den inloggade användarens ALLA data:
//  - byggen + deras kommentarer (recursiveDelete)
//  - hjälpfrågor/prompts + svar (recursiveDelete)
//  - votes, bookmarks, reports skapade av användaren
//  - Storage-filer under images/{uid}/
//  - profilen (inkl. xpEvents + notifications, via recursiveDelete)
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
    // Byggen + deras comments-subcollection
    const projects = await adminDb.collection("projects").where("userId", "==", uid).get();
    for (const d of projects.docs) {
      await adminDb.recursiveDelete(d.ref);
    }

    // Inlägg (hjälpfrågor + prompts) + svar
    const posts = await adminDb.collection("posts").where("userId", "==", uid).get();
    for (const d of posts.docs) {
      await adminDb.recursiveDelete(d.ref);
    }

    // Votes
    const votes = await adminDb.collection("votes").where("userId", "==", uid).get();
    const voteBatch = adminDb.batch();
    for (const d of votes.docs) voteBatch.delete(d.ref);
    if (!votes.empty) await voteBatch.commit();

    // Bookmarks
    const bookmarks = await adminDb.collection("bookmarks").where("userId", "==", uid).get();
    const bookmarkBatch = adminDb.batch();
    for (const d of bookmarks.docs) bookmarkBatch.delete(d.ref);
    if (!bookmarks.empty) await bookmarkBatch.commit();

    // Reports filed by this user
    const reports = await adminDb.collection("reports").where("reporterId", "==", uid).get();
    const reportBatch = adminDb.batch();
    for (const d of reports.docs) reportBatch.delete(d.ref);
    if (!reports.empty) await reportBatch.commit();

    // Rate-limit counters for this user (known prefixes)
    const rlKeys = ["feedback", "notify"];
    const rlBatch2 = adminDb.batch();
    for (const prefix of rlKeys) {
      rlBatch2.delete(adminDb.collection("_ratelimits").doc(`${prefix}:${uid}`));
    }
    await rlBatch2.commit();

    // Storage: delete all files under images/{uid}/
    if (adminStorage) {
      try {
        const [files] = await adminStorage.bucket().getFiles({ prefix: `images/${uid}/` });
        await Promise.all(files.map((f) => f.delete().catch(() => {})));
      } catch (e) {
        console.error("[account/delete] Storage-radering misslyckades:", e);
        // Continue — Firestore data is the priority
      }
    }

    // Profilen sist — recursiveDelete tar med xpEvents + notifications
    await adminDb.recursiveDelete(adminDb.collection("profiles").doc(uid));

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[account/delete] Misslyckades:", e);
    return NextResponse.json({ error: "Kunde inte radera kontot" }, { status: 500 });
  }
}
