import { ChunkyLink } from "@/components/ui/ChunkyButton";

const WORDS = ["BYGGEN", "BUGGAR", "PROMPTS", "DEPLOYS", "KAFFE", "ENVISHET"];

function Row() {
  return (
    <div className="marquee-track">
      {WORDS.map((w, i) => (
        <span key={i} className="flex items-center whitespace-nowrap font-display text-4xl font-bold uppercase tracking-tight text-paper sm:text-5xl">
          {w}
          <span aria-hidden className="mx-6 text-hammer-yellow">
            ·
          </span>
        </span>
      ))}
    </div>
  );
}

export function CommunityMarquee() {
  return (
    <section className="bg-ink py-14 sm:py-20">
      <div className="overflow-hidden py-2 select-none" aria-hidden>
        <div className="flex">
          <Row />
          <Row />
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-2xl px-4 text-center">
        <h2 className="font-display text-3xl font-bold text-paper sm:text-4xl">
          Kom in på byggbänken.
        </h2>
        <p className="mt-3 text-paper/60">
          Halvfärdigt är också byggt. Communityn dömer inte — den hjälper.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <ChunkyLink href="/projects/new" variant="green" size="lg">
            Lägg upp ett bygge
          </ChunkyLink>
          <ChunkyLink href="/help/new" variant="yellow" size="lg">
            Ställ en fråga
          </ChunkyLink>
        </div>
      </div>
    </section>
  );
}
