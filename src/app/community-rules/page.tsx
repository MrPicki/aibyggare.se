import { Sticker } from "@/components/ui/Sticker";

export const metadata = {
  title: "Regler — AIbyggare.se",
  description: "Reglerna på AIbyggare.se är enkla: hjälp till, var schysst och döm inte halvfärdiga byggen.",
};

const RULES: { title: string; body: string }[] = [
  {
    title: "Halvfärdigt räknas",
    body: "Ingen dömer ett bygge för att det är buggigt eller oklart. Alla har börjat någonstans. Visa vad du har.",
  },
  {
    title: "Hjälp som du själv vill bli hjälpt",
    body: "Svara konkret och snällt. Förklara så att även en nybörjare hänger med. Inga nedlåtande svar.",
  },
  {
    title: "Beskriv vad du testat",
    body: "När du fastnat: berätta vad du försöker göra, vad du provat och vad som gick fel. Då blir det lätt att hjälpa dig.",
  },
  {
    title: "Dela det som faktiskt funkade",
    body: "Prompts, guider och genvägar är guld. Dela det som sparade din kväll så slipper nästa person samma huvudvärk.",
  },
  {
    title: "Ingen spam, hype eller säljsnack",
    body: "Det här är en byggplats, inte en annonsplats. Ren reklam och tom AI-hype hör inte hemma här.",
  },
  {
    title: "Var en människa",
    body: "Bakom varje bygge sitter en person som försöker. Behandla dem därefter.",
  },
];

export default function CommunityRulesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <Sticker tilt={-2} className="mb-4 bg-bug-red text-paper">Regler</Sticker>
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Reglerna är enkla
      </h1>
      <p className="mt-3 max-w-md text-lg leading-relaxed text-mud">
        Inga långa villkor. Bara det som håller bänken till en plats man vill återvända till.
      </p>

      <ol className="mt-8 space-y-4">
        {RULES.map((rule, i) => (
          <li key={rule.title} className="chunky flex gap-4 rounded-3xl bg-paper p-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-hammer-yellow font-display text-lg font-bold text-ink">
              {i + 1}
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">{rule.title}</h2>
              <p className="mt-1 text-mud">{rule.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
