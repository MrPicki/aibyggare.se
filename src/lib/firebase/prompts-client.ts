"use client";

import { db } from "@/lib/firebase/client";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { slugify } from "@/lib/firebase/projects-client";

export { slugify };

export async function makeUniquePromptSlug(title: string): Promise<string> {
  const base = slugify(title);
  const snap = await getDocs(
    query(collection(db, "posts"), where("slug", "==", base))
  );
  if (snap.empty) return base;
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

export interface CreatePromptInput {
  userId: string;
  userDisplayName: string;
  userAvatarUrl: string;
  username: string;
  title: string;
  slug: string;
  body: string;   // själva prompt-texten
  tool: string;
  badge: string;  // kategori-etikett → sparas i tags[0]
}

export async function createPromptPost(
  data: CreatePromptInput
): Promise<{ id: string; slug: string }> {
  const docRef = await addDoc(collection(db, "posts"), {
    userId: data.userId,
    userDisplayName: data.userDisplayName,
    userAvatarUrl: data.userAvatarUrl,
    username: data.username,
    type: "prompt",
    title: data.title,
    slug: data.slug,
    body: data.body,
    tool: data.tool,
    tags: [data.badge],
    status: "open",
    isFeatured: false,
    acceptedCommentId: null,
    upvoteCount: 0,
    commentCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, slug: data.slug };
}

// ── Profil ────────────────────────────────────────────────────────────────────

export async function getUsernameFromProfile(uid: string): Promise<string> {
  const snap = await getDoc(doc(db, "profiles", uid));
  if (!snap.exists()) return "";
  return (snap.data().username as string) ?? "";
}

// ── Upvotes (borrar) ──────────────────────────────────────────────────────────

export async function togglePostUpvote(
  postId: string,
  userId: string
): Promise<{ upvoted: boolean; newCount: number }> {
  const voteId = `${userId}_${postId}`;
  const voteRef = doc(db, "votes", voteId);
  const postRef = doc(db, "posts", postId);

  return runTransaction(db, async (tx) => {
    const [voteSnap, postSnap] = await Promise.all([
      tx.get(voteRef),
      tx.get(postRef),
    ]);
    const currentCount = (postSnap.data()?.upvoteCount as number) ?? 0;

    if (voteSnap.exists()) {
      tx.delete(voteRef);
      tx.update(postRef, { upvoteCount: Math.max(0, currentCount - 1) });
      return { upvoted: false, newCount: Math.max(0, currentCount - 1) };
    } else {
      tx.set(voteRef, {
        userId,
        targetId: postId,
        targetType: "post",
        createdAt: serverTimestamp(),
      });
      tx.update(postRef, { upvoteCount: currentCount + 1 });
      return { upvoted: true, newCount: currentCount + 1 };
    }
  });
}

export async function hasPostUpvoted(postId: string, userId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "votes", `${userId}_${postId}`));
  return snap.exists();
}
