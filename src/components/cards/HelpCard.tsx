import Link from "next/link";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HelpCardProps {
  slug: string;
  title: string;
  body: string;
  topic: string;
  accent: string;
  author: string;
  username?: string;
  avatarUrl?: string;
  answerCount: number;
  status: "Löst" | "Öppen";
  className?: string;
}

export function HelpCard({
  slug,
  title,
  body,
  topic,
  accent,
  author,
  username,
  avatarUrl,
  answerCount,
  status,
  className,
}: HelpCardProps) {
  const solved = status === "Löst";

  return (
    <article
      className={cn(
        "chunky pressable group flex h-full flex-col overflow-hidden rounded-3xl bg-paper hover:-rotate-1",
        className,
      )}
    >
      {/* Header-bar — matchar ProjectCard */}
      <div
        className="flex items-center justify-between border-b-2 border-ink px-4 py-2.5"
        style={{ backgroundColor: accent }}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          {avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              className="h-5 w-5 shrink-0 rounded-full border border-ink/40 object-cover"
            />
          )}
          <span className="truncate font-mono text-[11px] font-bold uppercase tracking-widest text-ink/80">
            {author}
          </span>
        </div>
        <span
          className={cn(
            "sticker shrink-0 bg-paper px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide",
            solved ? "text-build-green" : "text-ink",
          )}
        >
          {status}
        </span>
      </div>

      {/* Brödtext */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold leading-tight text-ink">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-mud line-clamp-3">
          {body}
        </p>

        {/* Topic-tagg */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className="rounded-md border border-border bg-cream px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-mud">
            {topic}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t-2 border-dashed border-border pt-3">
          <Link
            href={`/help/${slug}`}
            className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wide text-ink transition-colors group-hover:text-hammer-yellow"
          >
            Se frågan <ArrowUpRight size={13} />
          </Link>
          <div className="flex items-center gap-3 font-mono text-xs font-semibold text-mud">
            {username ? (
              <Link
                href={`/profile/${username}`}
                className="hover:text-ink transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                @{username}
              </Link>
            ) : null}
            <span className="inline-flex items-center gap-1">
              <MessageSquare size={12} /> {answerCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
