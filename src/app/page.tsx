import { Hero } from "@/components/home/Hero";
import { TabStrip } from "@/components/home/TabStrip";
import { LatestBuildActivity, type BuildActivityItem } from "@/components/home/LatestBuildActivity";
import { FeaturedBuild } from "@/components/home/FeaturedBuild";
import { StatementBlock } from "@/components/home/StatementBlock";
import { ProjectShowcase } from "@/components/home/ProjectShowcase";
import { HelpShowcase } from "@/components/home/HelpShowcase";
import { StuckBanner } from "@/components/home/StuckBanner";
import { PromptShowcase } from "@/components/home/PromptShowcase";
import { Testimonials } from "@/components/home/Testimonials";
import { CommunityMarquee } from "@/components/home/CommunityMarquee";
import { STATUS_LABEL } from "@/lib/constants/project-status";
import type { Project, Post, ProjectStatus } from "@/types/firestore";

export const dynamic = "force-dynamic";

function relativeLabel(ts: { seconds?: number } | null | undefined): string {
  if (!ts?.seconds) return "nyss";
  const seconds = Date.now() / 1000 - ts.seconds;
  if (seconds < 60) return "nyss";
  if (seconds < 3600) return `för ${Math.round(seconds / 60)} min sen`;
  if (seconds < 86400) return `för ${Math.round(seconds / 3600)} tim sen`;
  const days = Math.round(seconds / 86400);
  return `för ${days} dag${days !== 1 ? "ar" : ""} sen`;
}

function projectToActivity(p: Project, badges?: { level: number; foundingMember: boolean }): BuildActivityItem {
  const ts = p.createdAt as { seconds?: number } | null;
  return {
    id: p.id,
    type: "project",
    user: {
      name: p.userDisplayName || "Byggare",
      handle: p.username ? `@${p.username}` : "",
      username: p.username ?? "",
      initials: (p.userDisplayName || "B").slice(0, 1).toUpperCase(),
      avatarUrl: p.userAvatarUrl || undefined,
      level: badges?.level,
      foundingMember: badges?.foundingMember,
    },
    projectName: p.title,
    projectUrl: p.projectUrl || undefined,
    title: p.tagline,
    description: p.description || p.tagline,
    tools: p.stack?.slice(0, 3) ?? [],
    status: STATUS_LABEL[p.status as ProjectStatus] ?? p.status,
    upvotes: p.upvoteCount ?? 0,
    comments: p.commentCount ?? 0,
    createdAtLabel: relativeLabel(ts),
    targetUrl: `/projects/${p.slug}`,
  };
}

function helpToActivity(post: Post, badges?: { level: number; foundingMember: boolean }): BuildActivityItem {
  const ts = post.createdAt as { seconds?: number } | null;
  return {
    id: post.id,
    type: "problem",
    user: {
      name: post.userDisplayName || "Byggare",
      handle: post.username ? `@${post.username}` : "",
      username: post.username ?? "",
      initials: (post.userDisplayName || "B").slice(0, 1).toUpperCase(),
      avatarUrl: post.userAvatarUrl || undefined,
      level: badges?.level,
      foundingMember: badges?.foundingMember,
    },
    projectName: post.title,
    title: post.title,
    description: post.body,
    problem: post.tryFix || undefined,
    tools: post.tags?.slice(0, 3) ?? [],
    status: post.status === "solved" ? "Löst" : "Öppet",
    upvotes: post.upvoteCount ?? 0,
    comments: post.commentCount ?? 0,
    createdAtLabel: relativeLabel(ts),
    targetUrl: `/problemhornan/${post.slug}`,
  };
}

export default async function HomePage() {
  let activityItems: BuildActivityItem[] | undefined;
  let featuredProject: Project | null = null;
  let featuredBadge: { level: number; foundingMember: boolean } | undefined;

  try {
    const [{ getProjects, getFeaturedProject }, { getHelpPosts }, { getUserBadges }] = await Promise.all([
      import("@/lib/firebase/projects"),
      import("@/lib/firebase/help"),
      import("@/lib/firebase/profiles"),
    ]);
    const [projects, helpPosts, featured] = await Promise.all([
      getProjects(5),
      getHelpPosts(4),
      getFeaturedProject().catch(() => null),
    ]);
    featuredProject = featured;

    if (projects.length > 0 || helpPosts.length > 0 || featured) {
      // Hämta författarnas level + founding-status i en batch för badges.
      const authorIds = [
        ...projects.map((p) => p.userId),
        ...helpPosts.map((p) => p.userId),
        ...(featured?.userId ? [featured.userId] : []),
      ].filter(Boolean) as string[];
      const badges = await getUserBadges(authorIds);
      if (featured?.userId) featuredBadge = badges[featured.userId];

      const mixed: BuildActivityItem[] = [
        ...projects.map((p) => projectToActivity(p, badges[p.userId])),
        ...helpPosts.map((p) => helpToActivity(p, badges[p.userId])),
      ];
      // Sort newest first by createdAt seconds
      mixed.sort((a, b) => {
        const aTs = (projects.find((p) => p.id === a.id) ?? helpPosts.find((p) => p.id === a.id));
        const bTs = (projects.find((p) => p.id === b.id) ?? helpPosts.find((p) => p.id === b.id));
        const aS = (aTs?.createdAt as { seconds?: number } | null)?.seconds ?? 0;
        const bS = (bTs?.createdAt as { seconds?: number } | null)?.seconds ?? 0;
        return bS - aS;
      });
      activityItems = mixed.slice(0, 6);
    }
  } catch {
    // Firestore otillgänglig — seed-data används i LatestBuildActivity
  }

  return (
    <>
      <Hero />
      <TabStrip />
      <LatestBuildActivity items={activityItems} />
      {featuredProject && <FeaturedBuild project={featuredProject} badge={featuredBadge} />}
      <StatementBlock />
      <ProjectShowcase />
      <HelpShowcase />
      <StuckBanner />
      <PromptShowcase />
      <Testimonials />
      <CommunityMarquee />
    </>
  );
}
