import Link from "next/link";

const footerLinks = {
  Plattform: [
    { href: "/projects", label: "Byggen" },
    { href: "/help", label: "Hjälp" },
    { href: "/prompts", label: "Prompts" },
    { href: "/community", label: "Community" },
  ],
  Verktyg: [
    { href: "/tools/claude-code", label: "Claude Code" },
    { href: "/tools/cursor", label: "Cursor" },
    { href: "/tools/lovable", label: "Lovable" },
    { href: "/tools/supabase", label: "Supabase" },
  ],
  Om: [
    { href: "/about", label: "Om AIbyggare" },
    { href: "/community-rules", label: "Regler" },
    { href: "/contact", label: "Kontakt" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-alt mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="font-semibold text-base tracking-tight text-foreground"
            >
              AIbyggare<span className="text-primary font-bold">.</span>se
            </Link>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-48">
              Sveriges community för dig som bygger med AI.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-foreground mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-primary font-medium">AIbyggare</span>.se — Byggd med AI i Sverige 🇸🇪
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Integritet
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Villkor
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
