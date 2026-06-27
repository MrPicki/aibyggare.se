"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface EditProjectButtonProps {
  slug: string;
  ownerId: string;
}

export function EditProjectButton({ slug, ownerId }: EditProjectButtonProps) {
  const { user } = useAuth();
  if (!user || user.uid !== ownerId) return null;

  return (
    <Link
      href={`/projects/${slug}/edit`}
      className="inline-flex items-center gap-1.5 rounded-xl border-2 border-ink px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-hammer-yellow"
    >
      <Pencil size={13} /> Redigera bygget
    </Link>
  );
}
