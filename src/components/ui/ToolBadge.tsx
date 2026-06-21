import { cn } from "@/lib/utils";

const toolDot: Record<string, string> = {
  "Claude Code":  "#D97706",
  "Claude AI":    "#D97706",
  "Cursor":       "#6366F1",
  "Supabase":     "#3ECF8E",
  "Vercel":       "#1a1a1a",
  "Firebase":     "#FFCA28",
  "Next.js":      "#1a1a1a",
  "Lovable":      "#EC4899",
  "Bolt":         "#8B5CF6",
  "Replit":       "#F97316",
  "Stripe":       "#635BFF",
  "GitHub":       "#24292E",
  "TypeScript":   "#3178C6",
  "React":        "#61DAFB",
};

interface ToolBadgeProps {
  name: string;
  className?: string;
  size?: "sm" | "md";
}

export function ToolBadge({ name, className, size = "sm" }: ToolBadgeProps) {
  const dot = toolDot[name];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono font-medium bg-card border border-border text-muted-foreground rounded-md transition-colors hover:border-primary/40 hover:text-foreground",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-2.5 py-1 text-sm",
        className
      )}
    >
      {dot && (
        <span
          aria-hidden
          className="shrink-0 rounded-[2px]"
          style={{
            width: size === "md" ? 7 : 6,
            height: size === "md" ? 7 : 6,
            backgroundColor: dot,
          }}
        />
      )}
      {name}
    </span>
  );
}
