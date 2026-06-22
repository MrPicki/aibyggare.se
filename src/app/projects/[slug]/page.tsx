import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronUp, MessageSquare } from "lucide-react";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";
import { SEED_PROJECTS } from "@/lib/seed";

export function generateStaticParams() {
  return SEED_PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = SEED_PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "Bygge — AIbyggare.se" };
  return {
    title: `${project.title} — AIbyggare.se`,
    description: project.tagline,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = SEED_PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-mud hover:text-build-green transition-colors"
      >
        <ArrowLeft size={14} /> Alla byggen
      </Link>

      <article className="chunky mt-6 overflow-hidden rounded-3xl bg-paper">
        <div
          className="flex items-center justify-between border-b-2 border-ink px-5 py-3"
          style={{ backgroundColor: project.accent }}
        >
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink/80">
            Bygge
          </span>
          <span className="sticker bg-paper px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink">
            {project.status}
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
            {project.title}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-mud">{project.tagline}</p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border bg-cream px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-mud"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4 border-t-2 border-dashed border-border pt-5 font-mono text-sm font-semibold text-mud">
            <span className="inline-flex items-center gap-1">
              <ChevronUp size={15} className="text-build-green" /> {project.upvotes} upvotes
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageSquare size={14} /> {project.commentCount} kommentarer
            </span>
          </div>
        </div>
      </article>

      <div className="chunky mt-6 rounded-3xl bg-cream p-6 text-center sm:p-8">
        <Sticker tilt={-2} className="mb-3 bg-hammer-yellow">Snart</Sticker>
        <p className="font-display text-lg font-bold text-ink">
          Kommentarer och upvotes kopplas på när du loggat in.
        </p>
        <p className="mx-auto mt-2 max-w-md text-mud">
          Vill du visa ditt eget bygge medan du väntar? Det tar två minuter.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <ChunkyLink href="/projects/new" variant="green">
            Lägg upp ett bygge
          </ChunkyLink>
          <ChunkyLink href="/login" variant="paper">
            Logga in
          </ChunkyLink>
        </div>
      </div>
    </div>
  );
}
