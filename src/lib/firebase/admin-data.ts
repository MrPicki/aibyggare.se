import { adminDb } from "@/lib/firebase/admin";
import type { Report } from "@/types/firestore";

function requireDb() {
  if (!adminDb) throw new Error("Firebase Admin ej tillgänglig");
  return adminDb;
}

// ─── Dashboard-statistik ─────────────────────────────────────────────────────
export interface AdminStats {
  users: number;
  projects: number;
  help: number;
  prompts: number;
  comments: number;
  openReports: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const db = requireDb();
  // count()-aggregering läser inte hela dokumenten — billigt och snabbt.
  const [users, projects, help, prompts, comments, openReports] = await Promise.all([
    db.collection("profiles").count().get(),
    db.collection("projects").count().get(),
    db.collection("posts").where("type", "==", "help").count().get(),
    db.collection("posts").where("type", "==", "prompt").count().get(),
    db.collectionGroup("comments").count().get(),
    db.collection("reports").where("status", "==", "open").count().get(),
  ]);

  return {
    users: users.data().count,
    projects: projects.data().count,
    help: help.data().count,
    prompts: prompts.data().count,
    comments: comments.data().count,
    openReports: openReports.data().count,
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
  // Filtrera på status (enkelt index), sortera i minnet → inget composite-index.
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

// ─── Senaste innehåll (modereringslista) ─────────────────────────────────────
export interface ModItem {
  kind: "project" | "post";
  id: string;
  label: string; // "Projekt" | "Hjälpfråga" | "Prompt" | "Inlägg"
  title: string;
  url: string;
  author: string;
  isFeatured: boolean;
}

function postLabel(type: string): string {
  if (type === "help") return "Hjälpfråga";
  if (type === "prompt") return "Prompt";
  if (type === "guide") return "Guide";
  return "Inlägg";
}

export async function getRecentContent(): Promise<ModItem[]> {
  const db = requireDb();
  const [projSnap, postSnap] = await Promise.all([
    db.collection("projects").orderBy("createdAt", "desc").limit(15).get(),
    db.collection("posts").orderBy("createdAt", "desc").limit(15).get(),
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

  const posts: ModItem[] = postSnap.docs.map((d) => {
    const data = d.data();
    const type = data.type ?? "discussion";
    const base = type === "help" ? "help" : type === "prompt" ? "prompts" : "help";
    return {
      kind: "post",
      id: d.id,
      label: postLabel(type),
      title: data.title ?? "(namnlöst)",
      url: `/${base}/${data.slug ?? ""}`,
      author: data.userDisplayName ?? "Okänd",
      isFeatured: Boolean(data.isFeatured),
    };
  });

  return [...projects, ...posts];
}
