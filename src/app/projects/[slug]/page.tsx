import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getProjectBySlug, getProjectComments } from "@/lib/firebase/projects";
import { DrillButton } from "@/components/projects/DrillButton";
import { CommentSection } from "@/components/projects/CommentSection";
import { STATUS_LABEL, STATUS_ACCENT } from "@/lib/constants/project-status";
import type { ProjectStatus } from "@/types/firestore";
import { SEED_PROJECTS } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
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

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Try Firestore first, fall back to seed data for demo projects
  let project = null;
  let comments: import("@/types/firestore").Comment[] = [];

  try {
    project = await getProjectBySlug(slug);
    if (project) {
      comments = await getProjectComments(project.id);
    }
  } catch (e) {
    console.error("[project-detail] Firestore fetch failed:", e);
  }

  if (!project) {
    // Seed data fallback (for demo slugs)
    const seed = SEED_PROJECTS.find((p) => p.slug === slug);
    if (!seed) notFound();

    const status = "mvp" as ProjectStatus;
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-mud hover:text-build-green transition-colors"
        >
          <ArrowLeft size={14} /> Alla byggen
        </Link>
        <article className="chunky mt-6 overflow-hidden rounded-3xl bg-paper">
          <div
            className="flex items-center justify-between border-b-2 border-ink px-5 py-3"
            style={{ backgroundColor: seed.accent }}
          >
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink/80">
              Bygge
            </span>
            <span className="sticker bg-paper px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink">
              {STATUS_LABEL[status]}
            </span>
          </div>
          <div className="p-6 sm:p-8">
            <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
              {seed.title}
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-mud">{seed.tagline}</p>
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
          </div>
        </article>
      </div>
    );
  }

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
        {/* Header-bar */}
        <div
          className="flex items-center justify-between border-b-2 border-ink px-5 py-3"
          style={{ backgroundColor: accent }}
        >
          <div className="flex items-center gap-2">
            {project.userAvatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.userAvatarUrl}
                alt=""
                className="h-6 w-6 rounded-full border-2 border-ink"
                referrerPolicy="no-referrer"
              />
            )}
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink/80">
              {project.userDisplayName || "Byggare"}
            </span>
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

          {/* Description */}
          {project.description && (
            <p className="mt-6 text-sm leading-relaxed text-ink whitespace-pre-line">
              {project.description}
            </p>
          )}

          {/* Feedback wanted */}
          {project.feedbackWanted && (
            <div className="mt-6 rounded-xl border-2 border-dashed border-border bg-cream p-4">
              <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-mud mb-1">
                Söker feedback på
              </p>
              <p className="text-sm text-ink">{project.feedbackWanted}</p>
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

          {/* Upvote + count bar */}
          <div className="mt-8 flex items-center gap-4 border-t-2 border-dashed border-border pt-5">
            <DrillButton projectId={project.id} initialCount={project.upvoteCount ?? 0} />
            <span className="font-mono text-sm text-mud">
              {project.commentCount ?? 0} kommentarer
            </span>
          </div>
        </div>
      </article>

      {/* Comments */}
      <div className="chunky mt-6 rounded-3xl bg-paper p-6 sm:p-8">
        <CommentSection projectId={project.id} initialComments={comments} />
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
