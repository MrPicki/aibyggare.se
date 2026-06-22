import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { HelpCard } from "@/components/cards/HelpCard";
import { Sticker } from "@/components/ui/Sticker";
import { SEED_HELP_QUESTIONS } from "@/lib/seed";

export const metadata = {
  title: "Fastnat? — AIbyggare.se",
  description: "Ställ en fråga och få hjälp av andra byggare. Auth, deploys, databaser — communityn har fastnat i precis samma saker.",
};

export default function HelpPage() {
  const questions = SEED_HELP_QUESTIONS;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Sticker tilt={2} className="mb-3 bg-hammer-yellow">Fastnat?</Sticker>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Folk har fastnat här
          </h1>
          <p className="mt-2 max-w-md text-mud">
            Supabase, Vercel, auth, CSS och andra små glädjeämnen. Du är inte ensam.
          </p>
        </div>
        <ChunkyLink href="/help/new" variant="yellow">
          Jag har fastnat
        </ChunkyLink>
      </div>

      {questions.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {questions.map((q) => (
            <HelpCard key={q.slug} {...q} />
          ))}
        </div>
      ) : (
        <div className="chunky rounded-3xl bg-paper p-12 text-center sm:p-16">
          <p className="font-display text-xl font-bold text-ink">
            Ingen har fastnat just nu. Det lär inte hålla länge.
          </p>
          <p className="mx-auto mt-2 max-w-sm text-mud">
            Beskriv vad du försöker göra och vad som gick fel, så blir det lättare att hjälpa dig.
          </p>
          <div className="mt-6 flex justify-center">
            <ChunkyLink href="/help/new" variant="yellow">
              Beskriv vad som strular
            </ChunkyLink>
          </div>
        </div>
      )}
    </div>
  );
}
