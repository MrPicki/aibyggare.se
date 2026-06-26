import { ImageResponse } from "next/og";
import { loadFredoka, makeFonts } from "@/lib/og-image";

export const alt = "AIbyggare.se — Sveriges byggbänk för vibe coders";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

const CREAM  = "#F6F1EC";
const INK    = "#373927";
const GREEN  = "#64B26A";
const YELLOW = "#F0D76A";
const RED    = "#B25A44";
const PURPLE = "#8B5CF6";
const BLUE   = "#4A90D9";
const PAPER  = "#FFFAF2";

// Vit hammare för logga-boxen (samma blockiga form som i sajten).
function Hammer({ size: s = 190 }: { size?: number }) {
  const sc = s / 32;
  const w = "white";
  return (
    <div style={{ position: "relative", width: s, height: s, display: "flex" }}>
      <div style={{ position: "absolute", left: 4*sc, top: 5*sc, width: 15*sc, height: 8*sc, borderRadius: 1.5*sc, background: w }} />
      <div style={{ position: "absolute", left: 16*sc, top: 7*sc, width: 9*sc, height: 4*sc, borderRadius: 1*sc, background: w }} />
      <div style={{ position: "absolute", left: 9*sc, top: 12*sc, width: 4*sc, height: 14*sc, borderRadius: 1.5*sc, background: w }} />
      <div style={{ position: "absolute", left: 22*sc, top: 20*sc, width: 3*sc, height: 3*sc, borderRadius: 0.8*sc, background: w, opacity: 0.55 }} />
    </div>
  );
}

// Chunky sticker — ink-kant + hard offset shadow, som sajtens .sticker/.chunky.
function Sticker({
  children, bg, color = INK, fz = 20, rotate = 0, ff,
}: {
  children: string; bg: string; color?: string; fz?: number; rotate?: number; ff: string;
}) {
  const style: Record<string, string | number> = {
    display: "flex",
    alignItems: "center",
    background: bg,
    color,
    border: `3px solid ${INK}`,
    borderRadius: 14,
    padding: "8px 18px",
    fontSize: fz,
    fontFamily: ff,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    boxShadow: `4px 4px 0 0 ${INK}`,
  };
  if (rotate) style.transform = `rotate(${rotate}deg)`;
  return <div style={style}>{children}</div>;
}

export default async function Image() {
  const fontData = await loadFont();
  const fonts = makeFonts(fontData);
  const ff = fontData ? "Fredoka" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: CREAM,
          display: "flex",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Retro pricksrutnät */}
        {Array.from({ length: 7 }).map((_, row) =>
          Array.from({ length: 13 }).map((_, col) => (
            <div
              key={`${row}-${col}`}
              style={{
                position: "absolute",
                left: col * 95 + 24,
                top: row * 92 + 24,
                width: 4,
                height: 4,
                borderRadius: 2,
                background: "rgba(55,57,39,0.10)",
              }}
            />
          )),
        )}

        {/* Vänster: text + stickers */}
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 0,
            width: 660,
            height: 630,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "56px 0",
          }}
        >
          {/* Wordmark-sticker */}
          <div style={{ display: "flex", marginBottom: 30 }}>
            <Sticker bg={GREEN} color={PAPER} fz={22} rotate={-2} ff={ff}>
              AIbyggare.se
            </Sticker>
          </div>

          {/* Headline */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: 26 }}>
            <span style={{ fontSize: 92, fontWeight: 700, color: INK, lineHeight: 1.0, fontFamily: ff, letterSpacing: "-2px" }}>Bygg med AI.</span>
            <span style={{ fontSize: 92, fontWeight: 700, color: GREEN, lineHeight: 1.0, fontFamily: ff, letterSpacing: "-2px" }}>Visa upp.</span>
            <span style={{ fontSize: 92, fontWeight: 700, color: RED, lineHeight: 1.0, fontFamily: ff, letterSpacing: "-2px" }}>Få hjälp.</span>
          </div>

          {/* Subtext */}
          <p style={{ fontSize: 24, color: "rgba(55,57,39,0.65)", fontFamily: ff, margin: 0, marginBottom: 30 }}>
            Sveriges byggbänk för vibe coders. Halvfärdigt räknas.
          </p>

          {/* Feature-stickers */}
          <div style={{ display: "flex", gap: 12 }}>
            <Sticker bg={GREEN} color={PAPER} fz={16} ff={ff}>Byggen</Sticker>
            <Sticker bg={RED} color={PAPER} fz={16} ff={ff}>Hjälp</Sticker>
            <Sticker bg={PURPLE} color={PAPER} fz={16} ff={ff}>Prompts</Sticker>
            <Sticker bg={BLUE} color={PAPER} fz={16} ff={ff}>Genvägar</Sticker>
          </div>
        </div>

        {/* Höger: chunky logga-box + gamification-hint */}
        <div
          style={{
            position: "absolute",
            right: 96,
            top: "50%",
            transform: "translateY(-50%) rotate(-3deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 300,
            height: 300,
            background: GREEN,
            borderRadius: 48,
            border: `4px solid ${INK}`,
            boxShadow: `12px 12px 0 0 ${INK}`,
          }}
        >
          <Hammer size={180} />
        </div>

        {/* LVL-badge (game-vibe) */}
        <div
          style={{
            position: "absolute",
            right: 72,
            top: 150,
            display: "flex",
            alignItems: "center",
            background: YELLOW,
            color: INK,
            border: `3px solid ${INK}`,
            borderRadius: 12,
            padding: "6px 14px",
            fontSize: 22,
            fontFamily: ff,
            fontWeight: 700,
            boxShadow: `3px 3px 0 0 ${INK}`,
            transform: "rotate(6deg)",
          }}
        >
          LVL 7
        </div>

        {/* Founding-stämpel */}
        <div
          style={{
            position: "absolute",
            right: 300,
            bottom: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            background: YELLOW,
            border: `4px solid ${INK}`,
            borderRadius: 999,
            boxShadow: `3px 3px 0 0 ${INK}`,
            transform: "rotate(-12deg)",
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill={INK}>
            <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" />
          </svg>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}

const loadFont = loadFredoka;
