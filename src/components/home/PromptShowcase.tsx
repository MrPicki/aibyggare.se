import Link from "next/link";
import { PromptCard } from "@/components/cards/PromptCard";
import { Sticker } from "@/components/ui/Sticker";
import { SEED_PROMPTS } from "@/lib/seed";

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
          {SEED_PROMPTS.map((p) => (
            <PromptCard key={p.title} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
