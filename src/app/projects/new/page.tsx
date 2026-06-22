import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";

export const metadata = {
  title: "Lägg upp bygge — AIbyggare.se",
};

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <Sticker tilt={-2} className="mb-4 bg-build-green">Nytt bygge</Sticker>
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
        Lägg upp ditt bygge
      </h1>
      <p className="mt-2 text-mud">
        Halvfärdigt räknas. Visa vad du håller på med och vad du vill ha hjälp eller feedback på.
      </p>

      <div className="chunky mt-10 rounded-3xl bg-paper p-10 text-center sm:p-12">
        <p className="font-display text-lg font-bold text-ink">Formuläret byggs just nu.</p>
        <p className="mx-auto mt-2 max-w-sm text-mud">
          Logga in så är du redo att lägga upp ditt bygge när det öppnar.
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
