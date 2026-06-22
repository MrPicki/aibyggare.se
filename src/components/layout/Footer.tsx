import Link from "next/link";
import { PixelHammerLogo } from "@/components/brand/illustrations";

const footerLinks = [
  { href: "/projects", label: "Byggen" },
  { href: "/help", label: "Fastnat?" },
  { href: "/prompts", label: "Prompts" },
  { href: "/guides", label: "Genvägar" },
  { href: "/community", label: "Byggsnack" },
  { href: "/about", label: "Om" },
  { href: "/community-rules", label: "Regler" },
  { href: "/contact", label: "Kontakt" },
];

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2" aria-label="AIbyggare.se — startsida">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink bg-build-green text-paper">
                <PixelHammerLogo size={22} />
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-ink">
                AIbyggare<span className="text-build-green">.</span>se
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mud">
              En svensk byggplats för folk som skapar med AI — och fastnar, delar och
              hjälper varandra vidare.
            </p>
          </div>

          {/* Nyhetsbrev */}
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-ink">
              Nyhetsbrev
            </h3>
            <p className="mt-3 text-sm text-mud">
              Få veckans byggen, prompts och misstag vi kan skratta åt efteråt.
            </p>
            <form className="mt-4 flex gap-2" action="#" aria-label="Prenumerera på nyhetsbrev">
              <input
                type="email"
                required
                placeholder="din@email.se"
                className="min-w-0 flex-1 rounded-xl border-2 border-ink bg-cream px-3 py-2 font-mono text-sm text-ink placeholder:text-mud/60 focus:outline-none focus:ring-2 focus:ring-build-green"
              />
              <button
                type="submit"
                className="chunky-sm pressable shrink-0 rounded-xl bg-build-green px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-paper"
              >
                Skicka
              </button>
            </form>
          </div>

          {/* Länkar */}
          <div className="md:justify-self-end">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-ink">
              Karta
            </h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-mono text-sm text-mud hover:text-build-green transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t-2 border-dashed border-border pt-6">
          <p className="font-mono text-xs text-mud">
            © {new Date().getFullYear()} AIbyggare.se · Byggt med AI, kaffe och rimlig
            mängd panik.
          </p>
        </div>
      </div>
    </footer>
  );
}
