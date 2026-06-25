import { ImageResponse } from "next/og";
import { SEED_HELP_QUESTIONS } from "@/lib/seed";
import {
  OG_SIZE, INK, PAPER, RED, MUD,
  loadFredoka, makeFonts, trunc,
} from "@/lib/og-image";

export const alt  = "Hjälpfråga på AIbyggare.se";
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let title   = "Hjälpfråga";
  let body    = "Se frågan på AIbyggare.se";
  let author  = "";
  let tags: string[] = [];
  let solved  = false;

  try {
    const { getHelpPostBySlug } = await import("@/lib/firebase/help");
    const p = await getHelpPostBySlug(slug);
    if (p) {
      title  = p.title;
      body   = p.body ?? "";
      author = p.userDisplayName || "";
      tags   = (p.tags ?? []).slice(0, 4);
      solved = p.status === "solved";
    }
  } catch { /* fallback */ }

  if (!title || title === "Hjälpfråga") {
    const seed = SEED_HELP_QUESTIONS.find((q) => q.slug === slug);
    if (seed) {
      title  = seed.title;
      body   = seed.body ?? "";
      tags   = (seed.tools ?? []).slice(0, 4);
    }
  }

  const fontData = await loadFredoka();
  const fonts    = makeFonts(fontData);
  const ff       = fontData ? "Fredoka" : "sans-serif";

  const statusColor = solved ? "#64B26A" : RED;
  const statusLabel = solved ? "Löst ✓" : "Öppet";

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, background: INK, display: "flex", position: "relative", overflow: "hidden" }}>
        {/* Dot grid */}
        {Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: 12 }).map((_, col) => (
            <div key={`${row}-${col}`} style={{ position: "absolute", left: col * 105 + 30, top: row * 110 + 20, width: 3, height: 3, borderRadius: 2, background: "rgba(255,250,242,0.07)" }} />
          )),
        )}

        {/* Red left bar */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 8, height: 630, background: RED }} />

        {/* Content */}
        <div style={{ position: "absolute", left: 60, top: 0, width: 1080, height: 630, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 0" }}>
          {/* Top */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: `${RED}33`, border: `2px solid ${RED}`, borderRadius: 100, padding: "6px 18px" }}>
              <span style={{ color: RED, fontSize: 16, fontWeight: 700, fontFamily: ff, textTransform: "uppercase", letterSpacing: "0.08em" }}>Fastnat</span>
            </div>
            <span style={{ color: MUD, fontSize: 18, fontFamily: "monospace" }}>aibyggare.se/problemhornan</span>
          </div>

          {/* Middle */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <span style={{ fontSize: 72, fontWeight: 700, color: PAPER, lineHeight: 1.05, fontFamily: ff, letterSpacing: "-1.5px" }}>
              {trunc(title, 50)}
            </span>
            <span style={{ fontSize: 26, color: "rgba(255,250,242,0.65)", fontFamily: "monospace", lineHeight: 1.35 }}>
              {trunc(body, 90)}
            </span>
          </div>

          {/* Bottom */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
            <div style={{ background: statusColor, borderRadius: 8, padding: "6px 16px", color: "white", fontSize: 14, fontFamily: "monospace", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {statusLabel}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
