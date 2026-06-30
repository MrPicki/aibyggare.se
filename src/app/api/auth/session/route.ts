import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { verifyFirebaseToken } from "@/lib/auth/verify-token";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token.trim() : "";

  if (!token) {
    return NextResponse.json({ error: "Token saknas" }, { status: 400 });
  }

  const verified = await verifyFirebaseToken(token);
  if (!verified) {
    return NextResponse.json({ error: "Ogiltig token" }, { status: 401 });
  }

  // Uppdatera lastSeenAt i profilen för inaktivitetsuppföljning (GDPR, 150 dagar).
  // Fire-and-forget — vi blockerar inte cookie-svar på ett Firestore-miss.
  if (adminDb) {
    adminDb
      .collection("profiles")
      .doc(verified.uid)
      .update({ lastSeenAt: FieldValue.serverTimestamp() })
      .catch(() => {});
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("__session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 3600,
  });
  return res;
}
