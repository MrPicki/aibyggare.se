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
  mood?: string;
}

export function HelpCard({
  title,
  slug,
  tool,
  answerCount,
  timeAgo,
  isOpen = true,
  mood,
}: HelpCardProps) {
  return (
    <Link href={`/help/${slug}`} className="group block">
      <article className="h-full rounded-xl border border-border bg-card p-5 shadow-sm shadow-border/40 transition-all duration-200 hover:border-[#E8722A]/50 hover:shadow-md hover:shadow-border/60 hover:-translate-y-0.5 border-t-[3px] border-t-[#E8722A]/60">
        <div className="flex gap-3.5">

          {/* Svar-indikator */}
          <div
            className={[
              "shrink-0 flex flex-col items-center justify-center w-11 h-11 rounded-lg text-xs font-semibold gap-0.5",
              answerCount > 0
                ? "bg-primary/12 text-[#3D6B20] border border-primary/20"
                : "bg-[#E8722A]/10 text-[#8B4F10] border border-[#E8722A]/25",
            ].join(" ")}
          >
            <MessageSquare size={13} />
            <span>{answerCount}</span>
          </div>

          <div className="min-w-0 flex-1">
            {mood && (
              <span className="inline-block text-[10px] font-semibold tracking-wide uppercase text-[#8B4F10] bg-[#E8722A]/10 border border-[#E8722A]/20 rounded px-1.5 py-0.5 mb-1.5">
                {mood}
              </span>
            )}
            <h3 className="font-medium text-sm text-foreground group-hover:text-[#3D6B20] transition-colors line-clamp-2 leading-snug">
              {title}
            </h3>
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              <ToolBadge name={tool} />
              {!isOpen && (
                <span className="text-xs bg-primary/10 text-[#3D6B20] border border-primary/20 rounded-full px-2 py-0.5 font-medium">
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
