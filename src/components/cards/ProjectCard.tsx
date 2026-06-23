import Link from "next/link";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { DrillIcon } from "@/components/brand/DrillIcon";

export interface ProjectCardProps {
  title: string;
  tagline: string;
  slug: string;
  status: string;
  /** CSS-färg för header-bar + statussticker. */
  accent: string;
  tags: string[];
  upvotes: number;
  commentCount: number;
  authorName?: string;
  authorAvatarUrl?: string;
  isFeatured?: boolean;
  className?: string;
}

export function ProjectCard({
  title,
  tagline,
  slug,
  status,
  accent,
  tags,
  upvotes,
  commentCount,
  authorName,
  authorAvatarUrl,
  isFeatured,
  className,
}: ProjectCardProps) {
  return (
    <div className={cn("relative h-full", className)}>
      {isFeatured && (
        <div className="pointer-events-none absolute -right-3 -top-3 z-10 rotate-[-12deg] drop-shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/seed/stamp-featured.png"
            alt="Mest borrad toppbygge"
            width={72}
            height={72}
            className="h-[60px] w-[60px] md:h-[72px] md:w-[72px]"
          />
        </div>
      )}

      <article className="chunky pressable group flex h-full flex-col overflow-hidden rounded-3xl bg-paper hover:-rotate-1">
        {/* Färgad header-bar (ritningslapp) */}
        <div
          className="flex items-center justify-between border-b-2 border-ink px-4 py-2.5"
          style={{ backgroundColor: accent }}
        >
          <div className="flex min-w-0 items-center gap-1.5">
            {authorAvatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={authorAvatarUrl}
                alt=""
                className="h-5 w-5 shrink-0 rounded-full border border-ink/40 object-cover"
              />
            )}
            <span className="truncate font-mono text-[11px] font-bold uppercase tracking-widest text-ink/80">
              {authorName ?? "Bygge"}
            </span>
          </div>
          <span className="sticker shrink-0 bg-paper px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink">
            {status}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-xl font-bold leading-tight text-ink">{title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-mud line-clamp-3">{tagline}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border bg-cream px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-mud"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t-2 border-dashed border-border pt-3">
            <Link
              href={`/projects/${slug}`}
              className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wide text-ink transition-colors group-hover:text-build-green"
            >
              Visa bygget <ArrowUpRight size={13} />
            </Link>
            <div className="flex items-center gap-3 font-mono text-xs font-semibold text-mud">
              <span className="inline-flex items-center gap-1">
                <DrillIcon className="h-3.5 w-3.5 text-build-green" /> {upvotes}
              </span>
              <span className="inline-flex items-center gap-1">
                <MessageSquare size={12} /> {commentCount}
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
