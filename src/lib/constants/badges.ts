// Statiska community-märken (Fas 6). Härleds helt från användarens egen data —
// ingen separat achievement-lagring. Ett märke är "intjänat" om predikatet
// stämmer mot BadgeStats som profilsidan räknar fram.

export interface BadgeStats {
  projectCount: number;
  liveProjectCount: number;
  promptCount: number;
  helpQuestionCount: number;
  totalUpvotes: number;
  helpedSomeone: boolean;
}

export interface BadgeDef {
  id: string;
  label: string;
  description: string;
  /** CSS-färgvariabel för märkets accent. */
  accent: string;
}

interface BadgeRule {
  def: BadgeDef;
  earned: (s: BadgeStats) => boolean;
}

export const BADGES: BadgeRule[] = [
  {
    def: {
      id: "first-build",
      label: "Första bygget",
      description: "Lade upp sitt första projekt.",
      accent: "var(--build-green)",
    },
    earned: (s) => s.projectCount >= 1,
  },
  {
    def: {
      id: "helped",
      label: "Hjälpt någon",
      description: "Svarade på en annan byggares fråga.",
      accent: "var(--bug-red)",
    },
    earned: (s) => s.helpedSomeone,
  },
  {
    def: {
      id: "shared-prompt",
      label: "Delat en prompt",
      description: "Delade minst en prompt med communityn.",
      accent: "var(--prompt-purple)",
    },
    earned: (s) => s.promptCount >= 1,
  },
  {
    def: {
      id: "ten-drills",
      label: "10 borrar",
      description: "Fått minst 10 borrar totalt.",
      accent: "var(--hammer-yellow)",
    },
    earned: (s) => s.totalUpvotes >= 10,
  },
  {
    def: {
      id: "project-live",
      label: "Projekt live",
      description: "Har ett projekt som är live.",
      accent: "var(--supabase-green)",
    },
    earned: (s) => s.liveProjectCount >= 1,
  },
];

export interface BadgeView extends BadgeDef {
  earned: boolean;
}

export function resolveBadges(stats: BadgeStats): BadgeView[] {
  return BADGES.map((b) => ({ ...b.def, earned: b.earned(stats) }));
}
