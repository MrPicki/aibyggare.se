import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Sticker } from "@/components/ui/Sticker";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { TOOL_PAGES, matchesTool } from "@/lib/constants/tool-pages";
import { SEED_PROJECTS, SEED_HELP_QUESTIONS, SEED_PROMPTS } from "@/lib/seed";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aibyggare.se";

export const metadata = {
  title: "AI-verktyg på svenska — Claude Code, Cursor, Lovable m.fl.",
  description:
    "Byggen, problem och prompts per AI-verktyg — Claude Code, Cursor, Lovable, Bolt, Supabase, Vercel och fler. Se vad svenska byggare gör med varje verktyg.",
  alternates: { canonical: `${SITE_URL}/tools` },
};

interface ToolCounts {
  projects: number;
  help: number;
  prompts: number;
}

export default async function ToolsIndexPage() {
  // Räkna innehåll per verktyg — Firestore med seed-fallback.
  let counts: Record<string, ToolCounts> = {};

  try {
    const [{ getProjects }, { getHelpPosts }, { getPromptPosts }] = await Promise.all([
      import("@/lib/firebase/projects"),
      import("@/lib/firebase/help"),
      import("@/lib/firebase/prompts"),
    ]);
    const [projects, help, prompts] = await Promise.all([
      getProjects(100),
      getHelpPosts(100),
      getPromptPosts(100),
    ]);
    for (const tool of TOOL_PAGES) {
      counts[tool.slug] = {
        projects: projects.filter((p) => matchesTool(tool, p.stack ?? [])).length,
        help: help.filter((p) => matchesTool(tool, [p.tool, ...(p.tags ?? [])])).length,
        prompts: prompts.filter((p) => matchesTool(tool, [p.tool, ...(p.tags ?? [])])).length,
      };
    }
  } catch {
    counts = {};
  }

  // Seed-fallback om Firestore inte gav något
  if (Object.keys(counts).length === 0) {
    for (const tool of TOOL_PAGES) {
      counts[tool.slug] = {
        projects: SEED_PROJECTS.filter((p) => matchesTool(tool, p.tags)).length,
        help: SEED_HELP_QUESTIONS.filter((q) => matchesTool(tool, [q.topic, ...(q.tools ?? [])])).length,
        prompts: SEED_PROMPTS.filter((p) => matchesTool(tool, [p.tool])).length,
      };
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      {/* Header */}
      <div className="mb-10 max-w-2xl">
        <Sticker tilt={-2} className="mb-3 bg-hammer-yellow">Verktyg</Sticker>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Vad bygger du med?
        </h1>
        <p className="mt-3 text-mud">
          Byggen, problem och prompts sorterat per verktyg. Välj ditt så ser du vad
          andra svenska byggare gjort med det — och var de kört fast.
        </p>
      </div>

      {/* Tool grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TOOL_PAGES.map((tool) => {
          const c = counts[tool.slug] ?? { projects: 0, help: 0, prompts: 0 };
          const total = c.projects + c.help + c.prompts;
          return (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              aria-label={`${tool.name} — byggen, problem och prompts`}
              className="chunky pressable group flex h-full flex-col overflow-hidden rounded-3xl bg-paper hover:-rotate-1"
            >
              <div
                className="flex items-center justify-between border-b-2 border-ink px-4 py-2.5"
                style={{ backgroundColor: tool.accent }}
              >
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink/80">
                  {tool.name}
                </span>
                {total > 0 && (
                  <span className="sticker shrink-0 bg-paper px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink">
                    {total} inlägg
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-display text-xl font-bold leading-tight text-ink">
                  {tool.name}
                </h2>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-mud">{tool.tagline}</p>
                <div className="mt-4 flex items-center justify-between border-t-2 border-dashed border-border pt-3">
                  <span className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wide text-ink transition-colors group-hover:text-build-green">
                    Utforska <ArrowUpRight size={13} />
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-mud">
                    {c.projects} byggen · {c.help} problem · {c.prompts} prompts
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      <div className="chunky mt-14 rounded-3xl bg-cream p-6 text-center sm:p-10">
        <Sticker tilt={2} className="mb-3 bg-build-green">Saknas ditt verktyg?</Sticker>
        <p className="font-display text-xl font-bold text-ink">
          Lägg upp ett bygge så syns verktyget här.
        </p>
        <p className="mx-auto mt-2 max-w-md text-mud">
          Sidorna byggs av det communityn delar — ditt bygge kan bli det första.
        </p>
        <div className="mt-6 flex justify-center">
          <ChunkyLink href="/projects/new" variant="green">Lägg upp bygge</ChunkyLink>
        </div>
      </div>
    </div>
  );
}
