import Link from "next/link";
import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";
import { DrillIcon } from "@/components/brand/DrillIcon";
import { SEED_PROJECTS } from "@/lib/seed";
import { STATUS_LABEL } from "@/lib/constants/project-status";
import type { Project, ProjectStatus } from "@/types/firestore";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Byggen — AIbyggare.se",
  description:
    "Projekt från folk som bygger med AI. Halvfärdigt, trasigt eller nästan lanserat — allt räknas.",
};

interface Row {
  slug: string;
  title: string;
  tagline: string;
  drills: number;
  status: string;
  authorName: string;
  authorAvatarUrl?: string;
}

function fromFirestore(p: Project): Row {
  const status = p.status as ProjectStatus;
  return {
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    drills: p.upvoteCount ?? 0,
    status: STATUS_LABEL[status] ?? p.status,
    authorName: p.userDisplayName || "Byggare",
    authorAvatarUrl: p.userAvatarUrl || undefined,
  };
}

function fromSeed(p: (typeof SEED_PROJECTS)[number]): Row {
  return {
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    drills: p.upvotes,
    status: p.status,
    authorName: p.authorName ?? "Byggare",
    authorAvatarUrl: p.authorAvatarUrl,
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

  const rows: Row[] = (
    firestoreProjects.length > 0
      ? firestoreProjects.map(fromFirestore)
      : SEED_PROJECTS.map(fromSeed)
  ).sort((a, b) => b.drills - a.drills);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      {/* Header */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Sticker tilt={-2} className="mb-3 bg-build-green">Byggen</Sticker>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Just nu på bänken
          </h1>
          <p className="mt-2 max-w-md text-mud">
            Sorterat efter popularitet. Flest borrar = mest kärlek från communityn.
          </p>
        </div>
        <ChunkyLink href="/projects/new" variant="green">
          Lägg upp bygge
        </ChunkyLink>
      </div>

      {/* Leaderboard */}
      {rows.length > 0 ? (
        <div className="space-y-3">
          {rows.map((row, i) => (
            <Link key={row.slug} href={`/projects/${row.slug}`} className="block group">
              <article
                className={[
                  "chunky pressable flex items-center gap-4 rounded-2xl bg-paper px-5 py-4 transition-transform duration-150 group-hover:-rotate-[0.3deg]",
                  i === 0
                    ? "ring-2 ring-build-green"
                    : "",
                ].join(" ")}
              >
                {/* Rank */}
                <span
                  className={[
                    "shrink-0 w-7 text-center font-mono text-sm font-bold",
                    i === 0 ? "text-build-green" : "text-mud",
                  ].join(" ")}
                >
                  #{i + 1}
                </span>

                {/* Avatar */}
                {row.authorAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.authorAvatarUrl}
                    alt=""
                    className="h-9 w-9 shrink-0 rounded-full border-2 border-ink object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-cream font-mono text-xs font-bold text-ink">
                    {(row.authorName ?? "B").charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Main content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-mono text-[11px] text-mud">
                      {row.authorName}
                    </span>
                    <span className="font-display font-bold text-ink group-hover:text-build-green transition-colors">
                      {row.title}
                    </span>
                    {i === 0 && (
                      <span className="sticker bg-build-green px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-paper">
                        Populärast
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-mud">
                    {row.tagline}
                  </p>
                </div>

                {/* Drill count */}
                <div className="shrink-0 flex items-center gap-1.5 font-mono text-sm font-bold text-mud">
                  <DrillIcon className={["h-4 w-4", i === 0 ? "text-build-green" : "text-mud"].join(" ")} />
                  {row.drills}
                </div>
              </article>
            </Link>
          ))}
        </div>
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
