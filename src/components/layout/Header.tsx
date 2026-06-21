"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const navLinks = [
  { href: "/projects", label: "Byggen" },
  { href: "/help", label: "Hjälp" },
  { href: "/prompts", label: "Prompts" },
  { href: "/community", label: "Community" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center font-semibold text-lg tracking-tight text-foreground"
          >
            AIbyggare<span className="text-primary font-bold">.</span>se
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
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
                "bg-primary text-primary-foreground hover:bg-[#8FB339] font-medium"
              )}
            >
              Lägg upp
            </Link>
          </div>

          {/* Mobile menu toggle */}
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
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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
                  "bg-primary text-primary-foreground hover:bg-[#8FB339]"
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
  );
}
