import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";

export const metadata = {
  title: "Om — AIbyggare.se",
  description: "AIbyggare.se är en svensk byggbänk för folk som bygger med AI — och fastnar, delar och hjälper varandra vidare.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <Sticker tilt={-2} className="mb-4 bg-build-green">Om</Sticker>
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        En svensk byggbänk för folk som bygger med AI.
      </h1>

      <div className="mt-6 space-y-5 text-lg leading-relaxed text-mud">
        <p>
          AIbyggare.se är för oss som bygger först och förstår sen. Vibe coders, nybörjare,
          indie hackers och självlärda byggare som skapar appar, sajter och prylar med AI vid
          sin sida.
        </p>
        <p>
          Det här är inte ett klassiskt programmeringsforum och inte en glättig AI-SaaS-sida.
          Det är en plats där halvfärdigt också räknas, där det är okej att fastna, och där
          folk hjälper varandra vidare istället för att döma.
        </p>
        <p>
          Visa vad du bygger även om det inte är perfekt. Fråga när du kör fast. Dela prompten
          som faktiskt funkade. Det är hela grejen.
        </p>
      </div>

      <div className="chunky mt-10 rounded-3xl bg-cream p-8 text-center">
        <p className="font-display text-lg font-bold text-ink">Vill du vara med och bygga bänken?</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <ChunkyLink href="/projects/new" variant="green">
            Lägg upp ett bygge
          </ChunkyLink>
          <ChunkyLink href="/help/new" variant="yellow">
            Ställ en fråga
          </ChunkyLink>
        </div>
      </div>
    </div>
  );
}
