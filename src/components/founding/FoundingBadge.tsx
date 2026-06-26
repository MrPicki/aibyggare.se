import { Star } from "lucide-react";
import { FOUNDING_BADGE_ENABLED } from "@/lib/founding";

interface FoundingBadgeProps {
  /** Visa inget om användaren inte är founding member. */
  show: boolean;
  /** sm = hörnstämpel på avatar. md = fristående pill bredvid namn. */
  size?: "sm" | "md";
  className?: string;
}

// Distinkt guld-stämpel för Founding Members (de N första registrerade).
// Tydligt skild från den runda LevelBadge-siffran. Döljs globalt om
// FOUNDING_BADGE_ENABLED = false.
export function FoundingBadge({ show, size = "sm", className }: FoundingBadgeProps) {
  if (!show || !FOUNDING_BADGE_ENABLED) return null;

  if (size === "md") {
    return (
      <span
        title="Founding Member — en av de första 30 byggarna"
        className={`inline-flex items-center gap-1 rounded-lg border-2 border-ink bg-hammer-yellow px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-ink shadow-[2px_2px_0_0_var(--ink)] ${className ?? ""}`}
      >
        <Star size={11} className="fill-ink" /> Founding
      </span>
    );
  }

  return (
    <span
      title="Founding Member — en av de första 30 byggarna"
      aria-label="Founding Member"
      className={`inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink bg-hammer-yellow shadow-[1.5px_1.5px_0_0_var(--ink)] ${className ?? ""}`}
      style={{ transform: "rotate(-10deg)" }}
    >
      <Star size={11} className="fill-ink text-ink" />
    </span>
  );
}
