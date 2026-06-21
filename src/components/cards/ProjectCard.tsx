import Link from "next/link";
import { ArrowUp, MessageSquare } from "lucide-react";
import { StatusPill, type ProjectStatus } from "@/components/ui/StatusPill";
import { ToolBadge } from "@/components/ui/ToolBadge";

interface ProjectCardProps {
  title: string;
  tagline: string;
  slug: string;
  status: ProjectStatus;
  stack: string[];
  upvotes: number;
  commentCount: number;
  authorName: string;
  authorUsername: string;
}

export function ProjectCard({
  title,
  tagline,
  slug,
  status,
  stack,
  upvotes,
  commentCount,
  authorName,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className="group block">
      <article className="h-full rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/50 hover:shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-[#2A5C1E] dark:group-hover:text-primary transition-colors truncate">
              {title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-snug">
              {tagline}
            </p>
          </div>
          <StatusPill status={status} className="shrink-0 mt-0.5" />
        </div>

        {/* Stack badges */}
        {stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {stack.map((tool) => (
              <ToolBadge key={tool} name={tool} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-1">
          <span className="text-xs truncate max-w-28">{authorName}</span>
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1 text-xs">
              <MessageSquare size={12} />
              {commentCount}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-foreground/70">
              <ArrowUp size={12} />
              {upvotes}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
