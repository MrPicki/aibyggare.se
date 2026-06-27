"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getProjectBySlugClient,
  updateProject,
  uploadProjectImage,
  UpdateProjectInput,
} from "@/lib/firebase/projects-client";
import { PROJECT_STATUS_OPTIONS } from "@/lib/constants/project-status";
import type { Project, ProjectStatus } from "@/types/firestore";

const STACK_OPTIONS = [
  "Claude Code", "Claude AI", "Cursor", "Lovable", "Bolt", "Replit",
  "Supabase", "Firebase", "Vercel", "Next.js", "React", "TypeScript",
  "Node.js", "Python", "Stripe", "GitHub", "ChatGPT", "Midjourney",
];

function urlOrEmpty(v: string): boolean {
  if (!v.trim()) return true;
  try { new URL(v); return true; } catch { return false; }
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { user, loading } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [form, setForm] = useState<UpdateProjectInput & { title: string; tagline: string }>({
    title: "", tagline: "", description: "", problem: "",
    stack: [], status: "mvp", projectUrl: "", githubUrl: "", feedbackWanted: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Hämta projektet när user är redo
  useEffect(() => {
    if (loading) return;
    if (!user) { router.push(`/login?from=/projects/${slug}/edit`); return; }

    getProjectBySlugClient(slug).then((p) => {
      if (!p) { setLoadError(true); return; }
      if (p.userId !== user.uid) { router.push(`/projects/${slug}`); return; }
      setProject(p);
      setForm({
        title: p.title,
        tagline: p.tagline,
        description: p.description ?? "",
        problem: p.problem ?? "",
        stack: p.stack ?? [],
        status: p.status,
        projectUrl: p.projectUrl ?? "",
        githubUrl: p.githubUrl ?? "",
        feedbackWanted: p.feedbackWanted ?? "",
      });
      if (p.imageUrl) setImagePreview(p.imageUrl);
    }).catch(() => setLoadError(true));
  }, [user, loading, slug, router]);

  if (loading || (!project && !loadError)) {
    return <div className="mx-auto max-w-2xl px-4 py-20 text-center font-mono text-mud">Laddar…</div>;
  }
  if (loadError) {
    return <div className="mx-auto max-w-2xl px-4 py-20 text-center font-mono text-bug-red">Kunde inte ladda bygget.</div>;
  }

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleStack(tool: string) {
    set("stack", form.stack.includes(tool)
      ? form.stack.filter((t) => t !== tool)
      : [...form.stack, tool]);
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
    if (!urlOrEmpty(form.projectUrl)) errs.projectUrl = "Ogiltig URL.";
    if (!urlOrEmpty(form.githubUrl)) errs.githubUrl = "Ogiltig URL.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!project || !user) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    setErrors({});
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadProjectImage(imageFile, user.uid);
      }
      await updateProject(project.id, { ...form, imageUrl });
      router.push(`/projects/${slug}`);
    } catch {
      setErrors({ submit: "Något gick fel. Försök igen om en stund." });
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <Link
        href={`/projects/${slug}`}
        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-mud hover:text-build-green transition-colors"
      >
        <ArrowLeft size={14} /> Tillbaka till bygget
      </Link>

      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-ink">
        Redigera bygget
      </h1>
      <p className="mt-2 text-mud mb-10">Sluggen ({slug}) ändras inte — befintliga länkar funkar.</p>

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* Titel */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-ink mb-1.5">
            Titel <span className="text-bug-red">*</span>
          </label>
          <input id="title" type="text" value={form.title}
            onChange={(e) => set("title", e.target.value)} maxLength={80}
            className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green"
          />
          {errors.title && <p className="mt-1 text-xs text-bug-red">{errors.title}</p>}
        </div>

        {/* Tagline */}
        <div>
          <label htmlFor="tagline" className="block text-sm font-semibold text-ink mb-1.5">
            En mening <span className="text-bug-red">*</span>
          </label>
          <input id="tagline" type="text" value={form.tagline}
            onChange={(e) => set("tagline", e.target.value)} maxLength={160}
            className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green"
          />
          <p className="mt-1 text-right text-xs text-mud">{form.tagline.length}/160</p>
          {errors.tagline && <p className="text-xs text-bug-red">{errors.tagline}</p>}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-semibold text-ink mb-1.5">Status</label>
          <select id="status" value={form.status}
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
          <textarea id="description" value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4} className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green resize-none"
          />
        </div>

        {/* Stack */}
        <div>
          <p className="block text-sm font-semibold text-ink mb-2">Verktyg <span className="text-mud font-normal">(valfri)</span></p>
          <div className="flex flex-wrap gap-2">
            {STACK_OPTIONS.map((tool) => {
              const selected = form.stack.includes(tool);
              return (
                <button key={tool} type="button" onClick={() => toggleStack(tool)}
                  aria-pressed={selected}
                  className={[
                    "rounded-xl border-2 border-ink px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wide transition-all",
                    selected ? "bg-build-green text-paper shadow-[2px_2px_0_0_var(--ink)]" : "bg-paper text-mud hover:bg-hammer-yellow hover:text-ink",
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
              Projektlänk <span className="text-mud font-normal">(valfri)</span>
            </label>
            <input id="projectUrl" type="url" value={form.projectUrl}
              onChange={(e) => set("projectUrl", e.target.value)} placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green placeholder:text-mud/60"
            />
            {errors.projectUrl && <p className="mt-1 text-xs text-bug-red">{errors.projectUrl}</p>}
          </div>
          <div>
            <label htmlFor="githubUrl" className="block text-sm font-semibold text-ink mb-1.5">
              GitHub-länk <span className="text-mud font-normal">(valfri)</span>
            </label>
            <input id="githubUrl" type="url" value={form.githubUrl}
              onChange={(e) => set("githubUrl", e.target.value)} placeholder="https://github.com/..."
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
          <textarea id="feedbackWanted" value={form.feedbackWanted}
            onChange={(e) => set("feedbackWanted", e.target.value)}
            rows={2} className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green resize-none"
          />
        </div>

        {/* Bild */}
        <div>
          <p className="block text-sm font-semibold text-ink mb-2">
            Omslagsbild <span className="text-mud font-normal">(valfri · byt ut befintlig)</span>
          </p>
          {imagePreview ? (
            <div className="relative">
              <Image src={imagePreview} alt="Förhandsgranskning" width={600} height={300}
                className="w-full rounded-xl border-2 border-ink object-cover" style={{ maxHeight: 220 }}
              />
              <button type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); set("imageUrl" as keyof typeof form, ""); }}
                className="absolute right-2 top-2 rounded-lg border-2 border-ink bg-paper px-2 py-0.5 font-mono text-xs font-bold text-ink hover:bg-bug-red hover:text-paper transition-colors"
              >
                Ta bort
              </button>
            </div>
          ) : (
            <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink py-8 font-mono text-sm font-semibold text-mud hover:border-build-green hover:text-build-green transition-colors">
              + Välj bild
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange} className="hidden" />
            </label>
          )}
          {errors.image && <p className="mt-1 text-xs text-bug-red">{errors.image}</p>}
        </div>

        {errors.submit && (
          <div className="chunky-sm rounded-xl bg-bug-red/10 p-3">
            <p className="text-sm font-medium text-bug-red">{errors.submit}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="chunky pressable flex-1 rounded-xl bg-build-green py-3.5 font-mono text-sm font-bold uppercase tracking-wide text-paper disabled:opacity-60 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
          >
            {saving ? "Sparar..." : "Spara ändringar →"}
          </button>
          <Link href={`/projects/${slug}`}
            className="rounded-xl border-2 border-ink px-5 py-3.5 font-mono text-sm font-bold uppercase tracking-wide text-ink hover:bg-hammer-yellow transition-colors"
          >
            Avbryt
          </Link>
        </div>
      </form>
    </div>
  );
}
