import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import type { Report } from "@/types/firestore";

function requireDb() {
  if (!adminDb) throw new Error("Firebase Admin ej tillgänglig");
  return adminDb;
}

// ─── Admin-användare ──────────────────────────────────────────────────────────
export interface AdminUserRecord {
  uid: string;
  displayName: string;
  username: string;
  avatarUrl: string;
}

export async function getAdminUsers(): Promise<AdminUserRecord[]> {
  const db = requireDb();
  const snap = await db.collection("profiles").where("role", "==", "admin").get();
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      displayName: data.displayName ?? "",
      username: data.username ?? "",
      avatarUrl: data.avatarUrl ?? "",
    };
  });
}

// ─── Dashboard-statistik med 24h-delta ───────────────────────────────────────
export interface AdminStats {
  users: number;     usersNew: number;
  projects: number;  projectsNew: number;
  help: number;      helpNew: number;
  prompts: number;   promptsNew: number;
  comments: number;  commentsNew: number;
  openReports: number; reportsNew: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const db = requireDb();
  const cutoff = Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000));

  // Totaler
  const [users, projects, help, prompts, comments, openReports] = await Promise.all([
    db.collection("profiles").count().get(),
    db.collection("projects").count().get(),
    db.collection("posts").where("type", "==", "help").count().get(),
    db.collection("posts").where("type", "==", "prompt").count().get(),
    db.collectionGroup("comments").count().get(),
    db.collection("reports").where("status", "==", "open").count().get(),
  ]);

  // 24h-deltas — enkla fältfilter kräver inga composite-index.
  // För posts hämtas alla nyligen skapade och räknas per typ i minnet
  // (billigt: max ett fåtal per dag i nuläget).
  const [usersNew, projectsNew, newPostDocs, commentsNew, reportsNew] = await Promise.all([
    db.collection("profiles").where("createdAt", ">", cutoff).count().get(),
    db.collection("projects").where("createdAt", ">", cutoff).count().get(),
    db.collection("posts").where("createdAt", ">", cutoff).select("type").get(),
    db.collectionGroup("comments").where("createdAt", ">", cutoff).count().get().catch(() => null),
    db.collection("reports").where("createdAt", ">", cutoff).count().get().catch(() => null),
  ]);

  const helpNew = newPostDocs.docs.filter((d) => d.data().type === "help").length;
  const promptsNew = newPostDocs.docs.filter((d) => d.data().type === "prompt").length;

  return {
    users: users.data().count,       usersNew: usersNew.data().count,
    projects: projects.data().count,  projectsNew: projectsNew.data().count,
    help: help.data().count,          helpNew,
    prompts: prompts.data().count,    promptsNew,
    comments: comments.data().count,  commentsNew: commentsNew?.data().count ?? 0,
    openReports: openReports.data().count, reportsNew: reportsNew?.data().count ?? 0,
  };
}

// ─── Öppna rapporter ─────────────────────────────────────────────────────────
export interface AdminReport {
  id: string;
  targetType: Report["targetType"];
  targetId: string;
  targetTitle: string;
  targetUrl: string;
  reason: string;
  createdAtSeconds: number | null;
}

export async function getOpenReports(): Promise<AdminReport[]> {
  const db = requireDb();
  const snap = await db.collection("reports").where("status", "==", "open").limit(100).get();
  return snap.docs
    .map((d) => {
      const data = d.data();
      const createdAt = data.createdAt as { seconds?: number } | undefined;
      return {
        id: d.id,
        targetType: data.targetType ?? "project",
        targetId: data.targetId ?? "",
        targetTitle: data.targetTitle ?? "(okänt innehåll)",
        targetUrl: data.targetUrl ?? "",
        reason: data.reason ?? "",
        createdAtSeconds: createdAt?.seconds ?? null,
      } as AdminReport;
    })
    .sort((a, b) => (b.createdAtSeconds ?? 0) - (a.createdAtSeconds ?? 0));
}

// ─── Senaste innehåll, uppdelat i Byggen / Problemhörnan ─────────────────────
export interface ModItem {
  kind: "project" | "post";
  id: string;
  label: string;
  title: string;
  url: string;
  author: string;
  isFeatured: boolean;
}

export interface RecentContentSplit {
  projects: ModItem[];
  helpPosts: ModItem[];
}

export async function getRecentContentSplit(): Promise<RecentContentSplit> {
  const db = requireDb();
  const [projSnap, helpSnap] = await Promise.all([
    db.collection("projects").orderBy("createdAt", "desc").limit(20).get(),
    db.collection("posts").where("type", "==", "help").orderBy("createdAt", "desc").limit(20).get(),
  ]);

  const projects: ModItem[] = projSnap.docs.map((d) => {
    const data = d.data();
    return {
      kind: "project",
      id: d.id,
      label: "Projekt",
      title: data.title ?? "(namnlöst)",
      url: `/projects/${data.slug ?? ""}`,
      author: data.userDisplayName ?? "Okänd",
      isFeatured: Boolean(data.isFeatured),
    };
  });

  const helpPosts: ModItem[] = helpSnap.docs.map((d) => {
    const data = d.data();
    return {
      kind: "post",
      id: d.id,
      label: "Hjälpfråga",
      title: data.title ?? "(namnlöst)",
      url: `/help/${data.slug ?? ""}`,
      author: data.userDisplayName ?? "Okänd",
      isFeatured: Boolean(data.isFeatured),
    };
  });

  return { projects, helpPosts };
}

// ─── Feedback ─────────────────────────────────────────────────────────────────
export interface FeedbackEntry {
  id: string;
  userName: string;
  username: string;
  message: string;
  pageUrl: string;
  imageUrl: string;
  status: "open" | "done";
  createdAtSeconds: number | null;
}

function mapFeedback(d: FirebaseFirestore.QueryDocumentSnapshot): FeedbackEntry {
  const data = d.data();
  const ts = data.createdAt as { seconds?: number } | undefined;
  return {
    id: d.id,
    userName: data.userName ?? "Okänd",
    username: data.username ?? "",
    message: data.message ?? "",
    pageUrl: data.pageUrl ?? "",
    imageUrl: data.imageUrl ?? "",
    status: data.status === "done" ? "done" : "open",
    createdAtSeconds: ts?.seconds ?? null,
  };
}

export async function getFeedbackEntries(limit = 60): Promise<FeedbackEntry[]> {
  const db = requireDb();
  // Fetch enough to get open ones after filtering (legacy docs lack status field)
  const snap = await db.collection("feedback").orderBy("createdAt", "desc").limit(limit).get();
  return snap.docs.map(mapFeedback).filter((f) => f.status === "open");
}

export async function getFeedbackDone(limit = 50): Promise<FeedbackEntry[]> {
  const db = requireDb();
  const snap = await db
    .collection("feedback")
    .where("status", "==", "done")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();
  return snap.docs.map(mapFeedback);
}

export async function markFeedbackDone(id: string): Promise<void> {
  const db = requireDb();
  await db.collection("feedback").doc(id).update({ status: "done" });
}

export async function deleteFeedback(id: string): Promise<void> {
  const db = requireDb();
  await db.collection("feedback").doc(id).delete();
}
