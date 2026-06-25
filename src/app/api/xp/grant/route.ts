import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyFirebaseToken } from "@/lib/auth/verify-token";
import { grantXp } from "@/lib/xp/grant-server";
import { XP_AMOUNTS, type XpEventType } from "@/lib/xp/levels";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Tilldelar XP för en given event-typ till den inloggade användaren.
// Säkerhet:
//  - uid hämtas ENBART från en kryptografiskt verifierad ID-token (cookie).
//  - beloppet styrs server-side av event-typen (XP_AMOUNTS) — klienten kan
//    aldrig välja belopp.
//  - idempotent i grantXp → samma event ger aldrig dubbel XP.
export async function POST(req: NextRequest) {
  const token = (await cookies()).get("__session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  const verified = await verifyFirebaseToken(token);
  if (!verified) {
    return NextResponse.json({ error: "Ogiltig token" }, { status: 401 });
  }

  let body: { eventType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig body" }, { status: 400 });
  }

  const eventType = body.eventType as XpEventType;
  if (!eventType || !(eventType in XP_AMOUNTS)) {
    return NextResponse.json({ error: "Okänd event-typ" }, { status: 400 });
  }

  const result = await grantXp(verified.uid, eventType);
  if (!result) {
    return NextResponse.json({ error: "Profil saknas" }, { status: 404 });
  }

  return NextResponse.json(result);
}
