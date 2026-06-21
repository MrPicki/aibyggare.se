import Link from "next/link";
import { ArrowRight, Hammer, HelpCircle, BookOpen, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { HelpCard } from "@/components/cards/HelpCard";
import { ToolBadge } from "@/components/ui/ToolBadge";

const tools = [
  "Claude Code",
  "Cursor",
  "Lovable",
  "Bolt",
  "Replit",
  "Supabase",
  "Vercel",
  "Next.js",
  "Stripe",
];

const mockProjects = [
  {
    title: "AIkostnad.se",
    tagline:
      "Förstå vad AI faktiskt kostar — jämför modeller och räkna ut din månadskostnad i realtid.",
    slug: "aikostnad-se",
    status: "live" as const,
    stack: ["Next.js", "Supabase"],
    upvotes: 24,
    commentCount: 7,
    authorName: "Erik Lindqvist",
    authorUsername: "eriklindqvist",
  },
  {
    title: "Need Radar",
    tagline:
      "AI som söker igenom forum och communities dagligen och hittar marknadsmöjligheter.",
    slug: "need-radar",
    status: "mvp" as const,
    stack: ["Next.js", "Claude AI"],
    upvotes: 18,
    commentCount: 4,
    authorName: "Sara Holm",
    authorUsername: "saraholm",
  },
  {
    title: "Smartbok.se",
    tagline:
      "AI-bokföringsassistent för enskild firma. Foton på kvitton, kategorisering, export.",
    slug: "smartbok-se",
    status: "feedback" as const,
    stack: ["React", "Supabase"],
    upvotes: 12,
    commentCount: 9,
    authorName: "Jonas Berg",
    authorUsername: "jonasberg",
  },
];

const mockHelpQuestions = [
  {
    title: "Hur kopplar jag Supabase Auth till Next.js App Router på rätt sätt?",
    slug: "supabase-auth-nextjs",
    tool: "Claude Code",
    answerCount: 0,
    timeAgo: "2 timmar sedan",
    isOpen: true,
  },
  {
    title: "Varför misslyckas min Vercel deploy — env variabler ser rätt ut?",
    slug: "vercel-deploy-env",
    tool: "Vercel",
    answerCount: 2,
    timeAgo: "5 timmar sedan",
    isOpen: true,
  },
  {
    title: "Hur strukturerar jag databasen för projekt med kommentarer och upvotes?",
    slug: "databas-projekt-kommentarer",
    tool: "Supabase",
    answerCount: 1,
    timeAgo: "1 dag sedan",
    isOpen: true,
  },
];

const howItWorks = [
  {
    icon: Hammer,
    step: "01",
    title: "Visa vad du bygger",
    text: "Lägg upp ditt projekt, berätta vad du använder och vad du vill ha feedback på.",
  },
  {
    icon: HelpCircle,
    step: "02",
    title: "Få hjälp när du fastnar",
    text: "Ställ tydliga frågor och få svar från andra som bygger med samma verktyg.",
  },
  {
    icon: BookOpen,
    step: "03",
    title: "Dela prompts och lärdomar",
    text: "Spara tid för andra genom att dela prompts, guider och workflows som faktiskt funkar.",
  },
  {
    icon: Users,
    step: "04",
    title: "Följ andra byggare",
    text: "Hitta människor som bygger liknande saker och följ deras resa från idé till lansering.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-background">
        {/* Dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--border) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.65,
          }}
        />
        {/* Radial fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 0%, transparent 30%, var(--background) 100%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28 md:py-32">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background-alt px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Sveriges community för AI-byggare
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              Bygg med AI.<br />
              Visa upp.<br />
              <span className="text-primary">Få hjälp.</span>
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
              AIbyggare.se är Sveriges community för dig som bygger appar,
              webbsidor och digitala produkter med AI.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/projects/new"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-primary text-primary-foreground hover:bg-[#8FB339] font-semibold shadow-sm"
                )}
              >
                Lägg upp ditt bygge
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link
                href="/help/new"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-border"
                )}
              >
                Be om hjälp
              </Link>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              För dig som använder Claude Code, Cursor, Lovable, Bolt, Replit,
              Supabase och liknande.
            </p>
          </div>
        </div>
      </section>

      {/* ── Tool badges ── */}
      <section className="border-y border-border bg-background-alt py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground font-medium shrink-0 mr-1">
              Populära verktyg:
            </span>
            {tools.map((tool) => (
              <ToolBadge key={tool} name={tool} />
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 space-y-16">
        {/* ── Senaste byggen ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Senaste byggen</h2>
            <Link
              href="/projects"
              className="text-sm font-medium text-primary hover:text-[#8FB339] transition-colors"
            >
              Se alla →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockProjects.map((project) => (
              <ProjectCard key={project.slug} {...project} />
            ))}
          </div>
        </section>

        {/* ── Hjälpfrågor ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Behöver hjälp just nu
            </h2>
            <Link
              href="/help"
              className="text-sm font-medium text-primary hover:text-[#8FB339] transition-colors"
            >
              Se alla →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockHelpQuestions.map((q) => (
              <HelpCard key={q.slug} {...q} />
            ))}
          </div>
        </section>

        {/* ── Så fungerar det ── */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-8">
            Så fungerar det
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                      <Icon size={15} className="text-[#2A5C1E] dark:text-primary" />
                    </div>
                    <span className="text-xs font-mono font-semibold text-muted-foreground">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="rounded-2xl bg-primary/10 border border-primary/25 p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Redo att visa vad du bygger?
          </h2>
          <p className="text-muted-foreground mb-8 text-base">
            Gratis. Inget kreditkort. Bara bygg.
          </p>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-primary text-primary-foreground hover:bg-[#8FB339] font-semibold shadow-sm"
            )}
          >
            Skapa konto gratis
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </section>
      </div>
    </>
  );
}
