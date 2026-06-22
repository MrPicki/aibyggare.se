const ITEMS = [
  "DEPLOY FAILED MEN DRÖMMEN LEVER",
  "FUNKAR LOKALT RÄKNAS",
  "CLAUDE SKREV OM ALLT IGEN",
  "DET VAR RLS — DET ÄR ALLTID RLS",
  "VISA DITT BYGGE",
  "FASTNAT? FRÅGA",
  "HALVFÄRDIGT ÄR OCKSÅ BYGGT",
];

function Row() {
  return (
    <div className="marquee-track">
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-wider text-ink">
          {item}
          <span aria-hidden className="mx-5 text-ink/45">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

export function AnnouncementMarquee() {
  return (
    <div className="marquee-paused overflow-hidden border-b-2 border-ink bg-hammer-yellow py-2 select-none">
      <div className="flex" aria-hidden>
        <Row />
        <Row />
      </div>
      <span className="sr-only">Aktuellt i communityn: {ITEMS.join(", ")}.</span>
    </div>
  );
}
