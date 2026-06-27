"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  slugify,
  makeUniqueHelpSlug,
  createHelpPost,
} from "@/lib/firebase/help-client";
import { TOOL_OPTIONS } from "@/lib/constants/tools";
import { grantXpClient } from "@/lib/xp/grant-client";
import { LevelUpBurst } from "@/components/levels/LevelUpBurst";

interface FormState {
  title: string;
  tool: string;
  body: string;
}

const INITIAL: FormState = { title: "", tool: "", body: "" };

export function HelpForm() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromOnboarding = searchParams.get("from") === "onboarding";
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const pendingDest = useRef<string | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined as unknown as string }));
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Skriv en kort rubrik — vad försöker du göra?";
    else if (form.title.length > 120) errs.title = "Max 120 tecken.";
    if (!form.tool) errs.tool = "Välj ett verktyg.";
    if (!form.body.trim()) errs.body = "Beskriv vad som strular. Ju mer detalj, desto lättare att hjälpa.";
    else if (form.body.length > 2000) errs.body = "Max 2 000 tecken.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    setErrors({});
    try {
      const slug = await makeUniqueHelpSlug(form.title);
      const displayName = (profile?.displayName?.trim() || user.displayName?.trim() || user.email?.split("@")[0]) ?? "Byggare";
      const { slug: finalSlug } = await createHelpPost({
        userId: user.uid,
        userDisplayName: displayName,
        userAvatarUrl: profile?.avatarUrl || user.photoURL || "",
        username: profile?.username || displayName.toLowerCase().replace(/\s+/g, ""),
        title: form.title.trim(),
        slug,
        body: form.body.trim(),
        tool: form.tool,
      });
      // Första frågan ger Byggkraft → ev. Level 1. Idempotent server-side.
      const xp = await grantXpClient("first_problem_created");
      await refreshProfile();

      const dest =
        fromOnboarding && profile?.username
          ? `/profile/${profile.username}`
          : `/problemhornan/${finalSlug}`;

      if (xp?.leveledUp) {
        pendingDest.current = dest;
        setLevelUp(xp.level);
      } else {
        router.push(dest);
      }
    } catch {
      setErrors({ submit: "Något gick fel. Försök igen om en stund." });
      setSaving(false);
    }
  }

  const slugPreview = slugify(form.title);

  return (
    <>
    {levelUp !== null && (
      <LevelUpBurst
        level={levelUp}
        onDone={() => router.push(pendingDest.current ?? "/problemhornan")}
      />
    )}
    <form onSubmit={handleSubmit} className="mt-10 space-y-7" noValidate>
      {/* Rubrik */}
      <div>
        <label htmlFor="title" className="block font-mono text-xs font-bold uppercase tracking-widest text-mud mb-1.5">
          Vad försöker du göra? <span className="text-bug-red">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="T.ex. Koppla Stripe-webhook till Firebase"
          maxLength={120}
          autoFocus
          className="chunky w-full rounded-2xl border-2 border-ink bg-paper px-4 py-3 font-mono text-sm text-ink placeholder:text-mud/50 focus:outline-none focus:ring-2 focus:ring-hammer-yellow"
        />
        {slugPreview && (
          <p className="mt-1.5 font-mono text-xs text-mud">
            aibyggare.se/problemhornan/<span className="text-ink font-semibold">{slugPreview}</span>
          </p>
        )}
        {errors.title && <p className="mt-1 font-mono text-xs text-bug-red">{errors.title}</p>}
      </div>

      {/* Verktyg */}
      <div>
        <label className="block font-mono text-xs font-bold uppercase tracking-widest text-mud mb-1.5">
          Vilket verktyg? <span className="text-bug-red">*</span>
        </label>
        <select
          value={form.tool}
          onChange={(e) => set("tool", e.target.value)}
          className="chunky w-full rounded-2xl border-2 border-ink bg-paper px-4 py-3 font-mono text-sm text-ink focus:outline-none focus:ring-2 focus:ring-hammer-yellow"
        >
          <option value="">Välj verktyg…</option>
          {TOOL_OPTIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.tool && <p className="mt-1 font-mono text-xs text-bug-red">{errors.tool}</p>}
      </div>

      {/* Beskrivning */}
      <div>
        <label htmlFor="body" className="block font-mono text-xs font-bold uppercase tracking-widest text-mud mb-1.5">
          Beskriv vad som strular <span className="text-bug-red">*</span>
        </label>
        <textarea
          id="body"
          value={form.body}
          onChange={(e) => set("body", e.target.value)}
          placeholder="Vad försökte du göra? Vad hände? Vad har du provat? Ju mer kontext, desto lättare att hjälpa."
          rows={8}
          maxLength={2000}
          className="chunky w-full rounded-2xl border-2 border-ink bg-cream px-4 py-3 font-mono text-sm text-ink placeholder:text-mud/50 focus:outline-none focus:ring-2 focus:ring-hammer-yellow resize-none"
        />
        <p className="mt-1 text-right font-mono text-[10px] text-mud/60">
          {form.body.length}/2 000
        </p>
        {errors.body && <p className="mt-1 font-mono text-xs text-bug-red">{errors.body}</p>}
      </div>

      {errors.submit && (
        <p className="font-mono text-xs text-bug-red">{errors.submit}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="chunky pressable w-full rounded-2xl bg-hammer-yellow px-6 py-4 font-mono text-sm font-bold uppercase tracking-wide text-ink disabled:opacity-50"
      >
        {saving ? "Skickar…" : "Lägg upp problemet →"}
      </button>
    </form>
    </>
  );
}
