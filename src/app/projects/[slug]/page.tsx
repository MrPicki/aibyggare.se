import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { DrillButton } from "@/components/projects/DrillButton";
import { CommentSection } from "@/components/projects/CommentSection";
import { ReportButton } from "@/components/moderation/ReportButton";
import { STATUS_LABEL, STATUS_ACCENT } from "@/lib/constants/project-status";
import type { ProjectStatus } from "@/types/firestore";
import { SEED_PROJECTS, SEED_PROJECT_DETAILS } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const { getProjectBySlug } = await import("@/lib/firebase/projects");
    const project = await getProjectBySlug(slug);
    if (project) {
      return {
        title: `${project.title} — AIbyggare.se`,
        description: project.tagline,
      };
    }
  } catch {}
  const seed = SEED_PROJECTS.find((p) => p.slug === slug);
  if (seed) return { title: `${seed.title} — AIbyggare.se`, description: seed.tagline };
  return { title: "Bygge — AIbyggare.se" };
}

function fmtDate(ts: unknown): string {
  if (!ts) return "";
  const d = (ts as { toDate?: () => Date }).toDate?.();
  if (!d) return "";
  return d.toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" });
}

function daysAgoLabel(days: number): string {
  if (days === 0) return "idag";
  if (days === 1) return "igår";
  if (days < 7) return `för ${days} dagar sen`;
  if (days < 14) return "för en vecka sen";
  if (days < 30) return `för ${Math.round(days / 7)} veckor sen`;
  if (days < 60) return "för en månad sen";
  return `för ${Math.round(days / 30)} månader sen`;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let project: import("@/types/firestore").Project | null = null;
  let comments: import("@/types/firestore").Comment[] = [];

  // Separate try/catch: project load and comment load are independent
  try {
    const { getProjectBySlug } = await import("@/lib/firebase/projects");
    project = await getProjectBySlug(slug);
  } catch (e) {
    console.error("[project-detail] Firestore project fetch failed:", e);
  }

  if (project) {
    try {
      const { getProjectComments } = await import("@/lib/firebase/projects");
      comments = await getProjectComments(project.id);
    } catch (e) {
      console.error("[project-detail] Firestore comments fetch failed:", e);
    }
  }

  // ── Seed fallback ────────────────────────────────────────────────────────────
  if (!project) {
    const seed = SEED_PROJECTS.find((p) => p.slug === slug);
    if (!seed) notFound();
    const detail = SEED_PROJECT_DETAILS[slug];
    const accent = seed.accent;

    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-mud hover:text-build-green transition-colors"
        >
          <ArrowLeft size={14} /> Alla byggen
        </Link>

        <article className="chunky mt-6 overflow-hidden rounded-3xl bg-paper">
          {/* Header bar */}
          <div
            className="flex items-center justify-between border-b-2 border-ink px-5 py-3"
            style={{ backgroundColor: accent }}
          >
            <div className="flex items-center gap-2">
              {detail?.username && (
                <Link
                  href={`/profile/${detail.username}`}
                  className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink/80 hover:text-ink transition-colors"
                >
                  {seed.authorName}
                </Link>
              )}
              {!detail?.username && (
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink/80">
                  {seed.authorName}
                </span>
              )}
            </div>
            <span className="sticker bg-paper px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink">
              {seed.status}
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
              {seed.title}
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-mud">{seed.tagline}</p>

            {/* Stack tags */}
            {seed.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {seed.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-border bg-cream px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-mud"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Why it was built */}
            {detail?.problem && (
              <div className="mt-6 rounded-xl border-2 border-dashed border-code-blue/40 bg-code-blue/5 px-4 py-3">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-code-blue mb-1.5">
                  Varför det byggdes
                </p>
                <p className="text-sm leading-relaxed text-ink">{detail.problem}</p>
              </div>
            )}

            {/* Description */}
            {detail?.description && (
              <p className="mt-6 text-sm leading-relaxed text-ink whitespace-pre-line">
                {detail.description}
              </p>
            )}

            {/* Feedback wanted */}
            {detail?.feedbackWanted && (
              <div className="mt-6 rounded-xl border-2 border-dashed border-hammer-yellow/40 bg-hammer-yellow/5 px-4 py-3">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-hammer-yellow/80 mb-1.5">
                  Söker feedback på
                </p>
                <p className="text-sm leading-relaxed text-ink">{detail.feedbackWanted}</p>
              </div>
            )}

            {/* Project URL */}
            {detail?.projectUrl && (
              <div className="mt-6">
                <a
                  href={detail.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chunky-sm pressable inline-flex items-center gap-1.5 rounded-xl bg-build-green px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-paper"
                >
                  <ExternalLink size={13} /> Öppna bygget
                </a>
              </div>
            )}

            {/* Stats */}
            <div className="mt-8 flex items-center justify-between border-t-2 border-dashed border-border pt-5">
              <div className="flex items-center gap-4 font-mono text-sm text-mud">
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  🔩 {seed.upvotes}
                </span>
                <span>{detail?.comments.length ?? seed.commentCount} kommentarer</span>
              </div>
              {detail && (
                <span className="font-mono text-[11px] text-mud">
                  {daysAgoLabel(detail.daysAgo)}
                </span>
              )}
            </div>
          </div>
        </article>

        {/* Seed comments */}
        {detail && (
          <div className="chunky mt-6 rounded-3xl bg-paper p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-ink mb-5">
              Kommentarer{" "}
              <span className="font-mono text-base font-semibold text-mud">
                ({detail.comments.length})
              </span>
            </h2>
            {detail.comments.length > 0 && (
              <ul className="space-y-4 mb-8">
                {detail.comments.map((c, i) => (
                  <li key={i} className="flex gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.avatarUrl}
                      alt=""
                      className="h-8 w-8 shrink-0 rounded-full border-2 border-ink mt-0.5 object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <Link
                          href={`/profile/${c.username}`}
                          className="font-mono text-xs font-bold text-ink hover:text-build-green transition-colors"
                        >
                          {c.author}
                        </Link>
                        <span className="font-mono text-[10px] text-mud">
                          {daysAgoLabel(c.daysAgo)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-ink">{c.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="chunky-sm rounded-xl border-2 border-dashed border-border p-4 text-center">
              <p className="text-sm text-mud">
                <Link
                  href="/login"
                  className="font-semibold text-ink underline underline-offset-2 hover:text-build-green"
                >
                  Logga in
                </Link>{" "}
                för att kommentera och hjälpa andra byggare.
              </p>
            </div>
          </div>
        )}

        {/* Report */}
        <div className="mt-6 flex justify-end">
          <ReportButton
            targetType="project"
            targetId={slug}
            targetTitle={seed.title}
            targetUrl={`/projects/${slug}`}
          />
        </div>
      </div>
    );
  }

  // ── Firestore project ────────────────────────────────────────────────────────
  const status = project.status as ProjectStatus;
  const statusLabel = STATUS_LABEL[status] ?? project.status;
  const accent = STATUS_ACCENT[status] ?? "var(--build-green)";

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-mud hover:text-build-green transition-colors"
      >
        <ArrowLeft size={14} /> Alla byggen
      </Link>

      <article className="chunky mt-6 overflow-hidden rounded-3xl bg-paper">
        {/* Header bar */}
        <div
          className="flex items-center justify-between border-b-2 border-ink px-5 py-3"
          style={{ backgroundColor: accent }}
        >
          <div className="flex items-center gap-2.5">
            {project.userAvatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.userAvatarUrl}
                alt=""
                className="h-6 w-6 rounded-full border-2 border-ink object-cover"
                referrerPolicy="no-referrer"
              />
            )}
            {project.username ? (
              <Link
                href={`/profile/${project.username}`}
                className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink/80 hover:text-ink transition-colors"
              >
                {project.userDisplayName || "Byggare"}
              </Link>
            ) : (
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink/80">
                {project.userDisplayName || "Byggare"}
              </span>
            )}
          </div>
          <span className="sticker bg-paper px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink">
            {statusLabel}
          </span>
        </div>

        {/* Cover image */}
        {project.imageUrl && (
          <div className="border-b-2 border-ink">
            <Image
              src={project.imageUrl}
              alt={project.title}
              width={800}
              height={400}
              className="w-full object-cover"
              style={{ maxHeight: 320 }}
            />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
            {project.title}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-mud">{project.tagline}</p>

          {/* Stack tags */}
          {project.stack?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.stack.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border bg-cream px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-mud"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Why it was built */}
          {project.problem && (
            <div className="mt-6 rounded-xl border-2 border-dashed border-code-blue/40 bg-code-blue/5 px-4 py-3">
              <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-code-blue mb-1.5">
                Varför det byggdes
              </p>
              <p className="text-sm leading-relaxed text-ink">{project.problem}</p>
            </div>
          )}

          {/* Description */}
          {project.description && (
            <p className="mt-6 text-sm leading-relaxed text-ink whitespace-pre-line">
              {project.description}
            </p>
          )}

          {/* Feedback wanted */}
          {project.feedbackWanted && (
            <div className="mt-6 rounded-xl border-2 border-dashed border-hammer-yellow/40 bg-hammer-yellow/5 px-4 py-3">
              <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-hammer-yellow/80 mb-1.5">
                Söker feedback på
              </p>
              <p className="text-sm leading-relaxed text-ink">{project.feedbackWanted}</p>
            </div>
          )}

          {/* Links */}
          {(project.projectUrl || project.githubUrl) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chunky-sm pressable inline-flex items-center gap-1.5 rounded-xl bg-build-green px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-paper"
                >
                  <ExternalLink size={13} /> Öppna bygget
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chunky-sm pressable inline-flex items-center gap-1.5 rounded-xl border-2 border-ink bg-paper px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-ink hover:bg-ink hover:text-paper transition-colors"
                >
                  <GithubIcon /> GitHub
                </a>
              )}
            </div>
          )}

          {/* Stats + date */}
          <div className="mt-8 flex items-center justify-between border-t-2 border-dashed border-border pt-5">
            <div className="flex items-center gap-4">
              <DrillButton projectId={project.id} initialCount={project.upvoteCount ?? 0} />
              <span className="font-mono text-sm text-mud">
                {project.commentCount ?? 0} kommentarer
              </span>
            </div>
            {project.createdAt && (
              <span className="font-mono text-[11px] text-mud">
                {fmtDate(project.createdAt)}
              </span>
            )}
          </div>
        </div>
      </article>

      {/* Comments */}
      <div className="chunky mt-6 rounded-3xl bg-paper p-6 sm:p-8">
        <CommentSection projectId={project.id} initialComments={comments} />
      </div>

      {/* Report */}
      <div className="mt-6 flex justify-end">
        <ReportButton
          targetType="project"
          targetId={project.id}
          targetTitle={project.title}
          targetUrl={`/projects/${project.slug}`}
        />
      </div>
    </div>
  );
}

function GithubIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12Z" />
    </svg>
  );
}
