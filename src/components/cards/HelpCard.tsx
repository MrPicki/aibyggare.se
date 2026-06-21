import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { ToolBadge } from "@/components/ui/ToolBadge";

interface HelpCardProps {
  title: string;
  slug: string;
  tool: string;
  answerCount: number;
  timeAgo: string;
  isOpen?: boolean;
}

export function HelpCard({
  title,
  slug,
  tool,
  answerCount,
  timeAgo,
  isOpen = true,
}: HelpCardProps) {
  return (
    <Link href={`/help/${slug}`} className="group block">
      <article className="h-full rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/50 hover:shadow-sm">
        <div className="flex items-start gap-3">
          {/* Answer count indicator */}
          <div
            className={`shrink-0 flex flex-col items-center justify-center w-11 h-11 rounded-lg text-xs font-semibold gap-0.5 ${
              answerCount > 0
                ? "bg-primary/15 text-[#2A5C1E] dark:bg-primary/20 dark:text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <MessageSquare size={13} />
            <span>{answerCount}</span>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-foreground group-hover:text-[#2A5C1E] dark:group-hover:text-primary transition-colors line-clamp-2 text-sm leading-snug">
              {title}
            </h3>
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              <ToolBadge name={tool} />
              {!isOpen && (
                <span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                  Löst
                </span>
              )}
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
