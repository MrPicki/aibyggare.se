import { adminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!adminDb) {
    return Response.json({ adminDb: null, error: "adminDb is null — Firebase Admin not initialized" });
  }
  try {
    await adminDb.collection("_ping").limit(1).get();
    return Response.json({ adminDb: "ok", firestore: "ok" });
  } catch (e) {
    return Response.json({ adminDb: "ok", firestore: "error", message: String(e) });
  }
}
