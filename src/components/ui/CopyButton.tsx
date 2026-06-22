"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <button
      onClick={copy}
      className="chunky-sm pressable inline-flex items-center gap-2 rounded-xl bg-build-green px-5 py-2.5 font-mono text-sm font-bold uppercase tracking-wide text-paper"
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? "Kopierat!" : "Kopiera prompt"}
    </button>
  );
}
