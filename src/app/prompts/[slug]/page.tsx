import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { Sticker } from "@/components/ui/Sticker";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { PromptDrillButton } from "@/components/prompts/PromptDrillButton";
import { SEED_PROMPTS } from "@/lib/seed";
import { toolAccent } from "@/lib/constants/tools";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seed = SEED_PROMPTS.find((p) => p.slug === slug);
  const title = seed?.title ?? "Prompt";
  return {
    title: `${title} — AIbyggare.se`,
    description: seed?.prompt ?? "En prompt från AIbyggare-communityn.",
  };
}

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Kontrollera inloggning via __session-cookie (sätts av AuthContext)
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("__session")?.value;

  type PromptData = {
    postId?: string;
    title: string;
    tool: string;
    badge: string;
    prompt: string;
    accent: string;
    upvoteCount?: number;
    author?: string;
    authorHandle?: string;
    authorAvatarUrl?: string;
  };

  let data: PromptData | null = null;

  try {
    const mod = await import("@/lib/firebase/prompts");
    const post = await mod.getPromptPostBySlug(slug);
    if (post) {
      data = {
        postId: post.id,
        title: post.title,
        tool: post.tool,
        badge: post.tags[0] ?? "Prompt",
        prompt: post.body,
        accent: toolAccent(post.tool),
        upvoteCount: post.upvoteCount ?? 0,
        author: post.userDisplayName,
        authorHandle: post.username,
        authorAvatarUrl: post.userAvatarUrl,
      };
    }
  } catch {
    // Firestore otillgänglig
  }

  // Seed-fallback
  if (!data) {
    const seed = SEED_PROMPTS.find((p) => p.slug === slug);
    if (!seed) notFound();
    data = {
      title: seed.title,
      tool: seed.tool,
      badge: seed.badge,
      prompt: seed.prompt,
      accent: seed.accent,
      author: seed.author,
      authorHandle: seed.authorHandle,
      authorAvatarUrl: seed.authorAvatarUrl,
    };
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <Link
        href="/prompts"
        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-mud hover:text-prompt-purple transition-colors"
      >
        <ArrowLeft size={14} /> Alla prompts
      </Link>

      <article className="chunky mt-6 overflow-hidden rounded-3xl bg-paper">
        {/* Header bar */}
        <div
          className="flex items-center justify-between border-b-2 border-ink px-5 py-3"
          style={{ backgroundColor: data.accent }}
        >
          <span className="sticker bg-paper px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-ink">
            {data.badge}
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink/70">
            {data.tool}
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="font-display text-2xl font-bold leading-snug text-ink sm:text-3xl">
            {data.title}
          </h1>

          {/* Author */}
          {data.author && data.authorHandle && (
            <Link
              href={`/profile/${data.authorHandle}`}
              className="mt-3 inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {data.authorAvatarUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.authorAvatarUrl}
                  alt=""
                  className="h-6 w-6 rounded-full border-2 border-ink object-cover"
                />
              )}
              <span className="font-mono text-sm font-semibold text-mud">
                {data.author}{" "}
                <span className="font-normal text-mud/70">@{data.authorHandle}</span>
              </span>
            </Link>
          )}

          {/* Prompt-text — auth-gate */}
          <div className="mt-6">
            <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-widest text-mud">
              Prompt
            </p>
            {isLoggedIn ? (
              <div className="relative rounded-2xl border-2 border-dashed border-border bg-cream p-5">
                <p className="font-mono text-sm leading-relaxed text-ink whitespace-pre-wrap">
                  {data.prompt}
                </p>
              </div>
            ) : (
              <div className="chunky flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-border bg-cream/50 p-8 text-center">
                <Lock size={24} className="text-mud/40" />
                <div>
                  <p className="font-display text-base font-bold text-ink">
                    Logga in för att se prompten
                  </p>
                  <p className="mt-1 text-sm text-mud">
                    Prompts är tillgängliga för inloggade byggare.
                  </p>
                </div>
                <ChunkyLink href={`/login?from=/prompts/${slug}`} variant="ink">
                  Logga in
                </ChunkyLink>
              </div>
            )}
          </div>

          {/* Actions */}
          {isLoggedIn && (
            <div className="mt-5 flex flex-wrap gap-3">
              <CopyButton text={data.prompt} />
              {data.postId && (
                <PromptDrillButton postId={data.postId} initialCount={data.upvoteCount ?? 0} />
              )}
              <ChunkyLink href="/prompts/new" variant="paper">
                Dela en egen prompt
              </ChunkyLink>
            </div>
          )}
        </div>
      </article>

      {/* CTA */}
      <div className="chunky mt-6 rounded-3xl bg-cream p-6 text-center sm:p-8">
        <Sticker tilt={2} className="mb-3 bg-prompt-purple/30">Testa den</Sticker>
        <p className="font-display text-lg font-bold text-ink">
          Funkar den? Dela din variant.
        </p>
        <p className="mx-auto mt-2 max-w-md text-mud">
          Prompts förbättras med iteration. Om du hittat ett bättre sätt att formulera det — dela det.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <ChunkyLink href="/prompts/new" variant="ink">
            Dela en prompt
          </ChunkyLink>
          <ChunkyLink href="/prompts" variant="paper">
            Se alla prompts →
          </ChunkyLink>
        </div>
      </div>
    </div>
  );
}
