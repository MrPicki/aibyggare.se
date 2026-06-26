"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import {
  slugify,
  makeUniqueSlug,
  uploadProjectImage,
  createProject,
} from "@/lib/firebase/projects-client";
import { grantXpClient } from "@/lib/xp/grant-client";
import { LevelUpBurst } from "@/components/levels/LevelUpBurst";
import { PROJECT_STATUS_OPTIONS } from "@/lib/constants/project-status";
import type { ProjectStatus } from "@/types/firestore";

const STACK_OPTIONS = [
  "Claude Code", "Claude AI", "Cursor", "Lovable", "Bolt", "Replit",
  "Supabase", "Firebase", "Vercel", "Next.js", "React", "TypeScript",
  "Node.js", "Python", "Stripe", "GitHub", "ChatGPT", "Midjourney",
];

interface FormState {
  title: string;
  tagline: string;
  description: string;
  problem: string;
  stack: string[];
  status: ProjectStatus;
  projectUrl: string;
  githubUrl: string;
  feedbackWanted: string;
}

const INITIAL: FormState = {
  title: "",
  tagline: "",
  description: "",
  problem: "",
  stack: [],
  status: "mvp",
  projectUrl: "",
  githubUrl: "",
  feedbackWanted: "",
};

function urlOrEmpty(v: string): boolean {
  if (!v.trim()) return true;
  try { new URL(v); return true; } catch { return false; }
}

