import Link from "next/link";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import { Sticker } from "@/components/ui/Sticker";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { DrillIcon } from "@/components/brand/DrillIcon";
import { LevelBadge } from "@/components/levels/LevelBadge";
import { FoundingBadge } from "@/components/founding/FoundingBadge";
import { STATUS_LABEL, STATUS_ACCENT } from "@/lib/constants/project-status";
import type { Project, ProjectStatus } from "@/types/firestore";

interface FeaturedBuildProps {
  project: Project;
  badge?: { level: number; foundingMember: boolean };
}

// "Veckans bygge" — lyft för det featured-projektet på startsidan.
// Product Hunt-logiken: ett bygge i rampljuset skapar återkommande besök
// och något att sikta på för alla som lägger upp.
export function FeaturedBuild({ project, badge }: FeaturedBuildProps) {
  const status = project.status as ProjectStatus;
  const accent = STATUS_ACCENT[status] ?? "var(--build-green)";

  return (
    <section className="border-b-2 border-ink bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8">
          <Sticker tilt={-2} className="mb-3 bg-hammer-yellow">Veckans bygge</Sticker>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            I rampljuset just nu
          </h2>
          <p className="mt-2 max-w-md text-mud">
            Ett bygge från communityn som är värt en extra titt. Nästa vecka kan det vara ditt.
          </p>
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div className="pointer-events-none absolute -right-3 -top-3 z-10 rotate-[-12deg] drop-shadow-md sm:-right-5 sm:-top-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/seed/stamp-featured.png"
              alt="Veckans bygge"
              width={96}
              height={96}
              className="h-[72px] w-[72px] sm:h-[96px] sm:w-[96px]"
            />
          </div>

          <Link
            href={`/projects/${project.slug}`}
            aria-label={`Öppna veckans bygge: ${project.title}`}
            className="chunky pressable group flex flex-col overflow-hidden rounded-3xl bg-paper hover:-rotate-1"
          >
            {/* Header-bar */}
            <div
              className="flex items-center justify-between border-b-2 border-ink px-5 py-3"
              style={{ backgroundColor: accent }}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="relative shrink-0">
                  {project.userAvatarUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.userAvatarUrl}
                      alt=""
                      className="h-6 w-6 rounded-full border border-ink/40 object-cover"
                    />
                  )}
                  {badge?.foundingMember && (
                    <FoundingBadge show className="absolute -left-1.5 -top-1.5 !h-3.5 !w-3.5" />
                  )}
                </span>
                <span className="truncate font-mono text-[11px] font-bold uppercase tracking-widest text-ink/80">
                  {project.userDisplayName || "Byggare"}
                </span>
                {typeof badge?.level === "number" && <LevelBadge level={badge.level} />}
              </div>
              <span className="sticker shrink-0 bg-paper px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink">
                {STATUS_LABEL[status] ?? project.status}
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <h3 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
                {project.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-mud line-clamp-3">
                {project.tagline}
              </p>

              {(project.stack?.length ?? 0) > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.stack!.slice(0, 6).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-border bg-cream px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-mud"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between border-t-2 border-dashed border-border pt-4">
                <span className="inline-flex items-center gap-1 font-mono text-sm font-bold uppercase tracking-wide text-ink transition-colors group-hover:text-build-green">
                  Visa bygget <ArrowUpRight size={15} />
                </span>
                <div className="flex items-center gap-4 font-mono text-sm font-semibold text-mud">
                  <span className="inline-flex items-center gap-1.5">
                    <DrillIcon className="h-4 w-4 text-build-green" /> {project.upvoteCount ?? 0}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MessageSquare size={14} /> {project.commentCount ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 flex justify-center">
          <ChunkyLink href="/projects/new" variant="paper">
            Lägg upp ditt bygge — kanske står det här nästa vecka
          </ChunkyLink>
        </div>
      </div>
    </section>
  );
}
