import { Mail } from "lucide-react";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";

export const metadata = {
  title: "Kontakt — AIbyggare.se",
  description: "Hör av dig till AIbyggare.se — idéer, buggrapporter, samarbeten eller bara ett hej.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <Sticker tilt={2} className="mb-4 bg-code-blue">Kontakt</Sticker>
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Hör av dig
      </h1>
      <p className="mt-3 max-w-md text-lg leading-relaxed text-mud">
        Idé, buggrapport, samarbete eller bara ett hej — allt är välkommet. Vi läser allt,
        även det som inte är perfekt formulerat.
      </p>

      <div className="chunky mt-8 rounded-3xl bg-paper p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-hammer-yellow text-ink">
            <Mail size={18} />
          </span>
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-mud">
              Mejl
            </p>
            <a
              href="mailto:hej@aibyggare.se"
              className="font-display text-lg font-bold text-ink hover:text-build-green transition-colors"
            >
              hej@aibyggare.se
            </a>
          </div>
        </div>
      </div>

      <p className="mt-8 text-mud">
        Sitter du fast i ett bygge istället? Då går det snabbare att fråga communityn direkt.
      </p>
      <div className="mt-4">
        <ChunkyLink href="/help/new" variant="yellow">
          Ställ en fråga
        </ChunkyLink>
      </div>
    </div>
  );
}
