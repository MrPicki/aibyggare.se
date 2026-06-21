import { cn } from "@/lib/utils";

interface ToolBadgeProps {
  name: string;
  className?: string;
}

export function ToolBadge({ name, className }: ToolBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs font-mono text-muted-foreground bg-background-alt hover:border-primary/40 transition-colors",
        className
      )}
    >
      {name}
    </span>
  );
}
