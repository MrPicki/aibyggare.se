"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export default function OnboardingPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  // Beslut tas EN gång vid ankomst: var onboarding redan klar då?
  // Annars skulle sidan redirecta bort så fort flödet sätter onboardingCompleted
  // = true (på länk-kortet) och sista kortet skulle aldrig hinna visas.
  const decided = useRef(false);
  const [allowFlow, setAllowFlow] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (decided.current) return;
    // profile === null kan vara "laddar än" — vänta tills den är hämtad.
    if (profile === null) return;

    decided.current = true;
    if (profile.onboardingCompleted) {
      router.replace("/projects");
    } else {
      setAllowFlow(true);
    }
  }, [user, profile, loading, router]);

  if (!allowFlow || !user) return null;

  return <OnboardingFlow user={user} />;
}
