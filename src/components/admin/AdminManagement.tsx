"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { UserPlus, UserMinus, ShieldCheck } from "lucide-react";
import type { AdminUserRecord } from "@/lib/firebase/admin-data";

export function AdminManagement({
  initialAdmins,
  currentUid,
}: {
  initialAdmins: AdminUserRecord[];
  currentUid: string;
}) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  async function callApi(body: object): Promise<{ ok?: boolean; admins?: AdminUserRecord[]; error?: string }> {
    const res = await fetch("/api/admin/manage-admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  async function refreshAdmins() {
    const res = await fetch("/api/admin/manage-admins");
    if (res.ok) {
      const data = await res.json();
      setAdmins(data.admins ?? []);
    }
  }

  function grant() {
    const trimmed = email.trim();
    if (!trimmed) return;
    setError("");
    setSuccess("");

    startTransition(async () => {
      const data = await callApi({ action: "grant", email: trimmed });
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(`${trimmed} är nu admin.`);
        setEmail("");
        await refreshAdmins();
      }
    });
  }

  function revoke(uid: string, name: string) {
    if (!confirm(`Ta bort admin-rollen från ${name}?`)) return;
    setError("");
    setSuccess("");

    startTransition(async () => {
      const data = await callApi({ action: "revoke", uid });
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(`${name} är inte längre admin.`);
        await refreshAdmins();
      }
    });
  }

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} className="text-build-green" />
        <h2 className="font-display text-xl font-bold text-ink">Admin-hantering</h2>
      </div>
      <p className="mt-1 text-sm text-mud">
        Lägg till eller ta bort admins. Alla admins har exakt samma befogenheter.
      </p>

      {/* Nuvarande admins */}
      <ul className="mt-4 space-y-2">
        {admins.map((a) => (
          <li
            key={a.uid}
            className="chunky-sm flex items-center justify-between gap-3 rounded-2xl bg-paper p-3.5"
          >
            <div className="flex items-center gap-2.5">
              {a.avatarUrl ? (
                <Image
                  src={a.avatarUrl}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="size-8 rounded-full bg-cream" />
              )}
              <div>
                <span className="font-semibold text-ink">{a.displayName || a.username}</span>
                {a.username && (
                  <span className="ml-2 font-mono text-[11px] text-mud">@{a.username}</span>
                )}
              </div>
              {a.uid === currentUid && (
                <span className="sticker bg-build-green/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-build-green">
                  Du
                </span>
              )}
            </div>
            {a.uid !== currentUid && (
              <button
                onClick={() => revoke(a.uid, a.displayName || a.username)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-bug-red hover:bg-bug-red/10 disabled:opacity-50 transition-colors"
                title="Ta bort admin-roll"
              >
                <UserMinus size={13} /> Ta bort
              </button>
            )}
          </li>
        ))}
        {admins.length === 0 && (
          <li className="text-sm text-mud">Inga admins hittades. Kontrollera databasen.</li>
        )}
      </ul>

      {/* Lägg till ny admin */}
      <div className="mt-5 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && grant()}
          placeholder="e-post till ny admin..."
          className="min-w-0 flex-1 rounded-xl border border-paper bg-paper px-3 py-2 font-mono text-sm text-ink placeholder:text-mud focus:outline-none focus:ring-2 focus:ring-build-green"
          disabled={isPending}
        />
        <button
          onClick={grant}
          disabled={isPending || !email.trim()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-build-green px-4 py-2 font-mono text-sm font-bold text-paper hover:bg-build-green/90 disabled:opacity-50 transition-colors"
        >
          <UserPlus size={14} /> Lägg till
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm font-medium text-bug-red">{error}</p>
      )}
      {success && (
        <p className="mt-2 text-sm font-medium text-build-green">{success}</p>
      )}
    </section>
  );
}
