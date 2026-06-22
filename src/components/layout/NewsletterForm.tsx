"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="mt-4 inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-build-green px-4 py-2.5 font-mono text-sm font-bold text-paper">
        <Check size={16} /> Tack — vi hör av oss.
      </p>
    );
  }

  return (
    <form
      className="mt-4 flex gap-2"
      aria-label="Prenumerera på nyhetsbrev"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <input
        type="email"
        required
        placeholder="din@email.se"
        className="min-w-0 flex-1 rounded-xl border-2 border-ink bg-cream px-3 py-2 font-mono text-sm text-ink placeholder:text-mud/60 focus:outline-none focus:ring-2 focus:ring-build-green"
      />
      <button
        type="submit"
        className="chunky-sm pressable shrink-0 rounded-xl bg-build-green px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-paper"
      >
        Skicka
      </button>
    </form>
  );
}
