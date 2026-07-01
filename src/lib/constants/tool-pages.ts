// SEO-landningssidor för verktyg — /tools/[slug].
// Varje sida samlar byggen, problem och prompts för ett verktyg.
// Copy: tydlig, varm svenska med sökord folk faktiskt googlar på.

export interface ToolPage {
  /** URL-slug: /tools/[slug] */
  slug: string;
  /** Visningsnamn */
  name: string;
  /** Namn som matchas mot projects.stack, posts.tool och posts.tags (case-insensitive) */
  aliases: string[];
  /** Kort rad under namnet */
  tagline: string;
  /** SEO meta description (~150 tecken) */
  description: string;
  /** Intro-stycke på sidan */
  intro: string;
  /** CSS-färg för accenter */
  accent: string;
}

export const TOOL_PAGES: ToolPage[] = [
  {
    slug: "claude-code",
    name: "Claude Code",
    aliases: ["Claude Code"],
    tagline: "Anthropics kodagent i terminalen",
    description:
      "Claude Code på svenska — se vad andra byggt, hitta lösningar när du fastnat och kopiera prompts som faktiskt fungerar. Sveriges community för AI-byggare.",
    intro:
      "Claude Code är Anthropics kodagent som bor i terminalen och bygger hela funktioner åt dig — inte bara rader. Här samlar vi allt svenska byggare gjort med den: byggen, problem folk kört fast i (och löst) och prompts som håller agenten på rätt spår.",
    accent: "var(--bug-red)",
  },
  {
    slug: "claude",
    name: "Claude",
    aliases: ["Claude", "Claude AI"],
    tagline: "Anthropics AI-assistent",
    description:
      "Bygger du med Claude? Se svenska projekt byggda med Claude, få hjälp när du fastnar och hitta prompts som ger bättre svar. Gratis community.",
    intro:
      "Claude är Anthropics AI-assistent — stark på långa resonemang, kod och svenska. Här hittar du vad andra svenska byggare skapat med Claude, vilka problem de stött på och prompts som får ut mer av modellen.",
    accent: "var(--bug-red)",
  },
  {
    slug: "chatgpt",
    name: "ChatGPT",
    aliases: ["ChatGPT", "GPT"],
    tagline: "OpenAIs assistent för allt möjligt",
    description:
      "ChatGPT för svenska byggare — projekt byggda med ChatGPT, vanliga problem med lösningar och prompts som fungerar. Sveriges AI-byggarcommunity.",
    intro:
      "ChatGPT är för många det första AI-verktyget — och fortfarande ett av de mest mångsidiga. Här ser du vad svenska byggare gjort med det, var det brukar strula och prompts som ger vassare resultat.",
    accent: "var(--build-green)",
  },
  {
    slug: "cursor",
    name: "Cursor",
    aliases: ["Cursor"],
    tagline: "AI-kodeditorn som förändrat arbetsflödet",
    description:
      "Cursor på svenska — se projekt byggda i Cursor, lös vanliga problem och hitta prompts och regler som gör editorn smartare. Community för AI-byggare.",
    intro:
      "Cursor är kodeditorn med AI inbyggd i kärnan — tab-kompletteringar, chatt med hela kodbasen och agentläge. Här samlar vi svenska byggen gjorda i Cursor, problemen folk kört fast i och prompts som lyfter arbetsflödet.",
    accent: "var(--code-blue)",
  },
  {
    slug: "lovable",
    name: "Lovable",
    aliases: ["Lovable"],
    tagline: "Från idé till app utan kod",
    description:
      "Lovable på svenska — appar byggda med Lovable, lösningar på vanliga problem och prompts som ger snyggare resultat. För vibe coders och nybörjare.",
    intro:
      "Lovable låter dig bygga riktiga appar genom att beskriva vad du vill ha — perfekt för dig som vill från idé till MVP utan att skriva all kod själv. Här ser du vad svenska byggare skapat, var det brukar ta stopp och prompts som undviker AI-looken.",
    accent: "var(--prompt-purple)",
  },
  {
    slug: "bolt",
    name: "Bolt",
    aliases: ["Bolt"],
    tagline: "Bygg fullstack-appar i webbläsaren",
    description:
      "Bolt.new på svenska — projekt byggda med Bolt, vanliga problem med lösningar och prompts som fungerar. Sveriges community för AI-byggare.",
    intro:
      "Bolt bygger och kör fullstack-appar direkt i webbläsaren — från prompt till körande kod på minuter. Här samlar vi svenska Bolt-byggen, problemen folk stött på och prompts som ger bättre struktur från start.",
    accent: "var(--hammer-yellow)",
  },
  {
    slug: "replit",
    name: "Replit",
    aliases: ["Replit"],
    tagline: "Koda, hosta och deploya på ett ställe",
    description:
      "Replit för svenska byggare — projekt byggda med Replit Agent, lösningar på vanliga problem och tips från communityn.",
    intro:
      "Replit kombinerar editor, hosting och AI-agent i ett — du kan gå från idé till deployad app utan att lämna webbläsaren. Här ser du vad svenska byggare gjort med Replit och var det brukar kräva lite extra handpåläggning.",
    accent: "var(--warning-orange)",
  },
  {
    slug: "v0",
    name: "v0",
    aliases: ["v0"],
    tagline: "Vercels UI-generator",
    description:
      "v0 på svenska — gränssnitt byggda med v0, vanliga problem och prompts som ger snyggare komponenter. Community för AI-byggare.",
    intro:
      "v0 är Vercels generator för React-gränssnitt — beskriv komponenten du vill ha och få shadcn/Tailwind-kod tillbaka. Här samlar vi svenska byggen, fallgropar och prompts som ger UI utan mall-känsla.",
    accent: "var(--code-blue)",
  },
  {
    slug: "vercel",
    name: "Vercel",
    aliases: ["Vercel"],
    tagline: "Hosting och deploy för moderna webbappar",
    description:
      "Vercel på svenska — deploy-problem med lösningar, projekt hostade på Vercel och tips från svenska byggare. Fastnat med en build? Fråga här.",
    intro:
      "Vercel är standardvalet för att deploya Next.js och moderna webbappar — tills builden plötsligt failar. Här hittar du svenska byggen som körs på Vercel, vanliga deploy-problem med lösningar och tips som sparar timmar.",
    accent: "var(--code-blue)",
  },
  {
    slug: "supabase",
    name: "Supabase",
    aliases: ["Supabase"],
    tagline: "Databas, auth och lagring — open source",
    description:
      "Supabase på svenska — RLS-problem med lösningar, projekt byggda på Supabase och hjälp när du fastnat. Sveriges community för AI-byggare.",
    intro:
      "Supabase ger dig Postgres, auth och lagring utan att bygga egen backend — men RLS-policies och auth-flöden är där många kör fast. Här samlar vi svenska Supabase-byggen, lösta problem och konkreta svar från folk som stött på samma sak.",
    accent: "var(--supabase-green)",
  },
  {
    slug: "firebase",
    name: "Firebase",
    aliases: ["Firebase"],
    tagline: "Googles backend-plattform",
    description:
      "Firebase på svenska — Firestore-frågor, Security Rules-problem och projekt byggda på Firebase. Få hjälp av svenska byggare som varit där.",
    intro:
      "Firebase ger dig databas, auth och lagring från Google — snabbt att komma igång med, men Security Rules och indexering har sina fällor. Här ser du svenska byggen på Firebase och lösningar på problemen alla stöter på förr eller senare.",
    accent: "var(--warning-orange)",
  },
  {
    slug: "stripe",
    name: "Stripe",
    aliases: ["Stripe"],
    tagline: "Betalningar i din app",
    description:
      "Stripe på svenska — webhook-problem med lösningar, projekt med Stripe-betalningar och hjälp från byggare som fått det att fungera.",
    intro:
      "Stripe är vägen från sidoprojekt till något som faktiskt drar in pengar — men webhooks, testläge och svenska moms-inställningar ställer till det för många. Här samlar vi byggen med Stripe och lösningar på problemen som brukar dyka upp.",
    accent: "var(--hammer-yellow)",
  },
];

export function getToolPage(slug: string): ToolPage | undefined {
  return TOOL_PAGES.find((t) => t.slug === slug);
}

/** Matchar ett verktygs aliases mot en lista strängar (stack/tags) eller enskild sträng (tool). */
export function matchesTool(tool: ToolPage, candidates: (string | undefined)[]): boolean {
  const aliases = tool.aliases.map((a) => a.toLowerCase());
  return candidates.some((c) => c && aliases.includes(c.toLowerCase()));
}
