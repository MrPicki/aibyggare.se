import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Tillåt export av e-postadress utan konto (nyhetsbrev är opt-in för alla).
// Sparar prenumeranten i Firestore (newsletter_subscribers/{encodedEmail}) och
// skickar välkomstmail via Resend om RESEND_API_KEY finns i miljön.
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

  // Dokumentets ID är e-postadressen base64-kodad (säker Firestore path).
  const docId = Buffer.from(email).toString("base64url");

  try {
    const existing = await adminDb
      .collection("newsletter_subscribers")
      .doc(docId)
      .get();

    if (existing.exists && existing.data()?.active) {
      // Redan prenumerant — returnera success utan att lagra dubbel.
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }

    await adminDb.collection("newsletter_subscribers").doc(docId).set({
      email,
      subscribedAt: FieldValue.serverTimestamp(),
      active: true,
      source: "footer_form",
    });
  } catch (e) {
    console.error("[newsletter] Firestore-fel:", e);
    return NextResponse.json(
      { error: "Kunde inte spara. Försök igen." },
      { status: 500 }
    );
  }

  // Välkomstmail via Resend (om API-nyckel finns).
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);

      await resend.emails.send({
        from: "AIbyggare.se Nyheter <nyheter@aibyggare.se>",
        to: email,
        subject: "Välkommen till AIbyggare-nyhetsbrevet!",
        html: `
<!DOCTYPE html>
<html lang="sv">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:monospace;background:#f5f2eb;margin:0;padding:32px 16px;">
  <div style="max-width:520px;margin:0 auto;background:#faf8f3;border:2px solid #1a1a1a;border-radius:16px;padding:32px;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px;">
      <div style="background:#4ade80;border:2px solid #1a1a1a;border-radius:10px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:18px;">🔨</div>
      <span style="font-weight:900;font-size:18px;color:#1a1a1a;letter-spacing:-0.5px;">AIbyggare<span style="color:#4ade80">.</span>se</span>
    </div>

    <h1 style="font-family:sans-serif;font-size:22px;font-weight:800;color:#1a1a1a;margin:0 0 12px;">
      Du är med på bänken.
    </h1>
    <p style="color:#5c5449;line-height:1.6;margin:0 0 16px;">
      Tack för att du prenumererar! Du får veckans byggen, prompts och lärdomar
      direkt i inkorgen — utan hype, utan fluff.
    </p>
    <p style="color:#5c5449;line-height:1.6;margin:0 0 24px;">
      Medan du väntar på första numret — kika gärna på vad communityn bygger:
    </p>
    <a href="https://aibyggare.se/projects"
       style="display:inline-block;background:#4ade80;color:#1a1a1a;font-weight:700;font-family:monospace;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;padding:10px 20px;border:2px solid #1a1a1a;border-radius:10px;text-decoration:none;">
      Se vad folk bygger →
    </a>

    <hr style="border:none;border-top:2px dashed #d4cfc8;margin:32px 0;">

    <p style="font-size:11px;color:#8a7f74;line-height:1.5;margin:0;">
      Du fick detta mail för att du prenumererade på nyhetsbrevet via aibyggare.se.<br>
      Vill du avregistrera dig?
      <a href="https://aibyggare.se/nyhetsbrev/avregistrera?email=${encodeURIComponent(email)}"
         style="color:#4ade80;text-decoration:underline;">Klicka här</a>.<br><br>
      Ansvarigt företag: Ncom.se — <a href="mailto:info@aibyggare.se" style="color:#4ade80;">info@aibyggare.se</a>
    </p>
  </div>
</body>
</html>`,
        text: `Välkommen till AIbyggare.se nyhetsbrevet!\n\nTack för att du prenumererar. Du får veckans byggen, prompts och lärdomar direkt i inkorgen.\n\nSe vad folk bygger: https://aibyggare.se/projects\n\nVill du avregistrera dig? Gå till: https://aibyggare.se/nyhetsbrev/avregistrera?email=${encodeURIComponent(email)}\n\nAnsvarigt företag: Ncom.se — info@aibyggare.se`,
      });
    } catch (e) {
      // Resend-fel blockar inte — prenumeranten är sparad i Firestore.
      console.error("[newsletter] Resend-fel:", e);
    }
  } else {
    console.warn(
      "[newsletter] RESEND_API_KEY saknas — välkomstmail skickas inte."
    );
  }

  return NextResponse.json({ ok: true });
}
