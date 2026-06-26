import { NextRequest, NextResponse } from "next/server";
import { getAdminApp } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (req.headers.get("x-cleanup-secret") !== process.env.CLEANUP_SECRET) {
    return NextResponse.json({ error: "Förbjudet" }, { status: 403 });
  }
  let body: { rules?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Ogiltig body" }, { status: 400 }); }
  const rules = body.rules;
  if (!rules || rules.length < 50) return NextResponse.json({ error: "Saknar regler" }, { status: 400 });
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const base = `https://firebaserules.googleapis.com/v1/projects/${projectId}`;
  try {
    const cred = getAdminApp().options.credential;
    if (!cred) throw new Error("Ingen credential");
    const { access_token } = await cred.getAccessToken();
    const auth = { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" };
    const rsRes = await fetch(`${base}/rulesets`, { method: "POST", headers: auth, body: JSON.stringify({ source: { files: [{ name: "firestore.rules", content: rules }] } }) });
    const rsJson = await rsRes.json();
    if (!rsRes.ok) return NextResponse.json({ step: "createRuleset", error: rsJson }, { status: 502 });
    const rulesetName = rsJson.name;
    const relName = `projects/${projectId}/releases/cloud.firestore`;
    const patchRes = await fetch(`${base}/releases/cloud.firestore`, { method: "PATCH", headers: auth, body: JSON.stringify({ release: { name: relName, rulesetName }, updateMask: "rulesetName" }) });
    const patchJson = await patchRes.json();
    if (!patchRes.ok) return NextResponse.json({ step: "updateRelease", error: patchJson }, { status: 502 });
    return NextResponse.json({ ok: true, rulesetName });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
