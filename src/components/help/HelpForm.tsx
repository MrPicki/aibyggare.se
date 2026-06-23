"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  slugify,
  makeUniqueHelpSlug,
  createHelpPost,
} from "@/lib/firebase/help-client";
import { TOOL_OPTIONS } from "@/lib/constants/tools";

interface FormState {
  title: string;
  tools: string[];
  body: string;
  tryFix: string;
  alreadyTried: string;
  projectUrl: string;
}

const INITIAL: FormState = {
  title: "",
  tools: [],
  body: "",
  tryFix: "",
  alreadyTried: "",
  projectUrl: "",
};

function urlOrEmpty(v: string): boolean {
  if (!v.trim()) return true;
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

export function HelpForm() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleTool(tool: string) {
    set(
      "tools",
      form.tools.includes(tool)
        ? form.tools.filter((t) => t !== tool)
        : [...form.tools, tool]
    );
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Skriv en titel — vad försöker du göra?";
    else if (form.title.length > 120) errs.title = "Max 120 tecken.";
    if (form.tools.length === 0) errs.tools = "Välj minst ett verktyg.";
    if (!form.body.trim()) errs.body = "Beskriv vad du försöker göra.";
    else if (form.body.length > 1000) errs.body = "Max 1 000 tecken.";
    if (!form.tryFix.trim()) errs.tryFix = "Beskriv vad som gick fel eller vad du är osäker på.";
    else if (form.tryFix.length > 1000) errs.tryFix = "Max 1 000 tecken.";
    if (form.alreadyTried.length > 500) errs.alreadyTried = "Max 500 tecken.";
    if (!urlOrEmpty(form.projectUrl)) errs.projectUrl = "Ogiltig URL. Börja med https://";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      const slug = await makeUniqueHelpSlug(form.title);
      const displayName =
        (user.displayName?.trim() || user.email?.split("@")[0]) ?? "Byggare";

      const { slug: finalSlug } = await createHelpPost({
        userId: user.uid,
        userDisplayName: displayName,
        userAvatarUrl: user.photoURL ?? "",
        username: displayName.toLowerCase().replace(/\s+/g, ""),
        title: form.title.trim(),
        slug,
        body: form.body.trim(),
        tryFix: form.tryFix.trim(),
        alreadyTried: form.alreadyTried.trim(),
        projectUrl: form.projectUrl.trim(),
        tools: form.tools,
      });

      router.push(`/help/${finalSlug}`);
    } catch {
      setErrors({ submit: "Något gick fel. Försök igen om en stund." });
      setSaving(false);
    }
  }

  const slugPreview = slugify(form.title);

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>

      {/* Titel */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-ink mb-1.5">
          Vad försöker du göra? <span className="text-bug-red">*</span>
          <span className="ml-2 font-normal text-mud">— en kort mening</span>
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="t.ex. Koppla Stripe-webhook till min Firebase-databas"
          maxLength={120}
          autoFocus
          className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green placeholder:text-mud/60"
        />
        {slugPreview && (
          <p className="mt-1.5 font-mono text-xs text-mud">
            aibyggare.se/help/<span className="text-ink font-semibold">{slugPreview}</span>
          </p>
        )}
        {errors.title && <p className="mt-1 text-xs text-bug-red">{errors.title}</p>}
      </div>

      {/* Verktyg */}
      <div>
        <p className="block text-sm font-semibold text-ink mb-2">
          Vilket/vilka verktyg handlar det om? <span className="text-bug-red">*</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {TOOL_OPTIONS.map((tool) => {
            const selected = form.tools.includes(tool);
            return (
              <button
                key={tool}
                type="button"
                onClick={() => toggleTool(tool)}
                aria-pressed={selected}
                className={[
                  "rounded-xl border-2 border-ink px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wide transition-all duration-100",
                  selected
                    ? "bg-hammer-yellow text-ink shadow-[2px_2px_0_0_var(--ink)]"
                    : "bg-paper text-mud hover:bg-cream hover:text-ink",
                ].join(" ")}
              >
                {tool}
              </button>
            );
          })}
        </div>
        {errors.tools && <p className="mt-1.5 text-xs text-bug-red">{errors.tools}</p>}
      </div>

      {/* Vad du försökte göra */}
      <div>
        <label htmlFor="body" className="block text-sm font-semibold text-ink mb-1.5">
          Vad försökte du göra? <span className="text-bug-red">*</span>
        </label>
        <p className="text-xs text-mud mb-2">
          Beskriv kontexten. Vad är det du vill uppnå, och i vilket sammanhang?
        </p>
        <textarea
          id="body"
          value={form.body}
          onChange={(e) => set("body", e.target.value)}
          placeholder="t.ex. Jag försöker fånga upp Stripe checkout.session.completed och spara orderns data i Firestore..."
          rows={4}
          maxLength={1000}
          className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green resize-none placeholder:text-mud/60"
        />
        <p className="mt-1 text-right text-xs text-mud">{form.body.length}/1000</p>
        {errors.body && <p className="text-xs text-bug-red">{errors.body}</p>}
      </div>

      {/* Vad gick fel */}
      <div>
        <label htmlFor="tryFix" className="block text-sm font-semibold text-ink mb-1.5">
          Vad gick fel? Vad är du osäker på? <span className="text-bug-red">*</span>
        </label>
        <p className="text-xs text-mud mb-2">
          Beskriv problemet. Felmeddelande? Oväntat beteende? Vet inte hur man börjar?
        </p>
        <textarea
          id="tryFix"
          value={form.tryFix}
          onChange={(e) => set("tryFix", e.target.value)}
          placeholder="t.ex. Webhooken svarar 200 men inget skrivs till Firestore. Firestore-loggen visar inga writes..."
          rows={4}
          maxLength={1000}
          className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green resize-none placeholder:text-mud/60"
        />
        <p className="mt-1 text-right text-xs text-mud">{form.tryFix.length}/1000</p>
        {errors.tryFix && <p className="text-xs text-bug-red">{errors.tryFix}</p>}
      </div>

      {/* Vad du redan provat */}
      <div>
        <label htmlFor="alreadyTried" className="block text-sm font-semibold text-ink mb-1.5">
          Vad har du redan provat?{" "}
          <span className="text-mud font-normal">(valfri — men gör det lättare att hjälpa)</span>
        </label>
        <textarea
          id="alreadyTried"
          value={form.alreadyTried}
          onChange={(e) => set("alreadyTried", e.target.value)}
          placeholder="t.ex. Kollat att webhook-secretet stämmer. Verifierat med Stripe CLI lokalt. Läst dokumentationen för..."
          rows={3}
          maxLength={500}
          className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green resize-none placeholder:text-mud/60"
        />
        {errors.alreadyTried && (
          <p className="mt-1 text-xs text-bug-red">{errors.alreadyTried}</p>
        )}
      </div>

      {/* Länk */}
      <div>
        <label htmlFor="projectUrl" className="block text-sm font-semibold text-ink mb-1.5">
          Länk till projekt eller kod{" "}
          <span className="text-mud font-normal">(valfri)</span>
        </label>
        <input
          id="projectUrl"
          type="url"
          value={form.projectUrl}
          onChange={(e) => set("projectUrl", e.target.value)}
          placeholder="https://github.com/... eller https://..."
          className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green placeholder:text-mud/60"
        />
        {errors.projectUrl && (
          <p className="mt-1 text-xs text-bug-red">{errors.projectUrl}</p>
        )}
      </div>

      {errors.submit && (
        <div className="rounded-xl bg-bug-red/10 border-2 border-bug-red/30 p-3">
          <p className="text-sm font-medium text-bug-red">{errors.submit}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="chunky pressable w-full rounded-xl bg-hammer-yellow py-3.5 font-mono text-sm font-bold uppercase tracking-wide text-ink disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
      >
        {saving ? "Skickar..." : "Skicka frågan →"}
      </button>
    </form>
  );
}
