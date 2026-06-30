"use client";

import { db, storage } from "@/lib/firebase/client";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { Comment, ProjectStatus } from "@/types/firestore";

// ── Slug ─────────────────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function makeUniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  const snap = await getDocs(
    query(collection(db, "projects"), where("slug", "==", base))
  );
  if (snap.empty) return base;
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

// ── Image upload ──────────────────────────────────────────────────────────────

export async function uploadProjectImage(file: File, uid: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `images/${uid}/projects/${Date.now()}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ── Create project ────────────────────────────────────────────────────────────

export interface CreateProjectInput {
  userId: string;
  userDisplayName: string;
  userAvatarUrl: string;
  username: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  problem: string;
  stack: string[];
  status: ProjectStatus;
  projectUrl: string;
  githubUrl: string;
  imageUrl: string;
  feedbackWanted: string;
}

export async function createProject(
  data: CreateProjectInput
): Promise<{ id: string; slug: string }> {
  const docRef = await addDoc(collection(db, "projects"), {
    ...data,
    isFeatured: false,
    upvoteCount: 0,
    commentCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, slug: data.slug };
}

// ── Fetch by slug (client) ───────────────────────────────────────────────────

import type { Project } from "@/types/firestore";

export async function getProjectBySlugClient(slug: string): Promise<Project | null> {
  const q = query(collection(db, "projects"), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Project;
}

// ── Update project ────────────────────────────────────────────────────────────

export interface UpdateProjectInput {
  title: string;
  tagline: string;
  description: string;
  problem: string;
  stack: string[];
  status: ProjectStatus;
  projectUrl: string;
  githubUrl: string;
  feedbackWanted: string;
  imageUrl?: string;
}

export async function updateProject(docId: string, data: UpdateProjectInput): Promise<void> {
  const { imageUrl, ...rest } = data;
  const payload: Record<string, unknown> = { ...rest, updatedAt: serverTimestamp() };
  if (imageUrl !== undefined) payload.imageUrl = imageUrl;
  await updateDoc(doc(db, "projects", docId), payload);
}

// ── Upvotes ───────────────────────────────────────────────────────────────────

export async function toggleUpvote(
  projectId: string,
  _userId: string
): Promise<{ upvoted: boolean; newCount: number }> {
  const res = await fetch("/api/upvote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetType: "project", targetId: projectId }),
  });
  if (!res.ok) throw new Error("Kunde inte upvota");
  return res.json();
}

export async function hasUpvoted(projectId: string, userId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "votes", `${userId}_${projectId}`));
  return snap.exists();
}

// ── Comments ──────────────────────────────────────────────────────────────────

export interface AddCommentInput {
  projectId: string;
  userId: string;
  userDisplayName: string;
  userAvatarUrl: string;
  body: string;
  parentId?: string | null;
  replyToName?: string | null;
}

export async function addComment(input: AddCommentInput): Promise<string> {
  const { projectId, parentId = null, replyToName = null, body } = input;
  const res = await fetch("/api/comment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetType: "project", targetId: projectId, body, parentId, replyToName }),
  });
  if (!res.ok) throw new Error("Kunde inte spara kommentar");
  const data = await res.json();
  return data.id;
}

export function subscribeToComments(
  projectId: string,
  callback: (comments: Comment[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "projects", projectId, "comments"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    // Skip empty cache snapshots — they'd overwrite valid SSR initial data
    if (snap.metadata.fromCache && snap.empty) return;
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Comment)));
  });
}
