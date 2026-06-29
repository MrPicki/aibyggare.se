"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { PromptCard, type PromptCardProps } from "@/components/cards/PromptCard";
import { ChunkyLink } from "@/components/ui/ChunkyButton";

type SortKey = "newest" | "popular";

const TOOL_FILTERS = [
  "Claude",
  "ChatGPT",
  "Cursor",
  "Bolt",
  "Lovable",
  "Replit",
  "Next.js",
  "Annat",
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Nyast" },
  { key: "popular", label: "Populärast" },
];

interface PromptFilterListProps {
  prompts: PromptCardProps[];
}

export function PromptFilterList({ prompts }: PromptFilterListProps) {
  const [toolFilter, setToolFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("newest");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = prompts.filter((p) => {
      if (toolFilter) {
        const matchesTool = p.tool.toLowerCase().includes(toolFilter.toLowerCase());
        const matchesBadge = p.badge.toLowerCase().includes(toolFilter.toLowerCase());
        if (!matchesTool && !matchesBadge) return false;
      }
      if (q) {
        const haystack = `${p.title} ${p.prompt} ${p.tool} ${p.badge} ${p.author ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sort === "popular") {
      list = [...list].sort((a, b) => (b.upvoteCount ?? 0) - (a.upvoteCount ?? 0));
    }
    return list;
  }, [prompts, toolFilter, sort, search]);

  return (
    <div>
      {/* Sökruta */}
      <div className="relative mb-3">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mud" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Sök prompts, verktyg eller nyckelord…"
          className="w-full rounded-xl border-2 border-ink bg-paper py-2.5 pl-10 pr-10 text-sm text-ink placeholder:text-mud/60 focus:outline-none focus:ring-2 focus:ring-prompt-purple"
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
        {/* Tool chips */}
        <div className="flex flex-wrap gap-1.5">
          {TOOL_FILTERS.map((tool) => (
            <button
              key={tool}
              onClick={() => setToolFilter(toolFilter === tool ? null : tool)}
              className={[
                "rounded-xl border-2 border-ink px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide transition-all",
                toolFilter === tool
                  ? "bg-prompt-purple text-paper shadow-[2px_2px_0_0_var(--ink)]"
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p) => (
            <PromptCard key={p.slug ?? p.title} {...p} />
          ))}
        </div>
      ) : (
        <div className="chunky rounded-3xl bg-paper p-12 text-center sm:p-16">
          <p className="font-display text-xl font-bold text-ink">
            Inga prompts matchar sökningen.
          </p>
          <p className="mx-auto mt-2 max-w-sm text-mud">
            Prova ett annat filter — eller dela den prompt du saknar.
          </p>
          <div className="mt-6 flex justify-center">
            <ChunkyLink href="/prompts/new" variant="ink">
              Dela en prompt
            </ChunkyLink>
          </div>
        </div>
      )}
    </div>
  );
}
