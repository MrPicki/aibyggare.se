import Link from "next/link";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";
import { ExternalLink } from "lucide-react";

export const metadata = {
  title: "Möt byggarna — AIbyggare.se",
  description: "Svenska vibe coders, indie hackers och AI-byggare. Halvfärdiga projekt, riktiga problem, konkret hjälp.",
};

const FEATURED_BUILDERS = [
  {
    username: "christoffer",
    name: "Christoffer",
    role: "Byggare av Smartbok.se",
    bio: "Bygger AI-bokföring för enskild firma. Foton på kvitton in — ordning ut. Kraschar ibland i produktion.",
    avatarUrl: "/seed/avatar-male.png",
    accent: "var(--build-green)",
    projects: ["Smartbok.se"],
    tools: ["Claude", "Supabase", "Vercel"],
  },
  {
    username: "linabygger",
    name: "Lina",
    role: "Nybörjare på allvar",
    bio: "Byggde sin första SaaS för tre månader sedan. Fastnar på Vercel-deploys. Löser det alltid till slut.",
    avatarUrl: "/seed/avatar-female.png",
    accent: "var(--bug-red)",
    projects: ["Min första SaaS"],
    tools: ["Next.js", "Supabase", "Vercel"],
  },
  {
    username: "adamcodes",
    name: "Adam",
    role: "Fullstack-vibe-coder",
    bio: "Bygger MenuPilot — AI som gör veckomenyer från rester. Alltid igång med minst tre projekt.",
    avatarUrl: "/seed/avatar-neutral.png",
    accent: "var(--hammer-yellow)",
    projects: ["MenuPilot"],
    tools: ["ChatGPT", "Next.js", "Firebase"],
  },
  {
    username: "sarapromptar",
    name: "Sara",
    role: "Prompt-nörd",
    bio: "Har testat alla sätt att promptea Claude på. Delar det som faktiskt funkar. Resten raderas tyst.",
    avatarUrl: "/seed/avatar-female.png",
    accent: "var(--prompt-purple)",
    projects: ["Claude Code Workflow"],
    tools: ["Claude Code", "Frontend"],
  },
  {
    username: "jonasbygger",
    name: "Jonas",
    role: "Datadriven byggare",
    bio: "Need Radar: AI som hittar ouppfyllda behov på Reddit. Bygger om scoringmodellen för tredje gången.",
    avatarUrl: "/seed/avatar-male.png",
    accent: "var(--code-blue)",
    projects: ["Need Radar"],
    tools: ["Reddit API", "Claude", "Supabase"],
  },
  {
    username: "majawebb",
    name: "Maja",
    role: "Designer som kodar",
    bio: "Håller på att lära sig. Claude förstör layouten var tredje dag. Fortsätter ändå.",
    avatarUrl: "/seed/avatar-female.png",
    accent: "var(--soft-teal)",
    projects: ["Portfolio med Lovable"],
    tools: ["Lovable", "Claude", "CSS"],
  },
];

const STATS = [
  { value: "100+", label: "Projekt upplagda" },
  { value: "50+", label: "Hjälpfrågor besvarade" },
  { value: "30+", label: "Prompts delade" },
  { value: "∞", label: "Kaffe drucket" },
];

