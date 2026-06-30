"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (status === "done") {
    return (
      <p className="mt-4 inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-build-green px-4 py-2.5 font-mono text-sm font-bold text-paper">
        <Check size={16} /> Tack — vi hör av oss!
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("done");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Något gick fel. Försök igen.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Nätverksfel. Försök igen.");
      setStatus("error");
    }
  }

  return (
    <form
      className="mt-4 space-y-2"
      aria-label="Prenumerera på nyhetsbrev"
      onSubmit={handleSubmit}
    >
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="din@email.se"
          disabled={status === "loading"}
          className="min-w-0 flex-1 rounded-xl border-2 border-ink bg-cream px-3 py-2 font-mono text-sm text-ink placeholder:text-mud/60 focus:outline-none focus:ring-2 focus:ring-build-green disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="chunky-sm pressable shrink-0 rounded-xl bg-build-green px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-paper disabled:opacity-60"
        >
          {status === "loading" ? "…" : "Skicka"}
        </button>
      </div>
      {status === "error" && (
        <p className="font-mono text-xs text-bug-red">{errorMsg}</p>
      )}
      <p className="font-mono text-[10px] text-mud/70 leading-relaxed">
        Inget skräp. Avregistrera närsomhelst.
      </p>
    </form>
  );
}
