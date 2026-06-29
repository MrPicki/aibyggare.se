import { adminDb } from "@/lib/firebase/admin";

export interface CommunityStats {
  projects: number;
  helpPosts: number;
  prompts: number;
  members: number;
}

export async function getCommunityStats(): Promise<CommunityStats | null> {
  if (!adminDb) return null;
  try {
    const [projects, help, prompts, members] = await Promise.all([
      adminDb.collection("projects").count().get(),
      adminDb.collection("posts").where("type", "==", "help").count().get(),
      adminDb.collection("posts").where("type", "==", "prompt").count().get(),
      adminDb.collection("profiles").count().get(),
    ]);
    return {
      projects: projects.data().count,
      helpPosts: help.data().count,
      prompts: prompts.data().count,
      members: members.data().count,
    };
  } catch {
    return null;
  }
}

export interface CommunityBuilder {
  username: string;
  displayName: string;
  bio: string;
  tools: string[];
  avatarUrl: string;
}

export async function getCommunityBuilders(limit = 6): Promise<CommunityBuilder[]> {
  if (!adminDb) return [];
  try {
    const snap = await adminDb
      .collection("profiles")
      .orderBy("createdAt", "desc")
      .limit(30)
      .get();
    return snap.docs
      .map((d) => {
        const data = d.data();
        return {
          username: data.username ?? "",
          displayName: data.displayName ?? "",
          bio: data.bio ?? "",
          tools: Array.isArray(data.tools) ? (data.tools as string[]).slice(0, 4) : [],
          avatarUrl: data.avatarUrl ?? "/seed/avatar-neutral.png",
        };
      })
      .filter((b) => b.username && b.displayName)
      .slice(0, limit);
  } catch {
    return [];
  }
}
