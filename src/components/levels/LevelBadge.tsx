import { titleForLevel } from "@/lib/xp/levels";

// Liten level-siffra som visas bredvid/på en avatar överallt namn syns.
// Ren komponent (inga hooks) → kan renderas server- som client-side.

function tierColor(level: number): { bg: string; text: string } {
  if (level >= 10) return { bg: "var(--prompt-purple)", text: "var(--paper)" };
  if (level >= 7)  return { bg: "var(--warning-orange)", text: "var(--ink)" };
  if (level >= 4)  return { bg: "var(--hammer-yellow)", text: "var(--ink)" };
  if (level >= 1)  return { bg: "var(--build-green)", text: "var(--paper)" };
  return { bg: "var(--cream)", text: "var(--mud)" };
}

interface LevelBadgeProps {
  level: number;
  /** sm = kompakt sifferpuck bredvid liten avatar. md = pill med "LVL". */
  size?: "sm" | "md";
  className?: string;
}

export function LevelBadge({ level, size = "sm", className }: LevelBadgeProps) {
  const { bg, text } = tierColor(level);

  if (size === "md") {
    return (
      <span
        title={`Level ${level} — ${titleForLevel(level)}`}
        className={`inline-flex items-center gap-1 rounded-lg border-2 border-ink px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wide shadow-[2px_2px_0_0_var(--ink)] ${className ?? ""}`}
        style={{ backgroundColor: bg, color: text }}
      >
        LVL {level}
      </span>
    );
  }

  return (
    <span
      title={`Level ${level} — ${titleForLevel(level)}`}
      aria-label={`Level ${level}`}
      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-ink px-1 font-mono text-[10px] font-bold leading-none ${className ?? ""}`}
      style={{ backgroundColor: bg, color: text }}
    >
      {level}
    </span>
  );
}
