import Link from "next/link";
import { MessageSquare, ExternalLink } from "lucide-react";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";
import { DrillIcon } from "@/components/brand/DrillIcon";

type ActivityType = "project" | "problem" | "idea" | "prompt" | "feedback";

interface BuildActivityItem {
  id: string;
  type: ActivityType;
  user: { name: string; handle: string; username: string; initials: string; avatarUrl?: string };
  projectName: string;
  projectUrl?: string;
  title: string;
  description: string;
  problem?: string;
  tools: string[];
  status: string;
  upvotes: number;
  comments: number;
  createdAtLabel: string;
  targetUrl: string;
}

const TYPE_LABEL: Record<ActivityType, string> = {
  project:  "Bygge",
  problem:  "Fastnat",
  idea:     "Idé",
  prompt:   "Prompt",
  feedback: "Feedback",
};

const TYPE_ACCENT: Record<ActivityType, string> = {
  project:  "var(--build-green)",
  problem:  "var(--bug-red)",
  idea:     "var(--code-blue)",
  prompt:   "var(--prompt-purple)",
  feedback: "var(--hammer-yellow)",
};

const F = "/seed/avatar-female.png";
const M = "/seed/avatar-male.png";

const SEED_ACTIVITY: BuildActivityItem[] = [
  {
    id: "1",
    type: "project",
    user: { name: "Christoffer", handle: "@christoffer", username: "christoffer", initials: "C", avatarUrl: M },
    projectName: "Smartbok.se",
    projectUrl: "https://smartbok.se",
    title: "AI-bokföring för enskild firma",
    description: "Foton på kvitton in, ordning ut.",
    problem: "Behöver förbättra hur AI:n ställer följdfrågor utan att bli tjatig.",
    tools: ["Supabase", "Claude", "Vercel"],
    status: "Hackig MVP",
    upvotes: 18,
    comments: 6,
    createdAtLabel: "för 12 min sen",
    targetUrl: "/projects/smartbok-se",
  },
  {
    id: "2",
    type: "problem",
    user: { name: "Lina", handle: "@linabygger", username: "linabygger", initials: "L", avatarUrl: F },
    projectName: "Min första SaaS",
    title: "Vercel vägrar deploya efter Supabase-ändring",
    description: "Allt funkar lokalt men builden dör på env-variabler.",
    problem: '"Missing NEXT_PUBLIC_SUPABASE_URL" trots att variabeln finns.',
    tools: ["Vercel", "Supabase", "Next.js"],
    status: "Fastnat",
    upvotes: 9,
    comments: 4,
    createdAtLabel: "för 28 min sen",
    targetUrl: "/problemhornan/vercel-vagrar-deploya",
  },
  {
    id: "3",
    type: "project",
    user: { name: "Adam", handle: "@adamcodes", username: "adamcodes", initials: "A", avatarUrl: M },
    projectName: "MenuPilot",
    projectUrl: "https://menupilot.se",
    title: "AI som gör veckomenyer från rester",
    description: "Man skriver vad man har hemma och får middagsförslag.",
    problem: "Behöver feedback på onboarding och första intrycket.",
    tools: ["ChatGPT", "Next.js", "Firebase"],
    status: "Behöver feedback",
    upvotes: 21,
    comments: 8,
    createdAtLabel: "för 1 tim sen",
    targetUrl: "/projects/menupilot-se",
  },
  {
    id: "4",
    type: "prompt",
    user: { name: "Sara", handle: "@sarapromptar", username: "sarapromptar", initials: "S", avatarUrl: F },
    projectName: "Claude Code Workflow",
    title: "Prompt som stoppar Claude från att förstöra designen",
    description: "En prompt för att tvinga Claude att planera innan den kodar.",
    tools: ["Claude Code", "Frontend"],
    status: "Funkade faktiskt",
    upvotes: 32,
    comments: 11,
    createdAtLabel: "för 2 tim sen",
    targetUrl: "/prompts/stopp-claude-designen",
  },
  {
    id: "5",
    type: "project",
    user: { name: "Jonas", handle: "@jonasbygger", username: "jonasbygger", initials: "J", avatarUrl: M },
    projectName: "Need Radar",
    title: "AI som hittar ouppfyllda behov på Reddit",
    description: "Daglig pipeline som rankar affärsidéer från forumtrådar.",
    problem: "Behöver hjälp att göra scoringmodellen mindre naiv.",
    tools: ["Reddit", "Claude", "Supabase"],
    status: "Byggs om",
    upvotes: 15,
    comments: 5,
    createdAtLabel: "för 3 tim sen",
    targetUrl: "/projects/need-radar",
  },
  {
    id: "6",
    type: "problem",
    user: { name: "Maja", handle: "@majawebb", username: "majawebb", initials: "M", avatarUrl: F },
    projectName: "Portfolio med Lovable",
    title: "Claude skrev om hela layouten igen",
    description: "Bad om liten justering, fick ny design på halva sidan.",
    problem: "Hur får man AI:n att bara ändra exakt det man ber om?",
    tools: ["Lovable", "Claude", "CSS"],
    status: "Claude gick bananas",
    upvotes: 14,
    comments: 7,
    createdAtLabel: "för 4 tim sen",
    targetUrl: "/problemhornan/claude-skrev-om-hela-layouten",
  },
];

