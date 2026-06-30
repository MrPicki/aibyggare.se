import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Sticker } from "@/components/ui/Sticker";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { PostCommentSection } from "@/components/shared/PostCommentSection";
import { SEED_GUIDES } from "@/lib/seed";
import { toolAccent } from "@/lib/constants/tools";
import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`\n]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-bold text-ink">{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="rounded bg-ink/10 px-1 py-0.5 font-mono text-[11px] text-ink">{part.slice(1, -1)}</code>;
    return part;
  });
}

function GuideBody({ body }: { body: string }) {
  // Split on fenced code blocks first
  const segments = body.split(/(```[\w]*\n[\s\S]*?```)/g);
  const nodes: ReactNode[] = [];

  for (let si = 0; si < segments.length; si++) {
    const seg = segments[si];
    if (seg.startsWith("```")) {
      const code = seg.replace(/^```[\w]*\n?/, "").replace(/```$/, "").trim();
      nodes.push(
        <pre key={si} className="overflow-x-auto rounded-xl border-2 border-ink bg-ink p-4 font-mono text-xs leading-relaxed text-paper">
          <code>{code}</code>
        </pre>
      );
      continue;
    }
    // Text segment — split into paragraphs
    const paras = seg.split(/\n\n+/).filter((p) => p.trim());
    paras.forEach((para, pi) => {
      const lines = para.split("\n").filter((l) => l.trim());
      const isList = lines.every((l) => /^[-[]/.test(l.trim()));
      if (isList) {
        nodes.push(
          <ul key={`${si}-${pi}`} className="space-y-1.5 pl-1">
            {lines.map((line, li) => {
              const isCheck = /^\[[ x]\]/.test(line.trim());
              const checked = /^\[x\]/i.test(line.trim());
              const content = line.replace(/^[-[][ x\]]*\s*/, "");
              return (
                <li key={li} className="flex items-start gap-2 text-sm text-ink leading-relaxed">
                  {isCheck ? (
                    <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 border-ink text-[10px] font-bold ${checked ? "bg-build-green" : "bg-paper"}`}>
                      {checked ? "✓" : ""}
                    </span>
                  ) : (
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/40" />
                  )}
                  <span>{renderInline(content)}</span>
                </li>
              );
            })}
          </ul>
        );
      } else {
        nodes.push(
          <p key={`${si}-${pi}`} className="text-sm leading-relaxed text-ink">
            {renderInline(para)}
          </p>
        );
      }
    });
  }

  return <div className="space-y-4">{nodes}</div>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const seed = SEED_GUIDES.find((g) => g.slug === slug);
  const title = seed?.title ?? "Genväg";
  return {
    title: `${title} — AIbyggare.se`,
    description: seed?.summary ?? "En guide från AIbyggare-communityn.",
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  type GuideData = {
    postId?: string;
    title: string;
    tool: string;
    category: string;
    accent: string;
    body: string;
    readMinutes: number;
    upvoteCount?: number;
    author?: string;
    authorHandle?: string;
    authorAvatarUrl?: string;
  };

  let data: GuideData | null = null;
  let initialComments: import("@/types/firestore").Comment[] = [];

  try {
    const mod = await import("@/lib/firebase/guides");
    const post = await mod.getGuidePostBySlug(slug);
    if (post) {
      data = {
        postId: post.id,
        title: post.title,
        tool: post.tool,
        category: post.tags[0] ?? "Guide",
        accent: toolAccent(post.tool),
        body: post.body,
        readMinutes: Math.max(1, Math.ceil(post.body.split(" ").length / 200)),
        upvoteCount: post.upvoteCount ?? 0,
        author: post.userDisplayName,
        authorHandle: post.username,
        authorAvatarUrl: post.userAvatarUrl,
      };
      try {
        const { getPostAnswers } = await import("@/lib/firebase/help");
        initialComments = await getPostAnswers(post.id);
      } catch {
        // kommentarer ej tillgängliga
      }
    }
  } catch {
    // Firestore otillgänglig
  }

  if (!data) {
    const seed = SEED_GUIDES.find((g) => g.slug === slug);
    if (!seed) notFound();
    data = {
      title: seed.title,
      tool: seed.tool,
      category: seed.category,
      accent: seed.accent,
      body: seed.body,
      readMinutes: seed.readMinutes,
      author: seed.author,
      authorHandle: seed.authorHandle,
      authorAvatarUrl: seed.authorAvatarUrl,
    };
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <Link
        href="/guides"
        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-mud hover:text-code-blue transition-colors"
      >
        <ArrowLeft size={14} /> Alla genvägar
      </Link>

      <article className="chunky mt-6 overflow-hidden rounded-3xl bg-paper">
        {/* Header bar */}
        <div
          className="flex items-center justify-between border-b-2 border-ink px-5 py-3"
          style={{ backgroundColor: data.accent }}
        >
          <span className="sticker bg-paper px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-ink">
            {data.category}
          </span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-ink/70">
              <Clock size={11} /> {data.readMinutes} min
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink/80">
              {data.tool}
            </span>
          </div>
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

          {/* Guide body */}
          <div className="mt-6">
            <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-widest text-mud">
              Guide
            </p>
            <div className="rounded-2xl border-2 border-dashed border-border bg-cream p-5">
              <GuideBody body={data.body} />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <ChunkyLink href="/guides/new" variant="paper">
              Dela en egen guide
            </ChunkyLink>
            <ChunkyLink href="/guides" variant="paper">
              Fler genvägar →
            </ChunkyLink>
          </div>
        </div>
      </article>

      {/* CTA */}
      <div className="chunky mt-6 rounded-3xl bg-cream p-6 text-center sm:p-8">
        <Sticker tilt={2} className="mb-3 bg-code-blue/30">Har du ett eget knep?</Sticker>
        <p className="font-display text-lg font-bold text-ink">
          Dela det med resten av communityn.
        </p>
        <p className="mx-auto mt-2 max-w-md text-mud">
          Din genväg kan spara en annan byggare timmar. Det tar fem minuter att skriva ner den.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <ChunkyLink href="/guides/new" variant="green">
            Dela en genväg
          </ChunkyLink>
          <ChunkyLink href="/guides" variant="paper">
            Se alla genvägar →
          </ChunkyLink>
        </div>
      </div>

      {/* Comments — only for Firestore-backed guides */}
      {data.postId && (
        <PostCommentSection postId={data.postId} initialComments={initialComments} />
      )}
    </div>
  );
}
