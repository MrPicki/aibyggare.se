import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";
import { ProjectFilterList } from "@/components/projects/ProjectFilterList";
import type { ProjectCardProps } from "@/components/cards/ProjectCard";
import { SEED_PROJECTS } from "@/lib/seed";
import { STATUS_LABEL, STATUS_ACCENT } from "@/lib/constants/project-status";
import type { Project, ProjectStatus } from "@/types/firestore";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Byggen — AIbyggare.se",
  description:
    "Projekt från folk som bygger med AI. Halvfärdigt, trasigt eller nästan lanserat — allt räknas.",
};

function fromFirestore(p: Project): ProjectCardProps {
  const status = p.status as ProjectStatus;
  const ts = p.createdAt as { seconds?: number } | null;
  return {
    title: p.title,
    tagline: p.tagline,
    slug: p.slug,
    status: STATUS_LABEL[status] ?? p.status,
    accent: STATUS_ACCENT[status] ?? "var(--build-green)",
    tags: p.stack ?? [],
    upvotes: p.upvoteCount ?? 0,
    commentCount: p.commentCount ?? 0,
    authorName: p.userDisplayName || "Byggare",
    authorAvatarUrl: p.userAvatarUrl || undefined,
    createdAt: ts?.seconds,
  };
}

export default async function ProjectsPage() {
  let firestoreProjects: Project[] = [];
  try {
    // Dynamisk import: om firebase-admin kraschar vid laddning blir det en
    // fångbar rejection istället för att ta ner hela sidan med 500.
    const { getProjects } = await import("@/lib/firebase/projects");
    firestoreProjects = await getProjects(50);
  } catch (e) {
    console.error("[projects] Firestore fetch failed:", e);
  }

  const projects: ProjectCardProps[] =
    firestoreProjects.length > 0
      ? firestoreProjects.map(fromFirestore)
      : SEED_PROJECTS;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      {/* Header */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Sticker tilt={-2} className="mb-3 bg-build-green">Byggen</Sticker>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Just nu på bänken
          </h1>
          <p className="mt-2 max-w-md text-mud">
            Halvfärdigt, trasigt eller nästan lanserat — allt räknas.
          </p>
        </div>
        <ChunkyLink href="/projects/new" variant="green">
          Lägg upp bygge
        </ChunkyLink>
      </div>

      {/* Filter list or empty */}
      {projects.length > 0 ? (
        <ProjectFilterList projects={projects} />
      ) : (
        <div className="chunky rounded-3xl bg-paper p-12 text-center sm:p-16">
          <p className="font-display text-xl font-bold text-ink">Tomt på bänken än så länge.</p>
          <p className="mx-auto mt-2 max-w-sm text-mud">
            Halvfärdigt räknas. Lägg upp det du håller på med.
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
