import { Sticker } from "@/components/ui/Sticker";

// OBS: Platshållare tills vi har riktiga röster. Byt ut innan lansering.
const QUOTES = [
  { quote: "Äntligen en plats där man får vara ny utan att skämmas.", name: "Byggare #1", accent: "var(--build-green)" },
  { quote: "Jag trodde jag var ensam om att Claude förstörde min layout.", name: "Byggare #2", accent: "var(--warning-orange)" },
  { quote: "Supabase-frågan jag inte vågade ställa fick svar på tio minuter.", name: "Byggare #3", accent: "var(--supabase-green)" },
  { quote: "Det här känns mer som en byggbänk än ett forum.", name: "Byggare #4", accent: "var(--code-blue)" },
  { quote: "Lade upp en halvtrasig MVP och fick faktiskt användbar feedback.", name: "Byggare #5", accent: "var(--prompt-purple)" },
];

export function Testimonials() {
  return (
    <section className="bg-paper border-t-2 border-ink px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <Sticker tilt={-2} className="mb-3 bg-soft-teal">Röster</Sticker>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            De fattar grejen
          </h2>
          <p className="mt-2 font-mono text-xs uppercase tracking-wide text-mud">
            Exempel-röster · byts mot riktiga vid lansering
          </p>
        </div>

        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {QUOTES.map((q, i) => (
            <figure
              key={i}
              className="chunky rounded-3xl bg-cream p-6"
              style={{ rotate: i % 2 === 0 ? "-1deg" : "1deg" }}
            >
              <span aria-hidden className="font-display text-4xl leading-none text-ink/20">
                ”
              </span>
              <blockquote className="mt-1 font-display text-lg font-semibold leading-snug text-ink">
                {q.quote}
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="h-8 w-8 rounded-full border-2 border-ink"
                  style={{ backgroundColor: q.accent }}
                />
                <span className="font-mono text-xs font-semibold uppercase tracking-wide text-mud">
                  {q.name}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
