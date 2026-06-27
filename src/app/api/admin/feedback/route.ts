import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import { markFeedbackDone, getFeedbackDone } from "@/lib/firebase/admin-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Ej admin" }, { status: 403 });

  try {
    const done = await getFeedbackDone();
    return NextResponse.json({ done });
  } catch {
    return NextResponse.json({ error: "Kunde inte hämta historik" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Ej admin" }, { status: 403 });

  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig body" }, { status: 400 });
  }

  if (!body.id) return NextResponse.json({ error: "Saknar id" }, { status: 400 });

  try {
    await markFeedbackDone(body.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Kunde inte uppdatera" }, { status: 500 });
  }
}
