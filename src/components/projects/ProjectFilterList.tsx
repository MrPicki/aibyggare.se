"use client";

import { useState, useMemo } from "react";
import { ProjectCard, type ProjectCardProps } from "@/components/cards/ProjectCard";
import { ChunkyLink } from "@/components/ui/ChunkyButton";

type SortKey = "upvotes" | "newest" | "comments";

const STATUS_TABS = [
  { key: "all", label: "Alla" },
  { key: "Idé", label: "Idé" },
  { key: "MVP", label: "MVP" },
  { key: "Live", label: "Live" },
  { key: "Söker feedback", label: "Feedback" },
  { key: "Behöver testare", label: "Testare" },
  { key: "Söker medgrundare", label: "Medgrundare" },
] as const;

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "upvotes", label: "Flest borrar" },
  { key: "newest", label: "Nyast" },
  { key: "comments", label: "Mest kommenterat" },
];

interface ProjectFilterListProps {
  projects: ProjectCardProps[];
}

export function ProjectFilterList({ projects }: ProjectFilterListProps) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [stackFilter, setStackFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("upvotes");

  const topTags = useMemo(() => {
    const freq: Record<string, number> = {};
    for (const p of projects) {
      for (const tag of p.tags) {
        freq[tag] = (freq[tag] ?? 0) + 1;
      }
    }
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag]) => tag);
  }, [projects]);

  const filtered = useMemo(() => {
    let list = projects.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (stackFilter && !p.tags.some((t) => t === stackFilter)) return false;
      return true;
    });

    if (sort === "upvotes") {
      list = [...list].sort((a, b) => b.upvotes - a.upvotes);
    } else if (sort === "newest") {
      list = [...list].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    } else if (sort === "comments") {
      list = [...list].sort((a, b) => b.commentCount - a.commentCount);
    }

    return list;
  }, [projects, statusFilter, stackFilter, sort]);

  return (
    <div>
      {/* Filter + sort bar */}
      <div className="mb-8 space-y-3">
        {/* Status tabs */}
        <div className="flex flex-wrap gap-1.5">
          <div className="flex flex-wrap gap-1 rounded-2xl border-2 border-ink bg-paper p-1">
            {STATUS_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={[
                  "rounded-xl px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wide transition-all",
                  statusFilter === key
                    ? "bg-ink text-paper"
                    : "text-mud hover:text-ink",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Stack chips + sort */}
        <div className="flex flex-wrap items-center gap-2">
          {topTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setStackFilter(stackFilter === tag ? null : tag)}
              className={[
                "rounded-xl border-2 border-ink px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide transition-all",
                stackFilter === tag
                  ? "bg-build-green text-ink shadow-[2px_2px_0_0_var(--ink)]"
                  : "bg-paper text-mud hover:bg-cream hover:text-ink",
              ].join(" ")}
            >
              {tag}
            </button>
          ))}

          {/* Sort — pushed to the right */}
          <div className="ml-auto flex gap-1 rounded-2xl border-2 border-ink bg-paper p-1">
            {SORT_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={[
                  "rounded-xl px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wide transition-all",
                  sort === key
                    ? "bg-ink text-paper"
                    : "text-mud hover:text-ink",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.slug} {...p} />
          ))}
        </div>
      ) : (
        <div className="chunky rounded-3xl bg-paper p-12 text-center sm:p-16">
          <p className="font-display text-xl font-bold text-ink">
            Inga byggen matchar filtret.
          </p>
          <p className="mx-auto mt-2 max-w-sm text-mud">
            Prova ett annat filter — eller lägg upp ditt eget.
          </p>
          <div className="mt-6 flex justify-center">
            <ChunkyLink href="/projects/new" variant="green">
              Lägg upp bygge
            </ChunkyLink>
          </div>
        </div>
      )}
    </div>
  );
}
