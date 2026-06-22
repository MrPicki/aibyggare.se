"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toggleUpvote, hasUpvoted } from "@/lib/firebase/projects-client";

interface UpvoteButtonProps {
  projectId: string;
  initialCount: number;
}

export function UpvoteButton({ projectId, initialCount }: UpvoteButtonProps) {
  const { user } = useAuth();
  const [count, setCount] = useState(initialCount);
  const [upvoted, setUpvoted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    hasUpvoted(projectId, user.uid).then(setUpvoted);
  }, [projectId, user]);

  async function handleClick() {
    if (!user || loading) return;
    setLoading(true);
    try {
      const result = await toggleUpvote(projectId, user.uid);
      setUpvoted(result.upvoted);
      setCount(result.newCount);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={!user || loading}
      aria-label={upvoted ? "Ta bort upvote" : "Upvota"}
      aria-pressed={upvoted}
      className={[
        "chunky-sm pressable inline-flex items-center gap-1.5 rounded-xl border-2 border-ink px-4 py-2 font-mono text-sm font-bold transition-all",
        upvoted
          ? "bg-build-green text-paper"
          : "bg-paper text-ink hover:bg-build-green hover:text-paper",
        !user ? "cursor-not-allowed opacity-60" : "",
        loading ? "opacity-60" : "",
      ].join(" ")}
    >
      <ChevronUp size={16} />
      {count}
    </button>
  );
}
