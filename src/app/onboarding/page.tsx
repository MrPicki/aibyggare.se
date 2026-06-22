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
      <span className="sticker mb-5 inline-flex bg-hammer-yellow px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-ink">
        Snabbinstallation
      </span>

      <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-2">
        Välkommen till AIbyggare
      </h1>
      <p className="text-mud mb-10">
        Tre snabba fält — sedan kan du visa upp ditt första bygge.
      </p>

      <form onSubmit={handleSubmit} className="space-y-7" noValidate>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-semibold text-ink mb-1.5">
            Användarnamn <span className="text-bug-red">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mud text-sm select-none">
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
              className="w-full pl-7 pr-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green placeholder:text-mud/60"
              maxLength={20}
              autoComplete="username"
              autoFocus
            />
          </div>
          {errors.username ? (
            <p className="mt-1.5 text-xs text-bug-red">{errors.username}</p>
          ) : (
            <p className="mt-1.5 text-xs text-mud">
              Syns på din profil. Kan ändras senare.
            </p>
          )}
        </div>

        {/* Display name */}
        <div>
          <label htmlFor="displayName" className="block text-sm font-semibold text-ink mb-1.5">
            Visningsnamn <span className="text-bug-red">*</span>
          </label>
          <input
            id="displayName"
            type="text"
            value={form.displayName}
            onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
            placeholder="Ditt namn"
            className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green placeholder:text-mud/60"
            maxLength={50}
            autoComplete="name"
          />
          {errors.displayName && (
            <p className="mt-1.5 text-xs text-bug-red">{errors.displayName}</p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-semibold text-ink mb-1.5">
            Kort bio{" "}
            <span className="text-mud font-normal">(valfri)</span>
          </label>
          <textarea
            id="bio"
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="Vad bygger du? Vad är du bra på? Vad håller du på att lära dig?"
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green resize-none placeholder:text-mud/60"
            maxLength={160}
          />
          <p className="mt-1 text-xs text-mud text-right">
            {form.bio.length}/160
          </p>
        </div>

        {/* Tools */}
        <div>
          <p className="block text-sm font-semibold text-ink mb-1.5">
            Vilka verktyg använder du?{" "}
            <span className="text-mud font-normal">(valfri)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TOOLS.map((tool) => {
              const selected = form.tools.includes(tool);
              return (
                <button
                  key={tool}
                  type="button"
                  onClick={() => toggleTool(tool)}
                  aria-pressed={selected}
                  className={[
                    "rounded-xl border-2 border-ink px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wide transition-all duration-150",
                    selected
                      ? "bg-build-green text-paper shadow-[2px_2px_0_0_var(--ink)]"
                      : "bg-paper text-mud hover:bg-hammer-yellow hover:text-ink",
                  ].join(" ")}
                >
                  {tool}
                </button>
              );
            })}
          </div>
        </div>

        {errors.submit && (
          <div className="chunky-sm rounded-xl bg-bug-red/10 p-3">
            <p className="text-sm font-medium text-bug-red">{errors.submit}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="chunky pressable w-full rounded-xl bg-build-green py-3 font-mono text-sm font-bold uppercase tracking-wide text-paper disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
        >
          {saving ? "Sparar..." : "Klar — visa upp mitt första bygge →"}
        </button>
      </form>
    </div>
  );
}
