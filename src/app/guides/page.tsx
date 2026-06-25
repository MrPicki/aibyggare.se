import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";
import { GuideCard, type GuideCardProps } from "@/components/cards/GuideCard";
import { SEED_GUIDES } from "@/lib/seed";
import { toolAccent } from "@/lib/constants/tools";
import type { Post } from "@/types/firestore";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Genvägar — AIbyggare.se",
  description: "Guider, workflows och tips från byggare som redan klurat ut det.",
};

function postToGuideCard(post: Post): GuideCardProps {
  return {
    postId: post.id,
    slug: post.slug,
    title: post.title,
    summary: post.body,
    tool: post.tool,
    category: post.tags[0] ?? "Guide",
    accent: toolAccent(post.tool),
    readMinutes: Math.max(1, Math.ceil(post.body.split(" ").length / 200)),
    upvoteCount: post.upvoteCount ?? 0,
    author: post.userDisplayName,
    authorHandle: post.username,
    authorAvatarUrl: post.userAvatarUrl,
  };
}

function seedToGuideCard(g: (typeof SEED_GUIDES)[number]): GuideCardProps {
  return {
    slug: g.slug,
    title: g.title,
    summary: g.summary,
    tool: g.tool,
    category: g.category,
    accent: g.accent,
    readMinutes: g.readMinutes,
    author: g.author,
    authorHandle: g.authorHandle,
    authorAvatarUrl: g.authorAvatarUrl,
  };
}

export default async function GuidesPage() {
  let guides: GuideCardProps[] = SEED_GUIDES.map(seedToGuideCard);

  try {
    const mod = await import("@/lib/firebase/guides");
    const posts = await mod.getGuidePosts(50);
    if (posts.length > 0) {
      guides = posts.map(postToGuideCard);
    }
  } catch {
    // Firestore otillgänglig — seed-data visas
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Sticker tilt={2} className="mb-3 bg-code-blue">Genvägar</Sticker>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Genvägar
          </h1>
          <p className="mt-2 max-w-md text-mud">
            Guider, workflows och tips från byggare som redan klurat ut det.
          </p>
        </div>
        <ChunkyLink href="/guides/new" variant="green">
          Dela en guide
        </ChunkyLink>
      </div>

      {guides.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <GuideCard key={g.slug} {...g} />
          ))}
        </div>
      ) : (
        <div className="chunky rounded-3xl bg-paper p-12 text-center sm:p-16">
          <p className="font-display text-xl font-bold text-ink">Inga genvägar ännu.</p>
          <p className="mx-auto mt-2 max-w-sm text-mud">
            Den första du lägger upp hjälper alla som kommer efter. Visa hur du löste det.
          </p>
          <div className="mt-6 flex justify-center">
            <ChunkyLink href="/guides/new" variant="green">
              Dela första genvägen
            </ChunkyLink>
          </div>
        </div>
      )}
    </div>
  );
}
