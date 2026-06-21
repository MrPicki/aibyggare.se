import Link from "next/link";
import { ArrowRight, Hammer, MessageSquare, BookOpen, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { HelpCard } from "@/components/cards/HelpCard";
import { ToolBadge } from "@/components/ui/ToolBadge";
import { Ticker } from "@/components/ui/Ticker";

// ─── Mock-data ───────────────────────────────────────────────────────────────

const mockProjects = [
  {
    title: "AIkostnad.se",
    tagline: "Förstå vad AI faktiskt kostar. Jämför modeller och räkna ut vad det kostar dig per månad.",
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
    tagline: "AI som söker igenom forum och communities dagligen och hittar marknadsmöjligheter.",
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
    tagline: "AI-bokföringsassistent för enskild firma. Foton på kvitton, kategorisering, export.",
    slug: "smartbok-se",
    status: "feedback" as const,
    stack: ["React", "Firebase"],
    upvotes: 12,
    commentCount: 9,
    authorName: "Jonas Berg",
    authorUsername: "jonasberg",
  },
];

const mockHelpQuestions = [
  {
    title: "Hur kopplar jag Firebase Auth till Next.js App Router utan att tappa session vid reload?",
    slug: "firebase-auth-nextjs",
    tool: "Claude Code",
    answerCount: 0,
    timeAgo: "2 timmar sedan",
    isOpen: true,
  },
  {
    title: "Varför misslyckas min Vercel deploy — env variabler ser rätt ut lokalt?",
    slug: "vercel-deploy-env",
    tool: "Vercel",
    answerCount: 2,
    timeAgo: "5 timmar sedan",
    isOpen: true,
  },
  {
    title: "Hur strukturerar jag Firestore för projekt med kommentarer och upvotes?",
    slug: "firestore-projekt-kommentarer",
    tool: "Firebase",
    answerCount: 1,
    timeAgo: "1 dag sedan",
    isOpen: true,
  },
];

const tools = [
  { name: "Claude Code", size: "lg" as const },
  { name: "Cursor", size: "lg" as const },
  { name: "Supabase", size: "lg" as const },
  { name: "Vercel", size: "lg" as const },
  { name: "Lovable", size: "md" as const },
  { name: "Next.js", size: "md" as const },
  { name: "Firebase", size: "md" as const },
  { name: "Bolt", size: "md" as const },
  { name: "Replit", size: "sm" as const },
  { name: "Stripe", size: "sm" as const },
  { name: "GitHub", size: "sm" as const },
  { name: "TypeScript", size: "sm" as const },
];

const howItWorks = [
  {
    icon: Hammer,
    title: "Lägg upp något du bygger",
    text: "Halvfärdigt, trasigt eller nästan lanserat — allt räknas. Berätta vad du använder och vad du vill ha feedback på.",
  },
  {
    icon: MessageSquare,
    title: "Berätta vad som funkar och strular",
    text: "Visa hur projektet mår just nu. Inga krav på perfektion. Den ärliga versionen är mer värdefull.",
  },
  {
    icon: Users,
    title: "Få feedback, hjälp eller en knuff",
    text: "Andra byggare svarar. Det handlar inte om att imponera — det handlar om att komma vidare.",
  },
  {
    icon: BookOpen,
    title: "Bygg vidare",
    text: "Ta feedbacken, fixa buggen, pusha. Sedan lägger du upp nästa sak du inte förstår ännu.",
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-background">
        {/* Varm dot-grid bakgrund */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, #D8CFBE 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.55,
          }}
        />
        {/* Nedåt-fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 100% 80% at 50% 0%, transparent 20%, #F6F1E7 100%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28 md:py-32">
          <div className="max-w-3xl">

            {/* Liten etikett */}
            <div className="mb-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Svensk community för AI-byggare
              </span>
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05]">
              För oss som bygger{" "}
              <span className="text-primary">först</span>
              <br className="hidden sm:block" />
              {" "}och förstår sen.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              AIbyggare.se är en svensk plats för dig som bygger appar, webbsidor
              och digitala projekt med AI — oavsett om du är utvecklare, nybörjare
              eller bara envis nog att fortsätta.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/projects/new"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-primary text-primary-foreground hover:bg-[#8DB34E] font-semibold shadow-sm"
                )}
              >
                Visa upp mitt bygge
                <ArrowRight size={16} className="ml-1.5" />
              </Link>
              <Link
                href="/help/new"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-border font-medium"
                )}
              >
                Jag har fastnat
              </Link>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Halvfärdiga MVP:er, trasiga deploys, smarta prompts och projekt som
              kanske blir något.
            </p>
          </div>
        </div>
      </section>

      {/* ── Ticker ── */}
      <Ticker />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 space-y-16">

        {/* ── Just nu på bänken ── */}
        <section>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Just nu på bänken
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Projekt från folk som bygger, testar, misslyckas och försöker igen.
              </p>
            </div>
            <Link
              href="/projects"
              className="text-sm font-medium text-primary hover:text-[#8DB34E] transition-colors mt-1 shrink-0"
            >
              Se alla →
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockProjects.map((p) => (
              <ProjectCard key={p.slug} {...p} />
            ))}
          </div>

          {/* Empty state (visas när inga projekt finns) */}
          {mockProjects.length === 0 && (
            <div className="mt-5 rounded-xl border border-dashed border-border p-10 text-center">
              <p className="text-sm text-muted-foreground">
                Tomt på bänken än så länge.{" "}
                <Link href="/projects/new" className="text-primary hover:underline font-medium">
                  Lägg upp första bygget
                </Link>{" "}
                innan någon annan hinner.
              </p>
            </div>
          )}
        </section>

        {/* ── Folk har fastnat här ── */}
        <section>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Folk har fastnat här
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Supabase, Vercel, auth, CSS och andra små glädjeämnen.
              </p>
            </div>
            <Link
              href="/help"
              className="text-sm font-medium text-primary hover:text-[#8DB34E] transition-colors mt-1 shrink-0"
            >
              Se alla →
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockHelpQuestions.map((q) => (
              <HelpCard key={q.slug} {...q} />
            ))}
          </div>

          {mockHelpQuestions.length === 0 && (
            <div className="mt-5 rounded-xl border border-dashed border-border p-10 text-center">
              <p className="text-sm text-muted-foreground">
                Ingen har fastnat just nu.{" "}
                <span className="text-muted-foreground/60">Det lär inte hålla länge.</span>
              </p>
            </div>
          )}
        </section>

        {/* ── Verktyg folk bråkar med ── */}
        <section className="rounded-2xl border border-border bg-background-alt px-6 py-8 sm:px-8">
          <h2 className="font-heading text-xl font-bold text-foreground mb-1">
            Verktyg folk bråkar med
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Populära verktyg i communityn — klicka för att filtrera.
          </p>
          <div className="flex flex-wrap gap-2">
            {tools.map(({ name }) => (
              <ToolBadge key={name} name={name} size="md" className="cursor-pointer" />
            ))}
          </div>
        </section>

        {/* ── Så funkar det ── */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-1">
            Så funkar det
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Fyra steg. Inga krav på att förstå allt från början.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/12 border border-primary/20">
                      <Icon size={16} className="text-[#3D6B20]" />
                    </div>
                    <span className="text-xs font-mono font-semibold text-muted-foreground">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-foreground leading-snug text-sm">
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
        <section className="rounded-2xl bg-[#181713] border border-[#2A2E25] p-8 sm:p-12">
          <div className="max-w-xl">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#F6F1E7] mb-2 leading-tight">
              Lägg upp något innan du fegar ur.
            </h2>
            <p className="text-[#9FBE5A]/80 text-base mb-8">
              Halvfärdigt är också byggt. Communityn dömer inte — den hjälper.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-primary text-[#181713] hover:bg-[#8DB34E] font-semibold"
                )}
              >
                Skapa konto gratis
                <ArrowRight size={16} className="ml-1.5" />
              </Link>
              <Link
                href="/projects"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "text-[#F6F1E7]/70 hover:text-[#F6F1E7] hover:bg-white/5"
                )}
              >
                Kolla in byggen först
              </Link>
            </div>
            <p className="mt-4 text-xs text-[#F6F1E7]/30">
              Gratis. Inget kreditkort. Ingen GDPR-popup efter GDPR-popup.
            </p>
          </div>
        </section>

      </div>
    </>
  );
}
