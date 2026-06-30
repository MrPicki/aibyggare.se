"use client";

import { useState } from "react";

export function ExportDataSection() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/account/export");
      if (!res.ok) throw new Error("server");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const cd = res.headers.get("content-disposition") ?? "";
      const match = cd.match(/filename="([^"]+)"/);
      a.download = match ? match[1] : "aibyggare-export.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Något gick fel. Försök igen om en stund.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-10 rounded-2xl border-2 border-border bg-paper p-6">
      <h2 className="font-display text-lg font-bold text-ink">Ladda ner min data</h2>
      <p className="mt-1.5 text-sm text-mud">
        Ladda ner en kopia av allt vi lagrar om dig — profil, byggen, inlägg, röster
        och bokmärken — som en JSON-fil. Din GDPR-rätt till dataportabilitet.
      </p>
      {error && <p className="mt-2 text-xs text-bug-red">{error}</p>}
      <button
        type="button"
        onClick={handleExport}
        disabled={busy}
        className="mt-4 chunky-sm pressable rounded-xl border-2 border-ink bg-paper px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-ink transition-colors hover:bg-cream disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
      >
        {busy ? "Förbereder..." : "Ladda ner min data"}
      </button>
    </div>
  );
}
