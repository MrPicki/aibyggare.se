"use client";

import { useState } from "react";
import { Check, Copy, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PromptCardProps {
  title: string;
  tool: string;
  badge: string;
  /** Själva prompten — kopieras till urklipp. */
  prompt: string;
  accent: string;
  className?: string;
}

export function PromptCard({ title, tool, badge, prompt, accent, className }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <article className={cn("chunky group flex h-full flex-col rounded-3xl bg-paper p-5", className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span
          className="sticker px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-ink"
          style={{ backgroundColor: accent }}
        >
          {badge}
        </span>
        <span className="font-mono text-[11px] font-medium uppercase tracking-wide text-mud">
          {tool}
        </span>
      </div>

      <h3 className="font-display text-lg font-bold leading-snug text-ink">{title}</h3>

      <p className="mt-2 flex-1 rounded-xl border-2 border-dashed border-border bg-cream p-3 font-mono text-xs leading-relaxed text-mud line-clamp-3">
        {prompt}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={copy}
          className="chunky-sm pressable inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-build-green px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide text-paper"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Kopierat!" : "Kopiera"}
        </button>
        <button
          className="chunky-sm pressable inline-flex items-center justify-center gap-1.5 rounded-xl bg-paper px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide text-ink"
          aria-label="Spara prompt"
        >
          <Bookmark size={13} /> Spara
        </button>
      </div>
    </article>
  );
}
