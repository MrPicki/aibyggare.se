import type { MetadataRoute } from "next";
import {
  SEED_PROJECTS,
  SEED_HELP_QUESTIONS,
  SEED_PROMPTS,
  SEED_GUIDES,
  SEED_USERS,
} from "@/lib/seed";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aibyggare.se";

export const dynamic = "force-dynamic";

function url(path: string): string {
  return `${SITE_URL}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Statiska sidor — alltid med.
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/projects",
    "/problemhornan",
    "/prompts",
    "/guides",
    "/about",
    "/community",
    "/community-rules",
    "/contact",
  ].map((p) => ({
    url: url(p),
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: p === "/" ? 1 : 0.8,
  }));

  // Dynamiskt innehåll — försök Firestore, fall tillbaka på seed-slugs.
  let projectSlugs = SEED_PROJECTS.map((p) => p.slug);
  let helpSlugs = SEED_HELP_QUESTIONS.map((q) => q.slug);
  let promptSlugs = SEED_PROMPTS.map((p) => p.slug).filter(Boolean) as string[];
  let guideSlugs = SEED_GUIDES.map((g) => g.slug);
  let profileHandles = SEED_USERS.map((u) => u.username);

  try {
    const [{ getProjects }, { getHelpPosts }, { getPromptPosts }, { getGuidePosts }] = await Promise.all([
      import("@/lib/firebase/projects"),
      import("@/lib/firebase/help"),
      import("@/lib/firebase/prompts"),
      import("@/lib/firebase/guides"),
    ]);
    const [projects, help, prompts, guides] = await Promise.all([
      getProjects(200),
      getHelpPosts(200),
      getPromptPosts(200),
      getGuidePosts(200),
    ]);
    if (projects.length) projectSlugs = projects.map((p) => p.slug).filter(Boolean);
    if (help.length) helpSlugs = help.map((p) => p.slug).filter(Boolean);
    if (prompts.length) promptSlugs = prompts.map((p) => p.slug).filter(Boolean);
    if (guides.length) guideSlugs = guides.map((g) => g.slug).filter(Boolean);
    // Profilhandtag: unika från innehållet + seed.
    const handles = new Set(profileHandles);
    for (const p of [...help, ...prompts, ...guides]) if (p.username) handles.add(p.username);
    profileHandles = [...handles];
  } catch {
    // Firestore otillgänglig — seed-slugs används.
  }

  const contentRoutes: MetadataRoute.Sitemap = [
    ...projectSlugs.map((s) => ({ url: url(`/projects/${s}`), lastModified: now, priority: 0.7 })),
    ...helpSlugs.map((s) => ({ url: url(`/problemhornan/${s}`), lastModified: now, priority: 0.6 })),
    ...promptSlugs.map((s) => ({ url: url(`/prompts/${s}`), lastModified: now, priority: 0.6 })),
    ...guideSlugs.map((s) => ({ url: url(`/guides/${s}`), lastModified: now, priority: 0.6 })),
    ...profileHandles.map((h) => ({ url: url(`/profile/${h}`), lastModified: now, priority: 0.5 })),
  ];

  return [...staticRoutes, ...contentRoutes];
}
