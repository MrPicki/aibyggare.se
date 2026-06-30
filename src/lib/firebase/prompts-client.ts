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
  _userId: string
): Promise<{ upvoted: boolean; newCount: number }> {
  const res = await fetch("/api/upvote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetType: "post", targetId: postId }),
  });
  if (!res.ok) throw new Error("Kunde inte upvota");
  return res.json();
}

export async function hasPostUpvoted(postId: string, userId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "votes", `${userId}_${postId}`));
  return snap.exists();
}
