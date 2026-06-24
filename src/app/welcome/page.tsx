"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Hammer, HelpCircle, Sparkles, Users, LayoutGrid, X, ArrowRight } from "lucide-react";
import { ChunkyLink } from "@/components/ui/ChunkyButton";

// ── Tour cards ─────────────────────────────────────────────────────────────────

const TOUR = [
  {
    id: "projects",
    accent: "var(--hammer-yellow)",
    Icon: Hammer,
    label: "Projekt",
    title: "Visa upp vad du bygger",
    body: "Lägg upp ditt projekt — vad det är, hur du byggde det och vilken feedback du söker. Communityn ger borrar (upvotes) på det de gillar.",
  },
  {
    id: "problemhornan",
    accent: "var(--build-green)",
    Icon: HelpCircle,
    label: "Problemhörnan",
    title: "Fastnat? Fråga communityn",
    body: "Beskriv vad du försöker göra och vad som gick fel. Någon har nästan alltid stött på exakt samma sak — och är redo att hjälpa.",
  },
  {
    id: "prompts",
    accent: "#c4b5fd",
    Icon: Sparkles,
    label: "Prompts",
    title: "Dela prompts som faktiskt funkar",
    body: "Har du en prompt som räddat dig från en Claude-spiral? Dela den. Den kanske räddar nästa byggare en timmes huvudvärk.",
  },
  {
    id: "community",
    accent: "var(--cream)",
    Icon: Users,
    label: "Community",
    title: "Hitta andra byggare",
    body: "Utforska profiler, se vad folk bygger och koppla ihop dig med dem som kör samma stack. Du är inte ensam i det här.",
  },
  {
    id: "profile",
    accent: "var(--hammer-yellow)",
    Icon: LayoutGrid,
    label: "Profil",
    title: "Din profil är din bas",
    body: "Allt du bygger, hjälper med och delar samlas på din profil. Det är din byggarpresentation — visa den stolt.",
  },
] as const;

// ── Card rotations — natural-looking stack offset per position ─────────────────
const STACK_ROTATIONS = [0, 1.5, -1.2, 2, -0.8];

// ── Main page ─────────────────────────────────────────────────────────────────

export default function WelcomePage() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const done = step >= TOUR.length;

  function next() {
    setStep((s) => s + 1);
  }

  if (done) {
    return <ActionPrompt />;
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-16 bg-paper">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="sticker inline-flex bg-hammer-yellow px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-ink mb-3">
          Välkommen till AIbyggare.se
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
          Här är hur det funkar
        </h1>
        <p className="mt-1 text-mud text-sm">
          {step + 1} av {TOUR.length}
        </p>
      </div>

      {/* Card stack */}
      <div className="relative w-full max-w-sm" style={{ height: 340 }}>
        {TOUR.map((card, i) => {
          const pos = i - step;
          // Only render current + 2 queued + 1 just-exited
          if (pos < -1 || pos > 2) return null;

          const isActive = pos === 0;
          const rotation = STACK_ROTATIONS[Math.max(0, pos)] ?? 0;

          return (
            <motion.div
              key={card.id}
              className="absolute inset-0 chunky overflow-hidden rounded-3xl bg-paper"
              style={{ transformOrigin: "bottom center" }}
              initial={false}
              animate={{
                scale: isActive ? 1 : pos === 1 ? 0.95 : 0.90,
                y: isActive ? 0 : pos === 1 ? 14 : 28,
                rotate: isActive ? 0 : rotation,
                zIndex: pos < 0 ? 0 : 10 - pos,
                opacity: pos < 0 ? 0 : 1,
              }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              {/* Accent header */}
              <div
                className="flex items-center gap-2 border-b-2 border-ink px-5 py-3"
                style={{ backgroundColor: card.accent }}
              >
                <card.Icon size={15} className="shrink-0 text-ink" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink">
                  {card.label}
                </span>
              </div>

              {/* Body */}
              <div className="p-7 sm:p-8">
                <h2 className="font-display text-xl font-bold leading-snug text-ink sm:text-2xl">
                  {card.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-mud">{card.body}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress dots */}
      <div className="mt-8 flex gap-2">
        {TOUR.map((_, i) => (
          <div
            key={i}
            className={[
              "h-2 rounded-full transition-all duration-300",
              i < step
                ? "w-2 bg-ink/30"
                : i === step
                ? "w-5 bg-ink"
                : "w-2 bg-ink/20",
            ].join(" ")}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          onClick={next}
          className="chunky pressable inline-flex items-center gap-2 rounded-xl bg-ink px-8 py-3 font-mono text-sm font-bold uppercase tracking-wide text-paper"
        >
          {step === TOUR.length - 1 ? "Kom igång" : "Nästa"}
          <ArrowRight size={15} />
        </button>
        <Link
          href="/"
          className="font-mono text-xs text-mud hover:text-ink transition-colors"
        >
          Hoppa över guiden
        </Link>
      </div>
    </div>
  );
}

// ── Final action prompt ────────────────────────────────────────────────────────

function ActionPrompt() {
  return (
    <AnimatePresence>
      <motion.div
        key="action"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-16 bg-paper"
      >
        <div className="relative w-full max-w-sm">
          {/* Dismiss link */}
          <Link
            href="/"
            aria-label="Stäng"
            className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-paper text-ink hover:bg-cream transition-colors z-10"
          >
            <X size={14} />
          </Link>

          <div className="chunky overflow-hidden rounded-3xl bg-paper">
            {/* Header */}
            <div className="border-b-2 border-ink bg-hammer-yellow px-5 py-3">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink">
                Bra jobbat! Profilen är klar.
              </span>
            </div>

            <div className="p-7 sm:p-8">
              <h2 className="font-display text-2xl font-bold leading-snug text-ink">
                Vad vill du göra nu?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-mud">
                Välj ett, eller utforska på egen hand — du hittar allt i menyn.
              </p>

              <div className="mt-7 flex flex-col gap-3">
                <ChunkyLink href="/projects/new" variant="yellow" className="w-full justify-center">
                  Lägg upp mitt bygge
                </ChunkyLink>
                <ChunkyLink href="/problemhornan/new" variant="paper" className="w-full justify-center">
                  Jag har fastnat — behöver hjälp
                </ChunkyLink>
              </div>

              <div className="mt-5 text-center">
                <Link
                  href="/"
                  className="font-mono text-xs text-mud underline underline-offset-2 hover:text-ink transition-colors"
                >
                  Utforska på egen hand →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
