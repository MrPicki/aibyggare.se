"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { titleForLevel } from "@/lib/xp/levels";

interface LevelUpBurstProps {
  level: number;
  previousLevel?: number;
  onDone: () => void;
}

// Motiverande copy per nivå. Level 1 är speciellt — "inte längre en nolla".
function copyFor(level: number): { kicker: string; headline: string; motivation: string } {
  if (level === 1) {
    return {
      kicker: "Du är inte en nolla längre",
      headline: "Grattis!",
      motivation:
        "Du är officiellt igång på byggbänken. Lägg upp fler byggen, ställ frågor och hjälp andra — varje handling ger Byggkraft och tar dig vidare.",
    };
  }
  return {
    kicker: "Level up!",
    headline: "Snyggt jobbat!",
    motivation:
      "Du klättrar. Fortsätt bygga, dela och hjälp till — nästa level är närmare än du tror.",
  };
}

// Retro-firande när användaren går upp i level. Mätaren fylls ut, siffran
// "kommer fram" med pop, pixelgnistor sprutar. Stänger sig själv efter ~4 s.
export function LevelUpBurst({ level, previousLevel = level - 1, onDone }: LevelUpBurstProps) {
  const reduce = useReducedMotion();
  const { kicker, headline, motivation } = copyFor(level);

  useEffect(() => {
    const t = setTimeout(onDone, 4500);
    return () => clearTimeout(t);
  }, [onDone]);

  const sparks = Array.from({ length: reduce ? 0 : 20 });

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDone}
      >
        <motion.div
          className="chunky relative w-full max-w-sm overflow-hidden rounded-3xl bg-paper p-8 text-center"
          initial={reduce ? { scale: 1 } : { scale: 0.7, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 16 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Retro scanline-textur i toppen */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-[0.08]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, var(--ink) 0, var(--ink) 1px, transparent 1px, transparent 4px)",
            }}
            aria-hidden
          />

          <span className="sticker relative mb-5 inline-flex bg-hammer-yellow px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-ink">
            {kicker}
          </span>

          {/* Siffran som "kommer fram" — med gnistor bakom */}
          <div className="relative mx-auto mb-5 flex h-32 w-32 items-center justify-center">
            {/* Gnistor */}
            {sparks.map((_, i) => {
              const angle = (i / sparks.length) * Math.PI * 2;
              const dist = 90 + (i % 3) * 14;
              return (
                <motion.span
                  key={i}
                  className="absolute h-2 w-2"
                  style={{
                    backgroundColor:
                      i % 4 === 0
                        ? "var(--hammer-yellow)"
                        : i % 4 === 1
                        ? "var(--build-green)"
                        : i % 4 === 2
                        ? "var(--warning-orange)"
                        : "var(--prompt-purple)",
                  }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 1 }}
                  animate={{
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    opacity: [0, 1, 0],
                    scale: [1, 1.3, 0.4],
                  }}
                  transition={{ duration: 1.1, delay: 0.45, ease: "easeOut" }}
                />
              );
            })}

            {/* Ring bakom siffran */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-ink"
              style={{ background: "linear-gradient(135deg, var(--hammer-yellow), var(--build-green))" }}
              initial={reduce ? { scale: 1 } : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
            />

            {/* Gamla siffran tonar bort, nya "kommer fram" */}
            {!reduce && (
              <motion.span
                className="absolute font-display text-6xl font-bold text-ink/30"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 0.5, y: -10 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {previousLevel}
              </motion.span>
            )}
            <motion.span
              className="relative font-display text-7xl font-bold text-ink"
              initial={reduce ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 12, delay: 0.45 }}
            >
              {level}
            </motion.span>
          </div>

          <h2 className="font-display text-3xl font-bold text-ink">{headline}</h2>
          <p className="mt-1 font-display text-lg font-bold text-build-green">
            Level {level} — {titleForLevel(level)}
          </p>

          {/* Mätaren som fylls ut */}
          <div className="relative mx-auto mt-5 h-6 w-full overflow-hidden rounded-full border-2 border-ink bg-cream shadow-[2px_2px_0_0_var(--ink)]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, var(--hammer-yellow), var(--build-green))" }}
              initial={reduce ? { width: "100%" } : { width: "70%" }}
              animate={{ width: "100%" }}
              transition={reduce ? { duration: 0 } : { duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-[11px] font-bold text-ink drop-shadow-[0_1px_0_var(--paper)]">
                LEVEL {level} LÅST UPP
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-mud">{motivation}</p>

          <button
            onClick={onDone}
            className="chunky-sm pressable mt-5 w-full rounded-xl bg-build-green py-2.5 font-mono text-xs font-bold uppercase tracking-wide text-paper"
          >
            Kör vidare →
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
