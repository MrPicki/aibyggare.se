import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Sticker } from "@/components/ui/Sticker";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { ProjectCard, type ProjectCardProps } from "@/components/cards/ProjectCard";
import { HelpCard, type HelpCardProps } from "@/components/cards/HelpCard";
import { PromptCard, type PromptCardProps } from "@/components/cards/PromptCard";
import { TOOL_PAGES, getToolPage, matchesTool, type ToolPage } from "@/lib/constants/tool-pages";
import { STATUS_LABEL, STATUS_ACCENT } from "@/lib/constants/project-status";
import { toolAccent } from "@/lib/constants/tools";
import { SEED_PROJECTS, SEED_HELP_QUESTIONS, SEED_PROMPTS } from "@/lib/seed";
import type { Project, Post, ProjectStatus } from "@/types/firestore";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aibyggare.se";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool: rawSlug } = await params;
  const tool = getToolPage(decodeURIComponent(rawSlug));
  if (!tool) return { title: "Verktyg" };

  const title = `${tool.name} på svenska — byggen, problem & prompts`;
  const canonical = `${SITE_URL}/tools/${tool.slug}`;
  return {
    title,
    description: tool.description,
    alternates: { canonical },
    openGraph: {
      title: `${tool.name} — AIbyggare.se`,
      description: tool.description,
      url: canonical,
      type: "website" as const,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${tool.name} — AIbyggare.se`,
      description: tool.description,
    },
  };
}

function projectToCard(p: Project, badge?: { level: number; foundingMember: boolean }): ProjectCardProps {
  const status = p.status as ProjectStatus;
  const ts = p.createdAt as { seconds?: number } | null;
  return {
    title: p.title,
    tagline: p.tagline,
    slug: p.slug,
    status: STATUS_LABEL[status] ?? p.status,
    accent: STATUS_ACCENT[status] ?? "var(--build-green)",
    tags: p.stack ?? [],
    upvotes: p.upvoteCount ?? 0,
    commentCount: p.commentCount ?? 0,
    authorName: p.userDisplayName || "Byggare",
    authorAvatarUrl: p.userAvatarUrl || undefined,
    authorLevel: badge?.level,
    authorFounding: badge?.foundingMember,
    createdAt: ts?.seconds,
  };
}

function helpPostToCard(p: Post, badge?: { level: number; foundingMember: boolean }): HelpCardProps {
  const topic = p.tool || p.tags?.[0] || "Annat";
  return {
    slug: p.slug,
    title: p.title,
    body: p.body,
    topic,
    accent: toolAccent(topic),
    author: p.userDisplayName || "Byggare",
    username: p.username,
    avatarUrl: p.userAvatarUrl || undefined,
    authorLevel: badge?.level,
    authorFounding: badge?.foundingMember,
    answerCount: p.commentCount ?? 0,
    status: p.status === "solved" ? "Löst" : "Öppen",
  };
}

function promptPostToCard(p: Post): PromptCardProps {
  return {
    title: p.title,
    tool: p.tool || "Annat",
    badge: p.tags?.[0] ?? "Prompt",
    prompt: p.body,
    accent: toolAccent(p.tool || "Annat"),
    slug: p.slug,
    postId: p.id,
    upvoteCount: p.upvoteCount ?? 0,
    author: p.userDisplayName,
    authorHandle: p.username,
    authorAvatarUrl: p.userAvatarUrl,
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool: rawSlug } = await params;
  const tool = getToolPage(decodeURIComponent(rawSlug));
  if (!tool) notFound();

  let projects: ProjectCardProps[] = [];
  let helpQuestions: HelpCardProps[] = [];
  let prompts: PromptCardProps[] = [];

  try {
    const [{ getProjects }, { getHelpPosts }, { getPromptPosts }] = await Promise.all([
      import("@/lib/firebase/projects"),
      import("@/lib/firebase/help"),
      import("@/lib/firebase/prompts"),
    ]);
    const [allProjects, allHelp, allPrompts] = await Promise.all([
      getProjects(100),
      getHelpPosts(100),
      getPromptPosts(100),
    ]);

    const matchedProjects = allProjects.filter((p) => matchesTool(tool, p.stack ?? []));
    const matchedHelp = allHelp.filter((p) => matchesTool(tool, [p.tool, ...(p.tags ?? [])]));
    const matchedPrompts = allPrompts.filter((p) => matchesTool(tool, [p.tool, ...(p.tags ?? [])]));

    let badges: Record<string, { level: number; foundingMember: boolean }> = {};
    try {
      const { getUserBadges } = await import("@/lib/firebase/profiles");
      const authorIds = [...matchedProjects, ...matchedHelp]
        .map((p) => p.userId)
        .filter(Boolean) as string[];
      if (authorIds.length) badges = await getUserBadges(authorIds);
    } catch { /* badges är icke-kritiska */ }

    projects = matchedProjects.map((p) => projectToCard(p, badges[p.userId]));
    helpQuestions = matchedHelp.map((p) => helpPostToCard(p, badges[p.userId]));
    prompts = matchedPrompts.map(promptPostToCard);
  } catch (e) {
    console.error("[tools/slug] Firestore fetch failed:", e);
  }

  // Seed-fallback om Firestore var tom/otillgänglig
  if (projects.length === 0) {
    projects = SEED_PROJECTS.filter((p) => matchesTool(tool, p.tags));
  }
  if (helpQuestions.length === 0) {
    helpQuestions = SEED_HELP_QUESTIONS
      .filter((q) => matchesTool(tool, [q.topic, ...(q.tools ?? [])]))
      .map((q) => ({
        slug: q.slug,
        title: q.title,
        body: q.body,
        topic: q.topic,
        accent: q.accent,
        author: q.author,
        username: q.username,
        avatarUrl: q.avatarUrl,
        answerCount: q.answerCount,
        status: q.status,
      }));
  }
  if (prompts.length === 0) {
    prompts = SEED_PROMPTS.filter((p) => matchesTool(tool, [p.tool]));
  }

  const otherTools = TOOL_PAGES.filter((t) => t.slug !== tool.slug);
  const isEmpty = projects.length === 0 && helpQuestions.length === 0 && prompts.length === 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${tool.name} på svenska — byggen, problem & prompts`,
    description: tool.description,
    url: `${SITE_URL}/tools/${tool.slug}`,
    isPartOf: { "@type": "WebSite", name: "AIbyggare.se", url: SITE_URL },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Verktyg", item: `${SITE_URL}/tools` },
        { "@type": "ListItem", position: 2, name: tool.name, item: `${SITE_URL}/tools/${tool.slug}` },
      ],
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/tools"
        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-mud hover:text-build-green transition-colors"
      >
        <ArrowLeft size={14} /> Alla verktyg
      </Link>

      {/* Hero */}
      <div className="mt-6 mb-12 max-w-2xl">
        <span
          className="sticker mb-3 inline-flex rotate-[-2deg] px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-ink"
          style={{ backgroundColor: tool.accent }}
        >
          {tool.name}
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Bygger du med {tool.name}?
        </h1>
        <p className="mt-1 font-mono text-sm font-semibold uppercase tracking-wide text-mud">
          {tool.tagline}
        </p>
        <p className="mt-4 text-base leading-relaxed text-mud">{tool.intro}</p>
      </div>

      {isEmpty ? (
        <div className="chunky rounded-3xl bg-paper p-12 text-center sm:p-16">
          <p className="font-display text-xl font-bold text-ink">
            Inget {tool.name}-innehåll än — bli först.
          </p>
          <p className="mx-auto mt-2 max-w-sm text-mud">
            Lägg upp ett bygge, ställ en fråga eller dela en prompt så syns du här.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ChunkyLink href="/projects/new" variant="green">Lägg upp bygge</ChunkyLink>
            <ChunkyLink href="/problemhornan/new" variant="paper">Ställ en fråga</ChunkyLink>
          </div>
        </div>
      ) : (
        <div className="space-y-14">
          {/* Byggen */}
          {projects.length > 0 && (
            <section>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <h2 className="font-display text-2xl font-bold text-ink">
                  Byggen med {tool.name}{" "}
                  <span className="font-mono text-base font-semibold text-mud">({projects.length})</span>
                </h2>
                <Link
                  href="/projects"
                  className="font-mono text-sm font-bold uppercase tracking-wide text-ink hover:text-build-green transition-colors"
                >
                  Alla byggen →
                </Link>
              </div>
              <div className="grid gap-5 pt-3 sm:grid-cols-2 lg:grid-cols-3">
                {projects.slice(0, 6).map((p) => (
                  <ProjectCard key={p.slug} {...p} />
                ))}
              </div>
            </section>
          )}

          {/* Problem */}
          {helpQuestions.length > 0 && (
            <section>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <h2 className="font-display text-2xl font-bold text-ink">
                  Problem &amp; lösningar{" "}
                  <span className="font-mono text-base font-semibold text-mud">({helpQuestions.length})</span>
                </h2>
                <Link
                  href="/problemhornan"
                  className="font-mono text-sm font-bold uppercase tracking-wide text-ink hover:text-build-green transition-colors"
                >
                  Problemhörnan →
                </Link>
              </div>
              <div className="grid gap-5 pt-3 sm:grid-cols-2 lg:grid-cols-3">
                {helpQuestions.slice(0, 6).map((q) => (
                  <HelpCard key={q.slug} {...q} />
                ))}
              </div>
            </section>
          )}

          {/* Prompts */}
          {prompts.length > 0 && (
            <section>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <h2 className="font-display text-2xl font-bold text-ink">
                  Prompts för {tool.name}{" "}
                  <span className="font-mono text-base font-semibold text-mud">({prompts.length})</span>
                </h2>
                <Link
                  href="/prompts"
                  className="font-mono text-sm font-bold uppercase tracking-wide text-ink hover:text-build-green transition-colors"
                >
                  Alla prompts →
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {prompts.slice(0, 6).map((p) => (
                  <PromptCard key={p.slug ?? p.title} {...p} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="chunky mt-14 rounded-3xl bg-cream p-6 text-center sm:p-10">
        <Sticker tilt={2} className="mb-3 bg-hammer-yellow">
          Bygger du med {tool.name}?
        </Sticker>
        <p className="font-display text-xl font-bold text-ink">
          Visa vad du gjort — eller få hjälp när det strular.
        </p>
        <p className="mx-auto mt-2 max-w-md text-mud">
          Det är gratis, tar två minuter och du hittar andra som bygger med exakt samma verktyg.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ChunkyLink href="/projects/new" variant="green">Lägg upp bygge</ChunkyLink>
          <ChunkyLink href="/problemhornan/new" variant="yellow">Jag har fastnat</ChunkyLink>
          <ChunkyLink href="/prompts/new" variant="paper">Dela en prompt</ChunkyLink>
        </div>
      </div>

      {/* Fler verktyg — intern länkning */}
      <div className="mt-14">
        <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-mud">
          Fler verktyg
        </h2>
        <div className="flex flex-wrap gap-2">
          {otherTools.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="chunky-sm pressable rounded-xl border-2 border-ink bg-paper px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wide text-ink hover:bg-cream transition-colors"
            >
              {t.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
