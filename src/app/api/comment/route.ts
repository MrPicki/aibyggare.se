import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";
import { verifyFirebaseToken } from "@/lib/auth/verify-token";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Skapar kommentar/svar server-side med Admin SDK och räknar upp commentCount
// atomärt i en transaktion. Klientens direktskrivrätt till commentCount är
// borttagen ur Firestore Security Rules.
export async function POST(req: NextRequest) {
  const token = (await cookies()).get("__session")?.value;
  if (!token) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  const verified = await verifyFirebaseToken(token);
  if (!verified) return NextResponse.json({ error: "Ogiltig token" }, { status: 401 });
  if (!adminDb) return NextResponse.json({ error: "DB ej tillgänglig" }, { status: 503 });

  let body: {
    targetType?: string;
    targetId?: string;
    body?: string;
    parentId?: string | null;
    replyToName?: string | null;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig body" }, { status: 400 });
  }

  const { targetType, targetId, body: commentBody, parentId = null, replyToName = null } = body;

  if (
    !["project", "post"].includes(targetType ?? "") ||
    !targetId ||
    typeof targetId !== "string" ||
    targetId.length > 256 ||
    targetId.includes("/")
  ) {
    return NextResponse.json({ error: "Ogiltiga fält" }, { status: 400 });
  }

  const text = (commentBody ?? "").trim();
  if (!text || text.length < 2 || text.length > 2000) {
    return NextResponse.json({ error: "Kommentar saknas eller för lång (max 2000 tecken)" }, { status: 400 });
  }

  const userId = verified.uid;
  const collectionName = targetType === "project" ? "projects" : "posts";

  try {
    const profileSnap = await adminDb.collection("profiles").doc(userId).get();
    const profile = profileSnap.data() ?? {};

    const targetRef = adminDb.collection(collectionName).doc(targetId);
    const commentRef = targetRef.collection("comments").doc();

    await adminDb.runTransaction(async (tx) => {
      const targetSnap = await tx.get(targetRef);
      if (!targetSnap.exists) throw new Error("Mål hittades inte");

      tx.set(commentRef, {
        userId,
        userDisplayName: profile.displayName || "",
        userAvatarUrl: profile.avatarUrl || profile.photoURL || "",
        body: text,
        parentId: parentId ?? null,
        replyToName: replyToName ?? null,
        isAccepted: false,
        projectId: targetType === "project" ? targetId : null,
        postId: targetType === "post" ? targetId : null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      tx.update(targetRef, { commentCount: FieldValue.increment(1) });
    });

    return NextResponse.json({ id: commentRef.id });
  } catch (e) {
    console.error("[comment] Misslyckades:", e);
    return NextResponse.json({ error: "Kunde inte spara kommentar" }, { status: 500 });
  }
}
