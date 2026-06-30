import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyFirebaseToken } from "@/lib/auth/verify-token";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Returnerar all användardata som JSON (GDPR Art. 20 — rätt till dataportabilitet).
// Inkluderar: profil, projekt, inlägg, röster, bokmärken, notiser, XP-händelser.
// Nedladdas direkt utan att lagra något externt.
export async function GET() {
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
    // Profil
    const profileSnap = await adminDb.collection("profiles").doc(uid).get();
    const profile = profileSnap.exists ? { id: profileSnap.id, ...profileSnap.data() } : null;

    // XP-händelser
    const xpSnap = await adminDb.collection("profiles").doc(uid).collection("xpEvents").get();
    const xpEvents = xpSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Notiser
    const notifSnap = await adminDb.collection("profiles").doc(uid).collection("notifications").get();
    const notifications = notifSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Byggen
    const projectsSnap = await adminDb.collection("projects").where("userId", "==", uid).get();
    const projects = projectsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Inlägg (hjälpfrågor, prompts, guider)
    const postsSnap = await adminDb.collection("posts").where("userId", "==", uid).get();
    const posts = postsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Röster
    const votesSnap = await adminDb.collection("votes").where("userId", "==", uid).get();
    const votes = votesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Bokmärken
    const bookmarksSnap = await adminDb.collection("bookmarks").where("userId", "==", uid).get();
    const bookmarks = bookmarksSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const payload = {
      exportedAt: new Date().toISOString(),
      userId: uid,
      email: verified.email ?? null,
      profile,
      xpEvents,
      notifications,
      projects,
      posts,
      votes,
      bookmarks,
    };

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="aibyggare-export-${uid.slice(0, 8)}.json"`,
      },
    });
  } catch (e) {
    console.error("[account/export] Misslyckades:", e);
    return NextResponse.json({ error: "Kunde inte exportera data" }, { status: 500 });
  }
}
