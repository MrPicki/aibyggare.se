"use client";

import { use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = use(params);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-mud">Laddar…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
        <div className="chunky rounded-3xl bg-paper p-12 text-center sm:p-16">
          <p className="font-display text-xl font-bold text-ink">
            Logga in för att se din profil
          </p>
          <p className="mx-auto mt-2 max-w-sm text-mud">
            Din byggaridentitet, dina projekt och dina sparade prompts samlas här.
          </p>
          <div className="mt-6 flex justify-center">
            <ChunkyLink href="/login" variant="green">
              Logga in
            </ChunkyLink>
          </div>
        </div>
      </div>
    );
  }

  const name = user.displayName || decodeURIComponent(handle);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <article className="chunky overflow-hidden rounded-3xl bg-paper">
        <div className="border-b-2 border-ink bg-build-green px-6 py-3">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink/80">
            Byggare
          </span>
        </div>
        <div className="flex flex-col items-center p-8 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-ink bg-cream">
            {user.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoURL} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="font-display text-3xl font-bold text-ink">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
          </span>
          <div className="mt-4 sm:mt-0">
            <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{name}</h1>
            {user.email && (
              <p className="mt-1 font-mono text-sm text-mud">{user.email}</p>
            )}
          </div>
        </div>
      </article>

      <div className="chunky mt-6 rounded-3xl bg-cream p-8 text-center">
        <Sticker tilt={-2} className="mb-3 bg-hammer-yellow">Snart</Sticker>
        <p className="font-display text-lg font-bold text-ink">
          Dina byggen och prompts dyker upp här.
        </p>
        <p className="mx-auto mt-2 max-w-md text-mud">
          Lägg upp ditt första bygge så fyller du bänken med något att visa.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <ChunkyLink href="/projects/new" variant="green">
            Lägg upp ett bygge
          </ChunkyLink>
          <ChunkyLink href="/onboarding" variant="paper">
            Redigera profil
          </ChunkyLink>
        </div>
      </div>
    </div>
  );
}
