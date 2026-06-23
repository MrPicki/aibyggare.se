import { adminDb } from "@/lib/firebase/admin";
import type { Post, Comment } from "@/types/firestore";

function requireDb() {
  if (!adminDb) throw new Error("Firebase Admin ej tillgänglig");
  return adminDb;
}

function withTimeout<T>(promise: Promise<T>, ms = 5000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Firestore timeout after ${ms}ms`)),
        ms
      )
    ),
  ]);
}

export async function getHelpPosts(limitCount = 50): Promise<Post[]> {
  const db = requireDb();
  const snap = await withTimeout(
    db
      .collection("posts")
      .where("type", "==", "help")
      .orderBy("createdAt", "desc")
      .limit(limitCount)
      .get()
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
}

export async function getHelpPostBySlug(slug: string): Promise<Post | null> {
  const db = requireDb();
  // Söker på slug (enkelt index) + verifierar type i kod → undviker composit-index.
  const snap = await withTimeout(
    db.collection("posts").where("slug", "==", slug).limit(1).get()
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  const post = { id: d.id, ...d.data() } as Post;
  if (post.type !== "help") return null;
  return post;
}

export async function getPostAnswers(postId: string): Promise<Comment[]> {
  const db = requireDb();
  const snap = await withTimeout(
    db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .orderBy("createdAt", "asc")
      .get()
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Comment));
}
