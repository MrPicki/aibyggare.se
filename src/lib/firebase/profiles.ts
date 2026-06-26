import { adminDb } from "@/lib/firebase/admin";
import type { Project, Post } from "@/types/firestore";

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

// Plain, serializable profile for Server → Client rendering (no Timestamps).
export interface PublicProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  tools: string[];
  websiteUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  joinedYear: number | null;
  totalXp: number;
  level: number;
  foundingMember: boolean;
}

function secondsOf(v: unknown): number | null {
  if (v && typeof v === "object" && "seconds" in v) {
    return (v as { seconds: number }).seconds;
  }
  return null;
}

export async function getProfileByUsername(username: string): Promise<PublicProfile | null> {
  const db = requireDb();
  const snap = await withTimeout(
    db.collection("profiles").where("username", "==", username).limit(1).get()
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data();
  const joinedSeconds = secondsOf(data.createdAt);
  return {
    id: d.id,
    username: data.username ?? "",
    displayName: data.displayName ?? "",
    bio: data.bio ?? "",
    avatarUrl: data.avatarUrl ?? data.photoURL ?? "",
    tools: Array.isArray(data.tools) ? data.tools : [],
    websiteUrl: data.websiteUrl ?? "",
    githubUrl: data.githubUrl ?? "",
    linkedinUrl: data.linkedinUrl ?? "",
    joinedYear: joinedSeconds ? new Date(joinedSeconds * 1000).getFullYear() : null,
    totalXp: typeof data.totalXp === "number" ? data.totalXp : 0,
    level: typeof data.level === "number" ? data.level : 0,
    foundingMember: data.foundingMember === true,
  };
}

export interface UserBadges {
  level: number;
  foundingMember: boolean;
}

// Batch-hämtar level + founding-status för en uppsättning användar-ID:n. Visas
// bredvid avatarer i flöden utan N separata anrop.
export async function getUserBadges(
  userIds: string[],
): Promise<Record<string, UserBadges>> {
  const unique = [...new Set(userIds.filter(Boolean))];
  if (unique.length === 0) return {};
  try {
    const db = requireDb();
    const refs = unique.map((id) => db.collection("profiles").doc(id));
    const snaps = await withTimeout(db.getAll(...refs));
    const out: Record<string, UserBadges> = {};
    for (const snap of snaps) {
      if (snap.exists) {
        const data = snap.data();
        out[snap.id] = {
          level: typeof data?.level === "number" ? data.level : 0,
          foundingMember: data?.foundingMember === true,
        };
      }
    }
    return out;
  } catch {
    return {};
  }
}

// Queries by userId only (no orderBy) so no composite index is needed; we sort
// newest-first in memory.
export async function getProjectsByUser(userId: string): Promise<Project[]> {
  const db = requireDb();
  const snap = await withTimeout(
    db.collection("projects").where("userId", "==", userId).get()
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Project))
    .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
}

export async function getPostsByUser(userId: string, type: Post["type"]): Promise<Post[]> {
  const db = requireDb();
  const snap = await withTimeout(
    db.collection("posts").where("userId", "==", userId).get()
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Post))
    .filter((p) => p.type === type)
    .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
}

// True om användaren har skrivit minst en kommentar/svar någonstans (märket
// "Hjälpt någon"). collectionGroup kräver ett COLLECTION_GROUP-index på
// comments.userId (se firestore.indexes.json). try/catch → om indexet saknas
// visas bara inte märket, sidan kraschar aldrig.
export async function hasHelpedSomeone(userId: string): Promise<boolean> {
  try {
    const db = requireDb();
    const snap = await withTimeout(
      db.collectionGroup("comments").where("userId", "==", userId).limit(1).get()
    );
    return !snap.empty;
  } catch {
    return false;
  }
}
