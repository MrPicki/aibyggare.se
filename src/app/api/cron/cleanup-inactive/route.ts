import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb, adminStorage } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min — may need to process many users

// Raderar konton som inte loggat in på 150 dagar (lastSeenAt saknas eller för gammalt).
// Körs veckovis via Vercel Cron. Skyddat med CRON_SECRET — Vercel skickar
// automatiskt "Authorization: Bearer <CRON_SECRET>" vid schemalagda anrop.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!adminDb) {
    return NextResponse.json({ error: "DB ej tillgänglig" }, { status: 503 });
  }

  const cutoff = new Date(Date.now() - 150 * 24 * 60 * 60 * 1000);
  const cutoffTs = Timestamp.fromDate(cutoff);

  // Hitta profiler där lastSeenAt finns och är äldre än 150 dagar.
  // Profiler utan lastSeenAt undantas — de har aldrig loggat in via det
  // nya systemet och ska ges tid att göra det (mjuk övergång).
  const snap = await adminDb
    .collection("profiles")
    .where("lastSeenAt", "<", cutoffTs)
    .limit(100) // Max 100 per körning — undviker timeout
    .get();

  let deleted = 0;
  const errors: string[] = [];

  for (const profileDoc of snap.docs) {
    const uid = profileDoc.id;
    try {
      // Byggen
      const projects = await adminDb.collection("projects").where("userId", "==", uid).get();
      for (const d of projects.docs) await adminDb.recursiveDelete(d.ref);

      // Inlägg
      const posts = await adminDb.collection("posts").where("userId", "==", uid).get();
      for (const d of posts.docs) await adminDb.recursiveDelete(d.ref);

      // Votes
      const votes = await adminDb.collection("votes").where("userId", "==", uid).get();
      const vb = adminDb.batch();
      for (const d of votes.docs) vb.delete(d.ref);
      if (!votes.empty) await vb.commit();

      // Bookmarks
      const bookmarks = await adminDb.collection("bookmarks").where("userId", "==", uid).get();
      const bb = adminDb.batch();
      for (const d of bookmarks.docs) bb.delete(d.ref);
      if (!bookmarks.empty) await bb.commit();

      // Reports
      const reports = await adminDb.collection("reports").where("reporterId", "==", uid).get();
      const rb = adminDb.batch();
      for (const d of reports.docs) rb.delete(d.ref);
      if (!reports.empty) await rb.commit();

      // Storage
      if (adminStorage) {
        const [files] = await adminStorage.bucket().getFiles({ prefix: `images/${uid}/` });
        await Promise.all(files.map((f) => f.delete().catch(() => {})));
      }

      // Profil sist
      await adminDb.recursiveDelete(adminDb.collection("profiles").doc(uid));
      deleted++;
    } catch (e) {
      console.error(`[cron/cleanup] Misslyckades för uid ${uid}:`, e);
      errors.push(uid);
    }
  }

  console.log(`[cron/cleanup-inactive] Raderade ${deleted} konton. Fel: ${errors.length}`);
  return NextResponse.json({ deleted, errors: errors.length, cutoff: cutoff.toISOString() });
}
