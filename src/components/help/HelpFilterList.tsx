"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { HelpCard } from "@/components/cards/HelpCard";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import type { HelpQuestion } from "@/lib/seed";

type SortKey = "newest" | "popular";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Nyast" },
  { key: "popular", label: "Populärast" },
];

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
  const [sort, setSort] = useState<SortKey>("newest");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = posts.filter((q) => {
      if (statusFilter === "open" && q.status !== "Öppen") return false;
      if (statusFilter === "solved" && q.status !== "Löst") return false;
      if (toolFilter) {
        const matchesTopic = q.topic.toLowerCase().includes(toolFilter.toLowerCase());
        const matchesTools = q.tools?.some((t) =>
          t.toLowerCase().includes(toolFilter.toLowerCase())
        );
        if (!matchesTopic && !matchesTools) return false;
      }
      if (query) {
        const haystack = `${q.title} ${q.body} ${q.topic} ${(q.tools ?? []).join(" ")} ${q.author}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    if (sort === "newest") {
      list = [...list].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    } else {
      list = [...list].sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0));
    }
    return list;
  }, [posts, statusFilter, toolFilter, sort, search]);

  return (
    <div>
      {/* Sökruta */}
      <div className="relative mb-3">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mud" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Sök frågor, verktyg eller felmeddelanden…"
          className="w-full rounded-xl border-2 border-ink bg-paper py-2.5 pl-10 pr-10 text-sm text-ink placeholder:text-mud/60 focus:outline-none focus:ring-2 focus:ring-warning-orange"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Rensa sökning"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-mud hover:bg-cream hover:text-ink"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
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

        {/* Sort */}
        <div className="ml-auto flex gap-1 rounded-2xl border-2 border-ink bg-paper p-1">
          {SORT_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={[
                "rounded-xl px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wide transition-all",
                sort === key ? "bg-ink text-paper" : "text-mud hover:text-ink",
              ].join(" ")}
            >
              {label}
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
