"use client";

import { useState } from "react";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";
import {
  CodeBlocks,
  TerminalWindow,
  BrowserBrush,
  DatabaseStack,
  Rocket,
  BoltBlock,
  BugSticker,
  DecorativeBlob,
} from "@/components/brand/illustrations";

type Tool = {
  id: string;
  name: string;
  accent: string;
  text: string;
  Illustration: (p: { className?: string; size?: number }) => React.ReactElement;
};

const TOOLS: Tool[] = [
  { id: "claude", name: "Claude Code", accent: "var(--warning-orange)", text: "Bra på att bygga. Ännu bättre på att skriva om allt.", Illustration: CodeBlocks },
  { id: "cursor", name: "Cursor", accent: "var(--code-blue)", text: "Autocomplete som ibland läser dina tankar.", Illustration: TerminalWindow },
  { id: "lovable", name: "Lovable", accent: "var(--prompt-purple)", text: "Snyggt snabbt. Sedan börjar det riktiga jobbet.", Illustration: BrowserBrush },
  { id: "supabase", name: "Supabase", accent: "var(--supabase-green)", text: "Det var RLS. Det är alltid RLS.", Illustration: DatabaseStack },
  { id: "vercel", name: "Vercel", accent: "var(--ink)", text: "Deploy failed, men vi försöker igen.", Illustration: Rocket },
  { id: "bolt", name: "Bolt", accent: "var(--hammer-yellow)", text: "Noll till app innan kaffet kallnar.", Illustration: BoltBlock },
];

function ToolSwitcherCard() {
  const [active, setActive] = useState(0);
  const tool = TOOLS[active];
  const Illu = tool.Illustration;

  return (
    <div className="chunky relative rounded-3xl bg-paper p-5 sm:p-6">
      {/* Header-bar med accentfärg */}
      <div
        className="mb-5 flex items-center justify-between rounded-2xl border-2 border-ink px-4 py-2.5 transition-colors duration-300"
        style={{ backgroundColor: tool.accent }}
      >
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-ink">
          Välj din byggmaskin
        </span>
        <span aria-hidden className="flex gap-1">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-paper" />
          <span className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-paper" />
        </span>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="AI-verktyg">
        {TOOLS.map((t, i) => {
          const selected = i === active;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(i)}
              className="rounded-xl border-2 border-ink px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide transition-all duration-150"
              style={
                selected
                  ? { backgroundColor: t.accent, color: "var(--ink)", boxShadow: "2px 2px 0 0 var(--ink)" }
                  : { backgroundColor: "var(--paper)", color: "var(--mud)" }
              }
            >
              {t.name}
            </button>
          );
        })}
      </div>

      {/* Illustration + copy (byts med fade) */}
      <div
        className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-border p-6 text-center"
        style={{ backgroundColor: "color-mix(in srgb, " + tool.accent + " 12%, var(--paper))" }}
      >
        <div key={tool.id} className="reveal-up" style={{ color: tool.accent }}>
          <Illu size={92} />
        </div>
        <p key={tool.id + "-t"} className="reveal-up max-w-xs font-display text-lg font-semibold leading-snug text-ink">
          {tool.text}
        </p>
      </div>

      {/* Liten dekor-bugg i hörnet */}
      <span aria-hidden className="absolute -bottom-4 -right-3 rotate-12 text-bug-red">
        <BugSticker size={34} />
      </span>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Blueprint-rutnät */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(55,57,39,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(55,57,39,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Dekorblobbar */}
      <DecorativeBlob className="pointer-events-none absolute -left-24 top-10 h-72 w-72 opacity-40" color="var(--soft-teal)" />
      <DecorativeBlob className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 opacity-30" color="var(--hammer-yellow)" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:py-28">
        {/* Vänster */}
        <div>
          <Sticker tilt={-2} className="mb-5">
            <span className="h-2 w-2 rounded-[2px] bg-build-green" /> Svensk byggplats för AI-projekt
          </Sticker>

          <h1 className="font-display text-4xl font-bold leading-[1.02] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            För oss som bygger{" "}
            <span className="relative whitespace-nowrap text-build-green">först</span>{" "}
            och förstår{" "}
            <span className="relative inline-block">
              sen.
              <svg aria-hidden viewBox="0 0 120 12" className="absolute -bottom-2 left-0 w-full" preserveAspectRatio="none">
                <path d="M2 8c30-6 86-6 116 0" stroke="var(--hammer-yellow)" strokeWidth="5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-mud">
            AIbyggare.se är platsen för dig som bygger appar, webbsidor och digitala
            projekt med AI — med kod, prompts, envishet och ibland ren panik.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ChunkyLink href="/projects/new" variant="green" size="lg">
              Lägg upp mitt bygge
            </ChunkyLink>
            <ChunkyLink href="/help/new" variant="paper" size="lg">
              Jag har fastnat
            </ChunkyLink>
          </div>

          <p className="mt-5 font-mono text-xs uppercase tracking-wide text-mud">
            Halvfärdiga MVP:er · trasiga deploys · prompts som faktiskt funkade
          </p>
        </div>

        {/* Höger */}
        <div className="relative">
          <span aria-hidden className="absolute -left-3 -top-4 z-10 -rotate-12">
            <Sticker tilt={-8} className="bg-hammer-yellow">Nytt</Sticker>
          </span>
          <ToolSwitcherCard />
        </div>
      </div>
    </section>
  );
}
