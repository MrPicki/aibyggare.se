import Link from "next/link";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Sticker } from "@/components/ui/Sticker";
import { SEED_PROJECTS } from "@/lib/seed";

export function ProjectShowcase() {
  return (
    <section className="bg-paper border-y-2 border-ink py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Sticker tilt={-2} className="mb-3 bg-build-green">Utvalda</Sticker>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Utvalda byggen
            </h2>
            <p className="mt-2 max-w-md text-mud">
              Några projekt från byggbänken som är värda en extra titt.
            </p>
          </div>
          <Link
            href="/projects"
            className="font-mono text-sm font-bold uppercase tracking-wide text-ink hover:text-build-green transition-colors"
          >
            Se alla →
          </Link>
        </div>
      </div>

      {/* Carousel */}
      <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="hidden sm:block sm:w-[max(0px,calc((100vw-80rem)/2))] shrink-0" aria-hidden />
        {SEED_PROJECTS.map((p) => (
          <div key={p.slug} className="w-[280px] shrink-0 snap-start sm:w-[320px]">
            <ProjectCard {...p} />
          </div>
        ))}
      </div>
    </section>
  );
}
