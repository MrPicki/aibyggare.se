"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <span className="sticker mb-5 inline-flex bg-bug-red px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide text-paper">
        Något gick fel
      </span>
      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        Det här bygget rasade
      </h1>
      <p className="mt-3 max-w-sm text-mud">
        Ett oväntat fel inträffade. Försök igen — funkar det inte, ladda om sidan om en stund.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="chunky pressable rounded-xl bg-build-green px-5 py-3 font-mono text-sm font-bold uppercase tracking-wide text-paper"
        >
          Försök igen
        </button>
        <Link
          href="/"
          className="chunky pressable rounded-xl bg-paper px-5 py-3 font-mono text-sm font-bold uppercase tracking-wide text-ink"
        >
          Till startsidan
        </Link>
      </div>
    </div>
  );
}
