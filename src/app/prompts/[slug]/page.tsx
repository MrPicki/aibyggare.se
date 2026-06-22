import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Copy } from "lucide-react";
import { Sticker } from "@/components/ui/Sticker";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { SEED_PROMPTS } from "@/lib/seed";
import { CopyButton } from "@/components/ui/CopyButton";

export function generateStaticParams() {
  return SEED_PROMPTS.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prompt = SEED_PROMPTS.find((p) => p.slug === slug);
  if (!prompt) return { title: "Prompt — AIbyggare.se" };
  return {
    title: `${prompt.title} — AIbyggare.se`,
    description: prompt.prompt,
  };
}

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prompt = SEED_PROMPTS.find((p) => p.slug === slug);
  if (!prompt) notFound();

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
          style={{ backgroundColor: prompt.accent }}
        >
          <span className="sticker bg-paper px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-ink">
            {prompt.badge}
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink/70">
            {prompt.tool}
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="font-display text-2xl font-bold leading-snug text-ink sm:text-3xl">
            {prompt.title}
          </h1>

          {/* Author */}
          {prompt.author && prompt.authorHandle && (
            <Link
              href={`/profile/${prompt.authorHandle}`}
              className="mt-3 inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {prompt.authorAvatarUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={prompt.authorAvatarUrl}
                  alt=""
                  className="h-6 w-6 rounded-full border-2 border-ink object-cover"
                />
              )}
              <span className="font-mono text-sm font-semibold text-mud">
                {prompt.author}{" "}
                <span className="font-normal text-mud/70">@{prompt.authorHandle}</span>
              </span>
            </Link>
          )}

          {/* Prompt text */}
          <div className="mt-6">
            <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-widest text-mud">
              Prompt
            </p>
            <div className="relative rounded-2xl border-2 border-dashed border-border bg-cream p-5">
              <p className="font-mono text-sm leading-relaxed text-ink whitespace-pre-wrap">
                {prompt.prompt}
              </p>
            </div>
          </div>

          {/* Copy button */}
          <div className="mt-5 flex flex-wrap gap-3">
            <CopyButton text={prompt.prompt} />
            <ChunkyLink href="/prompts/new" variant="paper">
              Dela en egen prompt
            </ChunkyLink>
          </div>
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
