import { adminDb } from "@/lib/firebase/admin";

export function requireDb() {
  if (!adminDb) throw new Error("Firebase Admin ej tillgänglig");
  return adminDb;
}

export function withTimeout<T>(promise: Promise<T>, ms = 5000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Firestore timeout after ${ms}ms`)), ms)
    ),
  ]);
}

// Konverterar Firestore Timestamp-instanser till plain { seconds } — krävs
// för att data ska kunna serialiseras genom RSC-gränsen till Client Components.
export function serializeDoc(
  data: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (
      v !== null &&
      typeof v === "object" &&
      "seconds" in v &&
      "nanoseconds" in v
    ) {
      out[k] = { seconds: (v as { seconds: number }).seconds };
    } else {
      out[k] = v;
    }
  }
  return out;
}
