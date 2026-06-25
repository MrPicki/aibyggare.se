import { ImageResponse } from "next/og";
import { SEED_PROMPTS } from "@/lib/seed";
import {
  OG_SIZE, INK, PAPER, PURPLE, MUD,
  loadFredoka, makeFonts, trunc,
} from "@/lib/og-image";

export const alt  = "Prompt på AIbyggare.se";
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let title   = "Prompt";
  let desc    = "En prompt från AIbyggare-communityn.";
  let author  = "";
  let tags: string[] = [];

  const seed = SEED_PROMPTS.find((p) => p.slug === slug);
  if (seed) {
    title  = seed.title;
    desc   = seed.prompt ? trunc(seed.prompt, 80) : desc;
    tags   = seed.tool ? [seed.tool] : [];
  }

  const fontData = await loadFredoka();
  const fonts    = makeFonts(fontData);
  const ff       = fontData ? "Fredoka" : "sans-serif";

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, background: INK, display: "flex", position: "relative", overflow: "hidden" }}>
        {/* Dot grid */}
        {Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: 12 }).map((_, col) => (
            <div key={`${row}-${col}`} style={{ position: "absolute", left: col * 105 + 30, top: row * 110 + 20, width: 3, height: 3, borderRadius: 2, background: "rgba(255,250,242,0.07)" }} />
          )),
        )}

        {/* Purple left bar */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 8, height: 630, background: PURPLE }} />

        {/* Decorative quote mark */}
        <div style={{ position: "absolute", right: 80, top: 80, fontSize: 280, color: "rgba(139,92,246,0.08)", fontFamily: "serif", lineHeight: 1 }}>
          "
        </div>

        {/* Content */}
        <div style={{ position: "absolute", left: 60, top: 0, width: 1000, height: 630, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 0" }}>
          {/* Top */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: `${PURPLE}33`, border: `2px solid ${PURPLE}`, borderRadius: 100, padding: "6px 18px" }}>
              <span style={{ color: PURPLE, fontSize: 16, fontWeight: 700, fontFamily: ff, textTransform: "uppercase", letterSpacing: "0.08em" }}>Prompt</span>
            </div>
            <span style={{ color: MUD, fontSize: 18, fontFamily: "monospace" }}>aibyggare.se/prompts</span>
          </div>

          {/* Middle */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <span style={{ fontSize: 72, fontWeight: 700, color: PAPER, lineHeight: 1.05, fontFamily: ff, letterSpacing: "-1.5px" }}>
              {trunc(title, 52)}
            </span>
            <span style={{ fontSize: 24, color: "rgba(255,250,242,0.65)", fontFamily: "monospace", lineHeight: 1.4, fontStyle: "italic" }}>
              {trunc(desc, 100)}
            </span>
          </div>

          {/* Bottom */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {author && (
              <span style={{ color: PAPER, fontSize: 18, fontFamily: "monospace", fontWeight: 600 }}>
                av {author}
              </span>
            )}
            {tags.map((t) => (
              <div key={t} style={{ background: "rgba(255,250,242,0.10)", borderRadius: 6, padding: "5px 12px", color: PAPER, fontSize: 14, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
