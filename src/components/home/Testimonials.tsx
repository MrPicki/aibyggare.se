import Link from "next/link";
import { Sticker } from "@/components/ui/Sticker";

const QUOTES = [
  {
    quote: "Lade upp Smartbok dagen efter MVP:n kraschade i produktion. Fick tre konkreta förslag inom en timme. Någon hade haft exakt samma Supabase-problem.",
    name: "Christoffer",
    handle: "christoffer",
    role: "Byggare av Smartbok.se",
    avatarUrl: "/seed/avatar-male.png",
    accent: "var(--build-green)",
    tilt: "-1.5deg",
  },
  {
    quote: "Jag visste inte ens vad RLS stod för. Frågade utan att skämmas — och fick faktiskt ett svar som förklarade det som om jag var ny. För jag var det.",
    name: "Lina",
    handle: "linabygger",
    role: "Bygger sin första SaaS",
    avatarUrl: "/seed/avatar-female.png",
    accent: "var(--warning-orange)",
    tilt: "1deg",
  },
  {
    quote: "MenuPilot lever för att tre personer på den här sidan tryckte borrar och kommenterade. Feedback från folk som faktiskt förstår vad en MVP är.",
    name: "Adam",
    handle: "adamcodes",
    role: "Byggare av MenuPilot",
    avatarUrl: "/seed/avatar-neutral.png",
    accent: "var(--code-blue)",
    tilt: "-1deg",
  },
  {
    quote: "Jag sparade en prompt, någon annan sparade samma prompt och kommenterade att de ändrat ett ord. Det funkar bättre nu. Exakt det jag hoppades att den här platsen skulle vara.",
    name: "Sara",
    handle: "sarapromptar",
    role: "Delar prompts som faktiskt funkar",
    avatarUrl: "/seed/avatar-female.png",
    accent: "var(--prompt-purple)",
    tilt: "1.5deg",
  },
  {
    quote: "Deployade Runnr med en bugg i onboarding-flödet. Lade upp problemet, fick en fix, la upp en uppdatering. Hela loopen tog ett dygn. Det är vibecodat.",
    name: "Nina",
    handle: "nina",
    role: "Byggare av Runnr",
    avatarUrl: "/seed/avatar-female.png",
    accent: "var(--supabase-green)",
    tilt: "-0.5deg",
  },
  {
    quote: "Byggde AIkostnad.se för att jag saknade verktyget. Sedan visade sig att andra också saknade det. Den sortens bekräftelse får man inte på LinkedIn.",
    name: "Oskar",
    handle: "oskar",
    role: "Byggare av AIkostnad.se",
    avatarUrl: "/seed/avatar-male.png",
    accent: "var(--hammer-yellow)",
    tilt: "1deg",
  },
];

export function Testimonials() {
  return (
    <section className="bg-paper border-t-2 border-ink px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <Sticker tilt={-2} className="mb-3 bg-soft-teal">Röster</Sticker>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Från bänken
          </h2>
          <p className="mt-2 max-w-lg mx-auto text-mud">
            Riktiga byggare. Halvfärdiga projekt. Konkret hjälp.
          </p>
        </div>

        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {QUOTES.map((q, i) => (
            <figure
              key={i}
              className="chunky rounded-3xl bg-cream p-6"
              style={{ rotate: q.tilt }}
            >
              <span aria-hidden className="font-display text-4xl leading-none text-ink/20">
                "
              </span>
              <blockquote className="mt-1 font-display text-lg font-semibold leading-snug text-ink">
                {q.quote}
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={q.avatarUrl}
                  alt=""
                  className="h-9 w-9 rounded-full border-2 border-ink object-cover shrink-0"
                  style={{ backgroundColor: q.accent }}
                />
                <div className="min-w-0">
                  <Link
                    href={`/profile/${q.handle}`}
                    className="block font-mono text-xs font-bold uppercase tracking-wide text-ink hover:text-build-green transition-colors truncate"
                  >
                    {q.name}
                  </Link>
                  <p className="font-mono text-[10px] text-mud truncate">{q.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
