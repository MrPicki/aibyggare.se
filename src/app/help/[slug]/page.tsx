import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageSquare, CheckCircle2 } from "lucide-react";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";
import { SEED_HELP_QUESTIONS } from "@/lib/seed";

export function generateStaticParams() {
  return SEED_HELP_QUESTIONS.map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const question = SEED_HELP_QUESTIONS.find((q) => q.slug === slug);
  if (!question) return { title: "Fråga — AIbyggare.se" };
  return { title: `${question.title} — AIbyggare.se`, description: question.body };
}

export default async function HelpDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const question = SEED_HELP_QUESTIONS.find((q) => q.slug === slug);
  if (!question) notFound();

  const solved = question.status === "Löst";
  const answers = question.answers ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <Link
        href="/help"
        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-mud hover:text-build-green transition-colors"
      >
        <ArrowLeft size={14} /> Alla frågor
      </Link>

      {/* ── Question ── */}
      <article className="chunky mt-6 rounded-3xl bg-paper">
        <div className="flex items-center justify-between border-b-2 border-ink px-5 py-3">
          <span
            className="sticker px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-ink"
            style={{ backgroundColor: question.accent }}
          >
            {question.topic}
          </span>
          <span
            className={
              "font-mono text-[11px] font-bold uppercase tracking-widest " +
              (solved ? "text-build-green" : "text-mud")
            }
          >
            {solved ? "Löst" : "Öppen"}
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="font-display text-2xl font-bold leading-snug text-ink sm:text-3xl">
            {question.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-mud">{question.body}</p>

          <div className="mt-6 flex items-center gap-3 border-t-2 border-dashed border-border pt-5">
            {question.avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={question.avatarUrl}
                alt=""
                className="h-7 w-7 rounded-full border-2 border-ink object-cover"
              />
            )}
            <div className="flex items-center gap-3 font-mono text-sm font-semibold text-mud">
              {question.username ? (
                <Link href={`/profile/${question.username}`} className="hover:text-ink transition-colors">
                  {question.author}
                </Link>
              ) : (
                <span>{question.author}</span>
              )}
              <span className="inline-flex items-center gap-1">
                <MessageSquare size={14} /> {question.answerCount} svar
              </span>
            </div>
          </div>
        </div>
      </article>

      {/* ── Answers ── */}
      {answers.length > 0 && (
        <section className="mt-8">
          <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-widest text-mud">
            {answers.length} {answers.length === 1 ? "svar" : "svar"}
          </p>
          <div className="space-y-4">
            {answers.map((answer, i) => (
              <article
                key={i}
                className={[
                  "chunky rounded-3xl bg-paper",
                  answer.isAccepted ? "ring-2 ring-build-green" : "",
                ].join(" ")}
              >
                {answer.isAccepted && (
                  <div className="flex items-center gap-2 border-b-2 border-ink bg-build-green/15 px-5 py-2.5">
                    <CheckCircle2 size={14} className="text-build-green" />
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-build-green">
                      Accepterat svar
                    </span>
                  </div>
                )}
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <Link
                      href={`/profile/${answer.username}`}
                      className="inline-flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={answer.avatarUrl}
                        alt=""
                        className="h-8 w-8 rounded-full border-2 border-ink object-cover"
                      />
                      <div>
                        <p className="font-mono text-xs font-bold text-ink">{answer.author}</p>
                        <p className="font-mono text-[10px] text-mud">@{answer.username}</p>
                      </div>
                    </Link>
                    <span className="font-mono text-[11px] text-mud">{answer.createdAtLabel}</span>
                  </div>
                  <p className="text-base leading-relaxed text-ink">{answer.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <div className="chunky mt-8 rounded-3xl bg-cream p-6 text-center sm:p-8">
        <Sticker tilt={2} className="mb-3 bg-build-green">Hjälp till</Sticker>
        <p className="font-display text-lg font-bold text-ink">
          Vet du svaret? Snart kan du skriva det här.
        </p>
        <p className="mx-auto mt-2 max-w-md text-mud">
          Svarstråden kopplas på när du loggat in. Har du fastnat i något eget — beskriv det.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <ChunkyLink href="/help/new" variant="yellow">
            Ställ en egen fråga
          </ChunkyLink>
          <ChunkyLink href="/login" variant="paper">
            Logga in för att svara
          </ChunkyLink>
        </div>
      </div>
    </div>
  );
}
