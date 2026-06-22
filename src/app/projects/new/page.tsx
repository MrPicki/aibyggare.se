"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Sticker } from "@/components/ui/Sticker";

export default function NewProjectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login?from=/projects/new");
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <Sticker tilt={-2} className="mb-4 bg-build-green">Nytt bygge</Sticker>
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
        Lägg upp ditt bygge
      </h1>
      <p className="mt-2 text-mud mb-10">
        Halvfärdigt räknas. Visa vad du håller på med och vad du vill ha hjälp eller feedback på.
      </p>

      <ProjectForm />
    </div>
  );
}
