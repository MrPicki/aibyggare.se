"use client";

import { useState } from "react";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { BugSticker } from "@/components/brand/illustrations";

const TOPICS: Record<string, string> = {
  Allmänt: "Det är okej. Alla fastnar. Skillnaden är att du inte behöver börja om från noll varje gång.",
  Supabase: "RLS, policies, auth och tabeller. En klassisk plats att förlora två timmar.",
  Vercel: "Deploy failed. Environment variables. Build error. Du är inte ensam.",
  Auth: "Sessionen försvinner vid reload, tokens som inte vill samarbeta. Vi har alla varit där.",
  CSS: "Den där diven som vägrar centreras. Klassiskt. Beskriv vad du försökt.",
  Claude: "När AI:n löser ett problem och skapar tre nya. Visa diffen så hjälps vi åt.",
  Stripe: "Webhooks, test- vs live-nycklar och belopp i ören. Lätt att snubbla.",
  Databas: "Schema, relationer och migrationer som inte vill köra. Beskriv din struktur.",
};

const LABELS = Object.keys(TOPICS).filter((t) => t !== "Allmänt");

export function StuckBanner() {
  const [active, setActive] = useState<string>("Allmänt");

  return (
    <section className="relative overflow-hidden border-y-2 border-ink bg-hammer-yellow px-4 py-16 sm:px-6 sm:py-24">
      <span aria-hidden className="absolute right-6 top-8 rotate-12 text-bug-red opacity-80">
        <BugSticker size={48} />
      </span>
      <span aria-hidden className="absolute bottom-10 left-10 -rotate-12 text-ink/15">
        <BugSticker size={64} />
      </span>

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-display text-6xl font-bold tracking-tight text-ink text-outline sm:text-7xl md:text-8xl">
          FASTNAT?
        </h2>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {LABELS.map((label) => {
            const selected = active === label;
            return (
              <button
                key={label}
                onClick={() => setActive(selected ? "Allmänt" : label)}
                aria-pressed={selected}
                className="rounded-xl border-2 border-ink px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wide transition-all duration-150"
                style={
                  selected
                    ? { backgroundColor: "var(--ink)", color: "var(--hammer-yellow)", boxShadow: "2px 2px 0 0 rgba(0,0,0,0.25)" }
                    : { backgroundColor: "var(--paper)", color: "var(--ink)" }
                }
              >
                {label}
              </button>
            );
          })}
        </div>

        <p key={active} className="reveal-up mx-auto mt-8 max-w-xl text-lg font-medium leading-relaxed text-ink">
          {TOPICS[active]}
        </p>

        <div className="mt-8 flex justify-center">
          <ChunkyLink href="/help/new" variant="ink" size="lg">
            Ställ en fråga
          </ChunkyLink>
        </div>
      </div>
    </section>
  );
}
