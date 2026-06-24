"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut, User, Settings, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { PixelHammerLogo } from "@/components/brand/illustrations";

const navLinks = [
  { href: "/projects", label: "Byggen" },
  { href: "/problemhornan", label: "Problemhörnan" },
  { href: "/prompts", label: "Prompts" },
  { href: "/guides", label: "Genvägar" },
];

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2 group" aria-label="AIbyggare.se — startsida">
      <span className="chunky-sm pressable flex h-9 w-9 items-center justify-center rounded-xl bg-build-green text-paper">
        <PixelHammerLogo size={22} />
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-ink">
        AIbyggare<span className="text-build-green">.</span>se
      </span>
    </Link>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, loading, signOut } = useAuth();
  const profileHref = profile?.username ? `/profile/${profile.username}` : "/onboarding";
  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={cn(
          "mx-auto max-w-7xl overflow-hidden rounded-2xl bg-paper/85 px-4 backdrop-blur-md transition-all duration-200 sm:px-6",
          scrolled ? "chunky" : "chunky-sm",
        )}
      >
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Vänster: nav (desktop) */}
          <nav className="hidden md:flex items-center gap-1 flex-1" aria-label="Huvudnavigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-1.5 font-mono text-[13px] font-medium uppercase tracking-wide text-mud hover:bg-hammer-yellow hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Center: wordmark */}
          <div className="flex-1 md:flex-none flex md:justify-center">
            <Wordmark />
          </div>

          {/* Höger: CTAs (desktop) */}
          <div className="hidden md:flex items-center justify-end gap-2 flex-1">
            {!loading &&
              (user ? (
                <>
                  <Link
                    href={profileHref}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-[13px] font-medium text-mud hover:text-ink transition-colors"
                  >
                    {profile?.avatarUrl || user.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profile?.avatarUrl || user.photoURL!} alt="" className="h-6 w-6 rounded-full border-2 border-ink object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User size={15} />
                    )}
                    <span className="max-w-24 truncate">{profile?.displayName ?? user.displayName ?? "Profil"}</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="rounded-xl p-2 text-mud hover:bg-bug-red/10 hover:text-bug-red transition-colors"
                      aria-label="Admin"
                    >
                      <ShieldCheck size={16} />
                    </Link>
                  )}
                  <Link
                    href="/settings"
                    className="rounded-xl p-2 text-mud hover:bg-hammer-yellow hover:text-ink transition-colors"
                    aria-label="Inställningar"
                  >
                    <Settings size={16} />
                  </Link>
                  <button
                    onClick={signOut}
                    className="rounded-xl p-2 text-mud hover:bg-bug-red/10 hover:text-bug-red transition-colors"
                    aria-label="Logga ut"
                  >
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-xl px-3.5 py-2 font-mono text-[13px] font-semibold uppercase tracking-wide text-ink hover:bg-hammer-yellow transition-colors"
                >
                  Logga in
                </Link>
              ))}
            <Link
              href="/projects/new"
              className="chunky-sm pressable rounded-xl bg-build-green px-4 py-2 font-mono text-[13px] font-bold uppercase tracking-wide text-paper"
            >
              Lägg upp
            </Link>
          </div>

          {/* Mobil toggle */}
          <button
            className="md:hidden rounded-xl p-2 text-ink hover:bg-hammer-yellow transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Stäng meny" : "Öppna meny"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobilmeny */}
        {mobileOpen && (
          <div className="md:hidden -mx-4 border-t-2 border-ink bg-paper sm:-mx-6">
            <nav className="flex flex-col gap-1 px-4 py-4 sm:px-6" aria-label="Mobilnavigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-3 font-mono text-base font-medium uppercase tracking-wide text-ink hover:bg-hammer-yellow transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t-2 border-dashed border-border pt-3">
                {!loading && user ? (
                  <>
                    <Link
                      href={profileHref}
                      className="flex items-center gap-2 rounded-xl px-3 py-3 font-mono text-base font-medium text-ink hover:bg-hammer-yellow transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <User size={16} /> Min profil
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 rounded-xl px-3 py-3 font-mono text-base font-medium text-ink hover:bg-hammer-yellow transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Settings size={16} /> Inställningar
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 rounded-xl px-3 py-3 font-mono text-base font-medium text-bug-red hover:bg-bug-red/10 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        <ShieldCheck size={16} /> Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-2 rounded-xl px-3 py-3 font-mono text-base font-medium text-mud hover:bg-bug-red/10 hover:text-bug-red transition-colors"
                    >
                      <LogOut size={16} /> Logga ut
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="rounded-xl px-3 py-3 font-mono text-base font-medium uppercase tracking-wide text-ink hover:bg-cream transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Logga in
                  </Link>
                )}
                <Link
                  href="/projects/new"
                  className="chunky-sm pressable rounded-xl bg-build-green px-4 py-3 text-center font-mono text-base font-bold uppercase tracking-wide text-paper"
                  onClick={() => setMobileOpen(false)}
                >
                  Lägg upp ett bygge
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
