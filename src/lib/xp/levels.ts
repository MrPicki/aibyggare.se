// AIbyggare.se — XP- och levelsystem ("Byggkraft").
// Ren logik, inga beroenden. Importeras både client- och server-side.
//
// XP delas ut server-side via /api/xp/grant — ALDRIG direkt från klienten.
// Varje event-typ har ett fast belopp här; klienten kan aldrig välja belopp.

export type XpEventType =
  | "onboarding_avatar_selected"
  | "onboarding_username_set"
  | "onboarding_tools_selected"
  | "onboarding_status_selected"
  | "onboarding_bio_set"
  | "first_project_created"
  | "first_problem_created";

/** Fast XP-belopp per event-typ. Server-side sanning. */
export const XP_AMOUNTS: Record<XpEventType, number> = {
  onboarding_avatar_selected: 20,
  onboarding_username_set:     20,
  onboarding_tools_selected:   15,
  onboarding_status_selected:  10,
  onboarding_bio_set:          15,
  first_project_created:       25,
  first_problem_created:       25,
};

/** Alla onboarding-events i ordning — summerar till 80 XP. */
export const ONBOARDING_EVENTS: XpEventType[] = [
  "onboarding_avatar_selected",
  "onboarding_username_set",
  "onboarding_tools_selected",
  "onboarding_status_selected",
  "onboarding_bio_set",
];

// ── Level-kurva ──────────────────────────────────────────────────────────────
// Level 0 → 1 kräver 100 XP. Därefter en mjukt stigande kurva så att tidiga
// levels nås snabbt men senare tar längre tid. Trösklarna är kumulativ total-XP.
export const LEVEL_THRESHOLDS: number[] = [
  0,     // Level 0
  100,   // Level 1
  250,   // Level 2
  450,   // Level 3
  700,   // Level 4
  1000,  // Level 5
  1400,  // Level 6
  1900,  // Level 7
  2500,  // Level 8
  3200,  // Level 9
  4000,  // Level 10
];

export const LEVEL_TITLES: Record<number, string> = {
  0: "Nyfiken",
  1: "Ny på byggbänken",
  2: "Bänkvärmare",
  3: "Skruvar igång",
  4: "Bygger på riktigt",
  5: "Van byggare",
  6: "Rutinerad",
  7: "Verktygsmästare",
  8: "Byggbänksveteran",
  9: "Hantverkare",
  10: "Mästarbyggare",
};

/** Högsta level vars tröskel <= xp. */
export function levelForXp(xp: number): number {
  let level = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i;
    else break;
  }
  return level;
}

export function titleForLevel(level: number): string {
  return LEVEL_TITLES[level] ?? LEVEL_TITLES[10];
}

export interface LevelProgress {
  level: number;
  title: string;
  /** XP vid nuvarande levels tröskel. */
  currentLevelXp: number;
  /** XP-tröskel för nästa level (= currentLevelXp om maxnivå). */
  nextLevelXp: number;
  /** XP intjänat in i nuvarande level. */
  xpIntoLevel: number;
  /** XP som krävs för att gå från nuvarande till nästa level. */
  xpForThisLevel: number;
  /** 0–1, andel mot nästa level. 1 om maxnivå. */
  ratio: number;
  /** XP kvar till nästa level. 0 om maxnivå. */
  xpToNext: number;
  isMaxLevel: boolean;
}

/** Räknar ut komplett progress-vy för en given total-XP. */
export function levelProgress(xp: number): LevelProgress {
  const level = levelForXp(xp);
  const maxLevel = LEVEL_THRESHOLDS.length - 1;
  const isMaxLevel = level >= maxLevel;

  const currentLevelXp = LEVEL_THRESHOLDS[level];
  const nextLevelXp = isMaxLevel ? currentLevelXp : LEVEL_THRESHOLDS[level + 1];
  const xpForThisLevel = Math.max(1, nextLevelXp - currentLevelXp);
  const xpIntoLevel = xp - currentLevelXp;
  const ratio = isMaxLevel ? 1 : Math.min(1, Math.max(0, xpIntoLevel / xpForThisLevel));
  const xpToNext = isMaxLevel ? 0 : Math.max(0, nextLevelXp - xp);

  return {
    level,
    title: titleForLevel(level),
    currentLevelXp,
    nextLevelXp,
    xpIntoLevel,
    xpForThisLevel,
    ratio,
    xpToNext,
    isMaxLevel,
  };
}
