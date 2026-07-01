import Link from "next/link";
import { PixelHammerLogo } from "@/components/brand/illustrations";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

const footerLinks = [
  { href: "/projects", label: "Byggen" },
  { href: "/problemhornan", label: "Problemhörnan" },
  { href: "/prompts", label: "Prompts" },
  { href: "/guides", label: "Genvägar" },
  { href: "/community", label: "Byggsnack" },
  { href: "/about", label: "Om" },
  { href: "/community-rules", label: "Regler" },
  { href: "/contact", label: "Kontakt" },
];

const legalLinks = [
  { href: "/integritetspolicy", label: "Integritetspolicy" },
  { href: "/anvandarvillkor", label: "Användarvillkor" },
];

// Sajtvid intern länkning till SEO-landningssidorna per verktyg.
const toolLinks = [
  { href: "/tools/claude-code", label: "Claude Code" },
  { href: "/tools/cursor", label: "Cursor" },
  { href: "/tools/lovable", label: "Lovable" },
  { href: "/tools/bolt", label: "Bolt" },
  { href: "/tools/supabase", label: "Supabase" },
  { href: "/tools/vercel", label: "Vercel" },
  { href: "/tools/firebase", label: "Firebase" },
  { href: "/tools", label: "Alla verktyg →" },
];

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
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
              En svensk byggbänk för folk som bygger med AI — och fastnar, delar och
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
            <NewsletterForm />
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

          {/* Verktyg */}
          <div className="md:justify-self-end">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-ink">
              Verktyg
            </h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2">
              {toolLinks.map((link) => (
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-xs text-mud">
              © {new Date().getFullYear()} AIbyggare.se · Byggt med AI, kaffe och rimlig
              mängd panik.
            </p>

            {/* Juridik + företagsinfo */}
            <div className="flex flex-col gap-1 sm:items-end">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {legalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-mono text-xs text-mud hover:text-build-green transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <p className="font-mono text-xs text-mud/70">
                Ansvarigt företag:{" "}
                <a
                  href="https://ncom.se"
                  className="hover:text-build-green transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ncom.se
                </a>
                {" · "}
                <a
                  href="mailto:info@aibyggare.se"
                  className="hover:text-build-green transition-colors"
                >
                  info@aibyggare.se
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
