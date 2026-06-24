import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Wrench, Globe } from "lucide-react";
import { Sticker } from "@/components/ui/Sticker";
import { ProjectCard, type ProjectCardProps } from "@/components/cards/ProjectCard";
import { HelpCard, type HelpCardProps } from "@/components/cards/HelpCard";
import { PromptCard, type PromptCardProps } from "@/components/cards/PromptCard";
import { ProfileBadges } from "@/components/profile/ProfileBadges";
import { STATUS_LABEL, STATUS_ACCENT } from "@/lib/constants/project-status";
import { toolAccent } from "@/lib/constants/tools";
import type { BadgeStats } from "@/lib/constants/badges";
import type { Project, Post, ProjectStatus } from "@/types/firestore";
import {
  SEED_USERS,
  SEED_PROJECTS,
  SEED_HELP_QUESTIONS,
  SEED_PROMPTS,
} from "@/lib/seed";

export const dynamic = "force-dynamic";

// lucide-react i denna version saknar Github/Linkedin — inline-SVG (samma
// konvention som login-sidan).
function GithubMark({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7 0-.7 0-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.6 18 4.9 18 4.9c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
  );
}

function LinkedinMark({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

// ─── Unified view model (Firestore and seed both normalize to this) ──────────
interface ProfileView {
  displayName: string;
  username: string;
  bio: string;
  avatarUrl: string;
  joinedLabel: string;
  tools: string[];
  websiteUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  projects: ProjectCardProps[];
  helpCards: HelpCardProps[];
  promptCards: PromptCardProps[];
  badgeStats: BadgeStats;
}

// ─── Firestore → card adapters ───────────────────────────────────────────────
function projectToCard(p: Project): ProjectCardProps {
  const status = p.status as ProjectStatus;
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
  };
}

function helpToCard(p: Post): HelpCardProps {
  return {
    slug: p.slug,
    title: p.title,
    body: p.body,
    topic: p.tool || "Annat",
    accent: toolAccent(p.tool),
    author: p.userDisplayName || "Byggare",
    username: p.username,
    avatarUrl: p.userAvatarUrl || undefined,
    answerCount: p.commentCount ?? 0,
    status: p.status === "solved" ? "Löst" : "Öppen",
  };
}

function promptToCard(p: Post): PromptCardProps {
  return {
    postId: p.id,
    title: p.title,
    tool: p.tool,
    badge: p.tags?.[0] ?? "Prompt",
    prompt: p.body,
    accent: toolAccent(p.tool),
    slug: p.slug,
    upvoteCount: p.upvoteCount ?? 0,
    author: p.userDisplayName,
    authorHandle: p.username,
    authorAvatarUrl: p.userAvatarUrl,
  };
}

function sumUpvotes(items: { upvoteCount?: number }[]): number {
  return items.reduce((acc, it) => acc + (it.upvoteCount ?? 0), 0);
}

// ─── Source resolvers ────────────────────────────────────────────────────────
async function fromFirestore(handle: string): Promise<ProfileView | null> {
  try {
    const { getProfileByUsername, getProjectsByUser, getPostsByUser, hasHelpedSomeone } =
      await import("@/lib/firebase/profiles");
    const profile = await getProfileByUsername(handle);
    if (!profile) return null;

    const [projects, helpPosts, promptPosts, helpedSomeone] = await Promise.all([
      getProjectsByUser(profile.id),
      getPostsByUser(profile.id, "help"),
      getPostsByUser(profile.id, "prompt"),
      hasHelpedSomeone(profile.id),
    ]);

    const totalUpvotes =
      sumUpvotes(projects) + sumUpvotes(helpPosts) + sumUpvotes(promptPosts);

    return {
      displayName: profile.displayName,
      username: profile.username,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      joinedLabel: profile.joinedYear ? String(profile.joinedYear) : "",
      tools: profile.tools,
      websiteUrl: profile.websiteUrl || undefined,
      githubUrl: profile.githubUrl || undefined,
      linkedinUrl: profile.linkedinUrl || undefined,
      projects: projects.map(projectToCard),
      helpCards: helpPosts.map(helpToCard),
      promptCards: promptPosts.map(promptToCard),
      badgeStats: {
        projectCount: projects.length,
        liveProjectCount: projects.filter((p) => p.status === "live").length,
        promptCount: promptPosts.length,
        helpQuestionCount: helpPosts.length,
        totalUpvotes,
        helpedSomeone,
      },
    };
  } catch {
    return null; // Firestore unavailable — caller falls back to seed
  }
}

function fromSeed(handle: string): ProfileView | null {
  const user = SEED_USERS.find((u) => u.username === handle);
  if (!user) return null;

  const projects = SEED_PROJECTS.filter((p) => user.projectSlugs.includes(p.slug));
  const helpCards = SEED_HELP_QUESTIONS.filter((q) => user.helpSlugs.includes(q.slug));
  const promptCards = SEED_PROMPTS.filter(
    (p) => p.slug && user.promptSlugs.includes(p.slug)
  );

  const totalUpvotes =
    projects.reduce((acc, p) => acc + (p.upvotes ?? 0), 0) +
    promptCards.reduce((acc, p) => acc + (p.upvoteCount ?? 0), 0);

  return {
    displayName: user.displayName,
    username: user.username,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    joinedLabel: user.joined,
    tools: user.tools,
    projects,
    helpCards: helpCards as unknown as HelpCardProps[],
    promptCards: promptCards as unknown as PromptCardProps[],
    badgeStats: {
      projectCount: projects.length,
      // Seed-status är friform ("Live men nervös") — matcha på ordet "live".
      liveProjectCount: projects.filter((p) => /live/i.test(p.status)).length,
      promptCount: promptCards.length,
      helpQuestionCount: helpCards.length,
      totalUpvotes,
      helpedSomeone: SEED_HELP_QUESTIONS.some((q) =>
        q.answers?.some((a) => a.username === user.username)
      ),
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const view = (await fromFirestore(handle)) ?? fromSeed(handle);
  if (!view) return { title: "Profil — AIbyggare.se" };
  return {
    title: `${view.displayName} (@${view.username}) — AIbyggare.se`,
    description: view.bio,
  };
}

const LINK_ITEMS = [
  { key: "websiteUrl", label: "Webbplats", Icon: Globe },
  { key: "githubUrl", label: "GitHub", Icon: GithubMark },
  { key: "linkedinUrl", label: "LinkedIn", Icon: LinkedinMark },
] as const;

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const view = (await fromFirestore(handle)) ?? fromSeed(handle);
  if (!view) notFound();

  const links = LINK_ITEMS.map((item) => ({ ...item, url: view[item.key] })).filter(
    (l): l is typeof l & { url: string } => Boolean(l.url)
  );

  const isEmpty =
    view.projects.length === 0 &&
    view.helpCards.length === 0 &&
    view.promptCards.length === 0;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-mud hover:text-build-green transition-colors"
      >
        <ArrowLeft size={14} /> Startsidan
      </Link>

      {/* ── Profile card ── */}
      <article className="chunky mt-6 overflow-hidden rounded-3xl bg-paper">
        <div className="border-b-2 border-ink bg-build-green px-6 py-3">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink/80">
            Byggare
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6">
            {/* Avatar */}
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-ink bg-cream">
              {view.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={view.avatarUrl}
                  alt={view.displayName}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center font-display text-3xl font-bold text-mud">
                  {(view.displayName || "?")[0].toUpperCase()}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 text-center sm:text-left">
              <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                {view.displayName}
              </h1>
              <p className="mt-0.5 font-mono text-sm text-mud">@{view.username}</p>

              {view.bio && (
                <p className="mt-3 text-base leading-relaxed text-ink">{view.bio}</p>
              )}

              {view.joinedLabel && (
                <div className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-mud">
                  <Calendar size={12} />
                  Gick med {view.joinedLabel}
                </div>
              )}

              {/* External links */}
              {links.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {links.map(({ key, label, Icon, url }) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="chunky-sm pressable inline-flex items-center gap-1.5 rounded-xl bg-paper px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-ink hover:bg-hammer-yellow transition-colors"
                    >
                      <Icon size={13} /> {label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tools */}
          {view.tools.length > 0 && (
            <div className="mt-6 border-t-2 border-dashed border-border pt-5">
              <div className="mb-3 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-mud">
                <Wrench size={12} /> Verktyg
              </div>
              <div className="flex flex-wrap gap-2">
                {view.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-xl border-2 border-ink px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide text-ink"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Märken */}
          <ProfileBadges stats={view.badgeStats} />
        </div>
      </article>

      {/* ── Projects ── */}
      {view.projects.length > 0 && (
        <section className="mt-10">
          <Sticker tilt={-1} className="mb-4 bg-build-green">Byggen</Sticker>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {view.projects.map((p) => (
              <ProjectCard key={p.slug} {...p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Help questions ── */}
      {view.helpCards.length > 0 && (
        <section className="mt-10">
          <Sticker tilt={1} className="mb-4 bg-bug-red/20">Hjälpfrågor</Sticker>
          <div className="grid grid-cols-1 gap-4">
            {view.helpCards.map((q) => (
              <HelpCard key={q.slug} {...q} />
            ))}
          </div>
        </section>
      )}

      {/* ── Prompts ── */}
      {view.promptCards.length > 0 && (
        <section className="mt-10">
          <Sticker tilt={-1} className="mb-4 bg-prompt-purple/20">Prompts</Sticker>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {view.promptCards.map((p) => (
              <PromptCard key={p.slug ?? p.title} {...p} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="chunky mt-8 rounded-3xl bg-cream p-10 text-center">
          <p className="font-display text-lg font-bold text-ink">Inget på bänken ännu.</p>
          <p className="mt-2 text-mud">Snart dyker det upp byggen, frågor och prompts här.</p>
        </div>
      )}
    </div>
  );
}
