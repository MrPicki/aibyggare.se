"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteUser } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useAuth } from "@/contexts/AuthContext";

export function DeleteAccountSection() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setBusy(true);
    setError(null);
    try {
      // 1. Radera all Firestore-data server-side (profil, XP, byggen, frågor).
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (!res.ok) {
        throw new Error("server");
      }

      // 2. Radera Auth-kontot client-side. Kan kräva nyligen inloggning —
      //    misslyckas det är datan ändå borta, så vi loggar ut oavsett.
      try {
        if (auth.currentUser) await deleteUser(auth.currentUser);
      } catch {
        /* requires-recent-login e.d. — datan är raderad, fortsätt ändå */
      }

      // 3. Logga ut och tillbaka till start.
      await signOut();
      router.push("/");
    } catch {
      setError("Något gick fel. Försök igen om en stund.");
      setBusy(false);
    }
  }

  return (
    <div className="mt-12 rounded-2xl border-2 border-bug-red/40 bg-bug-red/5 p-6">
      <h2 className="font-display text-lg font-bold text-bug-red">Radera konto</h2>
      <p className="mt-1.5 text-sm text-mud">
        Detta raderar din profil, ditt användarnamn, all Byggkraft, dina byggen och
        dina frågor — permanent. Det går inte att ångra.
      </p>

      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-4 rounded-xl border-2 border-bug-red px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-bug-red transition-colors hover:bg-bug-red hover:text-paper"
        >
          Radera mitt konto
        </button>
      ) : (
        <div className="mt-4 rounded-xl border-2 border-bug-red bg-paper p-4">
          <p className="text-sm font-semibold text-ink">
            Är du helt säker? Allt försvinner direkt.
          </p>
          {error && <p className="mt-2 text-xs text-bug-red">{error}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className="chunky-sm pressable rounded-xl bg-bug-red px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-paper disabled:opacity-60"
            >
              {busy ? "Raderar..." : "Ja, radera allt"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={busy}
              className="rounded-xl border-2 border-ink px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-ink transition-colors hover:bg-cream disabled:opacity-60"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
