"use client";

const MESSAGES = [
  "Claude skrev om hela komponenten igen.",
  "Supabase-felet var RLS. Det är alltid RLS.",
  "Funkar lokalt räknas som emotionellt stöd.",
  "Deploy failed, men drömmen lever.",
  "En MVP är bara en bugg med ambition.",
  "Glöm inte committa innan du ber AI:n refaktorera.",
  "Det är inte teknisk skuld, det är karaktär.",
  "Tre timmar på ett typo i env-filen.",
  "Tog bort en console.log och produktionen kraschade.",
  "GPT-4o förstod felet. Fixade fel sak.",
  "Halvfärdig funkar också.",
];

const tickerText = MESSAGES.join("   ·   ");

export function Ticker() {
  return (
    <div
      className="overflow-hidden border-b border-[#1e2119] bg-[#181713] py-2.5 select-none"
      aria-hidden
    >
      <div
        className="flex whitespace-nowrap"
        style={{ animation: "ticker 40s linear infinite" }}
      >
        <span className="text-xs font-mono text-[#9FBE5A]/80 pr-16">
          {tickerText}
        </span>
        <span className="text-xs font-mono text-[#9FBE5A]/80 pr-16">
          {tickerText}
        </span>
      </div>
    </div>
  );
}
