"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, User, Settings, ShieldCheck, ChevronDown, Hammer, HelpCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { PixelHammerLogo } from "@/components/brand/illustrations";
import { LevelBadge } from "@/components/levels/LevelBadge";
import { FoundingBadge } from "@/components/founding/FoundingBadge";
import { BETA_VERSION } from "@/lib/version";
import { NotificationBell } from "@/components/notifications/NotificationBell";

const navLinks = [
  { href: "/projects", label: "Byggen" },
  { href: "/problemhornan", label: "Problemhörnan" },
  { href: "/prompts", label: "Prompts" },
  { href: "/guides", label: "Genvägar" },
  { href: "/community", label: "Byggare" },
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
      <span className="inline-flex items-center rounded-md border-2 border-ink bg-hammer-yellow px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-ink shadow-[1.5px_1.5px_0_0_var(--ink)]">
        Beta v{BETA_VERSION}
      </span>
    </Link>
  );
}

const CTA_ITEMS = [
  { href: "/projects/new",      label: "Bygge",       sub: "Visa upp vad du bygger",       Icon: Hammer,      color: "var(--build-green)" },
  { href: "/problemhornan/new", label: "Hjälpfråga",  sub: "Fastnat? Fråga communityn",    Icon: HelpCircle,  color: "var(--warning-orange)" },
  { href: "/prompts/new",       label: "Prompt",      sub: "Dela en prompt som funkade",   Icon: Sparkles,    color: "#c4b5fd" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ctaOpen, setCtaOpen] = useState(false);
  const [ctaPos, setCtaPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const ctaBtnRef = useRef<HTMLButtonElement>(null);
  const ctaDropRef = useRef<HTMLDivElement>(null);
  const { user, profile, loading, signOut } = useAuth();
  const pathname = usePathname();
  const profileHref = profile?.username ? `/profile/${profile.username}` : "/onboarding";
  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!ctaOpen) return;
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (!ctaBtnRef.current?.contains(t) && !ctaDropRef.current?.contains(t)) {
        setCtaOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setCtaOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [ctaOpen]);

  function handleCtaClick() {
    if (!ctaOpen && ctaBtnRef.current) {
      const rect = ctaBtnRef.current.getBoundingClientRect();
      setCtaPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
    setCtaOpen((o) => !o);
  }

  const ctaDropdown = ctaOpen && typeof window !== "undefined" && createPortal(
    <div
      ref={ctaDropRef}
      role="menu"
      style={{ position: "fixed", top: ctaPos.top, right: ctaPos.right, zIndex: 9999 }}
      className="w-56 overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-[4px_4px_0_0_var(--ink)]"
    >
      {CTA_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          role="menuitem"
          onClick={() => setCtaOpen(false)}
          className="flex items-center gap-3 px-4 py-3 hover:bg-cream transition-colors first:pt-4 last:pb-4"
        >
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-ink/20"
            style={{ backgroundColor: item.color }}
          >
            <item.Icon size={14} className="text-ink" />
          </span>
          <div className="min-w-0">
            <p className="font-mono text-xs font-bold uppercase tracking-wide text-ink">{item.label}</p>
            <p className="truncate text-[10px] text-mud">{item.sub}</p>
          </div>
        </Link>
      ))}
    </div>,
    document.body
  );

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
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-xl px-3 py-1.5 font-mono text-[13px] font-medium uppercase tracking-wide transition-colors",
                    isActive
                      ? "bg-hammer-yellow text-ink shadow-[2px_2px_0_0_var(--ink)]"
                      : "text-mud hover:bg-hammer-yellow hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
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
                    {profile && <LevelBadge level={profile.level} />}
                    <FoundingBadge show={!!profile?.foundingMember} />
                  </Link>
                  <NotificationBell />
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
            <button
              ref={ctaBtnRef}
              onClick={handleCtaClick}
              aria-haspopup="menu"
              aria-expanded={ctaOpen}
              className="chunky-sm pressable inline-flex items-center gap-1.5 rounded-xl bg-build-green px-4 py-2 font-mono text-[13px] font-bold uppercase tracking-wide text-paper"
            >
              Lägg upp
              <ChevronDown size={12} className={cn("transition-transform duration-150", ctaOpen && "rotate-180")} />
            </button>
            {ctaDropdown}
          </div>

          {/* Mobil: notiser + toggle */}
          <div className="md:hidden flex items-center gap-1">
          {!loading && user && <NotificationBell />}
          <button
            className="rounded-xl p-2 text-ink hover:bg-hammer-yellow transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Stäng meny" : "Öppna meny"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          </div>
        </div>

        {/* Mobilmeny */}
        {mobileOpen && (
          <div className="md:hidden -mx-4 border-t-2 border-ink bg-paper sm:-mx-6">
            <nav className="flex flex-col gap-1 px-4 py-4 sm:px-6" aria-label="Mobilnavigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "rounded-xl px-3 py-3 font-mono text-base font-medium uppercase tracking-wide transition-colors",
                      isActive
                        ? "bg-hammer-yellow text-ink font-bold"
                        : "text-ink hover:bg-hammer-yellow",
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
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
                <p className="px-3 pt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-mud">Lägg upp</p>
                {CTA_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-cream"
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-ink/20"
                      style={{ backgroundColor: item.color }}
                    >
                      <item.Icon size={15} className="text-ink" />
                    </span>
                    <div>
                      <p className="font-mono text-sm font-bold uppercase tracking-wide text-ink">{item.label}</p>
                      <p className="text-[11px] text-mud">{item.sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
