import { ChunkyLink } from "@/components/ui/ChunkyButton";
import { Sticker } from "@/components/ui/Sticker";
import { DecorativeBlob } from "@/components/brand/illustrations";

const PREVIEW_ITEMS = [
  {
    label: "Bygge",
    accent: "var(--build-green)",
    user: "Christoffer",
    text: "AI-bokföring för enskild firma",
    time: "12 min",
  },
  {
    label: "Fastnat",
    accent: "var(--bug-red)",
    user: "Lina",
    text: "Vercel vägrar deploya efter Supabase-ändring",
    time: "28 min",
  },
  {
    label: "Prompt",
    accent: "var(--prompt-purple)",
    user: "Sara",
    text: "Prompt som stoppar Claude från att förstöra designen",
    time: "2 tim",
  },
];

function HeroFeedPreview() {
  return (
    <div className="mx-auto mt-10 w-full max-w-lg space-y-2.5 text-left">
      {PREVIEW_ITEMS.map((item) => (
        <div
          key={item.user}
          className="chunky-sm flex items-center gap-3 rounded-2xl border-2 border-ink bg-paper px-4 py-3"
        >
          <span
            className="sticker shrink-0 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide"
            style={{ backgroundColor: item.accent }}
          >
            {item.label}
          </span>
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-ink">
            <span className="font-bold">{item.user}:</span> {item.text}
          </span>
          <span className="shrink-0 font-mono text-[10px] text-mud">{item.time}</span>
        </div>
      ))}
      <p className="pt-1 text-center font-mono text-[11px] text-mud">
        och många fler som bygger just nu...
      </p>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Blueprint-rutnät */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(55,57,39,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(55,57,39,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Dekorblobbar */}
      <DecorativeBlob
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 opacity-40"
        color="var(--soft-teal)"
      />
      <DecorativeBlob
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 opacity-30"
        color="var(--hammer-yellow)"
      />

      <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:py-28">
        <div className="flex justify-center">
          <Sticker tilt={-2} className="mb-5">
            <span className="h-2 w-2 rounded-[2px] bg-build-green" /> Svensk byggplats för AI-projekt
          </Sticker>
        </div>

        <h1 className="font-display text-4xl font-bold leading-[1.02] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          För oss som bygger{" "}
          <span className="relative whitespace-nowrap text-build-green">först</span>{" "}
          och förstår{" "}
          <span className="relative inline-block">
            sen.
            <svg
              aria-hidden
              viewBox="0 0 120 12"
              className="absolute -bottom-2 left-0 w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M2 8c30-6 86-6 116 0"
                stroke="var(--hammer-yellow)"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-mud">
          AIbyggare.se är platsen för dig som bygger appar, webbsidor och digitala
          projekt med AI — med kod, prompts, envishet och ibland ren panik.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ChunkyLink href="/projects/new" variant="green" size="lg">
            Lägg upp mitt bygge
          </ChunkyLink>
          <ChunkyLink href="/problemhornan/new" variant="paper" size="lg">
            Jag har fastnat
          </ChunkyLink>
        </div>

        <p className="mt-5 font-mono text-xs uppercase tracking-wide text-mud">
          Halvfärdiga MVP:er · trasiga deploys · prompts som faktiskt funkade
        </p>

        <HeroFeedPreview />
      </div>
    </section>
  );
}
