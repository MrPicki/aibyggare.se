import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";
import { verifyFirebaseToken } from "@/lib/auth/verify-token";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Toggle upvote server-side med Admin SDK.
// Klientens direktskrivrätt till upvoteCount/commentCount är borttagen ur
// Firestore Security Rules — all räkning sker nu härifrån.
export async function POST(req: NextRequest) {
  const token = (await cookies()).get("__session")?.value;
  if (!token) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  const verified = await verifyFirebaseToken(token);
  if (!verified) return NextResponse.json({ error: "Ogiltig token" }, { status: 401 });
  if (!adminDb) return NextResponse.json({ error: "DB ej tillgänglig" }, { status: 503 });

  let body: { targetType?: string; targetId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig body" }, { status: 400 });
  }

  const { targetType, targetId } = body;
  if (
    !["project", "post"].includes(targetType ?? "") ||
    !targetId ||
    typeof targetId !== "string" ||
    targetId.length > 256 ||
    targetId.includes("/")
  ) {
    return NextResponse.json({ error: "Ogiltiga fält" }, { status: 400 });
  }

  const userId = verified.uid;
  const collectionName = targetType === "project" ? "projects" : "posts";
  const voteId = `${userId}_${targetId}`;
  const voteRef = adminDb.collection("votes").doc(voteId);
  const targetRef = adminDb.collection(collectionName).doc(targetId);

  try {
    const result = await adminDb.runTransaction(async (tx) => {
      const [voteSnap, targetSnap] = await Promise.all([
        tx.get(voteRef),
        tx.get(targetRef),
      ]);
      if (!targetSnap.exists) return null;

      const currentCount = (targetSnap.data()?.upvoteCount as number) ?? 0;

      if (voteSnap.exists) {
        tx.delete(voteRef);
        tx.update(targetRef, { upvoteCount: Math.max(0, currentCount - 1) });
        return { upvoted: false, newCount: Math.max(0, currentCount - 1) };
      } else {
        tx.set(voteRef, {
          userId,
          targetId,
          targetType,
          createdAt: FieldValue.serverTimestamp(),
        });
        tx.update(targetRef, { upvoteCount: currentCount + 1 });
        return { upvoted: true, newCount: currentCount + 1 };
      }
    });

    if (!result) {
      return NextResponse.json({ error: "Mål hittades inte" }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (e) {
    console.error("[upvote] Misslyckades:", e);
    return NextResponse.json({ error: "Kunde inte uppdatera" }, { status: 500 });
  }
}
