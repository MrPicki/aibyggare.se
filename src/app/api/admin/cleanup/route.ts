import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// TILLFÄLLIG engångs-route för att städa testdata. Skyddad av CLEANUP_SECRET.
// Tas bort efter användning. Raderar all Firestore-data (profil + xpEvents,
// byggen, frågor) för givna e-postadresser via Admin SDK.
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cleanup-secret");
  if (!secret || secret !== process.env.CLEANUP_SECRET) {
    return NextResponse.json({ error: "Förbjudet" }, { status: 403 });
  }
  if (!adminDb) {
    return NextResponse.json({ error: "Admin ej tillgänglig" }, { status: 503 });
  }

  let body: { emails?: string[]; resetFounding?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig body" }, { status: 400 });
  }
  const emails = Array.isArray(body.emails) ? body.emails : [];
  if (emails.length === 0) {
    return NextResponse.json({ error: "Inga e-postadresser" }, { status: 400 });
  }

  const deleted: { email: string; uid: string; projects: number; posts: number }[] = [];

  for (const email of emails) {
    const profs = await adminDb.collection("profiles").where("email", "==", email).get();
    for (const prof of profs.docs) {
      const uid = prof.id;
      const projects = await adminDb.collection("projects").where("userId", "==", uid).get();
      for (const d of projects.docs) await adminDb.recursiveDelete(d.ref);
      const posts = await adminDb.collection("posts").where("userId", "==", uid).get();
      for (const d of posts.docs) await adminDb.recursiveDelete(d.ref);
      await adminDb.recursiveDelete(prof.ref); // profil + xpEvents-subcollection
      deleted.push({ email, uid, projects: projects.size, posts: posts.size });
    }
  }

  if (body.resetFounding) {
    await adminDb.collection("meta").doc("stats").set({ foundingCount: 0 }, { merge: true });
  }

  return NextResponse.json({ ok: true, deleted, resetFounding: !!body.resetFounding });
}