export function ProjectForm() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromOnboarding = searchParams.get("from") === "onboarding";
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(INITIAL);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const pendingDest = useRef<string | null>(null);

  const slugPreview = slugify(form.title);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleStack(tool: string) {
    set(
      "stack",
      form.stack.includes(tool)
        ? form.stack.filter((t) => t !== tool)
        : [...form.stack, tool]
    );
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((err) => ({ ...err, image: "Bilden är för stor. Max 5 MB." }));
      return;
    }
    setErrors((err) => ({ ...err, image: "" }));
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Ge bygget en titel.";
    else if (form.title.length > 80) errs.title = "Max 80 tecken.";
    if (!form.tagline.trim()) errs.tagline = "Skriv en kort beskrivning.";
    else if (form.tagline.length > 160) errs.tagline = "Max 160 tecken.";
    if (!urlOrEmpty(form.projectUrl)) errs.projectUrl = "Ogiltig URL. Börja med https://";
    if (!urlOrEmpty(form.githubUrl)) errs.githubUrl = "Ogiltig URL. Börja med https://";
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
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadProjectImage(imageFile, user.uid);
      }

      const slug = await makeUniqueSlug(form.title);

      // Try to get username from Firestore profile (denormalized displayName fallback)
      const displayName =
        ((user.displayName ?? "").trim() || user.email?.split("@")[0]) ?? "Byggare";

      await createProject({
        userId: user.uid,
        userDisplayName: displayName,
        userAvatarUrl: user.photoURL ?? "",
        title: form.title.trim(),
        slug,
        tagline: form.tagline.trim(),
        description: form.description.trim(),
        problem: form.problem.trim(),
        stack: form.stack,
        status: form.status,
        projectUrl: form.projectUrl.trim(),
        githubUrl: form.githubUrl.trim(),
        imageUrl,
        feedbackWanted: form.feedbackWanted.trim(),
      });

      // Första bygget ger Byggkraft → ev. Level 1. Idempotent server-side.
      const xp = await grantXpClient("first_project_created");
      await refreshProfile();

      // Från onboarding → landa på profilen (där bygget nu syns). Annars
      // direkt till bygget.
      const dest =
        fromOnboarding && profile?.username
          ? `/profile/${profile.username}`
          : `/projects/${slug}`;

      if (xp?.leveledUp) {
        pendingDest.current = dest;
        setLevelUp(xp.level); // LevelUpBurst navigerar vidare när den stängs
      } else {
        router.push(dest);
      }
    } catch {
      setErrors({ submit: "Något gick fel. Försök igen om en stund." });
      setSaving(false);
    }
  }

  return (
    <>
    {levelUp !== null && (
      <LevelUpBurst
        level={levelUp}
        onDone={() => router.push(pendingDest.current ?? "/projects")}
      />
    )}
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>

      {/* Titel */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-ink mb-1.5">
          Titel <span className="text-bug-red">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="t.ex. Smartbok.se"
          maxLength={80}
          autoFocus
          className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green placeholder:text-mud/60"
        />
        {slugPreview && (
          <p className="mt-1.5 font-mono text-xs text-mud">
            aibyggare.se/projects/<span className="text-ink font-semibold">{slugPreview}</span>
          </p>
        )}
        {errors.title && <p className="mt-1 text-xs text-bug-red">{errors.title}</p>}
      </div>

      {/* Tagline */}
      <div>
        <label htmlFor="tagline" className="block text-sm font-semibold text-ink mb-1.5">
          En mening <span className="text-bug-red">*</span>
          <span className="ml-2 font-normal text-mud">— vad gör bygget?</span>
        </label>
        <input
          id="tagline"
          type="text"
          value={form.tagline}
          onChange={(e) => set("tagline", e.target.value)}
          placeholder="t.ex. Foton på kvitton in, ordning ut."
          maxLength={160}
          className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green placeholder:text-mud/60"
        />
        <p className="mt-1 text-right text-xs text-mud">{form.tagline.length}/160</p>
        {errors.tagline && <p className="text-xs text-bug-red">{errors.tagline}</p>}
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-semibold text-ink mb-1.5">
          Status <span className="text-bug-red">*</span>
        </label>
        <select
          id="status"
          value={form.status}
          onChange={(e) => set("status", e.target.value as ProjectStatus)}
          className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green"
        >
          {PROJECT_STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Beskrivning */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-ink mb-1.5">
          Längre beskrivning <span className="text-mud font-normal">(valfri)</span>
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Vad är problemet du löser? Hur fungerar det? Vad är du stolt över?"
          rows={4}
          className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green resize-none placeholder:text-mud/60"
        />
      </div>

      {/* Stack */}
      <div>
        <p className="block text-sm font-semibold text-ink mb-2">
          Vilka verktyg använder du? <span className="text-mud font-normal">(valfri)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {STACK_OPTIONS.map((tool) => {
            const selected = form.stack.includes(tool);
            return (
              <button
                key={tool}
                type="button"
                onClick={() => toggleStack(tool)}
                aria-pressed={selected}
                className={[
                  "rounded-xl border-2 border-ink px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wide transition-all duration-100",
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

      {/* URLs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="projectUrl" className="block text-sm font-semibold text-ink mb-1.5">
            Länk till projektet <span className="text-mud font-normal">(valfri)</span>
          </label>
          <input
            id="projectUrl"
            type="url"
            value={form.projectUrl}
            onChange={(e) => set("projectUrl", e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green placeholder:text-mud/60"
          />
          {errors.projectUrl && <p className="mt-1 text-xs text-bug-red">{errors.projectUrl}</p>}
        </div>
        <div>
          <label htmlFor="githubUrl" className="block text-sm font-semibold text-ink mb-1.5">
            GitHub-länk <span className="text-mud font-normal">(valfri)</span>
          </label>
          <input
            id="githubUrl"
            type="url"
            value={form.githubUrl}
            onChange={(e) => set("githubUrl", e.target.value)}
            placeholder="https://github.com/..."
            className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green placeholder:text-mud/60"
          />
          {errors.githubUrl && <p className="mt-1 text-xs text-bug-red">{errors.githubUrl}</p>}
        </div>
      </div>

      {/* Feedback */}
      <div>
        <label htmlFor="feedbackWanted" className="block text-sm font-semibold text-ink mb-1.5">
          Vad vill du ha feedback på? <span className="text-mud font-normal">(valfri)</span>
        </label>
        <textarea
          id="feedbackWanted"
          value={form.feedbackWanted}
          onChange={(e) => set("feedbackWanted", e.target.value)}
          placeholder="t.ex. Är tagline tydlig? Saknar du något? Skulle du betala för det här?"
          rows={2}
          className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green resize-none placeholder:text-mud/60"
        />
      </div>

      {/* Bild */}
      <div>
        <p className="block text-sm font-semibold text-ink mb-2">
          Omslagsbild <span className="text-mud font-normal">(valfri · max 5 MB)</span>
        </p>
        {imagePreview ? (
          <div className="relative">
            <Image
              src={imagePreview}
              alt="Förhandsgranskning"
              width={600}
              height={300}
              className="w-full rounded-xl border-2 border-ink object-cover"
              style={{ maxHeight: 220 }}
            />
            <button
              type="button"
              onClick={() => { setImageFile(null); setImagePreview(null); }}
              className="absolute right-2 top-2 rounded-lg border-2 border-ink bg-paper px-2 py-0.5 font-mono text-xs font-bold text-ink hover:bg-bug-red hover:text-paper transition-colors"
            >
              Ta bort
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink py-8 font-mono text-sm font-semibold text-mud hover:border-build-green hover:text-build-green transition-colors"
          >
            + Välj bild
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageChange}
          className="hidden"
        />
        {errors.image && <p className="mt-1 text-xs text-bug-red">{errors.image}</p>}
      </div>

      {errors.submit && (
        <div className="chunky-sm rounded-xl bg-bug-red/10 p-3">
          <p className="text-sm font-medium text-bug-red">{errors.submit}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="chunky pressable w-full rounded-xl bg-build-green py-3.5 font-mono text-sm font-bold uppercase tracking-wide text-paper disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
      >
        {saving ? "Publicerar..." : "Publicera bygget →"}
      </button>
    </form>
    </>
  );
}
