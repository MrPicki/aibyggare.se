"use client";

import { useState, useCallback } from "react";
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
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/contexts/AuthContext";
import { grantXpClient } from "@/lib/xp/grant-client";
import { XP_AMOUNTS, type XpEventType } from "@/lib/xp/levels";
import { OnboardingXpBar } from "./OnboardingXpBar";

const AVATAR_OPTIONS = [
  { key: "green",   url: "/seed/avatar-male.png",    label: "Grön hoodie" },
  { key: "pink",    url: "/seed/avatar-female.png",  label: "Rosa hoodie" },
  { key: "neutral", url: "/seed/avatar-neutral.png", label: "Gul t-shirt" },
];

const TOOLS = [
  "Claude Code", "Cursor", "Lovable", "Bolt", "ChatGPT", "Supabase",
  "Vercel", "Next.js", "React", "Firebase", "Stripe", "GitHub", "Annat",
];

const BUILDER_STATUSES = [
  "Jag har precis börjat",
  "Jag bygger mitt första projekt",
  "Jag har ett projekt live",
  "Jag fastnar mest i teknik",
  "Jag vill visa upp och få feedback",
  "Jag vill hjälpa andra",
];

// Steg → XP-event. Index matchar korten 0–4.
const STEP_EVENTS: XpEventType[] = [
  "onboarding_avatar_selected",
  "onboarding_username_set",
  "onboarding_tools_selected",
  "onboarding_status_selected",
  "onboarding_bio_set",
];

const STEP_TOASTS: Record<XpEventType, string> = {
  onboarding_avatar_selected: "byggaren vald",
  onboarding_username_set:     "namnet sitter",
  onboarding_tools_selected:   "verktygslådan packad",
  onboarding_status_selected:  "byggläget valt",
  onboarding_bio_set:          "profilen börjar leva",
  first_project_created:       "första bygget uppe",
  first_problem_created:       "första frågan ställd",
};

interface FormState {
  avatarUrl: string;
  username: string;
  displayName: string;
  tools: string[];
  builderStatus: string;
  bio: string;
  websiteUrl: string;
  githubUrl: string;
  linkedinUrl: string;
}

function xpForCompletedSteps(count: number): number {
  let xp = 0;
  for (let i = 0; i < count && i < STEP_EVENTS.length; i++) {
    xp += XP_AMOUNTS[STEP_EVENTS[i]];
  }
  return xp;
}

