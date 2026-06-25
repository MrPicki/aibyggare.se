import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GuideCardProps {
  slug: string;
  postId?: string;
  title: string;
  summary: string;
  tool: string;
  category: string;
  accent: string;
  readMinutes: number;
  upvoteCount?: number;
  author?: string;
  authorHandle?: string;
  authorAvatarUrl?: string;
  className?: string;
}

export function GuideCard({
  slug,
  title,
  summary,
  tool,
  category,
  accent,
  readMinutes,
  upvoteCount = 0,
  author,
  authorHandle,
  authorAvatarUrl,
  className,
}: GuideCardProps) {
  return (
    <article className={cn("chunky group flex h-full flex-col overflow-hidden rounded-3xl bg-paper hover:-rotate-1 transition-transform", className)}>
      {/* Color bar */}
      <div
        className="flex items-center justify-between border-b-2 border-ink px-4 py-2.5"
        style={{ backgroundColor: accent }}
      >
        <span className="sticker bg-paper px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-ink">
          {category}
        </span>
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink/80">
          {tool}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-ink">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-mud line-clamp-3">{summary}</p>

        {/* Author */}
        {author && authorHandle && (
          <div className="mt-3 flex items-center gap-2">
            {authorAvatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={authorAvatarUrl} alt="" className="h-5 w-5 rounded-full border border-ink/30 object-cover" />
            )}
            <span className="font-mono text-[11px] font-medium text-mud">
              @{authorHandle}
            </span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t-2 border-dashed border-border pt-3">
          <Link
            href={`/guides/${slug}`}
            className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wide text-ink transition-colors group-hover:text-code-blue"
          >
            Läs genvägen <ArrowUpRight size={13} />
          </Link>
          <div className="flex items-center gap-3 font-mono text-xs font-semibold text-mud">
            <span className="inline-flex items-center gap-1">
              <Clock size={11} /> {readMinutes} min
            </span>
            {upvoteCount > 0 && (
              <span className="inline-flex items-center gap-1">
                ↑ {upvoteCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
