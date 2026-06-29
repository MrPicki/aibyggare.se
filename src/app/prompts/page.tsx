import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { PromptFilterList } from "@/components/prompts/PromptFilterList";
import { type PromptCardProps } from "@/components/cards/PromptCard";
import { Sticker } from "@/components/ui/Sticker";
import { SEED_PROMPTS } from "@/lib/seed";
import { toolAccent } from "@/lib/constants/tools";
import type { Post } from "@/types/firestore";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Prompts — AIbyggare.se",
  description: "Prompts som faktiskt funkade. Sparade av byggare för byggare.",
};

function postToPromptCard(post: Post): PromptCardProps & { postId: string } {
  return {
    postId: post.id,
    title: post.title,
    tool: post.tool,
    badge: post.tags[0] ?? "Prompt",
    prompt: post.body,
    accent: toolAccent(post.tool),
    slug: post.slug,
    upvoteCount: post.upvoteCount ?? 0,
    author: post.userDisplayName,
    authorHandle: post.username,
    authorAvatarUrl: post.userAvatarUrl,
  };
}

export default async function PromptsPage() {
  let prompts: PromptCardProps[] = SEED_PROMPTS;

  try {
    const mod = await import("@/lib/firebase/prompts");
    const posts = await mod.getPromptPosts(50);
    if (posts.length > 0) {
      prompts = posts.map(postToPromptCard);
    }
  } catch {
    // Firestore otillgänglig — seed-data visas
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Sticker tilt={-2} className="mb-3 bg-prompt-purple">Prompts</Sticker>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Prompts som faktiskt funkade
          </h1>
          <p className="mt-2 max-w-md text-mud">
            Spara de prompts som gjorde mer nytta än skada.
          </p>
        </div>
        <ChunkyLink href="/prompts/new" variant="ink">
          Dela en prompt
        </ChunkyLink>
      </div>

      {prompts.length > 0 ? (
        <PromptFilterList prompts={prompts} />
      ) : (
        <div className="chunky rounded-3xl bg-paper p-12 text-center sm:p-16">
          <p className="font-display text-xl font-bold text-ink">Här saknas prompts.</p>
          <p className="mx-auto mt-2 max-w-sm text-mud">
            Dela den där prompten som räddade din kväll — någon annan sitter med samma problem.
          </p>
          <div className="mt-6 flex justify-center">
            <ChunkyLink href="/prompts/new" variant="ink">
              Dela en prompt
            </ChunkyLink>
          </div>
        </div>
      )}
    </div>
  );
}
