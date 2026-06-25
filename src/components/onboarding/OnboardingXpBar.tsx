"use client";

import { motion, useReducedMotion } from "framer-motion";

interface OnboardingXpBarProps {
  /** Aktuell XP (0–targetXp). */
  xp: number;
  /** XP som krävs för nästa level (100 för Level 1). */
  targetXp?: number;
  leftLabel?: string;
  rightLabel?: string;
}

// Retro "Byggkraft"-mätare. Chunky kant, hard shadow, gul→grön fyllning med
// pixliga gnistor. Ingen tunn SaaS-bar. Animeras mjukt när xp ändras.
export function OnboardingXpBar({
  xp,
  targetXp = 100,
  leftLabel = "LVL 0",
  rightLabel = "LVL 1",
}: OnboardingXpBarProps) {
  const reduce = useReducedMotion();
  const clamped = Math.max(0, Math.min(targetXp, xp));
  const ratio = clamped / targetXp;

  return (
    <div className="w-full">
      {/* Level-etiketter */}
      <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-widest text-mud">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>

      {/* Bar */}
      <div className="relative h-7 w-full overflow-hidden rounded-full border-2 border-ink bg-cream shadow-[3px_3px_0_0_var(--ink)]">
        <motion.div
          className="relative h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--hammer-yellow) 0%, var(--build-green) 100%)",
          }}
          initial={false}
          animate={{ width: `${ratio * 100}%` }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 120, damping: 18 }
          }
        >
          {/* Pixliga gnistor vid kanten */}
          {!reduce && ratio > 0 && ratio < 1 && (
            <span className="absolute right-1 top-1/2 flex -translate-y-1/2 gap-0.5">
              <motion.span
                className="h-1 w-1 bg-paper"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
              <motion.span
                className="h-1 w-1 bg-paper"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
            </span>
          )}
        </motion.div>

        {/* XP-text centrerad ovanpå */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-xs font-bold text-ink drop-shadow-[0_1px_0_var(--paper)]">
            {clamped}/{targetXp} Byggkraft
          </span>
        </div>
      </div>
    </div>
  );
}
