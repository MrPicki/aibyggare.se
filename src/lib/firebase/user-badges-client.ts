"use client";

import { db } from "@/lib/firebase/client";
import { collection, query, where, getDocs, documentId } from "firebase/firestore";

export interface UserBadgeData {
  foundingMember: boolean;
  isAdmin: boolean;
}

// Batch-fetches foundingMember + role for a set of user IDs using the client
// SDK. Processes in chunks of 30 to stay within Firestore's "in" limit.
export async function fetchUserBadgesClient(
  userIds: string[]
): Promise<Record<string, UserBadgeData>> {
  const unique = [...new Set(userIds.filter(Boolean))];
  if (unique.length === 0) return {};

  const result: Record<string, UserBadgeData> = {};
  for (let i = 0; i < unique.length; i += 30) {
    const batch = unique.slice(i, i + 30);
    const q = query(collection(db, "profiles"), where(documentId(), "in", batch));
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      const data = d.data();
      result[d.id] = {
        foundingMember: data.foundingMember === true,
        isAdmin: data.role === "admin",
      };
    }
  }
  return result;
}
