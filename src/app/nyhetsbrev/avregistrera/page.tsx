"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";

function UnsubscribeContent() {
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    email ? "loading" : "idle"
  );
  const didRun = useRef(false);

  useEffect(() => {
    if (!email || didRun.current) return;
    didRun.current = true;

    fetch("/api/newsletter/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((r) => {
        setStatus(r.ok ? "done" : "error");
      })
      .catch(() => setStatus("error"));
  }, [email]);

  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-24 text-center">
      {!email && (
        <>
          <p className="font-display text-2xl font-bold text-ink mb-4">
            Ogiltig avregistreringslänk
          </p>
          <p className="text-mud">
            Länken saknar e-postadress. Kontakta oss på{" "}
            <a
              href="mailto:info@aibyggare.se"
              className="text-build-green hover:underline"
            >
              info@aibyggare.se
            </a>{" "}
            så hjälper vi dig.
          </p>
        </>
      )}

      {email && status === "loading" && (
        <p className="font-mono text-mud animate-pulse">Avregistrerar…</p>
      )}

      {email && status === "done" && (
        <>
          <div className="mb-6 text-5xl">👋</div>
          <p className="font-display text-2xl font-bold text-ink mb-3">
            Du är avregistrerad.
          </p>
          <p className="text-mud mb-8">
            <span className="font-mono text-ink">{email}</span> får inga fler
            utskick från AIbyggare.se.
          </p>
          <Link
            href="/"
            className="font-mono text-sm text-build-green hover:underline"
          >
            Tillbaka till startsidan →
          </Link>
        </>
      )}

      {email && status === "error" && (
        <>
          <p className="font-display text-2xl font-bold text-ink mb-3">
            Något gick fel.
          </p>
          <p className="text-mud">
            Kontakta oss på{" "}
            <a
              href="mailto:info@aibyggare.se"
              className="text-build-green hover:underline"
            >
              info@aibyggare.se
            </a>{" "}
            så ordnar vi avregistreringen manuellt.
          </p>
        </>
      )}
    </div>
  );
}

export default function AvregistreraPage() {
  return (
    <Suspense>
      <UnsubscribeContent />
    </Suspense>
  );
}