function BuilderCard({ builder }: { builder: (typeof FEATURED_BUILDERS)[0] }) {
  return (
    <Link
      href={`/profile/${builder.username}`}
      className="chunky group flex flex-col gap-4 rounded-3xl bg-paper p-5 transition-transform duration-150 hover:-rotate-[0.4deg]"
    >
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={builder.avatarUrl} alt="" className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="font-mono text-sm font-bold text-ink group-hover:text-build-green transition-colors">
            {builder.name}
          </p>
          <p className="font-mono text-[11px] text-mud">{builder.role}</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-mud">{builder.bio}</p>

      <div className="flex flex-wrap gap-1.5">
        {builder.tools.map((tool) => (
          <span
            key={tool}
            className="rounded-lg border border-border bg-cream px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-mud"
          >
            {tool}
          </span>
        ))}
      </div>

      <div className="border-t-2 border-dashed border-border pt-3">
        <span
          className="sticker px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide"
          style={{ backgroundColor: builder.accent }}
        >
          Se profil →
        </span>
      </div>
    </Link>
  );
}

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
      {/* Header */}
      <div className="mb-12">
        <Sticker tilt={-2} className="mb-3 bg-soft-teal">Byggarna</Sticker>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Möt dem som faktiskt bygger.
        </h1>
        <p className="mt-3 max-w-xl text-lg text-mud">
          Vibe coders. Indie hackers. Nybörjare med en idé. Utvecklare som använder AI på nya sätt.
          Det är folk precis som du — och de är redan här.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="chunky-sm rounded-2xl bg-paper p-5 text-center">
            <p className="font-display text-3xl font-bold text-ink">{stat.value}</p>
            <p className="mt-1 font-mono text-[11px] font-medium uppercase tracking-wide text-mud">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Builder grid */}
      <div className="mb-10">
        <h2 className="mb-6 font-mono text-xs font-bold uppercase tracking-widest text-mud">
          Några av byggarna
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_BUILDERS.map((builder) => (
            <BuilderCard key={builder.username} builder={builder} />
          ))}
        </div>
      </div>

      {/* Philosophy block */}
      <div className="chunky mb-12 rounded-3xl border-2 border-ink bg-hammer-yellow/30 p-8">
        <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-mud mb-3">
          Varför vi finns
        </p>
        <p className="font-display text-xl font-bold leading-snug text-ink">
          "Alla de här byggarna var ensamma i sina egna Slack-grupper, Discord-servrar och Reddit-trådar.
          Och de snackade engelska. AIbyggare.se är platsen där de är tillsammans — på svenska."
        </p>
      </div>

      {/* How to get involved */}
      <div className="mb-12">
        <h2 className="mb-6 font-mono text-xs font-bold uppercase tracking-widest text-mud">
          Vad gör man på AIbyggare.se?
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              emoji: "🔨",
              title: "Visa upp ditt bygge",
              body: "Halvfärdigt räknas. Lägg upp projektet — communityn ger feedback, upvotes och ibland lösningar på problem du inte visste att du hade.",
              href: "/projects/new",
              cta: "Lägg upp ett bygge",
              color: "var(--build-green)",
            },
            {
              emoji: "🐛",
              title: "Fastnat? Fråga.",
              body: "Beskriv problemet, vad du försökte och vad som hände. Någon i communityn har förmodligen sett exakt den buggen.",
              href: "/problemhornan/new",
              cta: "Ställ en fråga",
              color: "var(--bug-red)",
            },
            {
              emoji: "✨",
              title: "Dela en prompt",
              body: "Prompten som räddade din kväll är guld värd. Dela den här så slipper nästa person tre timmar av trial and error.",
              href: "/prompts/new",
              cta: "Dela en prompt",
              color: "var(--prompt-purple)",
            },
            {
              emoji: "🗺️",
              title: "Skriv en guide",
              body: "Du har kört igenom Firebase Auth-setup tio gånger. Skriv ner det en gång till — för nästa person som googlar sig blind.",
              href: "/guides",
              cta: "Se genvägar",
              color: "var(--code-blue)",
            },
          ].map((item) => (
            <div key={item.href} className="chunky rounded-2xl bg-paper p-6">
              <div className="flex items-start gap-4">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink text-lg"
                  style={{ backgroundColor: item.color }}
                >
                  {item.emoji}
                </span>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm text-mud">{item.body}</p>
                  <Link
                    href={item.href}
                    className="mt-3 inline-block font-mono text-xs font-bold uppercase tracking-wide text-ink hover:text-build-green transition-colors"
                  >
                    {item.cta} →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="chunky rounded-3xl bg-ink p-8 text-center sm:p-12">
        <p className="font-display text-2xl font-bold text-paper sm:text-3xl">
          Bänken har en plats till.
        </p>
        <p className="mx-auto mt-3 max-w-sm text-paper/60">
          Skapa ett konto, lägg upp vad du bygger och bli en del av communityn.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <ChunkyLink href="/register" variant="green" size="lg">
            Skapa konto — gratis
          </ChunkyLink>
          <ChunkyLink href="/projects" variant="paper" size="lg">
            Utforska byggen →
          </ChunkyLink>
        </div>
      </div>
    </div>
  );
}
