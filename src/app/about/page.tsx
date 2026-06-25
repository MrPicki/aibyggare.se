import Link from "next/link";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";

export const metadata = {
  title: "Om — AIbyggare.se",
  description: "AIbyggare.se är platsen för oss som bygger med AI — halvfärdigt, ofullständigt och utan prestige. En svensk byggbänk för vibe coders.",
};

const TRUTHS = [
  "Du behöver inte vara utvecklare för att bygga.",
  "Halvfärdigt räknas. Alla börjar där.",
  "Det bästa sättet att lära sig är att visa vad man bygger.",
  "Fastna är normalt. Stanna fast är valfritt.",
  "En prompt du delar kan spara någon annan tre timmar.",
  "Communityn dömer inte — den hjälper.",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <Sticker tilt={-2} className="mb-4 bg-build-green">Om</Sticker>
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Platsen för oss som bygger med AI.
      </h1>

      {/* Manifesto intro */}
      <div className="mt-8 space-y-6 text-lg leading-relaxed text-mud">
        <p>
          Det finns en ny typ av byggare. Inte alltid utbildad programmerare. Inte alltid
          erfaren. Men envisa som fanken — de har en idé, ett verktyg och en vilja att
          faktiskt göra det.
        </p>
        <p>
          De kallas vibe coders. Indie hackers. Nybörjare med en idé. Småföretagare som
          vill automatisera sin vardag. Kreatörer som vill lansera sin första app.
          Utvecklare som inser att AI har förändrat vad de kan bygga på en kväll.
        </p>
        <p>
          De är utspridda. I Slack-grupper som ingen vet hur man hittar. I Discord-servrar
          för specifika verktyg. På X och LinkedIn. På Reddit, fast på engelska.
        </p>
        <p className="font-semibold text-ink">
          AIbyggare.se är samlingsplatsen. På svenska. För oss.
        </p>
      </div>

      {/* Truths / core beliefs */}
      <div className="mt-10">
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-mud mb-4">
          Det vi tror på
        </h2>
        <ul className="space-y-2">
          {TRUTHS.map((truth, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px] bg-build-green" />
              <span className="text-ink leading-relaxed">{truth}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* What the site is */}
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {[
          {
            emoji: "🔨",
            title: "Byggen",
            body: "Visa vad du håller på med. Det spelar ingen roll om det kraschar eller ser halvfärdigt ut. Det är poängen.",
            href: "/projects",
            color: "var(--build-green)",
          },
          {
            emoji: "🐛",
            title: "Problemhörnan",
            body: "Beskriv vad du fastnat på. Verktyg, felmeddelanden, konstiga beteenden — communityn har förmodligen sett det.",
            href: "/problemhornan",
            color: "var(--bug-red)",
          },
          {
            emoji: "✨",
            title: "Prompts",
            body: "Samla och dela de prompts som faktiskt fungerade. Utan att behöva uppfinna hjulet om och om igen.",
            href: "/prompts",
            color: "var(--prompt-purple)",
          },
          {
            emoji: "🗺️",
            title: "Genvägar",
            body: "Guider, workflows och tips från folk som redan klurat ut det. Från installation till deployment.",
            href: "/guides",
            color: "var(--code-blue)",
          },
        ].map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="chunky pressable group flex gap-4 rounded-2xl bg-paper p-5"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink text-lg"
              style={{ backgroundColor: section.color }}
            >
              {section.emoji}
            </span>
            <div>
              <h3 className="font-display font-bold text-ink group-hover:text-build-green transition-colors">
                {section.title}
              </h3>
              <p className="mt-1 text-sm text-mud">{section.body}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* The philosophy */}
      <div className="chunky mt-12 rounded-3xl border-2 border-ink bg-hammer-yellow/30 p-8">
        <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-mud mb-3">
          Filosofi
        </p>
        <p className="font-display text-xl font-bold leading-snug text-ink">
          "Det är okej att vara ny. Det är inte okej att vara passiv. Visa vad du försökt,
          så hjälper communityn dig vidare."
        </p>
        <p className="mt-4 text-mud">
          Det är inte ett forum för att imponera. Det är ett ställe för att faktiskt
          komma vidare. Halvfärdigt är ett utgångsläge, inte en skamgräns.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="font-display text-xl font-bold text-ink mb-5">
          Kom in på bänken.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ChunkyLink href="/projects/new" variant="green">
            Lägg upp ett bygge
          </ChunkyLink>
          <ChunkyLink href="/problemhornan/new" variant="yellow">
            Ställ en fråga
          </ChunkyLink>
          <ChunkyLink href="/projects" variant="paper">
            Utforska →
          </ChunkyLink>
        </div>
      </div>
    </div>
  );
}
