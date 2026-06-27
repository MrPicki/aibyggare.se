import { ShieldCheck } from "lucide-react";

interface AdminBadgeProps {
  /** sm = hörnikon på avatar-container. md = pill bredvid namn. */
  size?: "sm" | "md";
  className?: string;
}

export function AdminBadge({ size = "sm", className }: AdminBadgeProps) {
  if (size === "md") {
    return (
      <span
        title="Admin / Moderator"
        className={`inline-flex items-center gap-1 rounded-lg border-2 border-ink bg-build-green px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-paper shadow-[2px_2px_0_0_var(--ink)] ${className ?? ""}`}
      >
        <ShieldCheck size={11} /> Admin
      </span>
    );
  }

  return (
    <span
      title="Admin / Moderator"
      aria-label="Admin"
      className={`inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink bg-build-green shadow-[1.5px_1.5px_0_0_var(--ink)] ${className ?? ""}`}
    >
      <ShieldCheck size={11} className="text-paper" />
    </span>
  );
}
