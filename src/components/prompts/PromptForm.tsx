"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { TOOL_OPTIONS } from "@/lib/constants/tools";
import {
  makeUniquePromptSlug,
  createPromptPost,
  getUsernameFromProfile,
} from "@/lib/firebase/prompts-client";

interface FormState {
  title: string;
  tool: string;
  badge: string;
  body: string;
}

const EMPTY: FormState = { title: "", tool: "", badge: "", body: "" };

const BADGE_SUGGESTIONS = [
  "Stoppar panikfixar",
  "Nybörjarvänlig",
  "Räddar frontend",
  "Snabbare debug",
  "Ren kod",
  "Bättre förklaringar",
  "Säker refactor",
  "Databashjälp",
];

export function PromptForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    getUsernameFromProfile(user.uid).then(setUsername);
  }, [user]);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);

  function set(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.title.trim()) e.title = "Fyll i ett namn på prompten";
    if (form.title.trim().length > 100) e.title = "Max 100 tecken";
    if (!form.tool) e.tool = "Välj ett verktyg";
    if (!form.badge.trim()) e.badge = "Fyll i en kategori";
    if (form.badge.trim().length > 40) e.badge = "Max 40 tecken";
    if (!form.body.trim()) e.body = "Fyll i prompt-texten";
    if (form.body.trim().length > 2000) e.body = "Max 2 000 tecken";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !validate()) return;
    setSubmitting(true);
    try {
      const slug = await makeUniquePromptSlug(form.title);
      await createPromptPost({
        userId: user.uid,
        userDisplayName: user.displayName ?? "Anonym",
        userAvatarUrl: user.photoURL ?? "",
        username: username || user.uid.slice(0, 8),
        title: form.title.trim(),
        slug,
        body: form.body.trim(),
        tool: form.tool,
        badge: form.badge.trim(),
      });
      router.push(`/prompts/${slug}`);
    } catch {
      setErrors({ title: "Något gick fel. Försök igen." });
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-7">
      {/* Titel */}
      <div>
        <label className="block font-mono text-xs font-bold uppercase tracking-widest text-mud mb-1.5">
          Namn på prompten <span className="text-bug-red">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="T.ex. Debugga utan att koda direkt"
          maxLength={100}
          className="chunky w-full rounded-2xl border-2 border-ink bg-paper px-4 py-3 font-mono text-sm text-ink placeholder:text-mud/50 focus:outline-none focus:ring-2 focus:ring-prompt-purple"
        />
        {errors.title && (
          <p className="mt-1.5 font-mono text-xs text-bug-red">{errors.title}</p>
        )}
      </div>

      {/* Verktyg */}
      <div>
        <label className="block font-mono text-xs font-bold uppercase tracking-widest text-mud mb-1.5">
          Verktyg <span className="text-bug-red">*</span>
        </label>
        <select
          value={form.tool}
          onChange={(e) => set("tool", e.target.value)}
          className="chunky w-full rounded-2xl border-2 border-ink bg-paper px-4 py-3 font-mono text-sm text-ink focus:outline-none focus:ring-2 focus:ring-prompt-purple"
        >
          <option value="">Välj verktyg…</option>
          {TOOL_OPTIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.tool && (
          <p className="mt-1.5 font-mono text-xs text-bug-red">{errors.tool}</p>
        )}
      </div>

      {/* Kategori / badge */}
      <div>
        <label className="block font-mono text-xs font-bold uppercase tracking-widest text-mud mb-1.5">
          Kategori <span className="text-bug-red">*</span>
        </label>
        <input
          type="text"
          value={form.badge}
          onChange={(e) => set("badge", e.target.value)}
          placeholder="T.ex. Stoppar panikfixar"
          maxLength={40}
          className="chunky w-full rounded-2xl border-2 border-ink bg-paper px-4 py-3 font-mono text-sm text-ink placeholder:text-mud/50 focus:outline-none focus:ring-2 focus:ring-prompt-purple"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {BADGE_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => set("badge", s)}
              className="rounded-xl border-2 border-ink px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-mud hover:bg-cream hover:text-ink transition-all"
            >
              {s}
            </button>
          ))}
        </div>
        {errors.badge && (
          <p className="mt-1.5 font-mono text-xs text-bug-red">{errors.badge}</p>
        )}
      </div>

      {/* Prompt-text */}
      <div>
        <label className="block font-mono text-xs font-bold uppercase tracking-widest text-mud mb-1.5">
          Prompten <span className="text-bug-red">*</span>
        </label>
        <textarea
          value={form.body}
          onChange={(e) => set("body", e.target.value)}
          placeholder="Skriv eller klistra in prompten här…"
          rows={8}
          maxLength={2000}
          className="chunky w-full rounded-2xl border-2 border-ink bg-cream px-4 py-3 font-mono text-sm text-ink placeholder:text-mud/50 focus:outline-none focus:ring-2 focus:ring-prompt-purple resize-none"
        />
        <p className="mt-1 text-right font-mono text-[10px] text-mud/60">
          {form.body.length}/2 000
        </p>
        {errors.body && (
          <p className="mt-1 font-mono text-xs text-bug-red">{errors.body}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="chunky pressable w-full rounded-2xl bg-prompt-purple px-6 py-4 font-mono text-sm font-bold uppercase tracking-wide text-paper disabled:opacity-50"
      >
        {submitting ? "Sparar…" : "Dela prompten →"}
      </button>
    </form>
  );
}
