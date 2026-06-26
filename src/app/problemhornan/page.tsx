import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";
import { HelpFilterList } from "@/components/help/HelpFilterList";
import { SEED_HELP_QUESTIONS } from "@/lib/seed";
import { toolAccent } from "@/lib/constants/tools";
import type { Post } from "@/types/firestore";
import type { HelpQuestion } from "@/lib/seed";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Problemhörnan – få hjälp med AI-byggen | AIbyggare.se",
  description:
    "Ställ frågor, få hjälp med buggar, Supabase, Vercel, Claude Code, Cursor, Lovable och andra problem när du bygger med AI.",
};

function postToHelpQuestion(p: Post): HelpQuestion {
  return {
    slug: p.slug,
    title: p.title,
    body: p.body,
    topic: p.tool || (p.tags?.[0] ?? "Annat"),
    accent: toolAccent(p.tool || (p.tags?.[0] ?? "")),
    author: p.userDisplayName || "Byggare",
    username: p.username,
    avatarUrl: p.userAvatarUrl || undefined,
    answerCount: p.commentCount ?? 0,
    status: p.status === "solved" ? "Löst" : "Öppen",
    tools: p.tags ?? [],
    createdAt: (p.createdAt as { seconds?: number } | null)?.seconds ?? 0,
    upvotes: p.upvoteCount ?? 0,
  };
}

export default async function ProblemhornanPage() {
  let questions: HelpQuestion[] = [];

  try {
    const { getHelpPosts } = await import("@/lib/firebase/help");
    const firestorePosts = await getHelpPosts(50);
    if (firestorePosts.length > 0) {
      questions = firestorePosts.map(postToHelpQuestion);
    }
  } catch (e) {
    console.error("[problemhornan] Firestore fetch failed:", e);
  }

  if (questions.length === 0) {
    questions = SEED_HELP_QUESTIONS;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Sticker tilt={-2} className="mb-3 bg-warning-orange">
            Problemhörnan
          </Sticker>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Problemhörnan
          </h1>
          <p className="mt-2 max-w-lg text-mud">
            Här hamnar buggar, trasiga deploys, Supabase-kaos och frågor du
            inte vill ställa i ett vanligt kodforum.
          </p>
        </div>
        <ChunkyLink href="/problemhornan/new" variant="yellow">
          Lägg upp ett problem
        </ChunkyLink>
      </div>

      {questions.length > 0 ? (
        <HelpFilterList posts={questions} />
      ) : (
        <div className="chunky rounded-3xl bg-paper p-12 text-center sm:p-16">
          <p className="font-display text-xl font-bold text-ink">
            Problemhörnan är ovanligt lugn just nu. Det lär inte hålla länge.
          </p>
          <p className="mx-auto mt-2 max-w-sm text-mud">
            Beskriv vad du försöker göra och vad som gick fel — någon annan har
            troligen bråkat med samma sak.
          </p>
          <div className="mt-6 flex justify-center">
            <ChunkyLink href="/problemhornan/new" variant="yellow">
              Lägg upp första problemet
            </ChunkyLink>
          </div>
        </div>
      )}
    </div>
  );
}
