"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import {
  doc,
  updateDoc,
  getDocs,
  query,
  collection,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/contexts/AuthContext";

const AVAILABLE_TOOLS = [
  "Claude Code", "Claude AI", "Cursor", "Lovable", "Bolt", "Replit",
  "Supabase", "Vercel", "Firebase", "Next.js", "React", "Stripe",
  "GitHub", "TypeScript", "ChatGPT",
];

// Guard: wait for auth before rendering the form
export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) return null;

  return <OnboardingForm user={user} />;
}

// Separate component so useState can safely initialize from `user`
function OnboardingForm({ user }: { user: User }) {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    displayName: user.displayName ?? "",
    bio: "",
    tools: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function toggleTool(tool: string) {
    setForm((f) => ({
      ...f,
      tools: f.tools.includes(tool)
        ? f.tools.filter((t) => t !== tool)
        : [...f.tools, tool],
    }));
  }

  async function validate(): Promise<Record<string, string>> {
    const errs: Record<string, string> = {};
    const u = form.username.trim();

    if (!u) {
      errs.username = "Välj ett användarnamn.";
    } else if (!/^[a-z0-9_]{3,20}$/.test(u)) {
      errs.username = "3–20 tecken. Endast a–z, 0–9 och understreck.";
    } else {
      const q = query(collection(db, "profiles"), where("username", "==", u));
      const snap = await getDocs(q);
      const others = snap.docs.filter((d) => d.id !== user.uid);
      if (others.length > 0) errs.username = "Det användarnamnet är redan taget.";
    }

    if (!form.displayName.trim()) {
      errs.displayName = "Ange ett visningsnamn.";
    }

    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const errs = await validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSaving(false);
      return;
    }

    try {
      await updateDoc(doc(db, "profiles", user.uid), {
        username: form.username.trim().toLowerCase(),
        displayName: form.displayName.trim(),
        bio: form.bio.trim(),
        tools: form.tools,
        updatedAt: serverTimestamp(),
      });
      router.push("/projects/new");
    } catch {
      setErrors({ submit: "Något gick fel. Försök igen om en stund." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="flex items-center gap-2 mb-8">
        <span className="w-2 h-2 rounded-[2px] bg-primary" aria-hidden />
        <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wide">
          Snabbinstallation
        </span>
      </div>

      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
        Välkommen till AIbyggare
      </h1>
      <p className="text-muted-foreground mb-10">
        Tre snabba fält — sedan kan du visa upp ditt första bygge.
      </p>

      <form onSubmit={handleSubmit} className="space-y-7" noValidate>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1.5">
            Användarnamn <span className="text-[#D94F3F]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">
              @
            </span>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                }))
              }
              placeholder="dittnamn"
              className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-muted-foreground/60"
              maxLength={20}
              autoComplete="username"
              autoFocus
            />
          </div>
          {errors.username ? (
            <p className="mt-1.5 text-xs text-[#D94F3F]">{errors.username}</p>
          ) : (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Syns på din profil. Kan ändras senare.
            </p>
          )}
        </div>

        {/* Display name */}
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-foreground mb-1.5">
            Visningsnamn <span className="text-[#D94F3F]">*</span>
          </label>
          <input
            id="displayName"
            type="text"
            value={form.displayName}
            onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
            placeholder="Ditt namn"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-muted-foreground/60"
            maxLength={50}
            autoComplete="name"
          />
          {errors.displayName && (
            <p className="mt-1.5 text-xs text-[#D94F3F]">{errors.displayName}</p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-1.5">
            Kort bio{" "}
            <span className="text-muted-foreground font-normal">(valfri)</span>
          </label>
          <textarea
            id="bio"
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="Vad bygger du? Vad är du bra på? Vad håller du på att lära dig?"
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none placeholder:text-muted-foreground/60"
            maxLength={160}
          />
          <p className="mt-1 text-xs text-muted-foreground text-right">
            {form.bio.length}/160
          </p>
        </div>

        {/* Tools */}
        <div>
          <p className="block text-sm font-medium text-foreground mb-1.5">
            Vilka verktyg använder du?{" "}
            <span className="text-muted-foreground font-normal">(valfri)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TOOLS.map((tool) => {
              const selected = form.tools.includes(tool);
              return (
                <button
                  key={tool}
                  type="button"
                  onClick={() => toggleTool(tool)}
                  className={[
                    "px-3 py-1.5 rounded-md border text-xs font-mono font-medium transition-colors",
                    selected
                      ? "bg-primary/15 border-primary/40 text-[#3D6B20]"
                      : "bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-foreground",
                  ].join(" ")}
                >
                  {tool}
                </button>
              );
            })}
          </div>
        </div>

        {errors.submit && (
          <div className="p-3 rounded-lg bg-[#D94F3F]/10 border border-[#D94F3F]/20">
            <p className="text-sm text-[#D94F3F]">{errors.submit}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl bg-primary text-[#181713] font-semibold text-sm hover:bg-[#8DB34E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "Sparar..." : "Klar — visa upp mitt första bygge →"}
        </button>
      </form>
    </div>
  );
}
