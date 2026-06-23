"use client";

import { useState } from "react";
import Link from "next/link";
import { BookmarkCheck, Bookmark, ArrowUpRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { PromptDrillButton } from "@/components/prompts/PromptDrillButton";

const SAVED_KEY = "aibyggare:saved-prompts";

function readSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export interface PromptCardProps {
  title: string;
  tool: string;
  badge: string;
  prompt: string;
  accent: string;
  slug?: string;
  postId?: string;
  upvoteCount?: number;
  author?: string;
  authorHandle?: string;
  authorAvatarUrl?: string;
  className?: string;
}

export function PromptCard({
  title, tool, badge, prompt, accent,
  slug, postId, upvoteCount = 0,
  author, authorHandle, authorAvatarUrl,
  className,
}: PromptCardProps) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(() => readSaved().includes(title));

  function toggleSave() {
    const current = readSaved();
    const next = current.includes(title)
      ? current.filter((t) => t !== title)
      : [...current, title];
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    setSaved(next.includes(title));
  }

  return (
    <article className={cn("chunky group flex h-full flex-col rounded-3xl bg-paper p-5", className)}>
      {/* Header */}
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

      {/* Prompt-text — auth-gate */}
      {user ? (
        <p className="mt-2 flex-1 rounded-xl border-2 border-dashed border-border bg-cream p-3 font-mono text-xs leading-relaxed text-mud line-clamp-3">
          {prompt}
        </p>
      ) : (
        <div className="mt-2 flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-cream/60 p-4 text-center">
          <Lock size={16} className="text-mud/50" />
          <p className="font-mono text-[11px] text-mud/70">
            Logga in för att se prompten
          </p>
          <Link
            href="/login"
            className="font-mono text-[10px] font-bold uppercase tracking-wide text-prompt-purple hover:underline"
          >
            Logga in →
          </Link>
        </div>
      )}

      {/* Author */}
      {author && authorHandle && (
        <div className="mt-3 flex items-center gap-2">
          {authorAvatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={authorAvatarUrl} alt="" className="h-5 w-5 rounded-full border border-ink/30 object-cover" />
          )}
          <Link
            href={`/profile/${authorHandle}`}
            className="font-mono text-[11px] font-semibold text-mud hover:text-ink transition-colors"
          >
            @{authorHandle}
          </Link>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        {postId ? (
          <PromptDrillButton postId={postId} initialCount={upvoteCount} size="sm" />
        ) : null}
        <button
          onClick={toggleSave}
          disabled={!user}
          aria-pressed={saved}
          aria-label={saved ? "Ta bort sparad prompt" : "Spara prompt"}
          className={cn(
            "chunky-sm pressable inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide",
            saved ? "bg-hammer-yellow text-ink" : "bg-paper text-ink hover:bg-cream",
            !user && "cursor-not-allowed opacity-50",
          )}
        >
          {saved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
          {saved ? "Sparad" : "Spara"}
        </button>
      </div>

      {slug && (
        <Link
          href={`/prompts/${slug}`}
          className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wide text-ink group-hover:text-prompt-purple transition-colors"
        >
          Visa prompt <ArrowUpRight size={12} />
        </Link>
      )}
    </article>
  );
}
