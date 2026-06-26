"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { user, profile, loading, signInWithGoogle, signInWithGitHub, error } = useAuth();
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  // Redan inloggad? Skicka vidare — onboarding om den inte är klar, annars in
  // i flödet. Annars fastnar man på login-sidan efter redirect-inloggning.
  useEffect(() => {
    if (loading || !user || profile === null) return;
    router.replace(profile.onboardingCompleted ? "/projects" : "/onboarding");
  }, [user, profile, loading, router]);

  // Redirect-based sign-in navigates the whole tab away, so these handlers
  // only need to trigger the flow and show a brief "connecting" state.
  async function handleGoogle() {
    setGoogleLoading(true);
    await signInWithGoogle();
  }

  async function handleGitHub() {
    setGithubLoading(true);
    await signInWithGitHub();
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-20 sm:py-24">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="chunky-sm mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-build-green text-paper">
          <HammerIcon />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink mb-2">
          Välkommen tillbaka
        </h1>
        <p className="text-mud text-sm">
          Logga in för att visa upp ditt bygge, ställa frågor och hjälpa andra.
        </p>
      </div>

      {/* OAuth buttons */}
      <div className="space-y-3">
        <button
          onClick={handleGoogle}
          disabled={googleLoading || githubLoading}
          className="chunky pressable flex w-full items-center justify-center gap-3 rounded-xl bg-paper px-4 py-3 font-mono text-sm font-semibold text-ink disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
        >
          <GoogleIcon />
          {googleLoading ? "Ansluter..." : "Fortsätt med Google"}
        </button>

        <button
          onClick={handleGitHub}
          disabled={googleLoading || githubLoading}
          className="chunky pressable flex w-full items-center justify-center gap-3 rounded-xl bg-ink px-4 py-3 font-mono text-sm font-semibold text-paper disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
        >
          <GithubIcon />
          {githubLoading ? "Ansluter..." : "Fortsätt med GitHub"}
        </button>
      </div>

      {error && (
        <div className="chunky-sm mt-4 rounded-xl bg-bug-red/10 p-3">
          <p className="text-sm font-medium text-bug-red">{error}</p>
        </div>
      )}

      <div className="mt-8 space-y-3">
        <p className="text-center text-sm text-mud">
          Inget konto? Du skapar ett automatiskt när du loggar in.
        </p>
        <p className="text-center text-xs text-mud/70">
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
