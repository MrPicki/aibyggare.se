import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Wrench } from "lucide-react";
import { Sticker } from "@/components/ui/Sticker";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { HelpCard } from "@/components/cards/HelpCard";
import { PromptCard } from "@/components/cards/PromptCard";
import {
  SEED_USERS,
  SEED_PROJECTS,
  SEED_HELP_QUESTIONS,
  SEED_PROMPTS,
} from "@/lib/seed";

export function generateStaticParams() {
  return SEED_USERS.map((u) => ({ handle: u.username }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const user = SEED_USERS.find((u) => u.username === handle);
  if (!user) return { title: "Profil — AIbyggare.se" };
  return {
    title: `${user.displayName} (@${user.username}) — AIbyggare.se`,
    description: user.bio,
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const user = SEED_USERS.find((u) => u.username === handle);
  if (!user) notFound();

  const projects = SEED_PROJECTS.filter((p) => user.projectSlugs.includes(p.slug));
  const helpQuestions = SEED_HELP_QUESTIONS.filter((q) => user.helpSlugs.includes(q.slug));
  const prompts = SEED_PROMPTS.filter((p) => p.slug && user.promptSlugs.includes(p.slug));

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-mud hover:text-build-green transition-colors"
      >
        <ArrowLeft size={14} /> Tillbaka
      </Link>

      {/* ── Profile card ── */}
      <article className="chunky mt-6 overflow-hidden rounded-3xl bg-paper">
        <div className="border-b-2 border-ink bg-build-green px-6 py-3">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink/80">
            Byggare
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6">
            {/* Avatar */}
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="min-w-0 text-center sm:text-left">
              <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                {user.displayName}
              </h1>
              <p className="mt-0.5 font-mono text-sm text-mud">@{user.username}</p>

              {user.bio && (
                <p className="mt-3 text-base leading-relaxed text-ink">{user.bio}</p>
              )}

              <div className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-mud">
                <Calendar size={12} />
                Gick med {user.joined}
              </div>
            </div>
          </div>

          {/* Tools */}
          {user.tools.length > 0 && (
            <div className="mt-6 border-t-2 border-dashed border-border pt-5">
              <div className="mb-3 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-mud">
                <Wrench size={12} /> Verktyg
              </div>
              <div className="flex flex-wrap gap-2">
                {user.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-xl border-2 border-ink px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide text-ink"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* ── Projects ── */}
      {projects.length > 0 && (
        <section className="mt-10">
          <Sticker tilt={-1} className="mb-4 bg-build-green">Byggen</Sticker>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {projects.map((p) => (
              <ProjectCard key={p.slug} {...p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Help questions ── */}
      {helpQuestions.length > 0 && (
        <section className="mt-10">
          <Sticker tilt={1} className="mb-4 bg-bug-red/20">Hjälpfrågor</Sticker>
          <div className="grid grid-cols-1 gap-4">
            {helpQuestions.map((q) => (
              <HelpCard key={q.slug} {...q} />
            ))}
          </div>
        </section>
      )}

      {/* ── Prompts ── */}
      {prompts.length > 0 && (
        <section className="mt-10">
          <Sticker tilt={-1} className="mb-4 bg-prompt-purple/20">Prompts</Sticker>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {prompts.map((p) => (
              <PromptCard key={p.slug} {...p} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {projects.length === 0 && helpQuestions.length === 0 && prompts.length === 0 && (
        <div className="chunky mt-8 rounded-3xl bg-cream p-10 text-center">
          <p className="font-display text-lg font-bold text-ink">Inget på bänken ännu.</p>
          <p className="mt-2 text-mud">Snart dyker det upp byggen, frågor och prompts här.</p>
        </div>
      )}
    </div>
  );
}
