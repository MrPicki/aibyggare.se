export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { adminDb } = await import("@/lib/firebase/admin");
    if (!adminDb) {
      return Response.json({
        import: "ok",
        adminDb: null,
        note: "Firebase Admin not initialized (env-nyckel saknas/ogiltig)",
      });
    }
    try {
      await adminDb.collection("_ping").limit(1).get();
      return Response.json({ import: "ok", adminDb: "ok", firestore: "ok" });
    } catch (e) {
      return Response.json({ import: "ok", adminDb: "ok", firestore: "error", message: String(e) });
    }
  } catch (e) {
    return Response.json({ import: "FAILED", message: String(e) });
  }
}
