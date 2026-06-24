import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";

export const dynamic = "force-dynamic";

// Explicit allowlist — bara dessa actions accepteras.
const ACTIONS = [
  "delete-project",
  "delete-post",
  "feature-project",
  "feature-post",
  "resolve-report",
] as const;
type Action = (typeof ACTIONS)[number];

interface Body {
  action: Action;
  id: string;
  value?: boolean;
}

function parseBody(raw: unknown): Body | null {
  if (!raw || typeof raw !== "object") return null;
  const { action, id, value } = raw as Record<string, unknown>;
  if (typeof action !== "string" || !ACTIONS.includes(action as Action)) return null;
  // Avvisa tomma, för långa eller path-liknande id:n — ett id med "/" skulle
  // kunna adressera en nästlad dokumentväg istället för ett toppdokument.
  if (typeof id !== "string" || id.length === 0 || id.length > 256 || id.includes("/")) return null;
  if (value !== undefined && typeof value !== "boolean") return null;
  return { action: action as Action, id, value: value as boolean | undefined };
}

export async function POST(req: Request) {
  // Säkerhetsgrind: kryptografisk admin-verifiering server-side.
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Otillåten åtkomst." }, { status: 403 });
  }

  const body = parseBody(await req.json().catch(() => null));
  if (!body) {
    return NextResponse.json({ error: "Ogiltig begäran." }, { status: 400 });
  }

  const { adminDb } = await import("@/lib/firebase/admin");
  if (!adminDb) {
    return NextResponse.json({ error: "Databasen är inte tillgänglig." }, { status: 500 });
  }

  try {
    switch (body.action) {
      case "delete-project":
        await adminDb.collection("projects").doc(body.id).delete();
        break;
      case "delete-post":
        await adminDb.collection("posts").doc(body.id).delete();
        break;
      case "feature-project":
        await adminDb.collection("projects").doc(body.id).update({ isFeatured: !!body.value });
        break;
      case "feature-post":
        await adminDb.collection("posts").doc(body.id).update({ isFeatured: !!body.value });
        break;
      case "resolve-report":
        await adminDb.collection("reports").doc(body.id).update({ status: "resolved" });
        break;
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/action] misslyckades:", e);
    return NextResponse.json({ error: "Åtgärden kunde inte slutföras." }, { status: 500 });
  }
}
