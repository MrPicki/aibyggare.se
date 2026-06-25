import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { XP_AMOUNTS, levelForXp, type XpEventType } from "@/lib/xp/levels";

// Server-side XP-tilldelning. ENDA stället XP skrivs. Idempotent: varje
// event-typ lagras som ett dokument i profiles/{uid}/xpEvents/{eventType}, så
// samma event aldrig kan ge XP två gånger — även vid dubbelklick eller retry.

export interface GrantResult {
  /** false om eventet redan fanns (idempotent no-op). */
  granted: boolean;
  totalXp: number;
  level: number;
  previousLevel: number;
  leveledUp: boolean;
}

export async function grantXp(
  uid: string,
  eventType: XpEventType,
): Promise<GrantResult | null> {
  if (!adminDb) return null;
  const amount = XP_AMOUNTS[eventType];
  if (typeof amount !== "number") return null;

  const profileRef = adminDb.collection("profiles").doc(uid);
  const eventRef = profileRef.collection("xpEvents").doc(eventType);

  return adminDb.runTransaction<GrantResult | null>(async (tx) => {
    const [profileSnap, eventSnap] = await Promise.all([
      tx.get(profileRef),
      tx.get(eventRef),
    ]);

    if (!profileSnap.exists) return null;

    const data = profileSnap.data() ?? {};
    const currentXp = typeof data.totalXp === "number" ? data.totalXp : 0;
    const previousLevel =
      typeof data.level === "number" ? data.level : levelForXp(currentXp);

    // Redan tilldelat — returnera nuvarande tillstånd utan att skriva.
    if (eventSnap.exists) {
      return {
        granted: false,
        totalXp: currentXp,
        level: previousLevel,
        previousLevel,
        leveledUp: false,
      };
    }

    const newXp = currentXp + amount;
    const newLevel = levelForXp(newXp);

    tx.set(eventRef, {
      eventType,
      xpAmount: amount,
      createdAt: FieldValue.serverTimestamp(),
    });
    tx.update(profileRef, {
      totalXp: newXp,
      level: newLevel,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      granted: true,
      totalXp: newXp,
      level: newLevel,
      previousLevel,
      leveledUp: newLevel > previousLevel,
    };
  });
}
