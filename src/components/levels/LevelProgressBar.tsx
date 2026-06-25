"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { levelProgress } from "@/lib/xp/levels";

interface LevelProgressBarProps {
  /** Profilägarens uid — används för att avgöra om baren är "din". */
  ownerUid: string;
  /** Serverlagrad totalXp (fallback om ej din egen profil). */
  totalXp: number;
}

// Progress-bar mot nästa level. På din EGEN profil låses den till ditt
// inloggade konto och uppdateras live från AuthContext; på andras profiler
// visas deras lagrade XP statiskt.
export function LevelProgressBar({ ownerUid, totalXp }: LevelProgressBarProps) {
  const reduce = useReducedMotion();
  const { user, profile } = useAuth();

  const isOwn = !!user && user.uid === ownerUid;
  const xp = isOwn && profile ? profile.totalXp : totalXp;
  const p = levelProgress(xp);

  return (
    <div className="chunky rounded-2xl bg-paper p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="font-display text-lg font-bold text-ink">
            Level {p.level}
            <span className="ml-2 font-mono text-xs font-normal text-mud">{p.title}</span>
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-mud">
          {p.isMaxLevel ? "MAX" : `${p.xpToNext} kvar`}
        </span>
      </div>

      <div className="relative h-6 w-full overflow-hidden rounded-full border-2 border-ink bg-cream shadow-[2px_2px_0_0_var(--ink)]">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, var(--hammer-yellow) 0%, var(--build-green) 100%)",
          }}
          initial={false}
          animate={{ width: `${p.ratio * 100}%` }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 18 }}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[11px] font-bold text-ink drop-shadow-[0_1px_0_var(--paper)]">
            {p.isMaxLevel
              ? `${xp} Byggkraft`
              : `${p.xpIntoLevel}/${p.xpForThisLevel} mot LVL ${p.level + 1}`}
          </span>
        </div>
      </div>

      {isOwn && !p.isMaxLevel && (
        <p className="mt-2 font-mono text-[11px] text-mud">
          Lägg upp byggen, ställ frågor och hjälp andra för mer Byggkraft.
        </p>
      )}
    </div>
  );
}
