"use client";

import { db } from "@/lib/firebase/client";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  increment,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";
import { slugify } from "@/lib/firebase/projects-client";
import type { Comment } from "@/types/firestore";

export { slugify };

export async function makeUniqueHelpSlug(title: string): Promise<string> {
  const base = slugify(title);
  const snap = await getDocs(
    query(collection(db, "posts"), where("slug", "==", base))
  );
  if (snap.empty) return base;
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

export interface CreateHelpInput {
  userId: string;
  userDisplayName: string;
  userAvatarUrl: string;
  username: string;
  title: string;
  slug: string;
  body: string;          // "vad du försökte göra" — används som summary i kort
  tryFix: string;        // "vad som gick fel"
  alreadyTried: string;  // valfri
  projectUrl: string;    // valfri
  tools: string[];       // alla valda verktyg → sparas i tags
}

export async function createHelpPost(
  data: CreateHelpInput
): Promise<{ id: string; slug: string }> {
  const docRef = await addDoc(collection(db, "posts"), {
    userId: data.userId,
    userDisplayName: data.userDisplayName,
    userAvatarUrl: data.userAvatarUrl,
    username: data.username,
    type: "help",
    title: data.title,
    slug: data.slug,
    body: data.body,
    tryFix: data.tryFix,
    alreadyTried: data.alreadyTried || null,
    projectUrl: data.projectUrl || null,
    tool: data.tools[0] ?? "Annat",
    tags: data.tools,
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

export interface AddAnswerInput {
  postId: string;
  userId: string;
  userDisplayName: string;
  userAvatarUrl: string;
  body: string;
}

export async function addAnswer(input: AddAnswerInput): Promise<string> {
  const { postId, ...fields } = input;
  const answersRef = collection(db, "posts", postId, "comments");
  const postRef = doc(db, "posts", postId);

  const docRef = await addDoc(answersRef, {
    ...fields,
    parentId: null,
    isAccepted: false,
    projectId: null,
    postId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await updateDoc(postRef, { commentCount: increment(1) });

  return docRef.id;
}

export function subscribeToAnswers(
  postId: string,
  callback: (answers: Comment[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "posts", postId, "comments"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Comment)));
  });
}

export async function acceptAnswer(
  postId: string,
  commentId: string,
  previousCommentId: string | null
): Promise<void> {
  const batch = writeBatch(db);

  if (previousCommentId && previousCommentId !== commentId) {
    batch.update(doc(db, "posts", postId, "comments", previousCommentId), {
      isAccepted: false,
    });
  }

  batch.update(doc(db, "posts", postId, "comments", commentId), {
    isAccepted: true,
  });

  batch.update(doc(db, "posts", postId), {
    status: "solved",
    acceptedCommentId: commentId,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}
