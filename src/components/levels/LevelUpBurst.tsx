"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { titleForLevel } from "@/lib/xp/levels";

interface LevelUpBurstProps {
  level: number;
  onDone: () => void;
}

// Fullskärms-firande när användaren går upp i level. Pixliga gnistor + chunky
// kort. Stänger sig själv efter ~3 s. Respekterar prefers-reduced-motion.
export function LevelUpBurst({ level, onDone }: LevelUpBurstProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  const sparks = Array.from({ length: reduce ? 0 : 14 });

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDone}
      >
        <motion.div
          className="chunky relative max-w-sm rounded-3xl bg-paper p-8 text-center"
          initial={reduce ? { scale: 1 } : { scale: 0.6, rotate: -4 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 14 }}
        >
          {/* Pixliga gnistor */}
          {sparks.map((_, i) => {
            const angle = (i / sparks.length) * Math.PI * 2;
            return (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 h-2 w-2"
                style={{
                  backgroundColor:
                    i % 3 === 0
                      ? "var(--hammer-yellow)"
                      : i % 3 === 1
                      ? "var(--build-green)"
                      : "var(--warning-orange)",
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos(angle) * 130,
                  y: Math.sin(angle) * 130,
                  opacity: 0,
                  scale: 0.5,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            );
          })}

          <span className="sticker mb-4 inline-flex bg-hammer-yellow px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-ink">
            Level up!
          </span>
          <p className="font-display text-5xl font-bold text-ink">LVL {level}</p>
          <p className="mt-3 font-display text-xl font-bold text-build-green">
            {titleForLevel(level)}
          </p>
          <p className="mt-2 text-sm text-mud">
            Din byggare klättrar. Fortsätt bygga, fråga och hjälp till.
          </p>
          <button
            onClick={onDone}
            className="chunky-sm pressable mt-5 rounded-xl bg-build-green px-5 py-2 font-mono text-xs font-bold uppercase tracking-wide text-paper"
          >
            Nice →
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
