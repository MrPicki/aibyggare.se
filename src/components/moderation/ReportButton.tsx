"use client";

import { useState } from "react";
import Link from "next/link";
import { Flag, X } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { ReportTargetType } from "@/types/firestore";

interface ReportButtonProps {
  targetType: ReportTargetType;
  targetId: string;
  targetTitle: string;
  targetUrl: string;
}

export function ReportButton({ targetType, targetId, targetTitle, targetUrl }: ReportButtonProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !reason.trim()) return;
    setSaving(true);
    setError("");
    try {
      await addDoc(collection(db, "reports"), {
        reporterId: user.uid,
        targetType,
        targetId,
        targetTitle: targetTitle.slice(0, 200),
        targetUrl,
        reason: reason.trim().slice(0, 500),
        status: "open",
        createdAt: serverTimestamp(),
      });
      setDone(true);
      setOpen(false);
    } catch {
      setError("Kunde inte skicka rapporten. Försök igen.");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <p className="font-mono text-[11px] text-mud">
        Tack — rapporten är skickad till moderatorerna.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-wide text-mud/70 transition-colors hover:text-bug-red"
      >
        <Flag size={12} /> Rapportera
      </button>
    );
  }

  return (
    <div className="chunky-sm rounded-2xl border-2 border-border bg-paper p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-ink">
          Rapportera innehåll
        </span>
        <button onClick={() => setOpen(false)} aria-label="Stäng" className="text-mud hover:text-ink">
          <X size={15} />
        </button>
      </div>

      {!user ? (
        <p className="text-sm text-mud">
          <Link href="/login" className="font-semibold text-ink underline underline-offset-2 hover:text-bug-red">
            Logga in
          </Link>{" "}
          för att rapportera innehåll.
        </p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-2.5">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Vad är problemet? (spam, stötande, fel kategori...)"
            rows={3}
            maxLength={500}
            className="w-full rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm text-ink placeholder:text-mud/60 focus:outline-none focus:ring-2 focus:ring-bug-red resize-none"
          />
          {error && <p className="text-xs text-bug-red">{error}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || !reason.trim()}
              className="chunky-sm pressable rounded-xl bg-bug-red px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-paper disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Skickar..." : "Skicka rapport"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
