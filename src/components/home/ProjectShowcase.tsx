import Link from "next/link";
import { ProjectCard, type ProjectCardProps } from "@/components/cards/ProjectCard";
import { Sticker } from "@/components/ui/Sticker";

const PROJECTS: ProjectCardProps[] = [
  { title: "Smartbok.se", tagline: "AI-bokföring för enskild firma. Foton på kvitton in, ordning ut.", slug: "smartbok-se", status: "Hackig MVP", accent: "var(--supabase-green)", tags: ["Supabase", "Claude", "Vercel"], upvotes: 18, commentCount: 6 },
  { title: "AIkostnad.se", tagline: "Räkna ut vad AI faktiskt kostar dig per månad. Jämför modeller.", slug: "aikostnad-se", status: "Live men nervös", accent: "var(--build-green)", tags: ["Next.js", "API", "Kalkylator"], upvotes: 24, commentCount: 7 },
  { title: "Need Radar", tagline: "AI som dagligen letar marknadsmöjligheter i forum och trådar.", slug: "need-radar", status: "Byggs om", accent: "var(--warning-orange)", tags: ["Reddit", "Claude", "Automation"], upvotes: 15, commentCount: 4 },
  { title: "Amazon Snipe", tagline: "Prisfel-scanner för Amazon som tjuter när något är felprissatt.", slug: "amazon-snipe", status: "MVP på livstöd", accent: "var(--hammer-yellow)", tags: ["Keepa", "Telegram", "Bot"], upvotes: 11, commentCount: 9 },
  { title: "BTC Edge", tagline: "Polymarket-bot med hårda go/no-go-regler. Disciplin över hopp.", slug: "btc-edge", status: "Forskning först", accent: "var(--code-blue)", tags: ["Trading", "Backtest", "Bot"], upvotes: 9, commentCount: 3 },
  { title: "Runnr", tagline: "AI-löpcoach för vanliga människor som inte vill ha en PT-app.", slug: "runnr", status: "Behöver testare", accent: "var(--prompt-purple)", tags: ["AI Coach", "Running", "Mobile"], upvotes: 21, commentCount: 8 },
];

export function ProjectShowcase() {
  return (
    <section className="bg-paper border-y-2 border-ink py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Sticker tilt={-2} className="mb-3 bg-build-green">Byggen</Sticker>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Just nu på bänken
            </h2>
            <p className="mt-2 max-w-md text-mud">
              Projekt från folk som bygger, testar, misslyckas och försöker igen.
            </p>
          </div>
          <Link
            href="/projects"
            className="font-mono text-sm font-bold uppercase tracking-wide text-ink hover:text-build-green transition-colors"
          >
            Se alla →
          </Link>
        </div>
      </div>

      {/* Carousel */}
      <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="hidden sm:block sm:w-[max(0px,calc((100vw-80rem)/2))] shrink-0" aria-hidden />
        {PROJECTS.map((p) => (
          <div key={p.slug} className="w-[280px] shrink-0 snap-start sm:w-[320px]">
            <ProjectCard {...p} />
          </div>
        ))}
      </div>
    </section>
  );
}
