import { adminDb } from "@/lib/firebase/admin";
import type { Project, Comment } from "@/types/firestore";

function requireDb() {
  if (!adminDb) throw new Error("Firebase Admin ej tillgänglig");
  return adminDb;
}

function withTimeout<T>(promise: Promise<T>, ms = 5000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Firestore timeout after ${ms}ms`)), ms)
    ),
  ]);
}

export async function getProjects(limitCount = 30): Promise<Project[]> {
  const db = requireDb();
  const snap = await withTimeout(
    db.collection("projects").orderBy("createdAt", "desc").limit(limitCount).get()
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const db = requireDb();
  const snap = await withTimeout(
    db.collection("projects").where("slug", "==", slug).limit(1).get()
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Project;
}

export async function getProjectComments(projectId: string): Promise<Comment[]> {
  const db = requireDb();
  const snap = await withTimeout(
    db.collection("projects").doc(projectId).collection("comments").orderBy("createdAt", "asc").get()
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Comment));
}
