import type { Project, Comment } from "@/types/firestore";
import { requireDb, withTimeout, serializeDoc } from "@/lib/firebase/admin-utils";

export async function getProjects(limitCount = 30): Promise<Project[]> {
  const db = requireDb();
  const snap = await withTimeout(
    db.collection("projects").orderBy("createdAt", "desc").limit(limitCount).get()
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
}

// "Veckans bygge": admin-utsett featured-projekt, annars mest borrade.
export async function getFeaturedProject(): Promise<Project | null> {
  const db = requireDb();
  const featured = await withTimeout(
    db.collection("projects").where("isFeatured", "==", true).limit(1).get()
  );
  if (!featured.empty) {
    const d = featured.docs[0];
    return { id: d.id, ...d.data() } as Project;
  }
  const top = await withTimeout(
    db.collection("projects").orderBy("upvoteCount", "desc").limit(1).get()
  );
  if (top.empty) return null;
  const d = top.docs[0];
  return { id: d.id, ...d.data() } as Project;
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
  return snap.docs.map((d) => ({ id: d.id, ...serializeDoc(d.data()) } as Comment));
}