export function OnboardingFlow({ user }: { user: User }) {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const reduce = useReducedMotion();

  const [step, setStep] = useState(0); // 0–5 kort, 6 = sista kortet
  const [form, setForm] = useState<FormState>({
    avatarUrl: AVATAR_OPTIONS[0].url,
    username: "",
    displayName: user.displayName ?? "",
    tools: [],
    builderStatus: "",
    bio: "",
    websiteUrl: "",
    githubUrl: "",
    linkedinUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ amount: number; msg: string } | null>(null);

  const displayedXp = xpForCompletedSteps(step);

  const showToast = useCallback((event: XpEventType) => {
    setToast({ amount: XP_AMOUNTS[event], msg: STEP_TOASTS[event] });
    setTimeout(() => setToast(null), 2200);
  }, []);

  // Markerar ett steg klart: delar ut XP (idempotent, bakgrund) + toast + nästa.
  const completeStep = useCallback(
    (index: number) => {
      const event = STEP_EVENTS[index];
      if (event) {
        showToast(event);
        void grantXpClient(event); // fire-and-forget, idempotent server-side
      }
      setStep((s) => s + 1);
    },
    [showToast],
  );

  async function validateUsername(): Promise<string | null> {
    const u = form.username.trim().toLowerCase();
    if (!u) return "Välj ett användarnamn.";
    if (!/^[a-z0-9_-]{3,24}$/.test(u))
      return "3–24 tecken. Bokstäver, siffror, - och _.";
    const snap = await getDocs(
      query(collection(db, "profiles"), where("username", "==", u)),
    );
    const taken = snap.docs.some((d) => d.id !== user.uid);
    if (taken) return "Det användarnamnet är redan taget.";
    return null;
  }

  async function handleUsernameNext() {
    setSaving(true);
    setErrors({});
    const err = await validateUsername();
    setSaving(false);
    if (err) {
      setErrors({ username: err });
      return;
    }
    if (!form.displayName.trim()) {
      setErrors({ displayName: "Ange ett visningsnamn." });
      return;
    }
    completeStep(1);
  }

  // Länk-kortet (sista formulärsteget): spara hela profilen + markera klar.
  async function handleFinish() {
    setSaving(true);
    setErrors({});
    try {
      await updateDoc(doc(db, "profiles", user.uid), {
        username: form.username.trim().toLowerCase(),
        displayName: form.displayName.trim(),
        bio: form.bio.trim(),
        tools: form.tools,
        avatarUrl: form.avatarUrl,
        builderStatus: form.builderStatus,
        websiteUrl: form.websiteUrl.trim(),
        githubUrl: form.githubUrl.trim(),
        linkedinUrl: form.linkedinUrl.trim(),
        onboardingCompleted: true,
        onboardingCompletedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await refreshProfile();
      setStep(6); // sista kortet (Nästan Level 1)
    } catch {
      setErrors({ submit: "Något gick fel. Försök igen om en stund." });
    } finally {
      setSaving(false);
    }
  }

  function toggleTool(tool: string) {
    setForm((f) => ({
      ...f,
      tools: f.tools.includes(tool)
        ? f.tools.filter((t) => t !== tool)
        : [...f.tools, tool],
    }));
  }

  // ── Animations-varianter för kortstacken ──
  const cardVariants = reduce
    ? {
        enter: { opacity: 1, y: 0, scale: 1 },
        center: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: { opacity: 0, y: 40, scale: 0.96 },
        center: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 60, scale: 0.9 },
      };

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:py-14">
      {/* XP-toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed left-1/2 top-4 z-50 -translate-x-1/2"
          >
            <div className="chunky-sm flex items-center gap-2 rounded-full bg-build-green px-4 py-2 text-paper">
              <span className="font-mono text-sm font-bold">+{toast.amount} Byggkraft</span>
              <span className="font-mono text-xs opacity-90">— {toast.msg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kort-container med stack-känsla bakom */}
      <div className="relative mb-8 min-h-[440px]">
        {/* Dekorativa kort bakom */}
        {step < 6 && (
          <>
            <div className="absolute inset-x-3 top-3 h-full rounded-3xl border-2 border-ink/20 bg-paper/40" aria-hidden />
            <div className="absolute inset-x-1.5 top-1.5 h-full rounded-3xl border-2 border-ink/30 bg-paper/60" aria-hidden />
          </>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduce ? { duration: 0 } : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="relative chunky rounded-3xl bg-paper p-6 sm:p-8"
          >
            {/* ── Kort 1: Avatar ── */}
            {step === 0 && (
              <Card
                badge="Karaktär"
                title="Välj din byggare"
                text="Det här är du på byggbänken. Du kan byta stil senare."
              >
                <div className="flex justify-center gap-4">
                  {AVATAR_OPTIONS.map((opt) => {
                    const selected = form.avatarUrl === opt.url;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, avatarUrl: opt.url }))}
                        aria-pressed={selected}
                        aria-label={opt.label}
                        className="flex flex-col items-center gap-2"
                      >
                        <motion.span
                          animate={selected && !reduce ? { scale: [1, 1.12, 1] } : {}}
                          transition={{ duration: 0.3 }}
                          className={[
                            "relative block h-20 w-20 overflow-hidden rounded-full border-4 transition-all duration-150",
                            selected
                              ? "border-ink shadow-[3px_3px_0_0_var(--ink)]"
                              : "border-ink/30 opacity-50 hover:opacity-80",
                          ].join(" ")}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={opt.url} alt={opt.label} className="h-full w-full object-cover" />
                          {selected && (
                            <span className="absolute inset-x-0 bottom-0 bg-build-green py-0.5 text-center font-mono text-[8px] font-bold uppercase text-paper">
                              Vald
                            </span>
                          )}
                        </motion.span>
                        <span className="font-mono text-[10px] text-mud">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
                <CardButton onClick={() => completeStep(0)}>Fortsätt</CardButton>
              </Card>
            )}

            {/* ── Kort 2: Användarnamn ── */}
            {step === 1 && (
              <Card
                badge="Identitet"
                title="Vad ska folk kalla dig?"
                text="Välj ett användarnamn som syns bredvid dina byggen, borrar och kommentarer."
              >
                <div className="space-y-4">
                  <div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 select-none text-sm text-mud">@</span>
                      <input
                        type="text"
                        value={form.username}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
                          }))
                        }
                        placeholder="dittnamn"
                        maxLength={24}
                        autoFocus
                        className="w-full rounded-xl border-2 border-ink bg-paper py-2.5 pl-7 pr-3 text-sm text-ink placeholder:text-mud/60 focus:outline-none focus:ring-2 focus:ring-build-green"
                      />
                    </div>
                    {errors.username ? (
                      <p className="mt-1.5 text-xs text-bug-red">{errors.username}</p>
                    ) : (
                      <p className="mt-1.5 text-xs text-mud">Syns på din profil. Kan ändras senare.</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={form.displayName}
                      onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                      placeholder="Visningsnamn (valfritt men trevligt)"
                      maxLength={50}
                      className="w-full rounded-xl border-2 border-ink bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-mud/60 focus:outline-none focus:ring-2 focus:ring-build-green"
                    />
                    {errors.displayName && (
                      <p className="mt-1.5 text-xs text-bug-red">{errors.displayName}</p>
                    )}
                  </div>
                  <p className="text-xs text-mud">
                    Du kan alltid bygga om projekt. Användarnamn är lite jobbigare.
                  </p>
                </div>
                <CardButton onClick={handleUsernameNext} disabled={saving}>
                  {saving ? "Kollar..." : "Fortsätt"}
                </CardButton>
              </Card>
            )}

            {/* ── Kort 3: Verktyg ── */}
            {step === 2 && (
              <Card
                badge="Verktygslåda"
                title="Vad bygger du med?"
                text="Välj verktygen du använder, bråkar med eller är nyfiken på."
              >
                <div className="flex flex-wrap gap-2">
                  {TOOLS.map((tool) => {
                    const selected = form.tools.includes(tool);
                    return (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleTool(tool)}
                        aria-pressed={selected}
                        className={[
                          "rounded-xl border-2 border-ink px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wide transition-all duration-150",
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
                <CardButton onClick={() => completeStep(2)} disabled={form.tools.length === 0}>
                  {form.tools.length === 0 ? "Välj minst ett" : "Fortsätt"}
                </CardButton>
              </Card>
            )}

            {/* ── Kort 4: Byggstatus ── */}
            {step === 3 && (
              <Card
                badge="Byggläge"
                title="Var är du i byggresan?"
                text="Det finns inget fel svar. Alla börjar någonstans."
              >
                <div className="grid gap-2.5">
                  {BUILDER_STATUSES.map((status) => {
                    const selected = form.builderStatus === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, builderStatus: status }))}
                        aria-pressed={selected}
                        className={[
                          "rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition-all duration-150",
                          selected
                            ? "border-ink bg-hammer-yellow text-ink shadow-[3px_3px_0_0_var(--ink)]"
                            : "border-ink/30 bg-paper text-mud hover:border-ink hover:text-ink",
                        ].join(" ")}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
                <CardButton onClick={() => completeStep(3)} disabled={!form.builderStatus}>
                  {form.builderStatus ? "Fortsätt" : "Välj ett läge"}
                </CardButton>
              </Card>
            )}

            {/* ── Kort 5: Bio ── */}
            {step === 4 && (
              <Card
                badge="Säg hej"
                title="Säg hej till byggbänken"
                text="Skriv en kort rad om dig själv. Inget perfekt pitchande. Bara vem du är här."
              >
                <div>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    placeholder="Bygger små AI-projekt, fastnar ofta i Supabase och vägrar ge upp."
                    rows={3}
                    maxLength={160}
                    autoFocus
                    className="w-full resize-none rounded-xl border-2 border-ink bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-mud/60 focus:outline-none focus:ring-2 focus:ring-build-green"
                  />
                  <p className="mt-1 text-right text-xs text-mud">{form.bio.length}/160</p>
                </div>
                <CardButton onClick={() => completeStep(4)}>Fortsätt</CardButton>
              </Card>
            )}

            {/* ── Kort 6: Länkar ── */}
            {step === 5 && (
              <Card
                badge="Visa upp"
                title="Var hittar man dig?"
                text="Länka din sida, GitHub eller LinkedIn om du vill. Helt valfritt — du kan lägga till det senare."
              >
                <div className="space-y-3">
                  <LinkInput
                    label="Hemsida"
                    placeholder="https://dinsida.se"
                    value={form.websiteUrl}
                    onChange={(v) => setForm((f) => ({ ...f, websiteUrl: v }))}
                  />
                  <LinkInput
                    label="GitHub"
                    placeholder="https://github.com/dittnamn"
                    value={form.githubUrl}
                    onChange={(v) => setForm((f) => ({ ...f, githubUrl: v }))}
                  />
                  <LinkInput
                    label="LinkedIn"
                    placeholder="https://linkedin.com/in/dittnamn"
                    value={form.linkedinUrl}
                    onChange={(v) => setForm((f) => ({ ...f, linkedinUrl: v }))}
                  />
                  {errors.submit && (
                    <p className="text-xs text-bug-red">{errors.submit}</p>
                  )}
                </div>
                <CardButton onClick={handleFinish} disabled={saving}>
                  {saving ? "Sparar..." : "Slutför profilen →"}
                </CardButton>
              </Card>
            )}

            {/* ── Sista kortet: Nästan Level 1 ── */}
            {step === 6 && (
              <FinalActionCard
                onProject={() => router.push("/projects/new")}
                onProblem={() => router.push("/problemhornan/new")}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* XP-mätare under korten */}
      <OnboardingXpBar xp={displayedXp} />
      {step === 6 && (
        <p className="mt-3 text-center font-mono text-xs font-bold text-ink">
          20 Byggkraft kvar till Level 1
        </p>
      )}
    </div>
  );
}

// ── Delade kort-byggstenar ───────────────────────────────────────────────────
function Card({
  badge,
  title,
  text,
  children,
}: {
  badge: string;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="sticker mb-3 inline-flex bg-hammer-yellow px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-ink">
          {badge}
        </span>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-mud">{text}</p>
      </div>
      {children}
    </div>
  );
}

function CardButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="chunky pressable mt-1 w-full rounded-xl bg-build-green py-3 font-mono text-sm font-bold uppercase tracking-wide text-paper disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
    >
      {children}
    </button>
  );
}

function LinkInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block font-mono text-[11px] font-bold uppercase tracking-wide text-mud">
        {label}
      </label>
      <input
        type="url"
        inputMode="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border-2 border-ink bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-mud/60 focus:outline-none focus:ring-2 focus:ring-build-green"
      />
    </div>
  );
}

function FinalActionCard({
  onProject,
  onProblem,
}: {
  onProject: () => void;
  onProblem: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="sticker mb-3 inline-flex bg-build-green px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-paper">
          Nästan Level 1
        </span>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Du är nästan Level 1
        </h1>
        <p className="mt-2 text-sm text-mud">
          Din byggare är skapad. Nu saknas bara ett riktigt första steg på byggbänken.
        </p>
        <p className="mt-3 font-display text-base font-bold text-build-green">
          Lägg upp ditt bygge eller ställ en fråga — och levla upp.
        </p>
      </div>

      <button
        type="button"
        onClick={onProject}
        className="chunky pressable rounded-2xl bg-build-green p-5 text-left text-paper"
      >
        <p className="font-display text-lg font-bold">Lägg upp ditt första bygge</p>
        <p className="mt-1 text-sm text-paper/80">
          Visa vad du bygger, även om det bara funkar lokalt.
        </p>
        <span className="mt-3 inline-block font-mono text-xs font-bold uppercase tracking-wide">
          Lägg upp bygge →
        </span>
      </button>

      <button
        type="button"
        onClick={onProblem}
        className="chunky pressable rounded-2xl bg-hammer-yellow p-5 text-left text-ink"
      >
        <p className="font-display text-lg font-bold">Lägg upp ett problem</p>
        <p className="mt-1 text-sm text-ink/70">
          Fastnat i något? Lägg det i Problemhörnan.
        </p>
        <span className="mt-3 inline-block font-mono text-xs font-bold uppercase tracking-wide">
          Till Problemhörnan →
        </span>
      </button>
    </div>
  );
}
