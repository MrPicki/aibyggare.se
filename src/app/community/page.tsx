import Link from "next/link";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";
import {
  getCommunityStats,
  getCommunityBuilders,
  type CommunityBuilder,
} from "@/lib/firebase/community";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Möt byggarna — AIbyggare.se",
  description: "Svenska vibe coders, indie hackers och AI-byggare. Halvfärdiga projekt, riktiga problem, konkret hjälp.",
};

const ACCENT_CYCLE = [
  "var(--build-green)",
  "var(--bug-red)",
  "var(--hammer-yellow)",
  "var(--prompt-purple)",
  "var(--code-blue)",
  "var(--soft-teal)",
];

function BuilderCard({ builder, accent }: { builder: CommunityBuilder; accent: string }) {
  return (
    <Link
      href={`/profile/${builder.username}`}
      className="chunky group flex flex-col gap-4 rounded-3xl bg-paper p-5 transition-transform duration-150 hover:-rotate-[0.4deg]"
    >
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={builder.avatarUrl} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div>
          <p className="font-mono text-sm font-bold text-ink group-hover:text-build-green transition-colors">
            {builder.displayName}
          </p>
          <p className="font-mono text-[11px] text-mud">@{builder.username}</p>
        </div>
      </div>

      {builder.bio && <p className="text-sm leading-relaxed text-mud">{builder.bio}</p>}

      {builder.tools.length > 0 && (
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
      )}

      <div className="border-t-2 border-dashed border-border pt-3">
        <span
          className="sticker px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide"
          style={{ backgroundColor: accent }}
        >
          Se profil →
        </span>
      </div>
    </Link>
  );
}

function formatCount(n: number): string {
  if (n === 0) return "0";
  if (n < 10) return String(n);
  const rounded = Math.floor(n / 5) * 5;
  return `${rounded}+`;
}

export default async function CommunityPage() {
  const [stats, builders] = await Promise.all([
    getCommunityStats(),
    getCommunityBuilders(6),
  ]);

  const statCards = [
    {
      value: stats ? formatCount(stats.projects) : "—",
      label: "Projekt upplagda",
    },
    {
      value: stats ? formatCount(stats.helpPosts) : "—",
      label: "Hjälpfrågor",
    },
    {
      value: stats ? formatCount(stats.prompts) : "—",
      label: "Prompts delade",
    },
    {
      value: stats ? formatCount(stats.members) : "—",
      label: "Byggare",
    },
  ];

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
        {statCards.map((stat) => (
          <div key={stat.label} className="chunky-sm rounded-2xl bg-paper p-5 text-center">
            <p className="font-display text-3xl font-bold text-ink">{stat.value}</p>
            <p className="mt-1 font-mono text-[11px] font-medium uppercase tracking-wide text-mud">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Builder grid */}
      {builders.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-6 font-mono text-xs font-bold uppercase tracking-widest text-mud">
            Senaste byggarna
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {builders.map((builder, i) => (
              <BuilderCard key={builder.username} builder={builder} accent={ACCENT_CYCLE[i % ACCENT_CYCLE.length]} />
            ))}
          </div>
        </div>
      )}

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
