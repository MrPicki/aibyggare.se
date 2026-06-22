import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Sticker } from "@/components/ui/Sticker";
import { SEED_PROJECTS } from "@/lib/seed";

export const metadata = {
  title: "Byggen — AIbyggare.se",
  description: "Projekt från folk som bygger med AI. Halvfärdigt, trasigt eller nästan lanserat — allt räknas.",
};

export default function ProjectsPage() {
  const projects = SEED_PROJECTS;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Sticker tilt={-2} className="mb-3 bg-build-green">Byggen</Sticker>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Just nu på bänken
          </h1>
          <p className="mt-2 max-w-md text-mud">
            Projekt från folk som bygger, testar, misslyckas och försöker igen.
          </p>
        </div>
        <ChunkyLink href="/projects/new" variant="green">
          Lägg upp bygge
        </ChunkyLink>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.slug} {...p} />
          ))}
        </div>
      ) : (
        <div className="chunky rounded-3xl bg-paper p-12 text-center sm:p-16">
          <p className="font-display text-xl font-bold text-ink">Tomt på bänken än så länge.</p>
          <p className="mx-auto mt-2 max-w-sm text-mud">
            Halvfärdigt räknas. Lägg upp det du håller på med så har bänken något att visa.
          </p>
          <div className="mt-6 flex justify-center">
            <ChunkyLink href="/projects/new" variant="green">
              Lägg upp första bygget
            </ChunkyLink>
          </div>
        </div>
      )}
    </div>
  );
}
