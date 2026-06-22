import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Sticker } from "@/components/ui/Sticker";
import { getProjects } from "@/lib/firebase/projects";
import { STATUS_LABEL, STATUS_ACCENT } from "@/lib/constants/project-status";
import type { Project, ProjectStatus } from "@/types/firestore";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Byggen — AIbyggare.se",
  description:
    "Projekt från folk som bygger med AI. Halvfärdigt, trasigt eller nästan lanserat — allt räknas.",
};

function toCardProps(p: Project) {
  const status = p.status as ProjectStatus;
  return {
    title: p.title,
    tagline: p.tagline,
    slug: p.slug,
    status: STATUS_LABEL[status] ?? p.status,
    accent: STATUS_ACCENT[status] ?? "var(--build-green)",
    tags: p.stack ?? [],
    upvotes: p.upvoteCount ?? 0,
    commentCount: p.commentCount ?? 0,
  };
}

export default async function ProjectsPage() {
  let projects: Project[] = [];
  try {
    projects = await getProjects(30);
  } catch (e) {
    console.error("[projects] Firestore fetch failed:", e);
  }

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
            <ProjectCard key={p.id} {...toCardProps(p)} />
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
