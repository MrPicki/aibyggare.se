"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, deleteDoc } from "firebase/firestore";
import { Trash2 } from "lucide-react";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DeleteContentButtonProps {
  /** Firestore-collection: "projects" eller "posts". */
  collectionName: "projects" | "posts";
  docId: string;
  /** Ägarens uid — knappen visas bara för ägaren. */
  ownerId: string;
  /** Vad det heter i UI ("bygget" / "problemet"). */
  label: string;
  /** Dit vi navigerar efter radering. */
  redirectTo: string;
}

// Owner-only radering av eget bygge/problem. Firestore-reglerna tillåter ägaren
// att radera sitt eget dokument; knappen visas bara om inloggad === ägare.
export function DeleteContentButton({
  collectionName,
  docId,
  ownerId,
  label,
  redirectTo,
}: DeleteContentButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user || user.uid !== ownerId) return null;

  async function handleDelete() {
    setBusy(true);
    setError(null);
    try {
      await deleteDoc(doc(db, collectionName, docId));
      router.push(redirectTo);
    } catch {
      setError("Kunde inte radera. Försök igen.");
      setBusy(false);
    }
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-1.5 rounded-xl border-2 border-bug-red/40 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-bug-red transition-colors hover:border-bug-red hover:bg-bug-red hover:text-paper"
      >
        <Trash2 size={13} /> Radera {label}
      </button>
    );
  }

  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-xl border-2 border-bug-red bg-bug-red/5 px-3 py-2">
      <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-ink">
        Säker? Går inte att ångra.
      </span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className="rounded-lg bg-bug-red px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wide text-paper disabled:opacity-60"
      >
        {busy ? "Raderar..." : "Ja, radera"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        disabled={busy}
        className="rounded-lg border-2 border-ink px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wide text-ink disabled:opacity-60"
      >
        Avbryt
      </button>
      {error && <span className="w-full font-mono text-[11px] text-bug-red">{error}</span>}
    </div>
  );
}
