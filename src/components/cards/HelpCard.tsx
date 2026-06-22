import Link from "next/link";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HelpQuestion } from "@/lib/seed";

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
}: HelpQuestion & { className?: string }) {
  const solved = status === "Löst";

  return (
    <article
      className={cn(
        "chunky pressable group flex h-full flex-col rounded-3xl bg-paper",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b-2 border-ink px-4 py-2.5">
        <span
          className="sticker px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-ink"
          style={{ backgroundColor: accent }}
        >
          {topic}
        </span>
        <span
          className={cn(
            "font-mono text-[10px] font-bold uppercase tracking-widest",
            solved ? "text-build-green" : "text-mud",
          )}
        >
          {solved ? "Löst" : "Öppen"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-ink">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-mud line-clamp-3">{body}</p>

        <div className="mt-5 flex items-center justify-between border-t-2 border-dashed border-border pt-3">
          <Link
            href={`/help/${slug}`}
            className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wide text-ink group-hover:text-build-green transition-colors"
          >
            Hjälp till <ArrowUpRight size={13} />
          </Link>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-mud">
            {username ? (
              <Link href={`/profile/${username}`} className="inline-flex items-center gap-1.5 hover:text-ink transition-colors">
                {avatarUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" className="h-4 w-4 rounded-full border border-ink/30 object-cover" />
                )}
                {author}
              </Link>
            ) : (
              <span>{author}</span>
            )}
            <span className="inline-flex items-center gap-1">
              <MessageSquare size={12} /> {answerCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
