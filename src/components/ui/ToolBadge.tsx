import { cn } from "@/lib/utils";

interface ToolBadgeProps {
  name: string;
  className?: string;
  size?: "sm" | "md";
}

export function ToolBadge({ name, className, size = "sm" }: ToolBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono font-medium bg-background-alt border border-border text-muted-foreground rounded-md transition-colors hover:border-primary/40 hover:text-foreground",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-2.5 py-1 text-sm",
        className
      )}
    >
      {name}
    </span>
  );
}
