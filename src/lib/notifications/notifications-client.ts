import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export interface AppNotification {
  id: string;
  type: "upvote" | "comment" | "answer" | "reply";
  actorName: string;
  actorAvatarUrl: string;
  actorUsername: string;
  targetType: "project" | "post";
  targetTitle: string;
  url: string;
  preview: string;
  read: boolean;
  createdAtSeconds: number;
}

// Live-prenumeration på en användares notiser (senaste 30). orderBy på
// createdAt i subcollection → automatiskt single-field-index, inget composite.
export function subscribeToNotifications(
  uid: string,
  cb: (items: AppNotification[]) => void,
): () => void {
  const q = query(
    collection(db, "profiles", uid, "notifications"),
    orderBy("createdAt", "desc"),
    limit(30),
  );
  return onSnapshot(
    q,
    (snap) => {
      const items: AppNotification[] = snap.docs.map((d) => {
        const x = d.data();
        return {
          id: d.id,
          type: x.type,
          actorName: x.actorName ?? "En byggare",
          actorAvatarUrl: x.actorAvatarUrl ?? "",
          actorUsername: x.actorUsername ?? "",
          targetType: x.targetType,
          targetTitle: x.targetTitle ?? "",
          url: x.url ?? "/",
          preview: x.preview ?? "",
          read: x.read === true,
          createdAtSeconds: x.createdAt?.seconds ?? 0,
        };
      });
      cb(items);
    },
    () => cb([]),
  );
}

export async function markNotificationRead(uid: string, notifId: string): Promise<void> {
  try {
    await updateDoc(doc(db, "profiles", uid, "notifications", notifId), { read: true });
  } catch { /* icke-kritiskt */ }
}

export async function markAllNotificationsRead(
  uid: string,
  ids: string[],
): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const id of ids) {
      batch.update(doc(db, "profiles", uid, "notifications", id), { read: true });
    }
    await batch.commit();
  } catch { /* icke-kritiskt */ }
}

export async function deleteNotification(uid: string, notifId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "profiles", uid, "notifications", notifId));
  } catch { /* icke-kritiskt */ }
}
