import type { Post, Comment } from "@/types/firestore";
import { requireDb, withTimeout, serializeDoc } from "@/lib/firebase/admin-utils";

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
  return snap.docs.map((d) => ({ id: d.id, ...serializeDoc(d.data()) } as Comment));
}
