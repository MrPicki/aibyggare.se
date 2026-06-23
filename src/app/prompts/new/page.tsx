"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Sticker } from "@/components/ui/Sticker";
import { PromptForm } from "@/components/prompts/PromptForm";

export default function NewPromptPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login?from=/prompts/new");
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <Sticker tilt={-2} className="mb-4 bg-prompt-purple">Ny prompt</Sticker>
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
        Dela en prompt
      </h1>
      <p className="mt-2 text-mud">
        Den där prompten som faktiskt funkade. Spara den här så andra slipper uppfinna hjulet igen.
      </p>
      <PromptForm />
    </div>
  );
}
