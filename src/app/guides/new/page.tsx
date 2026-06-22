import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";

export const metadata = {
  title: "Dela en guide — AIbyggare.se",
};

export default function NewGuidePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <Sticker tilt={-2} className="mb-4 bg-code-blue">Ny genväg</Sticker>
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
        Dela en genväg
      </h1>
      <p className="mt-2 text-mud">
        En guide, ett workflow eller ett knep som sparar tid. Visa hur du löste det så slipper nästa person gräva.
      </p>

      <div className="chunky mt-10 rounded-3xl bg-paper p-10 text-center sm:p-12">
        <p className="font-display text-lg font-bold text-ink">Formuläret byggs just nu.</p>
        <p className="mx-auto mt-2 max-w-sm text-mud">
          Logga in så är du först på plats när det öppnar.
        </p>
        <div className="mt-6 flex justify-center">
          <ChunkyLink href="/login" variant="green">
            Logga in
          </ChunkyLink>
        </div>
      </div>
    </div>
  );
}
