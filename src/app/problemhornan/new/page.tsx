"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { HelpForm } from "@/components/help/HelpForm";
import { Sticker } from "@/components/ui/Sticker";

export default function NyttProblemPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login?from=/problemhornan/new");
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <Sticker tilt={2} className="mb-4 bg-warning-orange">
        Nytt problem
      </Sticker>
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
        Vad har du kört fast med?
      </h1>
      <p className="mt-2 text-mud mb-10">
        Beskriv problemet. Ju mer konkret du skriver, desto snabbare hittar vi
        lösningen. Ingen skam — alla fastnar.
      </p>

      <HelpForm />
    </div>
  );
}
