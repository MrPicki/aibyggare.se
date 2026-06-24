import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";

export const metadata = {
  title: "Byggsnack — AIbyggare.se",
  description: "Diskussioner, tankar och löst snack från folk som bygger med AI.",
};

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      <div className="mb-10">
        <Sticker tilt={-2} className="mb-3 bg-prompt-purple">Byggsnack</Sticker>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Byggsnack
        </h1>
        <p className="mt-2 max-w-md text-mud">
          Diskussioner, tankar och löst snack från folk som bygger.
        </p>
      </div>

      <div className="chunky rounded-3xl bg-paper p-12 text-center sm:p-16">
        <p className="font-display text-xl font-bold text-ink">Tyst på bänken just nu.</p>
        <p className="mx-auto mt-2 max-w-sm text-mud">
          Dra igång det första snacket — en fråga, en seger eller en bugg du fortfarande inte fattar.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ChunkyLink href="/problemhornan/new" variant="yellow">
            Ställ en fråga
          </ChunkyLink>
          <ChunkyLink href="/projects/new" variant="green">
            Visa ett bygge
          </ChunkyLink>
        </div>
      </div>
    </div>
  );
}
