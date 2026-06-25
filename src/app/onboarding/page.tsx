"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export default function OnboardingPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    // Redan klar med onboarding → ut till flödet.
    if (profile?.onboardingCompleted) {
      router.replace("/projects");
    }
  }, [user, profile, loading, router]);

  if (loading || !user || profile?.onboardingCompleted) return null;

  return <OnboardingFlow user={user} />;
}
