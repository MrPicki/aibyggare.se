"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Star, Check } from "lucide-react";

type Action =
  | "delete-project"
  | "delete-post"
  | "feature-project"
  | "feature-post"
  | "resolve-report";

async function callAdmin(action: Action, id: string, value?: boolean): Promise<string | null> {
  try {
    const res = await fetch("/api/admin/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, id, value }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return data.error ?? "Något gick fel.";
    }
    return null;
  } catch {
    return "Nätverksfel. Försök igen.";
  }
}

// ── Ta bort + featured-knappar för projekt/inlägg ──
export function ModerationButtons({
  kind,
  id,
  isFeatured,
}: {
  kind: "project" | "post";
  id: string;
  isFeatured: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function feature() {
    setBusy(true);
    setError("");
    const err = await callAdmin(kind === "project" ? "feature-project" : "feature-post", id, !isFeatured);
    setBusy(false);
    if (err) setError(err);
    else router.refresh();
  }

  async function remove() {
    if (!confirm("Ta bort det här innehållet permanent? Detta går inte att ångra.")) return;
    setBusy(true);
    setError("");
    const err = await callAdmin(kind === "project" ? "delete-project" : "delete-post", id);
    setBusy(false);
    if (err) setError(err);
    else router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={feature}
        disabled={busy}
        className={[
          "chunky-sm pressable inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wide disabled:opacity-50",
          isFeatured ? "bg-hammer-yellow text-ink" : "bg-paper text-mud hover:text-ink",
        ].join(" ")}
        title={isFeatured ? "Ta bort utvald-status" : "Markera som utvald"}
      >
        <Star size={12} className={isFeatured ? "fill-ink" : ""} />
        {isFeatured ? "Utvald" : "Utse"}
      </button>
      <button
        onClick={remove}
        disabled={busy}
        className="chunky-sm pressable inline-flex items-center gap-1 rounded-lg bg-paper px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wide text-bug-red hover:bg-bug-red/10 disabled:opacity-50"
        title="Ta bort innehåll"
      >
        <Trash2 size={12} /> Radera
      </button>
      {error && <span className="font-mono text-[10px] text-bug-red">{error}</span>}
    </div>
  );
}

// ── Lös-knapp för en rapport ──
export function ResolveReportButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function resolve() {
    setBusy(true);
    setError("");
    const err = await callAdmin("resolve-report", id);
    setBusy(false);
    if (err) setError(err);
    else router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={resolve}
        disabled={busy}
        className="chunky-sm pressable inline-flex items-center gap-1 rounded-lg bg-build-green px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wide text-paper disabled:opacity-50"
      >
        <Check size={12} /> {busy ? "..." : "Markera löst"}
      </button>
      {error && <span className="font-mono text-[10px] text-bug-red">{error}</span>}
    </div>
  );
}
