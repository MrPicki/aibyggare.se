"use client";

import { useState } from "react";
import { Hammer, LifeBuoy, Sparkles, Users } from "lucide-react";

const TABS = [
  {
    id: "visa",
    label: "Visa byggen",
    accent: "var(--build-green)",
    Icon: Hammer,
    text: "Lägg upp projektet du bygger, även om det bara funkar när månen står rätt.",
  },
  {
    id: "hjalp",
    label: "Få hjälp",
    accent: "var(--warning-orange)",
    Icon: LifeBuoy,
    text: "Beskriv vad du försökte göra, vad som gick fel och vad du redan testat.",
  },
  {
    id: "prompts",
    label: "Dela prompts",
    accent: "var(--prompt-purple)",
    Icon: Sparkles,
    text: "Dela prompten som faktiskt räddade din kväll.",
  },
  {
    id: "byggare",
    label: "Hitta byggare",
    accent: "var(--code-blue)",
    Icon: Users,
    text: "Följ andra som bygger med samma verktyg, problem och envishet.",
  },
];

export function TabStrip() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];
  const Icon = tab.Icon;

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <h2 className="mb-6 text-center font-mono text-xs font-bold uppercase tracking-widest text-mud">
        Vad gör man här?
      </h2>

      <div className="mb-8 flex flex-wrap justify-center gap-2.5" role="tablist">
        {TABS.map((t, i) => {
          const selected = i === active;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(i)}
              className="rounded-2xl border-2 border-ink px-4 py-2 font-mono text-sm font-semibold uppercase tracking-wide transition-all duration-150"
              style={
                selected
                  ? { backgroundColor: t.accent, color: "var(--ink)", boxShadow: "3px 3px 0 0 var(--ink)" }
                  : { backgroundColor: "var(--paper)", color: "var(--mud)" }
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div
        key={tab.id}
        className="chunky reveal-up mx-auto flex max-w-2xl items-center gap-5 rounded-3xl bg-paper p-6 sm:p-8"
      >
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-ink text-ink"
          style={{ backgroundColor: tab.accent }}
        >
          <Icon size={26} />
        </span>
        <p className="font-display text-xl font-semibold leading-snug text-ink sm:text-2xl">
          {tab.text}
        </p>
      </div>
    </section>
  );
}
