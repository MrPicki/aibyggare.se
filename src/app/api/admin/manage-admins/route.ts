import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";

export const dynamic = "force-dynamic";

// GET /api/admin/manage-admins — lista alla admins
export async function GET() {
  const caller = await getAdminUser();
  if (!caller) {
    return NextResponse.json({ error: "Otillåten åtkomst." }, { status: 403 });
  }

  const { adminDb } = await import("@/lib/firebase/admin");
  if (!adminDb) {
    return NextResponse.json({ error: "Databasen är inte tillgänglig." }, { status: 500 });
  }

  const snap = await adminDb.collection("profiles").where("role", "==", "admin").get();
  const admins = snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      displayName: data.displayName ?? "",
      username: data.username ?? "",
      avatarUrl: data.avatarUrl ?? "",
    };
  });

  return NextResponse.json({ admins });
}

// POST /api/admin/manage-admins — grant eller revoke admin
//   body: { action: "grant", email: string }
//      | { action: "revoke", uid: string }
export async function POST(req: Request) {
  // Säkerhetsgrind: kryptografisk admin-verifiering server-side.
  // Utan denna kontroll kan vem som helst kalla routen och ge sig själv admin.
  const caller = await getAdminUser();
  if (!caller) {
    return NextResponse.json({ error: "Otillåten åtkomst." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Ogiltig begäran." }, { status: 400 });
  }

  const { action } = body as Record<string, unknown>;

  if (action === "grant") {
    return grantAdmin(body as Record<string, unknown>);
  } else if (action === "revoke") {
    return revokeAdmin(body as Record<string, unknown>, caller.uid);
  }

  return NextResponse.json({ error: "Okänd action." }, { status: 400 });
}

async function grantAdmin(body: Record<string, unknown>) {
  const email = body.email;
  if (typeof email !== "string" || !email.includes("@") || email.length > 320) {
    return NextResponse.json({ error: "Ogiltig e-postadress." }, { status: 400 });
  }

  const [{ adminDb }, { adminAuth }] = await Promise.all([
    import("@/lib/firebase/admin"),
    import("@/lib/firebase/admin-auth"),
  ]);
  if (!adminDb || !adminAuth) {
    return NextResponse.json({ error: "Firebase Admin är inte tillgänglig." }, { status: 500 });
  }

  // Slå upp Firebase Auth-UID via e-post
  let uid: string;
  try {
    const user = await adminAuth.getUserByEmail(email);
    uid = user.uid;
  } catch {
    return NextResponse.json(
      { error: `Hittade ingen användare med e-post ${email}. Personen måste ha registrerat sig.` },
      { status: 404 }
    );
  }

  // Kontrollera att profildokumentet finns
  const profileRef = adminDb.collection("profiles").doc(uid);
  const snap = await profileRef.get();
  if (!snap.exists) {
    return NextResponse.json(
      { error: "Användaren har inte slutfört onboarding och saknar profil." },
      { status: 404 }
    );
  }

  if (snap.data()?.role === "admin") {
    return NextResponse.json({ ok: true, message: "Redan admin." });
  }

  // Admin SDK kringgår Firestore-regler — den enda vägen att skriva role-fältet.
  await profileRef.update({ role: "admin" });

  return NextResponse.json({ ok: true });
}

async function revokeAdmin(body: Record<string, unknown>, callerUid: string) {
  const uid = body.uid;
  if (typeof uid !== "string" || uid.length === 0 || uid.length > 256 || uid.includes("/")) {
    return NextResponse.json({ error: "Ogiltigt UID." }, { status: 400 });
  }

  // En admin kan inte ta bort sig själv — skyddar mot oavsiktlig lockout.
  if (uid === callerUid) {
    return NextResponse.json(
      { error: "Du kan inte ta bort din egen admin-roll." },
      { status: 400 }
    );
  }

  const { adminDb } = await import("@/lib/firebase/admin");
  if (!adminDb) {
    return NextResponse.json({ error: "Databasen är inte tillgänglig." }, { status: 500 });
  }

  const profileRef = adminDb.collection("profiles").doc(uid);
  const snap = await profileRef.get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Profil hittades inte." }, { status: 404 });
  }

  await profileRef.update({ role: "user" });

  return NextResponse.json({ ok: true });
}
