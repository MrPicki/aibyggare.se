import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!adminDb) {
    return NextResponse.json({ error: "DB ej tillgänglig" }, { status: 503 });
  }

  let body: { email?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig body" }, { status: 400 });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Ange en giltig e-postadress." },
      { status: 400 }
    );
  }

  const docId = Buffer.from(email).toString("base64url");

  try {
    await adminDb
      .collection("newsletter_subscribers")
      .doc(docId)
      .set({ active: false, unsubscribedAt: new Date().toISOString() }, { merge: true });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[newsletter/unsubscribe] Fel:", e);
    return NextResponse.json({ error: "Kunde inte avregistrera" }, { status: 500 });
  }
}
