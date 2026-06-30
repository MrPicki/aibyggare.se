import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";
import { verifyFirebaseToken } from "@/lib/auth/verify-token";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { adminDb, adminStorage } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Tar emot feedback/problemrapporter från inloggade användare och sparar dem i
// en samlad `feedback`-collection (en doc per inlämning, fylls på över tid).
// Allt server-side via Admin SDK → inga klient-skrivregler behövs, och ingen
// kan förfalska avsändare. Bild laddas upp till Storage via Admin SDK.
export async function POST(req: NextRequest) {
  const token = (await cookies()).get("__session")?.value;
  if (!token) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  const verified = await verifyFirebaseToken(token);
  if (!verified) return NextResponse.json({ error: "Ogiltig token" }, { status: 401 });
  if (!adminDb) return NextResponse.json({ error: "DB ej tillgänglig" }, { status: 503 });

  const rl = await checkRateLimit(`feedback:${verified.uid}`, 10, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "För många feedback-inlämningar. Vänta en stund och försök igen." },
      { status: 429, headers: { "Retry-After": "3600" } }
    );
  }

  let body: { message?: string; pageUrl?: string; image?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig body" }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (!message || message.length < 3) {
    return NextResponse.json({ error: "Skriv en kort beskrivning." }, { status: 400 });
  }

  const userId = verified.uid;
  let imageUrl = "";

  // Bild (data-URL) → ladda upp via Admin SDK Storage, hämta signerad URL.
  if (body.image && body.image.startsWith("data:image/") && adminStorage) {
    try {
      const m = body.image.match(/^data:(image\/\w+);base64,(.+)$/);
      if (m) {
        const contentType = m[1];
        const buffer = Buffer.from(m[2], "base64");
        if (buffer.length <= 6_000_000) {
          const ext = contentType.split("/")[1] || "jpg";
          const file = adminStorage.bucket().file(`feedback/${userId}/${Date.now()}.${ext}`);
          await file.save(buffer, { contentType, resumable: false });
          const [url] = await file.getSignedUrl({ action: "read", expires: "2100-01-01" });
          imageUrl = url;
        }
      }
    } catch (e) {
      console.error("[feedback] Bilduppladdning misslyckades:", e);
      // Fortsätt ändå — texten är det viktiga.
    }
  }

  try {
    const profileSnap = await adminDb.collection("profiles").doc(userId).get();
    const profile = profileSnap.data() ?? {};

    await adminDb.collection("feedback").add({
      userId,
      userName: profile.displayName || verified.email || "Okänd",
      userEmail: profile.email || verified.email || "",
      username: profile.username || "",
      message,
      imageUrl,
      pageUrl: typeof body.pageUrl === "string" ? body.pageUrl.slice(0, 300) : "",
      status: "new",
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[feedback] Misslyckades:", e);
    return NextResponse.json({ error: "Kunde inte spara" }, { status: 500 });
  }
}
