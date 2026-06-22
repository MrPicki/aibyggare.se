"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { signInWithGoogle, signInWithGitHub } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  function firebaseErrorMessage(err: unknown): string {
    const code = (err as { code?: string })?.code ?? "";
    const msg  = (err as { message?: string })?.message ?? String(err);
    if (code === "auth/popup-blocked")         return "Popupen blockerades. Tillåt popups för den här sidan i webbläsaren.";
    if (code === "auth/popup-closed-by-user")  return "Du stängde inloggningsfönstret. Försök igen.";
    if (code === "auth/unauthorized-domain")   return "Den här domänen är inte auktoriserad i Firebase.";
    if (code === "auth/operation-not-allowed") return "Inloggningsmetoden är inte aktiverad i Firebase Console.";
    if (code === "auth/cancelled-popup-request") return "Bara ett inloggningsfönster åt gången.";
    return `Fel: ${code || msg}`;
  }

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(firebaseErrorMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleGitHub() {
    setError(null);
    setGithubLoading(true);
    try {
      await signInWithGitHub();
    } catch (err) {
      setError(firebaseErrorMessage(err));
    } finally {
      setGithubLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 mb-4">
          <HammerIcon className="text-[#3D6B20]" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
          Välkommen tillbaka
        </h1>
        <p className="text-muted-foreground text-sm">
          Logga in för att visa upp ditt bygge, ställa frågor och hjälpa andra.
        </p>
      </div>

      {/* OAuth buttons */}
      <div className="space-y-3">
        <button
          onClick={handleGoogle}
          disabled={googleLoading || githubLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GoogleIcon />
          {googleLoading ? "Ansluter..." : "Fortsätt med Google"}
        </button>

        <button
          onClick={handleGitHub}
          disabled={googleLoading || githubLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-[#30363d] bg-[#161b22] hover:bg-[#21262d] transition-colors text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GithubIcon />
          {githubLoading ? "Ansluter..." : "Fortsätt med GitHub"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-[#D94F3F]/10 border border-[#D94F3F]/20">
          <p className="text-sm text-[#D94F3F]">{error}</p>
        </div>
      )}

      <div className="mt-8 space-y-3">
        <p className="text-center text-sm text-muted-foreground">
          Inget konto? Du skapar ett automatiskt när du loggar in.
        </p>
        <p className="text-center text-xs text-muted-foreground/70">
          Genom att logga in godkänner du att vi lagrar din profilinformation.{" "}
          <Link href="/" className="underline underline-offset-2">Inga GDPR-popups</Link>, lovar.
        </p>
      </div>
    </div>
  );
}

function HammerIcon({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 18 18" fill="currentColor" className={className} aria-hidden>
      <rect x="1" y="1" width="12" height="7" rx="1.5" />
      <rect x="10" y="3" width="7" height="3" rx="1" />
      <rect x="5.5" y="7" width="3.5" height="10" rx="1.5" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.96L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12Z"/>
    </svg>
  );
}
