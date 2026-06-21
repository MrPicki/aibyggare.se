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

const statusTopColor: Record<ProjectStatus, string> = {
  idea:       "#D8CFBE",
  mvp:        "#3B7DD8",
  live:       "#9FBE5A",
  feedback:   "#E8722A",
  testers:    "#A78BFA",
  cofounder:  "#F472B6",
};

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
      <article
        className="h-full rounded-xl border border-border bg-card p-5 shadow-sm shadow-border/40 transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-border/60 hover:-translate-y-0.5 border-t-[3px]"
        style={{ borderTopColor: statusTopColor[status] }}
      >
        {/* Status + title */}
        <div className="mb-3">
          <StatusPill status={status} className="mb-2" />
          <h3 className="font-heading font-semibold text-foreground group-hover:text-[#3D6B20] dark:group-hover:text-primary transition-colors leading-snug">
            {title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-snug">
            {tagline}
          </p>
        </div>

        {/* Stack */}
        {stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {stack.map((tool) => (
              <ToolBadge key={tool} name={tool} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-3 mt-auto">
          <span className="truncate max-w-32 font-medium">{authorName}</span>
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1">
              <MessageSquare size={11} />
              {commentCount}
            </span>
            <span className="flex items-center gap-1 font-semibold text-foreground/60">
              <ArrowUp size={11} />
              {upvotes}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
