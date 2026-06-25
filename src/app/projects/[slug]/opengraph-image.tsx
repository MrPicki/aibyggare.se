import { ImageResponse } from "next/og";
import { SEED_PROJECTS } from "@/lib/seed";
import {
  OG_SIZE, INK, PAPER, GREEN, YELLOW, MUD,
  loadFredoka, makeFonts, trunc,
} from "@/lib/og-image";

export const alt  = "Bygge på AIbyggare.se";
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let title    = "Bygge";
  let tagline  = "Se projektet på AIbyggare.se";
  let author   = "";
  let tools: string[] = [];
  let status   = "";

  try {
    const { getProjectBySlug } = await import("@/lib/firebase/projects");
    const p = await getProjectBySlug(slug);
    if (p) {
      title   = p.title;
      tagline = p.tagline;
      author  = p.userDisplayName || "";
      tools   = (p.stack ?? []).slice(0, 4);
      status  = p.status ?? "";
    }
  } catch { /* fallback to seed */ }

  if (!author) {
    const seed = SEED_PROJECTS.find((p) => p.slug === slug);
    if (seed) {
      title   = seed.title;
      tagline = seed.tagline;
      tools   = (seed.tags ?? []).slice(0, 4);
    }
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

        {/* Green left bar */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 8, height: 630, background: GREEN }} />

        {/* Content */}
        <div style={{ position: "absolute", left: 60, top: 0, width: 1080, height: 630, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 0" }}>
          {/* Top: type badge + site name */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: `${GREEN}33`, border: `2px solid ${GREEN}`, borderRadius: 100, padding: "6px 18px" }}>
              <span style={{ color: GREEN, fontSize: 16, fontWeight: 700, fontFamily: ff, textTransform: "uppercase", letterSpacing: "0.08em" }}>Bygge</span>
            </div>
            <span style={{ color: MUD, fontSize: 18, fontFamily: "monospace" }}>aibyggare.se</span>
          </div>

          {/* Middle: title + tagline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <span style={{ fontSize: 76, fontWeight: 700, color: PAPER, lineHeight: 1.05, fontFamily: ff, letterSpacing: "-1.5px" }}>
              {trunc(title, 42)}
            </span>
            <span style={{ fontSize: 28, color: "rgba(255,250,242,0.70)", fontFamily: "monospace", lineHeight: 1.35 }}>
              {trunc(tagline, 80)}
            </span>
          </div>

          {/* Bottom: author + tools + status */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {author && (
                <span style={{ color: PAPER, fontSize: 18, fontFamily: "monospace", fontWeight: 600 }}>
                  av {author}
                </span>
              )}
              {tools.map((t) => (
                <div key={t} style={{ background: "rgba(255,250,242,0.10)", borderRadius: 6, padding: "5px 12px", color: PAPER, fontSize: 14, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {t}
                </div>
              ))}
            </div>
            {status && (
              <div style={{ background: YELLOW, borderRadius: 8, padding: "6px 16px", color: INK, fontSize: 14, fontFamily: "monospace", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {status}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
