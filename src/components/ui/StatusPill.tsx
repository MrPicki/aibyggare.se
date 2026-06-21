import { cn } from "@/lib/utils";

export type ProjectStatus = "idea" | "mvp" | "live" | "feedback" | "testers" | "cofounder";
export type PostStatus = "open" | "solved" | "archived";
export type AnyStatus = ProjectStatus | PostStatus;

const statusConfig: Record<AnyStatus, { label: string; className: string }> = {
  idea: {
    label: "Idé",
    className: "bg-muted text-muted-foreground border border-border",
  },
  mvp: {
    label: "Hackig MVP",
    className: "bg-[#263B4A]/10 text-[#263B4A] border border-[#263B4A]/20 dark:bg-blue-950/40 dark:text-blue-300",
  },
  live: {
    label: "Live men nervös",
    className: "bg-primary/12 text-[#3D6B20] border border-primary/25 dark:bg-primary/15 dark:text-primary",
  },
  feedback: {
    label: "Behöver feedback",
    className: "bg-[#F2A65A]/12 text-[#8B4F10] border border-[#F2A65A]/25 dark:bg-[#F2A65A]/15 dark:text-[#F2A65A]",
  },
  testers: {
    label: "Behöver testare",
    className: "bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300",
  },
  cofounder: {
    label: "Söker medgrundare",
    className: "bg-pink-100 text-pink-700 border border-pink-200 dark:bg-pink-950/40 dark:text-pink-300",
  },
  open: {
    label: "Öppen",
    className: "bg-primary/12 text-[#3D6B20] border border-primary/25 dark:bg-primary/15 dark:text-primary",
  },
  solved: {
    label: "Löst",
    className: "bg-muted text-muted-foreground border border-border",
  },
  archived: {
    label: "Arkiverad",
    className: "bg-muted text-muted-foreground border border-border",
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
