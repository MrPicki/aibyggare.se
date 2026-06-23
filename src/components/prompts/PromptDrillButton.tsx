"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { togglePostUpvote, hasPostUpvoted } from "@/lib/firebase/prompts-client";
import { DrillIcon } from "@/components/brand/DrillIcon";

interface PromptDrillButtonProps {
  postId: string;
  initialCount: number;
  size?: "sm" | "md";
}

export function PromptDrillButton({ postId, initialCount, size = "md" }: PromptDrillButtonProps) {
  const { user } = useAuth();
  const [count, setCount] = useState(initialCount);
  const [drilled, setDrilled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [showPlus, setShowPlus] = useState(false);

  useEffect(() => {
    if (!user) return;
    hasPostUpvoted(postId, user.uid).then(setDrilled);
  }, [postId, user]);

  async function handleClick() {
    if (!user || loading) return;
    const wasD = drilled;
    const prevCount = count;
    setDrilled(!wasD);
    setCount((c) => (wasD ? c - 1 : c + 1));
    if (!wasD) {
      setShaking(true);
      setShowPlus(true);
      setTimeout(() => setShaking(false), 420);
      setTimeout(() => setShowPlus(false), 650);
    }
    setLoading(true);
    try {
      const result = await togglePostUpvote(postId, user.uid);
      setDrilled(result.upvoted);
      setCount(result.newCount);
    } catch {
      setDrilled(wasD);
      setCount(prevCount);
    } finally {
      setLoading(false);
    }
  }

  const tooltip = !user ? "Logga in för att ge en borr" : drilled ? "Ta bort borr" : "Ge en borr";

  if (size === "sm") {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        title={tooltip}
        aria-label={tooltip}
        aria-pressed={drilled}
        className={cn(
          "inline-flex items-center gap-1 font-mono text-[11px] font-semibold transition-colors",
          drilled ? "text-build-green" : "text-mud hover:text-build-green",
          !user && "cursor-not-allowed",
        )}
      >
        <DrillIcon className={cn("h-3.5 w-3.5", shaking && "animate-drill-shake")} />
        {count}
      </button>
    );
  }

  return (
    <div className="relative">
      {showPlus && (
        <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-sm font-bold text-build-green animate-drill-plus select-none">
          +1
        </span>
      )}
      <button
        onClick={handleClick}
        disabled={loading}
        title={tooltip}
        aria-label={tooltip}
        aria-pressed={drilled}
        className={cn(
          "chunky-sm pressable inline-flex items-center gap-2 rounded-xl border-2 border-ink px-4 py-2 font-mono text-sm font-bold transition-all",
          drilled ? "bg-build-green text-paper" : "bg-paper text-ink hover:bg-build-green hover:text-paper",
          (!user || loading) && "opacity-60",
          !user && "cursor-not-allowed",
        )}
      >
        <DrillIcon className={cn("h-5 w-5 shrink-0", shaking && "animate-drill-shake")} />
        {drilled ? "Borrad" : "Ge en borr"}
        <span className="rounded-md bg-black/10 px-1.5 py-0.5 text-[11px] tabular-nums">
          {count}
        </span>
      </button>
    </div>
  );
}
