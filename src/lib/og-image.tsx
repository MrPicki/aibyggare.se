/**
 * Shared helpers for Next.js ImageResponse OG images.
 * Consumed by src/app/[...]/opengraph-image.tsx files.
 */

export const OG_SIZE = { width: 1200, height: 630 };

export const INK    = "#373927";
export const PAPER  = "#FFFAF2";
export const MUD    = "rgba(55,57,39,0.55)";
export const GREEN  = "#64B26A";
export const YELLOW = "#F0D76A";
export const RED    = "#B25A44";
export const PURPLE = "#8B5CF6";
export const BLUE   = "#4A90D9";

export type OgType = "project" | "problem" | "prompt" | "guide";

export const TYPE_CONFIG: Record<OgType, { label: string; color: string; bg: string }> = {
  project: { label: "Bygge",        color: GREEN,  bg: `${GREEN}22` },
  problem: { label: "Hjälpfråga",   color: RED,    bg: `${RED}22` },
  prompt:  { label: "Prompt",       color: PURPLE, bg: `${PURPLE}22` },
  guide:   { label: "Genväg",       color: BLUE,   bg: `${BLUE}22` },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aibyggare.se";

// Läser en buntad statisk TTF (Geist) från egna domänen. Google Fonts gav
// woff2/EOT och variabel-TTF kraschar Satori ("reading '256'"); en statisk TTF
// är robust och fungerar på alla runtimes.
export async function loadFredoka(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(`${SITE_URL}/fonts/og-font.ttf`);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export function makeFonts(fontData: ArrayBuffer | null) {
  if (!fontData) return [];
  // Samma data för 400 och 700 så att alla fontWeight i designen matchar
  // (Satori faller annars tillbaka och kan rendera fel).
  return [
    { name: "Fredoka", data: fontData, weight: 400 as const, style: "normal" as const },
    { name: "Fredoka", data: fontData, weight: 700 as const, style: "normal" as const },
  ];
}

/** Truncate text to maxLen chars, adding ellipsis. */
export function trunc(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + "…";
}
