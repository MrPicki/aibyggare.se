import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";
import { HelpCommentSection } from "@/components/help/HelpCommentSection";
import { ReportButton } from "@/components/moderation/ReportButton";
import { SEED_HELP_QUESTIONS } from "@/lib/seed";
import { toolAccent } from "@/lib/constants/tools";
import type { Post, Comment } from "@/types/firestore";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const { getHelpPostBySlug } = await import("@/lib/firebase/help");
    const post = await getHelpPostBySlug(slug);
    if (post) return { title: `${post.title} — AIbyggare.se`, description: post.body };
  } catch {}
  const seed = SEED_HELP_QUESTIONS.find((q) => q.slug === slug);
  return {
    title: seed ? `${seed.title} — AIbyggare.se` : "Problem — AIbyggare.se",
    description: seed?.body,
  };
}

export default async function ProblemhornanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: Post | null = null;
  let comments: Comment[] = [];

  try {
    const { getHelpPostBySlug, getPostAnswers } = await import("@/lib/firebase/help");
    post = await getHelpPostBySlug(slug);
    if (post) comments = await getPostAnswers(post.id);
  } catch (e) {
    console.error("[problemhornan/slug] Firestore fetch failed:", e);
  }

  const seed = SEED_HELP_QUESTIONS.find((q) => q.slug === slug);
  if (!post && !seed) notFound();

  const title = post?.title ?? seed!.title;
  const body = post?.body ?? seed!.body;
  const topic = post?.tool ?? post?.tags?.[0] ?? seed!.topic;
  const accent = toolAccent(topic);
  const solved = post ? post.status === "solved" : seed!.status === "Löst";
  const authorName = post?.userDisplayName ?? seed!.author;
  const authorHandle = post?.username ?? seed!.username;
  const authorAvatar = post?.userAvatarUrl ?? seed!.avatarUrl;
  const commentCount = post?.commentCount ?? seed!.answerCount;

  const seedComments: Comment[] = !post && seed?.answers
    ? seed.answers.map((a, i) => ({
        id: `seed-${i}`,
        userId: "",
        userDisplayName: a.author,
        userAvatarUrl: a.avatarUrl ?? "",
        projectId: null,
        postId: null,
        parentId: null,
        body: a.body,
        isAccepted: a.isAccepted ?? false,
        createdAt: null,
        updatedAt: null,
      }))
    : [];

  const initialComments = post ? comments : seedComments;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <Link
        href="/problemhornan"
        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-mud hover:text-hammer-yellow transition-colors"
      >
        <ArrowLeft size={14} /> Alla problem
      </Link>

      <div className="relative mt-6">
        {solved && (
          <div className="pointer-events-none absolute -right-3 -top-3 z-10 rotate-[10deg] drop-shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/seed/problemet-lost-badge.png"
              alt="Problemet löst"
              width={80}
              height={80}
              className="h-[68px] w-[68px] md:h-[80px] md:w-[80px]"
            />
          </div>
        )}
      <article className="chunky overflow-hidden rounded-3xl bg-paper">
        <div
          className="flex items-center justify-between border-b-2 border-ink px-5 py-3"
          style={{ backgroundColor: accent }}
        >
          <div className="flex min-w-0 items-center gap-2">
            {authorAvatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={authorAvatar}
                alt=""
                className="h-6 w-6 shrink-0 rounded-full border border-ink/40 object-cover"
                referrerPolicy="no-referrer"
              />
            )}
            {authorHandle ? (
              <Link
                href={`/profile/${authorHandle}`}
                className="truncate font-mono text-[11px] font-bold uppercase tracking-widest text-ink/80 hover:text-ink transition-colors"
              >
                {authorName}
              </Link>
            ) : (
              <span className="truncate font-mono text-[11px] font-bold uppercase tracking-widest text-ink/80">
                {authorName}
              </span>
            )}
          </div>
          <span
            className={
              "sticker shrink-0 bg-paper px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide " +
              (solved ? "text-build-green" : "text-ink")
            }
          >
            {solved ? "Löst" : "Öppen"}
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="font-display text-2xl font-bold leading-snug text-ink sm:text-3xl">
            {title}
          </h1>

          <p className="mt-5 text-base leading-relaxed text-ink whitespace-pre-wrap">
            {body}
          </p>

          <div className="mt-6 flex items-center justify-between border-t-2 border-dashed border-border pt-4">
            <span className="rounded-md border border-border bg-cream px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-mud">
              {topic}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-mud">
              <MessageSquare size={13} /> {commentCount} svar
            </span>
          </div>
        </div>
      </article>
      </div>

      <div className="mt-10">
        {post ? (
          <HelpCommentSection
            postId={post.id}
            postOwnerId={post.userId}
            acceptedCommentId={post.acceptedCommentId}
            initialComments={initialComments}
          />
        ) : (
          <section>
            <h2 className="font-display text-xl font-bold text-ink mb-5">
              Hjälp från communityn{" "}
              {initialComments.length > 0 && (
                <span className="font-mono text-base font-semibold text-mud">({initialComments.length})</span>
              )}
            </h2>
            {initialComments.length === 0 ? (
              <p className="text-mud text-sm py-4">Ingen har svarat ännu.</p>
            ) : (
              <ul className="space-y-4 mb-8">
                {initialComments.map((c) => (
                  <li key={c.id} className="flex gap-3">
                    {c.userAvatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.userAvatarUrl}
                        alt=""
                        className="h-8 w-8 shrink-0 rounded-full border-2 border-ink mt-0.5"
                      />
                    ) : (
                      <div className="h-8 w-8 shrink-0 rounded-full border-2 border-ink bg-cream flex items-center justify-center font-mono text-xs font-bold text-mud mt-0.5">
                        {(c.userDisplayName || "?")[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <span className="font-mono text-xs font-bold text-ink">
                        {c.userDisplayName || "Anonym"}
                      </span>
                      <p className="mt-1 text-sm leading-relaxed text-ink">{c.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="chunky-sm rounded-xl border-2 border-dashed border-border p-4 text-center">
              <p className="text-sm text-mud">
                <Link href="/login" className="font-semibold text-ink underline underline-offset-2 hover:text-hammer-yellow">
                  Logga in
                </Link>{" "}
                för att hjälpa andra byggare.
              </p>
            </div>
          </section>
        )}
      </div>

      {post && (
        <div className="mt-6 flex justify-end">
          <ReportButton
            targetType="post"
            targetId={post.id}
            targetTitle={post.title}
            targetUrl={`/problemhornan/${post.slug}`}
          />
        </div>
      )}

      <div className="chunky mt-8 rounded-3xl bg-cream p-6 text-center sm:p-8">
        <Sticker tilt={2} className="mb-3 bg-hammer-yellow/60">
          Fastnat?
        </Sticker>
        <p className="font-display text-lg font-bold text-ink">
          Kört fast i något eget? Fråga communityn.
        </p>
        <p className="mx-auto mt-2 max-w-md text-mud">
          Beskriv vad du försöker göra och vad som gick fel — någon har troligen stött på samma sak.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <ChunkyLink href="/problemhornan/new" variant="yellow">
            Lägg upp ett problem
          </ChunkyLink>
          <ChunkyLink href="/problemhornan" variant="paper">
            Se alla problem →
          </ChunkyLink>
        </div>
      </div>
    </div>
  );
}
