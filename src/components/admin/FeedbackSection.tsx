"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, ExternalLink, ImageIcon } from "lucide-react";
import type { FeedbackEntry } from "@/lib/firebase/admin-data";

function formatDate(seconds: number | null): string {
  if (!seconds) return "";
  return new Date(seconds * 1000).toLocaleString("sv-SE", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function FeedbackCard({
  f,
  onDone,
  showDone,
}: {
  f: FeedbackEntry;
  onDone?: (id: string) => void;
  showDone?: boolean;
}) {
  const [busy, setBusy] = useState(false);

  async function handleDone() {
    if (!onDone) return;
    setBusy(true);
    try {
      await fetch("/api/admin/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: f.id }),
      });
      onDone(f.id);
    } catch {
      setBusy(false);
    }
  }

  return (
    <li className="chunky-sm rounded-2xl bg-paper p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-ink">
              {f.userName}
              {f.username ? ` (@${f.username})` : ""}
            </span>
            {f.pageUrl && (
              <a
                href={f.pageUrl.startsWith("http") ? f.pageUrl : `https://aibyggare.se${f.pageUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 truncate font-mono text-[10px] text-mud hover:text-ink"
              >
                {f.pageUrl} <ExternalLink size={9} />
              </a>
            )}
            {f.createdAtSeconds && (
              <span className="font-mono text-[10px] text-mud">{formatDate(f.createdAtSeconds)}</span>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink">{f.message}</p>
          {f.imageUrl && (
            <div className="mt-3">
              <a
                href={f.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-xl border-2 border-dashed border-border hover:border-ink transition-colors"
                style={{ maxWidth: 320 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.imageUrl}
                  alt="Skärmdump"
                  className="w-full object-cover"
                  style={{ maxHeight: 180 }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                  }}
                />
                <span className="hidden items-center gap-1.5 px-3 py-2 font-mono text-[11px] text-mud group-hover:text-ink">
                  <ImageIcon size={11} /> Se skärmdump
                </span>
              </a>
            </div>
          )}
        </div>
        {!showDone && onDone && (
          <button
            type="button"
            onClick={handleDone}
            disabled={busy}
            title="Markera som klar"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border-2 border-build-green px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wide text-build-green transition-colors hover:bg-build-green hover:text-paper disabled:opacity-50"
          >
            <Check size={12} /> Klar
          </button>
        )}
        {showDone && (
          <span className="shrink-0 inline-flex items-center gap-1 rounded-xl bg-build-green/15 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wide text-build-green">
            <Check size={11} /> Klar
          </span>
        )}
      </div>
    </li>
  );
}

export function FeedbackSection({ initialOpen }: { initialOpen: FeedbackEntry[] }) {
  const [openItems, setOpenItems] = useState<FeedbackEntry[]>(initialOpen);
  const [doneItems, setDoneItems] = useState<FeedbackEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  function handleDone(id: string) {
    const item = openItems.find((f) => f.id === id);
    setOpenItems((prev) => prev.filter((f) => f.id !== id));
    if (item) setDoneItems((prev) => [{ ...item, status: "done" }, ...prev]);
  }

  async function toggleHistory() {
    if (!historyOpen && doneItems.length === 0) {
      setLoadingHistory(true);
      try {
        const res = await fetch("/api/admin/feedback");
        const json = await res.json();
        setDoneItems(json.done ?? []);
      } catch {}
      setLoadingHistory(false);
    }
    setHistoryOpen((v) => !v);
  }

  return (
    <div>
      {openItems.length === 0 ? (
        <p className="mt-3 text-sm text-mud">Ingen öppen feedback. Bra jobbat!</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {openItems.map((f) => (
            <FeedbackCard key={f.id} f={f} onDone={handleDone} />
          ))}
        </ul>
      )}

      {/* Historik */}
      <div className="mt-4">
        <button
          type="button"
          onClick={toggleHistory}
          className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-mud hover:text-ink transition-colors"
        >
          {historyOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          Historik {doneItems.length > 0 && `(${doneItems.length})`}
          {loadingHistory && " …"}
        </button>
        {historyOpen && (
          <ul className="mt-3 space-y-3 opacity-70">
            {doneItems.length === 0 && !loadingHistory && (
              <li className="text-sm text-mud">Ingen avklarad feedback ännu.</li>
            )}
            {doneItems.map((f) => (
              <FeedbackCard key={f.id} f={f} showDone />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
