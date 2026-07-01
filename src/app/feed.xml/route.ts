import { SEED_PROJECTS, SEED_HELP_QUESTIONS } from "@/lib/seed";
import type { Project, Post } from "@/types/firestore";

// RSS-flöde för nya byggen och problem — plockas upp av läsare och aggregatorer.
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aibyggare.se";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface FeedItem {
  title: string;
  url: string;
  description: string;
  pubDate: Date;
}

export async function GET() {
  let items: FeedItem[] = [];

  try {
    const [{ getProjects }, { getHelpPosts }] = await Promise.all([
      import("@/lib/firebase/projects"),
      import("@/lib/firebase/help"),
    ]);
    const [projects, help] = await Promise.all([getProjects(20), getHelpPosts(20)]);

    const projectItems: FeedItem[] = projects.map((p: Project) => {
      const ts = p.createdAt as { seconds?: number } | null;
      return {
        title: `Bygge: ${p.title}`,
        url: `${SITE_URL}/projects/${p.slug}`,
        description: p.tagline || p.description || "",
        pubDate: ts?.seconds ? new Date(ts.seconds * 1000) : new Date(),
      };
    });
    const helpItems: FeedItem[] = help.map((p: Post) => {
      const ts = p.createdAt as { seconds?: number } | null;
      return {
        title: `Problem: ${p.title}`,
        url: `${SITE_URL}/problemhornan/${p.slug}`,
        description: (p.body ?? "").slice(0, 200),
        pubDate: ts?.seconds ? new Date(ts.seconds * 1000) : new Date(),
      };
    });

    items = [...projectItems, ...helpItems]
      .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
      .slice(0, 30);
  } catch {
    // Firestore otillgänglig — seed-fallback så flödet aldrig är tomt.
    items = [
      ...SEED_PROJECTS.slice(0, 6).map((p) => ({
        title: `Bygge: ${p.title}`,
        url: `${SITE_URL}/projects/${p.slug}`,
        description: p.tagline,
        pubDate: new Date(),
      })),
      ...SEED_HELP_QUESTIONS.slice(0, 4).map((q) => ({
        title: `Problem: ${q.title}`,
        url: `${SITE_URL}/problemhornan/${q.slug}`,
        description: q.body.slice(0, 200),
        pubDate: new Date(),
      })),
    ];
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AIbyggare.se — nya byggen och problem</title>
    <link>${SITE_URL}</link>
    <description>Sveriges community för folk som bygger med AI. Nya byggen, problem och lösningar från svenska byggare.</description>
    <language>sv-SE</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${esc(i.url)}</link>
      <guid isPermaLink="true">${esc(i.url)}</guid>
      <description>${esc(i.description)}</description>
      <pubDate>${i.pubDate.toUTCString()}</pubDate>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600",
    },
  });
}
