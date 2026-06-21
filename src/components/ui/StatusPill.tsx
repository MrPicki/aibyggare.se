import { cn } from "@/lib/utils";

export type ProjectStatus = "idea" | "mvp" | "live" | "feedback" | "testers" | "cofounder";
export type PostStatus = "open" | "solved" | "archived";
export type AnyStatus = ProjectStatus | PostStatus;

const statusConfig: Record<AnyStatus, { label: string; className: string }> = {
  idea: {
    label: "Idé",
    className: "bg-muted text-muted-foreground",
  },
  mvp: {
    label: "MVP",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  },
  live: {
    label: "Live",
    className:
      "bg-primary/15 text-[#2A5C1E] dark:bg-primary/20 dark:text-primary",
  },
  feedback: {
    label: "Söker feedback",
    className:
      "bg-[#E79D45]/15 text-[#7A4E0A] dark:bg-[#E79D45]/20 dark:text-[#E79D45]",
  },
  testers: {
    label: "Behöver testare",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
  },
  cofounder: {
    label: "Söker medgrundare",
    className:
      "bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300",
  },
  open: {
    label: "Öppen",
    className:
      "bg-primary/15 text-[#2A5C1E] dark:bg-primary/20 dark:text-primary",
  },
  solved: {
    label: "Löst",
    className: "bg-muted text-muted-foreground",
  },
  archived: {
    label: "Arkiverad",
    className: "bg-muted text-muted-foreground",
  },
};

interface StatusPillProps {
  status: AnyStatus;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
