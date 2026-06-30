import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

/**
 * Sliding-window rate limiter backed by Firestore (_ratelimits collection).
 * Each call increments a counter within a time window. Returns 429 metadata
 * when the limit is exceeded. The collection is server-only (Admin SDK) —
 * clients are denied read/write via Firestore security rules.
 *
 * @param key     Unique key, e.g. "feedback:uid123"
 * @param limit   Max calls allowed within the window
 * @param windowS Window duration in seconds (default 3600 = 1 hour)
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowS = 3600
): Promise<RateLimitResult> {
  if (!adminDb) return { allowed: true, remaining: limit };

  const ref = adminDb.collection("_ratelimits").doc(key);
  const now = Date.now();
  const windowMs = windowS * 1000;

  try {
    const result = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) {
        tx.set(ref, { count: 1, windowStart: FieldValue.serverTimestamp(), windowStartMs: now });
        return { count: 1 };
      }
      const data = snap.data()!;
      const windowStartMs: number = data.windowStartMs ?? now;
      if (now - windowStartMs > windowMs) {
        // Window expired — reset
        tx.set(ref, { count: 1, windowStart: FieldValue.serverTimestamp(), windowStartMs: now });
        return { count: 1 };
      }
      const newCount = (data.count as number) + 1;
      tx.update(ref, { count: newCount });
      return { count: newCount };
    });

    return {
      allowed: result.count <= limit,
      remaining: Math.max(0, limit - result.count),
    };
  } catch {
    // On Firestore error, fail open to avoid blocking legitimate users
    return { allowed: true, remaining: limit };
  }
}
