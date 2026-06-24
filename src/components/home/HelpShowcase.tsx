import Link from "next/link";
import { HelpCard } from "@/components/cards/HelpCard";
import { Sticker } from "@/components/ui/Sticker";
import { SEED_HELP_QUESTIONS } from "@/lib/seed";
import { toolAccent } from "@/lib/constants/tools";

const FEATURED = SEED_HELP_QUESTIONS.filter((q) => q.status === "Öppen").slice(0, 3);

export function HelpShowcase() {
  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Sticker tilt={-1} className="mb-3 bg-warning-orange">Öppna frågor</Sticker>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Fastnat? Du är inte ensam.
            </h2>
            <p className="mt-2 max-w-md text-mud">
              Frågor från communityn som väntar på svar — kanske vet du något.
            </p>
          </div>
          <Link
            href="/help"
            className="font-mono text-sm font-bold uppercase tracking-wide text-ink hover:text-warning-orange transition-colors"
          >
            Se alla frågor →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((q) => (
            <HelpCard
              key={q.slug}
              slug={q.slug}
              title={q.title}
              body={q.body}
              topic={q.topic}
              accent={q.accent ?? toolAccent(q.topic)}
              author={q.author}
              username={q.username}
              avatarUrl={q.avatarUrl}
              answerCount={q.answerCount}
              status={q.status}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
