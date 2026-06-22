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
  className,
}: ProjectCardProps) {
  return (
    <article
      className={cn(
        "chunky pressable group flex h-full flex-col overflow-hidden rounded-3xl bg-paper hover:-rotate-1",
        className,
      )}
    >
      {/* Färgad header-bar (ritningslapp) */}
      <div
        className="flex items-center justify-between border-b-2 border-ink px-4 py-2.5"
        style={{ backgroundColor: accent }}
      >
        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink/80">
          Bygge
        </span>
        <span className="sticker bg-paper px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink">
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
            className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wide text-ink group-hover:text-build-green transition-colors"
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
  );
}
