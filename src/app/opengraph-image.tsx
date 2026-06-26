import { ImageResponse } from "next/og";
import { loadFredoka, makeFonts } from "@/lib/og-image";

export const alt = "AIbyggare.se — Sveriges community för AI-byggare";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

const INK    = "#373927";
const GREEN  = "#64B26A";
const YELLOW = "#F0D76A";
const PAPER  = "#FFFAF2";
const MUD    = "rgba(255,250,242,0.55)";

const loadFont = loadFredoka;

function Hammer({ size: s = 200 }: { size?: number }) {
  const sc = s / 32;
  return (
    <div style={{ position: "relative", width: s, height: s, display: "flex" }}>
      {/* head */}
      <div style={{ position: "absolute", left: 4*sc, top: 5*sc, width: 15*sc, height: 8*sc, borderRadius: 1.5*sc, background: "white" }} />
      {/* extension */}
      <div style={{ position: "absolute", left: 16*sc, top: 7*sc, width: 9*sc, height: 4*sc, borderRadius: 1*sc, background: "white" }} />
      {/* shaft */}
      <div style={{ position: "absolute", left: 9*sc, top: 12*sc, width: 4*sc, height: 14*sc, borderRadius: 1.5*sc, background: "white" }} />
      {/* dot */}
      <div style={{ position: "absolute", left: 22*sc, top: 20*sc, width: 3*sc, height: 3*sc, borderRadius: 0.8*sc, background: "white", opacity: 0.5 }} />
    </div>
  );
}

export default async function Image() {
  const fontData = await loadFont();
  const fonts = makeFonts(fontData);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: INK,
          display: "flex",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative grid dots */}
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 14 }).map((_, col) => (
            <div
              key={`${row}-${col}`}
              style={{
                position: "absolute",
                left: col * 90 + 20,
                top: row * 90 + 20,
                width: 3,
                height: 3,
                borderRadius: 2,
                background: "rgba(255,250,242,0.08)",
              }}
            />
          )),
        )}

        {/* Green accent bar on left edge */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 8, height: 630, background: GREEN }} />

        {/* Left content column */}
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 0,
            width: 660,
            height: 630,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 0,
            padding: "60px 40px 60px 0",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: GREEN,
              borderRadius: 100,
              padding: "8px 22px",
              width: "fit-content",
              marginBottom: 36,
            }}
          >
            <span style={{ color: "white", fontSize: 18, fontWeight: 700, fontFamily: fontData ? "Fredoka" : "sans-serif", letterSpacing: "-0.3px" }}>
              AIbyggare.se
            </span>
          </div>

          {/* Headline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 24 }}>
            <span
              style={{
                fontSize: 96,
                fontWeight: 700,
                color: PAPER,
                lineHeight: 1.0,
                fontFamily: fontData ? "Fredoka" : "sans-serif",
                letterSpacing: "-2px",
              }}
            >
              Bygg med AI.
            </span>
            <span
              style={{
                fontSize: 96,
                fontWeight: 700,
                color: GREEN,
                lineHeight: 1.0,
                fontFamily: fontData ? "Fredoka" : "sans-serif",
                letterSpacing: "-2px",
              }}
            >
              Visa upp.
            </span>
            <span
              style={{
                fontSize: 96,
                fontWeight: 700,
                color: YELLOW,
                lineHeight: 1.0,
                fontFamily: fontData ? "Fredoka" : "sans-serif",
                letterSpacing: "-2px",
              }}
            >
              Få hjälp.
            </span>
          </div>

          {/* Subtext */}
          <p
            style={{
              fontSize: 22,
              color: MUD,
              fontFamily: "monospace",
              letterSpacing: "-0.3px",
              lineHeight: 1.4,
              margin: 0,
              marginBottom: 32,
            }}
          >
            Sveriges community för vibe coders och AI-byggare.
          </p>

          {/* Feature pills */}
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "Byggen", bg: `${GREEN}33` },
              { label: "Prompts", bg: "rgba(160,90,200,0.2)" },
              { label: "Hjälp", bg: "rgba(178,90,68,0.2)" },
              { label: "Genvägar", bg: "rgba(100,150,220,0.2)" },
            ].map((p) => (
              <div
                key={p.label}
                style={{
                  background: p.bg,
                  borderRadius: 8,
                  padding: "7px 16px",
                  color: PAPER,
                  fontSize: 15,
                  fontFamily: "monospace",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {p.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right column — big hammer on green, clean premium look */}
        <div
          style={{
            position: "absolute",
            right: 90,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 320,
            height: 320,
            background: "linear-gradient(150deg, #72bd78 0%, #5aa861 100%)",
            borderRadius: 60,
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
          }}
        >
          <Hammer size={196} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    },
  );
}
