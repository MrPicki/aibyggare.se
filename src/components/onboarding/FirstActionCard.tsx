"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hammer, LifeBuoy, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { makeUniqueSlug, createProject } from "@/lib/firebase/projects-client";
import { makeUniqueHelpSlug, createHelpPost } from "@/lib/firebase/help-client";
import { grantXpClient } from "@/lib/xp/grant-client";
import { LevelUpBurst } from "@/components/levels/LevelUpBurst";

const PROBLEM_TOOLS = [
  "Claude Code", "Cursor", "Lovable", "ChatGPT", "Supabase",
  "Vercel", "Next.js", "Firebase", "Annat",
];

type ActionType = "project" | "problem" | null;

// Sista onboarding-steget: skapa sitt FÖRSTA bygge eller problem inline — utan
// att lämna onboarding. Skapar ett riktigt Firestore-dokument, delar ut de
// sista 20 XP:n (→ Level 1), visar level-up-animationen och landar sedan på
// profilen där bygget/frågan syns.
export function FirstActionCard() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();

  const [type, setType] = useState<ActionType>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState(""); // beskrivning (bygge) ELLER body (problem)
  const [link, setLink] = useState(""); // valfri länk till bygget
  const [tool, setTool] = useState("Claude Code");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [levelUp, setLevelUp] = useState<number | null>(null);

  const profileHref = profile?.username ? `/profile/${profile.username}` : "/projects";

  async function handleCreate() {
    if (!user) return;
    if (!title.trim()) {
      setError(type === "project" ? "Ge ditt bygge ett namn." : "Sammanfatta problemet i en rubrik.");
      return;
    }
    if (!text.trim()) {
      setError(type === "project" ? "Skriv en kort rad om vad det är." : "Beskriv vad som händer.");
      return;
    }

    setSaving(true);
    setError(null);
    const displayName = profile?.displayName || user.displayName || "Byggare";
    const avatarUrl = profile?.avatarUrl || user.photoURL || "";

    try {
      if (type === "project") {
        const slug = await makeUniqueSlug(title);
        await createProject({
          userId: user.uid,
          userDisplayName: displayName,
          userAvatarUrl: avatarUrl,
          title: title.trim(),
          slug,
          tagline: text.trim().slice(0, 140),
          description: text.trim(),
          problem: "",
          stack: [],
          status: "mvp",
          projectUrl: link.trim(),
          githubUrl: "",
          imageUrl: "",
          feedbackWanted: "",
        });
        const xp = await grantXpClient("first_project_created");
        await refreshProfile();
        finish(xp?.leveledUp ? xp.level : null);
      } else {
        const slug = await makeUniqueHelpSlug(title);
        await createHelpPost({
          userId: user.uid,
          userDisplayName: displayName,
          userAvatarUrl: avatarUrl,
          username: profile?.username || "",
          title: title.trim(),
          slug,
          body: text.trim(),
          tool,
        });
        const xp = await grantXpClient("first_problem_created");
        await refreshProfile();
        finish(xp?.leveledUp ? xp.level : null);
      }
    } catch {
      setError("Något gick fel. Försök igen om en stund.");
      setSaving(false);
    }
  }

  function finish(leveledUpTo: number | null) {
    if (leveledUpTo !== null) {
      setLevelUp(leveledUpTo); // LevelUpBurst → navigerar i onDone
    } else {
      router.push(profileHref);
    }
  }

  // ── Val-vy ──────────────────────────────────────────────────────────────────
  if (type === null) {
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
            Din byggare är skapad. Ett riktigt första steg kvar.
          </p>
          <p className="mt-3 font-display text-base font-bold text-build-green">
            Lägg upp ditt bygge eller ställ en fråga — och levla upp.
          </p>
        </div>

        <button
          type="button"
          onClick={() => { setType("project"); setError(null); }}
          className="chunky pressable flex items-center gap-4 rounded-2xl bg-build-green p-4 text-left text-paper"
        >
          <Hammer size={24} className="shrink-0" />
          <div>
            <p className="font-display text-base font-bold">Lägg upp ett bygge</p>
            <p className="text-sm text-paper/80">Visa vad du bygger, även om det bara funkar lokalt.</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => { setType("problem"); setError(null); }}
          className="chunky pressable flex items-center gap-4 rounded-2xl bg-hammer-yellow p-4 text-left text-ink"
        >
          <LifeBuoy size={24} className="shrink-0" />
          <div>
            <p className="font-display text-base font-bold">Beskriv ett problem</p>
            <p className="text-sm text-ink/70">Fastnat i något? Lägg det i Problemhörnan.</p>
          </div>
        </button>
      </div>
    );
  }

  // ── Skapa-vy (inline-formulär) ────────────────────────────────────────────────
  const isProject = type === "project";
  return (
    <>
      {levelUp !== null && (
        <LevelUpBurst level={levelUp} onDone={() => router.push(profileHref)} />
      )}

      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => { setType(null); setTitle(""); setText(""); setError(null); }}
          className="inline-flex w-fit items-center gap-1 font-mono text-xs font-bold uppercase tracking-wide text-mud hover:text-ink"
        >
          <ArrowLeft size={13} /> Tillbaka
        </button>

        <div>
          <span
            className="sticker mb-3 inline-flex px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-ink"
            style={{ backgroundColor: isProject ? "var(--build-green)" : "var(--warning-orange)" }}
          >
            {isProject ? "Ditt första bygge" : "Ditt första problem"}
          </span>
          <h1 className="font-display text-xl font-bold text-ink sm:text-2xl">
            {isProject ? "Vad bygger du?" : "Vad har du kört fast med?"}
          </h1>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={isProject ? "Namn på bygget" : "Rubrik — sammanfatta problemet"}
          maxLength={80}
          autoFocus
          className="w-full rounded-xl border-2 border-ink bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-mud/60 focus:outline-none focus:ring-2 focus:ring-build-green"
        />

        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              isProject
                ? "Beskriv ditt bygge — vad gör det, vad är du stolt över, vad vill du ha feedback på?"
                : "Vad försökte du göra, vad hände och vad har du testat?"
            }
            rows={isProject ? 5 : 4}
            maxLength={isProject ? 1000 : 800}
            className="w-full resize-none rounded-xl border-2 border-ink bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-mud/60 focus:outline-none focus:ring-2 focus:ring-build-green"
          />
          <p className="mt-1 text-right text-xs text-mud">
            {text.length}/{isProject ? 1000 : 800}
            {isProject && text.length < 100 && " · gärna minst 100 tecken"}
          </p>
        </div>

        {/* Valfri länk till bygget */}
        {isProject && (
          <div>
            <label className="mb-1 block font-mono text-[11px] font-bold uppercase tracking-wide text-mud">
              Länk till bygget <span className="text-mud/60">(valfritt)</span>
            </label>
            <input
              type="url"
              inputMode="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://dittbygge.se"
              className="w-full rounded-xl border-2 border-ink bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-mud/60 focus:outline-none focus:ring-2 focus:ring-build-green"
            />
          </div>
        )}

        {!isProject && (
          <div className="flex flex-wrap gap-1.5">
            {PROBLEM_TOOLS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTool(t)}
                className={[
                  "rounded-lg border-2 border-ink px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wide transition-all",
                  tool === t
                    ? "bg-warning-orange text-ink shadow-[2px_2px_0_0_var(--ink)]"
                    : "bg-paper text-mud hover:bg-hammer-yellow hover:text-ink",
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {error && <p className="text-xs text-bug-red">{error}</p>}

        <button
          type="button"
          onClick={handleCreate}
          disabled={saving}
          className="chunky pressable w-full rounded-xl bg-build-green py-3 font-mono text-sm font-bold uppercase tracking-wide text-paper disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
        >
          {saving ? "Skapar..." : isProject ? "Publicera & bli Level 1 →" : "Lägg upp & bli Level 1 →"}
        </button>
      </div>
    </>
  );
}
