import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";
import { verifyFirebaseToken } from "@/lib/auth/verify-token";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type NotifType = "upvote" | "comment" | "answer" | "reply";

// Skapar en notis för ägaren av ett bygge/inlägg när någon borrar, kommenterar
// eller svarar. Server-side (Admin SDK) så ingen kan spamma andras notiser:
//  - aktör hämtas från verifierad token
//  - mottagare = innehållets ägare (slås upp server-side)
//  - aldrig notis till sig själv
export async function POST(req: NextRequest) {
  const token = (await cookies()).get("__session")?.value;
  if (!token) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  const verified = await verifyFirebaseToken(token);
  if (!verified) return NextResponse.json({ error: "Ogiltig token" }, { status: 401 });
  if (!adminDb) return NextResponse.json({ error: "DB ej tillgänglig" }, { status: 503 });

  const rl = await checkRateLimit(`notify:${verified.uid}`, 100, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "För många notiser. Vänta en stund." },
      { status: 429, headers: { "Retry-After": "3600" } }
    );
  }

  let body: { type?: string; targetType?: string; targetId?: string; preview?: string; parentCommentId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig body" }, { status: 400 });
  }

  const type = body.type as NotifType;
  const targetType = body.targetType as "project" | "post";
  const targetId = body.targetId;
  if (!["upvote", "comment", "answer", "reply"].includes(type) || !targetId || !["project", "post"].includes(targetType)) {
    return NextResponse.json({ error: "Ogiltiga fält" }, { status: 400 });
  }

  const actorId = verified.uid;
  const collectionName = targetType === "project" ? "projects" : "posts";

  try {
    const targetSnap = await adminDb.collection(collectionName).doc(targetId).get();
    if (!targetSnap.exists) return NextResponse.json({ ok: false, reason: "no-target" });
    const target = targetSnap.data() ?? {};

    // Mottagare: för svar = förälder-kommentarens författare (slås upp
    // server-side så ingen kan välja godtycklig mottagare). Annars = ägaren.
    let recipientId = target.userId as string;
    if (type === "reply") {
      if (!body.parentCommentId) return NextResponse.json({ error: "Saknar parentCommentId" }, { status: 400 });
      const parentSnap = await adminDb
        .collection(collectionName).doc(targetId)
        .collection("comments").doc(body.parentCommentId).get();
      if (!parentSnap.exists) return NextResponse.json({ ok: false, reason: "no-parent" });
      recipientId = parentSnap.data()?.userId as string;
    }
    const ownerId = recipientId;

    // Ingen notis till sig själv.
    if (!ownerId || ownerId === actorId) return NextResponse.json({ ok: true, skipped: true });

    // Aktörens profil för namn/avatar.
    const actorSnap = await adminDb.collection("profiles").doc(actorId).get();
    const actor = actorSnap.data() ?? {};

    const slug = target.slug as string;
    const postType = target.type as string | undefined;
    const postBase =
      postType === "prompt" ? "prompts"
      : postType === "guide" ? "guides"
      : "problemhornan";
    const url = targetType === "project" ? `/projects/${slug}` : `/${postBase}/${slug}`;

    await adminDb.collection("profiles").doc(ownerId).collection("notifications").add({
      type,
      actorId,
      actorName: actor.displayName || "En byggare",
      actorAvatarUrl: actor.avatarUrl || actor.photoURL || "",
      actorUsername: actor.username || "",
      targetType,
      targetId,
      targetSlug: slug,
      targetTitle: target.title || "",
      url,
      preview: typeof body.preview === "string" ? body.preview.slice(0, 120) : "",
      read: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[notify] Misslyckades:", e);
    return NextResponse.json({ error: "Kunde inte skapa notis" }, { status: 500 });
  }
}
