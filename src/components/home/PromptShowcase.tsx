import Link from "next/link";
import { PromptCard, type PromptCardProps } from "@/components/cards/PromptCard";
import { Sticker } from "@/components/ui/Sticker";

const PROMPTS: (Omit<PromptCardProps, "className">)[] = [
  {
    title: "Bygg utan att förstöra designen",
    tool: "Claude Code",
    badge: "Räddar frontend",
    accent: "var(--warning-orange)",
    prompt: "Innan du ändrar något: lista exakt vilka filer och rader du tänker röra och varför. Rör inte styling, layout eller befintliga komponenter som inte är del av uppgiften. Gör minsta möjliga ändring.",
  },
  {
    title: "Debugga först, koda sen",
    tool: "Cursor / Claude",
    badge: "Stoppar panikfixar",
    accent: "var(--code-blue)",
    prompt: "Skriv ingen kod än. Förklara först vad som faktiskt orsakar felet, hur du vet det, och vilka 2 alternativa lösningar som finns. Vänta på mitt godkännande innan du ändrar något.",
  },
  {
    title: "Förklara felet som om jag är ny",
    tool: "ChatGPT",
    badge: "Nybörjarvänlig",
    accent: "var(--prompt-purple)",
    prompt: "Förklara det här felmeddelandet som om jag precis börjat koda. Vad betyder det på vanlig svenska, varför händer det, och vad gör jag steg för steg för att fixa det?",
  },
  {
    title: "Skapa Supabase RLS steg för steg",
    tool: "Supabase",
    badge: "RLS-terapi",
    accent: "var(--supabase-green)",
    prompt: "Skriv Row Level Security-policies för den här tabellen så att användare bara kan läsa och ändra sina egna rader. Förklara varje policy med en kommentar och visa hur jag testar att de funkar.",
  },
];

export function PromptShowcase() {
  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Sticker tilt={2} className="mb-3 bg-prompt-purple">Prompts</Sticker>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Prompts som faktiskt funkade
            </h2>
            <p className="mt-2 max-w-md text-mud">
              Spara de prompts som gjorde mer nytta än skada.
            </p>
          </div>
          <Link
            href="/prompts"
            className="font-mono text-sm font-bold uppercase tracking-wide text-ink hover:text-build-green transition-colors"
          >
            Se alla →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROMPTS.map((p) => (
            <PromptCard key={p.title} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
