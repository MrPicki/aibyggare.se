const CHIPS = ["Claude Code", "Supabase", "Vercel", "Cursor", "Lovable", "Bolt", "ChatGPT"];

function HL({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="inline-block rounded-lg border-2 border-ink px-2 leading-tight"
      style={{ backgroundColor: color, boxShadow: "2px 2px 0 0 var(--ink)" }}
    >
      {children}
    </span>
  );
}

export function StatementBlock() {
  return (
    <section className="bg-cream px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-3xl font-bold leading-[1.35] tracking-tight text-ink sm:text-4xl sm:leading-[1.4] md:text-5xl md:leading-[1.4]">
          AIbyggare är en <HL color="var(--hammer-yellow)">byggbänk</HL> för{" "}
          <HL color="var(--build-green)">appar</HL>,{" "}
          <HL color="var(--prompt-purple)">prompts</HL>,{" "}
          <HL color="var(--bug-red)">buggar</HL> &{" "}
          <HL color="var(--code-blue)">idéer</HL>.
        </h2>

        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-mud">
          Inga prestige-krav. Inga dumma frågor. Bara människor som bygger, fastnar
          och hjälper varandra vidare.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {CHIPS.map((chip) => (
            <span
              key={chip}
              className="rounded-full border-2 border-ink bg-paper px-3 py-1 font-mono text-xs font-medium text-ink"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
