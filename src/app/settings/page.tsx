"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  doc,
  getDoc,
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

const ILLUSTRATED_AVATARS = [
  { url: "/seed/avatar-female.png",  label: "Tjej" },
  { url: "/seed/avatar-neutral.png", label: "Neutral" },
  { url: "/seed/avatar-male.png",    label: "Kille" },
];

interface ProfileForm {
  username: string;
  displayName: string;
  bio: string;
  tools: string[];
  avatarUrl: string;
  websiteUrl: string;
  githubUrl: string;
  linkedinUrl: string;
}

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login?from=/settings");
  }, [user, loading, router]);

  if (loading || !user) return null;

  return <SettingsForm user={user} />;
}

function SettingsForm({ user }: { user: User }) {
  const { refreshProfile } = useAuth();
  const [form, setForm] = useState<ProfileForm | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load the existing profile so the form opens pre-filled, not blank.
  useEffect(() => {
    let active = true;
    (async () => {
      const snap = await getDoc(doc(db, "profiles", user.uid));
      if (!active) return;
      const data = snap.exists() ? snap.data() : {};
      setForm({
        username: data.username ?? "",
        displayName: data.displayName ?? user.displayName ?? "",
        bio: data.bio ?? "",
        tools: Array.isArray(data.tools) ? data.tools : [],
        avatarUrl: data.avatarUrl ?? data.photoURL ?? user.photoURL ?? ILLUSTRATED_AVATARS[0].url,
        websiteUrl: data.websiteUrl ?? "",
        githubUrl: data.githubUrl ?? "",
        linkedinUrl: data.linkedinUrl ?? "",
      });
    })();
    return () => {
      active = false;
    };
  }, [user]);

  if (!form) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="h-7 w-40 animate-pulse rounded-lg bg-cream" />
        <div className="mt-6 space-y-4">
          <div className="h-20 w-full animate-pulse rounded-2xl bg-cream" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-cream" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-cream" />
        </div>
      </div>
    );
  }

  function update<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
    setSaved(false);
  }

  function toggleTool(tool: string) {
    setForm((f) =>
      f
        ? {
            ...f,
            tools: f.tools.includes(tool)
              ? f.tools.filter((t) => t !== tool)
              : [...f.tools, tool],
          }
        : f
    );
    setSaved(false);
  }

  function validateUrl(value: string): boolean {
    if (!value.trim()) return true; // optional
    try {
      const u = new URL(value.trim());
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  async function validate(f: ProfileForm): Promise<Record<string, string>> {
    const errs: Record<string, string> = {};
    const u = f.username.trim();

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

    if (!f.displayName.trim()) errs.displayName = "Ange ett visningsnamn.";
    if (!validateUrl(f.websiteUrl)) errs.websiteUrl = "Ange en giltig länk (https://…).";
    if (!validateUrl(f.githubUrl)) errs.githubUrl = "Ange en giltig länk (https://…).";
    if (!validateUrl(f.linkedinUrl)) errs.linkedinUrl = "Ange en giltig länk (https://…).";

    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setErrors({});
    setSaved(false);

    const errs = await validate(form);
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
        avatarUrl: form.avatarUrl,
        websiteUrl: form.websiteUrl.trim(),
        githubUrl: form.githubUrl.trim(),
        linkedinUrl: form.linkedinUrl.trim(),
        updatedAt: serverTimestamp(),
      });
      await refreshProfile();
      setSaved(true);
    } catch {
      setErrors({ submit: "Något gick fel när profilen sparades. Försök igen om en stund." });
    } finally {
      setSaving(false);
    }
  }

  // Offer the two illustrated avatars plus the OAuth photo (if the user has one
  // that isn't already one of the illustrated options).
  const oauthPhoto = user.photoURL;
  const avatarOptions = [
    ...ILLUSTRATED_AVATARS,
    ...(oauthPhoto && !ILLUSTRATED_AVATARS.some((a) => a.url === oauthPhoto)
      ? [{ url: oauthPhoto, label: "Inloggningsbild" }]
      : []),
  ];

  return (
    <div className="mx-auto max-w-lg px-4 py-14">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-mud hover:text-build-green transition-colors"
        >
          <ArrowLeft size={14} /> Startsidan
        </Link>
        {form.username && (
          <Link
            href={`/profile/${form.username}`}
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-mud hover:text-build-green transition-colors"
          >
            Visa min profil <ExternalLink size={13} />
          </Link>
        )}
      </div>

      <h1 className="mt-6 font-display text-2xl sm:text-3xl font-bold text-ink">
        Redigera profil
      </h1>
      <p className="mt-2 text-mud">
        Det här är så andra byggare ser dig. Uppdatera när som helst.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-7" noValidate>

        {/* ── Avatar ── */}
        <div>
          <p className="block text-sm font-semibold text-ink mb-3">Profilbild</p>
          <div className="flex flex-wrap gap-5">
            {avatarOptions.map((opt) => {
              const selected = form.avatarUrl === opt.url;
              return (
                <button
                  key={opt.url}
                  type="button"
                  onClick={() => update("avatarUrl", opt.url)}
                  aria-pressed={selected}
                  aria-label={opt.label}
                  className={[
                    "relative h-20 w-20 overflow-hidden rounded-full border-4 transition-all duration-150",
                    selected
                      ? "border-build-green shadow-[0_0_0_3px_var(--build-green)]"
                      : "border-ink opacity-40 hover:opacity-70",
                  ].join(" ")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={opt.url} alt={opt.label} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  {selected && (
                    <span className="pointer-events-none absolute inset-0 flex items-end justify-center pb-1.5">
                      <span className="rounded-full bg-build-green px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-paper">
                        Vald
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Username ── */}
        <div>
          <label htmlFor="username" className="block text-sm font-semibold text-ink mb-1.5">
            Användarnamn <span className="text-bug-red">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mud text-sm select-none">@</span>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={(e) =>
                update("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
              }
              placeholder="dittnamn"
              className="w-full pl-7 pr-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green placeholder:text-mud/60"
              maxLength={20}
              autoComplete="username"
            />
          </div>
          {errors.username ? (
            <p className="mt-1.5 text-xs text-bug-red">{errors.username}</p>
          ) : (
            <p className="mt-1.5 text-xs text-mud">Din publika adress: aibyggare.se/profile/{form.username || "…"}</p>
          )}
        </div>

        {/* ── Display name ── */}
        <div>
          <label htmlFor="displayName" className="block text-sm font-semibold text-ink mb-1.5">
            Visningsnamn <span className="text-bug-red">*</span>
          </label>
          <input
            id="displayName"
            type="text"
            value={form.displayName}
            onChange={(e) => update("displayName", e.target.value)}
            placeholder="Ditt namn"
            className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green placeholder:text-mud/60"
            maxLength={50}
            autoComplete="name"
          />
          {errors.displayName && <p className="mt-1.5 text-xs text-bug-red">{errors.displayName}</p>}
        </div>

        {/* ── Bio ── */}
        <div>
          <label htmlFor="bio" className="block text-sm font-semibold text-ink mb-1.5">
            Kort bio <span className="text-mud font-normal">(valfri)</span>
          </label>
          <textarea
            id="bio"
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
            placeholder="Vad bygger du? Vad är du bra på? Vad håller du på att lära dig?"
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green resize-none placeholder:text-mud/60"
            maxLength={160}
          />
          <p className="mt-1 text-xs text-mud text-right">{form.bio.length}/160</p>
        </div>

        {/* ── Tools ── */}
        <div>
          <p className="block text-sm font-semibold text-ink mb-1.5">
            Vilka verktyg använder du? <span className="text-mud font-normal">(valfri)</span>
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

        {/* ── Links ── */}
        <div className="space-y-4 border-t-2 border-dashed border-border pt-6">
          <p className="block text-sm font-semibold text-ink">
            Länkar <span className="text-mud font-normal">(valfria)</span>
          </p>

          <div>
            <label htmlFor="websiteUrl" className="block text-xs font-mono font-bold uppercase tracking-wide text-mud mb-1.5">
              Webbplats
            </label>
            <input
              id="websiteUrl"
              type="url"
              value={form.websiteUrl}
              onChange={(e) => update("websiteUrl", e.target.value)}
              placeholder="https://dinsajt.se"
              className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green placeholder:text-mud/60"
            />
            {errors.websiteUrl && <p className="mt-1.5 text-xs text-bug-red">{errors.websiteUrl}</p>}
          </div>

          <div>
            <label htmlFor="githubUrl" className="block text-xs font-mono font-bold uppercase tracking-wide text-mud mb-1.5">
              GitHub
            </label>
            <input
              id="githubUrl"
              type="url"
              value={form.githubUrl}
              onChange={(e) => update("githubUrl", e.target.value)}
              placeholder="https://github.com/dittnamn"
              className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green placeholder:text-mud/60"
            />
            {errors.githubUrl && <p className="mt-1.5 text-xs text-bug-red">{errors.githubUrl}</p>}
          </div>

          <div>
            <label htmlFor="linkedinUrl" className="block text-xs font-mono font-bold uppercase tracking-wide text-mud mb-1.5">
              LinkedIn
            </label>
            <input
              id="linkedinUrl"
              type="url"
              value={form.linkedinUrl}
              onChange={(e) => update("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/in/dittnamn"
              className="w-full px-3 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-build-green placeholder:text-mud/60"
            />
            {errors.linkedinUrl && <p className="mt-1.5 text-xs text-bug-red">{errors.linkedinUrl}</p>}
          </div>
        </div>

        {errors.submit && (
          <div className="chunky-sm rounded-xl bg-bug-red/10 p-3">
            <p className="text-sm font-medium text-bug-red">{errors.submit}</p>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="chunky pressable rounded-xl bg-build-green px-6 py-3 font-mono text-sm font-bold uppercase tracking-wide text-paper disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
          >
            {saving ? "Sparar..." : "Spara ändringar"}
          </button>
          {saved && (
            <span className="font-mono text-xs font-bold uppercase tracking-wide text-build-green">
              Sparat ✓
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
