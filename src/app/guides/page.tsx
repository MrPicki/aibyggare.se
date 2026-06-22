import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";

export const metadata = {
  title: "Genvägar — AIbyggare.se",
  description: "Guider, workflows och genvägar för att bygga snabbare med AI.",
};

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Sticker tilt={2} className="mb-3 bg-code-blue">Genvägar</Sticker>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Genvägar
          </h1>
          <p className="mt-2 max-w-md text-mud">
            Guider, workflows och tips från byggare som redan klurat ut det.
          </p>
        </div>
        <ChunkyLink href="/guides/new" variant="green">
          Dela en guide
        </ChunkyLink>
      </div>

      <div className="chunky rounded-3xl bg-paper p-12 text-center sm:p-16">
        <p className="font-display text-xl font-bold text-ink">Inga genvägar ännu.</p>
        <p className="mx-auto mt-2 max-w-sm text-mud">
          Den första du lägger upp hjälper alla som kommer efter. Visa hur du löste det.
        </p>
        <div className="mt-6 flex justify-center">
          <ChunkyLink href="/guides/new" variant="green">
            Dela första genvägen
          </ChunkyLink>
        </div>
      </div>
    </div>
  );
}