function Avatar({ initials, accent, avatarUrl }: { initials: string; accent: string; avatarUrl?: string }) {
  if (avatarUrl) {
    return (
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-ink" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-ink font-mono text-sm font-bold text-ink"
      style={{ backgroundColor: accent }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

function ActivityCard({ item }: { item: BuildActivityItem }) {
  const accent = TYPE_ACCENT[item.type];
  const label  = TYPE_LABEL[item.type];

  return (
    <article className="chunky group flex flex-col gap-4 rounded-3xl bg-paper p-5 transition-transform duration-150 hover:-rotate-[0.4deg] sm:p-6">

      {/* ── Row 1: avatar + meta ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link href={`/profile/${item.user.username}`} className="shrink-0 hover:opacity-80 transition-opacity">
            <Avatar initials={item.user.initials} accent={accent} avatarUrl={item.user.avatarUrl} />
          </Link>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Link
                href={`/profile/${item.user.username}`}
                className="font-mono text-xs font-bold text-ink hover:text-build-green transition-colors"
              >
                {item.user.name}
              </Link>
              <span className="font-mono text-[11px] text-mud">{item.user.handle}</span>
              <span
                className="sticker px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide"
                style={{ backgroundColor: accent }}
              >
                {label}
              </span>
            </div>
          </div>
        </div>
        <span className="shrink-0 font-mono text-[11px] text-mud whitespace-nowrap">
          {item.createdAtLabel}
        </span>
      </div>

      {/* ── Row 2: project name + optional link ── */}
      <div className="flex flex-wrap items-center gap-2">
        <Link href={item.targetUrl} className="font-display text-base font-bold text-ink hover:text-build-green transition-colors">
          {item.projectName}
        </Link>
        {item.projectUrl && (
          <a
            href={item.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-cream px-2 py-0.5 font-mono text-[10px] font-semibold text-mud hover:border-ink hover:text-ink transition-colors"
          >
            <ExternalLink size={10} /> Öppna
          </a>
        )}
      </div>

      {/* ── Row 3: title + description ── */}
      <Link href={item.targetUrl} className="group/inner block">
        <p className="font-semibold text-ink leading-snug group-hover/inner:text-build-green transition-colors">{item.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-mud">{item.description}</p>
      </Link>

      {/* ── Row 4: problem box (optional) ── */}
      {item.problem && (
        <div className="rounded-xl border-2 border-dashed border-bug-red/40 bg-bug-red/5 px-3 py-2.5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-bug-red mb-1">
            Strular med
          </p>
          <p className="text-sm text-ink">{item.problem}</p>
        </div>
      )}

      {/* ── Row 5: tool tags ── */}
      {item.tools.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-lg border border-border bg-cream px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-mud"
            >
              {tool}
            </span>
          ))}
        </div>
      )}

      {/* ── Row 6: footer ── */}
      <div className="flex items-center justify-between border-t-2 border-dashed border-border pt-3">
        <span
          className="sticker px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide"
          style={{ backgroundColor: accent }}
        >
          {item.status}
        </span>
        <div className="flex items-center gap-4 font-mono text-xs font-semibold text-mud">
          <span className="inline-flex items-center gap-1">
            <DrillIcon className="h-3.5 w-3.5 text-build-green" />
            {item.upvotes}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageSquare size={12} />
            {item.comments}
          </span>
          <Link
            href={item.targetUrl}
            className="font-bold uppercase tracking-wide text-ink hover:text-build-green transition-colors"
          >
            Visa tråd →
          </Link>
        </div>
      </div>
    </article>
  );
}

export function LatestBuildActivity() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Sticker tilt={-2} className="mb-3 bg-hammer-yellow">Live</Sticker>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            På byggbänken just nu
          </h2>
          <p className="mt-2 max-w-md text-mud">
            Projekt, buggar och idéer från folk som faktiskt bygger.
          </p>
        </div>
        <ChunkyLink href="/projects" variant="paper">
          Se alla byggen →
        </ChunkyLink>
      </div>

      {/* Activity list */}
      <div className="space-y-4">
        {SEED_ACTIVITY.map((item) => (
          <ActivityCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
