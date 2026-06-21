import Link from "next/link";
import { Bookmark } from "lucide-react";
import { ToolBadge } from "@/components/ui/ToolBadge";

interface PromptCardProps {
  title: string;
  slug: string;
  tool: string;
  saves: number;
  timeAgo: string;
  excerpt: string;
}

export function PromptCard({
  title,
  slug,
  tool,
  saves,
  timeAgo,
  excerpt,
}: PromptCardProps) {
  return (
    <Link href={`/prompts/${slug}`} className="group block">
      <article className="h-full rounded-xl border border-border bg-card p-5 shadow-sm shadow-border/40 transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-border/60 hover:-translate-y-0.5">

        <h3 className="font-medium text-sm text-foreground group-hover:text-[#3D6B20] dark:group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
          {title}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
          {excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-3">
          <div className="flex items-center gap-2">
            <ToolBadge name={tool} />
            <span>{timeAgo}</span>
          </div>
          <span className="flex items-center gap-1 font-semibold text-foreground/60 shrink-0">
            <Bookmark size={11} />
            {saves}
          </span>
        </div>
      </article>
    </Link>
  );
}
