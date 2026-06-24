"use client";

import { useState } from "react";
import { HelpCard } from "@/components/cards/HelpCard";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import type { HelpQuestion } from "@/lib/seed";

const TOOL_FILTERS = [
  "Claude",
  "ChatGPT",
  "Cursor",
  "v0",
  "Bolt",
  "Replit",
  "Lovable",
  "Vercel",
  "Supabase",
  "Stripe",
  "Annat",
];

type StatusFilter = "all" | "open" | "solved";

interface HelpFilterListProps {
  posts: HelpQuestion[];
}

export function HelpFilterList({ posts }: HelpFilterListProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [toolFilter, setToolFilter] = useState<string | null>(null);

  const filtered = posts.filter((q) => {
    if (statusFilter === "open" && q.status !== "Öppen") return false;
    if (statusFilter === "solved" && q.status !== "Löst") return false;
    if (toolFilter) {
      const matchesTopic = q.topic
        .toLowerCase()
        .includes(toolFilter.toLowerCase());
      const matchesTools = q.tools?.some((t) =>
        t.toLowerCase().includes(toolFilter.toLowerCase())
      );
      if (!matchesTopic && !matchesTools) return false;
    }
    return true;
  });

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-8 flex flex-wrap gap-3">
        {/* Status */}
        <div className="flex gap-1.5 rounded-2xl border-2 border-ink bg-paper p-1">
          {(
            [
              { key: "all", label: "Alla" },
              { key: "open", label: "Öppna" },
              { key: "solved", label: "Lösta" },
            ] as { key: StatusFilter; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={[
                "rounded-xl px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wide transition-all",
                statusFilter === key
                  ? "bg-ink text-paper shadow-none"
                  : "text-mud hover:text-ink",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tool filter chips */}
        <div className="flex flex-wrap gap-1.5">
          {TOOL_FILTERS.map((tool) => (
            <button
              key={tool}
              onClick={() => setToolFilter(toolFilter === tool ? null : tool)}
              className={[
                "rounded-xl border-2 border-ink px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide transition-all",
                toolFilter === tool
                  ? "bg-hammer-yellow text-ink shadow-[2px_2px_0_0_var(--ink)]"
                  : "bg-paper text-mud hover:bg-cream hover:text-ink",
              ].join(" ")}
            >
              {tool}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((q) => (
            <HelpCard key={q.slug} {...q} />
          ))}
        </div>
      ) : (
        <div className="chunky rounded-3xl bg-paper p-12 text-center sm:p-16">
          <p className="font-display text-xl font-bold text-ink">
            Inga frågor matchar filtret.
          </p>
          <p className="mx-auto mt-2 max-w-sm text-mud">
            Prova ett annat filter — eller ha du fastnat på just det här? Ställ
            frågan så kanske du är den första.
          </p>
          <div className="mt-6 flex justify-center">
            <ChunkyLink href="/problemhornan/new" variant="yellow">
              Lägg upp ett problem
            </ChunkyLink>
          </div>
        </div>
      )}
    </div>
  );
}
