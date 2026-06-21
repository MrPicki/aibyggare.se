"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const navLinks = [
  { href: "/projects", label: "Byggen" },
  { href: "/help", label: "Fastnat?" },
  { href: "/prompts", label: "Prompts" },
  { href: "/guides", label: "Genvägar" },
  { href: "/community", label: "Byggsnack" },
];

function HammerIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      {/* Hammer head */}
      <rect x="1" y="1" width="12" height="7" rx="1.5" />
      {/* Side claw */}
      <rect x="10" y="3" width="7" height="3" rx="1" />
      {/* Handle */}
      <rect x="5.5" y="7" width="3.5" height="10" rx="1.5" />
    </svg>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50">
      {/* Safety stripe — construction yellow */}
      <div aria-hidden className="h-[3px] w-full bg-[#F5C842]" />

      <header className="w-full border-b border-border bg-background/96 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between gap-4">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 group"
              aria-label="AIbyggare.se — startsida"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-[5px] bg-primary text-[#181713] group-hover:bg-[#8DB34E] transition-colors">
                <HammerIcon />
              </span>
              <span className="font-heading font-bold text-[15px] tracking-tight text-foreground">
                AIbyggare<span className="text-primary">.</span>se
              </span>
            </Link>

            {/* Desktop nav — pill style */}
            <nav className="hidden md:flex items-center gap-0.5" aria-label="Huvudnavigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Logga in
              </Link>
              <Link
                href="/projects/new"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-primary text-[#181713] hover:bg-[#8DB34E] font-semibold"
                )}
              >
                Lägg upp
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Stäng meny" : "Öppna meny"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="flex flex-col px-4 py-3 gap-0.5 max-w-7xl mx-auto" aria-label="Mobilnavigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-2.5 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-border">
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "justify-start"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  Logga in
                </Link>
                <Link
                  href="/projects/new"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "bg-primary text-[#181713] hover:bg-[#8DB34E] font-semibold"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  Lägg upp
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
