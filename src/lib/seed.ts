// Delad seed-data för startsidan och undersidorna.
// Tills riktig data finns i Firestore drar både / och /projects, /help, /prompts
// från samma källa, så upplevelsen känns konsekvent och bebodd.

import type { ProjectCardProps } from "@/components/cards/ProjectCard";
import type { PromptCardProps } from "@/components/cards/PromptCard";

const F = "/seed/avatar-female.png";
const M = "/seed/avatar-male.png";

// ─── Seed users (för profilsidor) ────────────────────────────────────────────
export interface SeedUser {
  username: string;
  displayName: string;
  bio: string;
  tools: string[];
  avatarUrl: string;
  joined: string;
  projectSlugs: string[];
  helpSlugs: string[];
  promptSlugs: string[];
}

export const SEED_USERS: SeedUser[] = [
  {
    username: "christoffer",
    displayName: "Christoffer",
    bio: "Bygger AI-verktyg för småföretagare. Supabase-fan och notorisk feature creeper.",
    tools: ["Supabase", "Claude", "Next.js", "Vercel"],
    avatarUrl: M,
    joined: "maj 2025",
    projectSlugs: ["smartbok-se"],
    helpSlugs: [],
    promptSlugs: [],
  },
  {
    username: "linabygger",
    displayName: "Lina",
    bio: "Bygger min första SaaS. Lär mig allt från scratch — inklusive att googla felmeddelanden.",
    tools: ["Next.js", "Vercel", "Supabase", "TypeScript"],
    avatarUrl: F,
    joined: "juni 2025",
    projectSlugs: [],
    helpSlugs: ["vercel-vagrar-deploya"],
    promptSlugs: [],
  },
  {
    username: "adamcodes",
    displayName: "Adam",
    bio: "Byggde MenuPilot när jag inte kom på vad som skulle lagas till middag. Nu testar folk det.",
    tools: ["ChatGPT", "Next.js", "Firebase", "React"],
    avatarUrl: M,
    joined: "april 2025",
    projectSlugs: ["menupilot-se"],
    helpSlugs: [],
    promptSlugs: [],
  },
  {
    username: "sarapromptar",
    displayName: "Sara",
    bio: "Prompt-nörd. Har testat fler prompts än jag vill erkänna. Delar bara de som faktiskt funkade.",
    tools: ["Claude Code", "Claude AI", "Cursor", "Lovable"],
    avatarUrl: F,
    joined: "mars 2025",
    projectSlugs: [],
    helpSlugs: [],
    promptSlugs: ["stopp-claude-designen"],
  },
  {
    username: "jonasbygger",
    displayName: "Jonas",
    bio: "Bygger NeedRadar — en pipeline som hittar marknadsgap i Reddit-trådar varje dag.",
    tools: ["Reddit", "Claude", "Supabase", "Python"],
    avatarUrl: M,
    joined: "maj 2025",
    projectSlugs: ["need-radar"],
    helpSlugs: [],
    promptSlugs: [],
  },
  {
    username: "majawebb",
    displayName: "Maja",
    bio: "Designer som försöker lära sig koda med hjälp av Lovable och Claude. Det går... ok.",
    tools: ["Lovable", "Claude", "Figma", "CSS"],
    avatarUrl: F,
    joined: "juni 2025",
    projectSlugs: [],
    helpSlugs: ["claude-skrev-om-hela-layouten"],
    promptSlugs: [],
  },
];

// ─── Projects ─────────────────────────────────────────────────────────────────
export const SEED_PROJECTS: ProjectCardProps[] = [
  { title: "Smartbok.se", tagline: "AI-bokföring för enskild firma. Foton på kvitton in, ordning ut.", slug: "smartbok-se", status: "Hackig MVP", accent: "var(--supabase-green)", tags: ["Supabase", "Claude", "Vercel"], upvotes: 18, commentCount: 6, authorName: "Christoffer", authorAvatarUrl: M },
  { title: "AIkostnad.se", tagline: "Räkna ut vad AI faktiskt kostar dig per månad. Jämför modeller.", slug: "aikostnad-se", status: "Live men nervös", accent: "var(--build-green)", tags: ["Next.js", "API", "Kalkylator"], upvotes: 24, commentCount: 7, authorName: "Oskar", authorAvatarUrl: M, isFeatured: true },
  { title: "Need Radar", tagline: "AI som dagligen letar marknadsmöjligheter i forum och trådar.", slug: "need-radar", status: "Byggs om", accent: "var(--warning-orange)", tags: ["Reddit", "Claude", "Automation"], upvotes: 15, commentCount: 4, authorName: "Jonas", authorAvatarUrl: M },
  { title: "MenuPilot", tagline: "AI som gör veckomenyer från matresterna hemma. Skriv vad du har i kylen och få middagsförslag.", slug: "menupilot-se", status: "Behöver feedback", accent: "var(--build-green)", tags: ["ChatGPT", "Next.js", "Firebase"], upvotes: 21, commentCount: 8, authorName: "Adam", authorAvatarUrl: M, isFeatured: true },
  { title: "Amazon Snipe", tagline: "Prisfel-scanner för Amazon som tjuter när något är felprissatt.", slug: "amazon-snipe", status: "MVP på livstöd", accent: "var(--hammer-yellow)", tags: ["Keepa", "Telegram", "Bot"], upvotes: 11, commentCount: 9, authorName: "Sara", authorAvatarUrl: F },
  { title: "BTC Edge", tagline: "Polymarket-bot med hårda go/no-go-regler. Disciplin över hopp.", slug: "btc-edge", status: "Forskning först", accent: "var(--code-blue)", tags: ["Trading", "Backtest", "Bot"], upvotes: 9, commentCount: 3, authorName: "Pelle", authorAvatarUrl: M },
  { title: "Runnr", tagline: "AI-löpcoach för vanliga människor som inte vill ha en PT-app.", slug: "runnr", status: "Behöver testare", accent: "var(--prompt-purple)", tags: ["AI Coach", "Running", "Mobile"], upvotes: 21, commentCount: 8, authorName: "Nina", authorAvatarUrl: F },
];

// ─── Prompts ──────────────────────────────────────────────────────────────────
export const SEED_PROMPTS: Omit<PromptCardProps, "className">[] = [
  {
    slug: "stopp-claude-designen",
    title: "Bygg utan att förstöra designen",
    tool: "Claude Code",
    badge: "Räddar frontend",
    accent: "var(--warning-orange)",
    author: "Sara",
    authorHandle: "sarapromptar",
    authorAvatarUrl: F,
    prompt: "Innan du ändrar något: lista exakt vilka filer och rader du tänker röra och varför. Rör inte styling, layout eller befintliga komponenter som inte är del av uppgiften. Gör minsta möjliga ändring.",
  },
  {
    slug: "debugga-forst-koda-sen",
    title: "Debugga först, koda sen",
    tool: "Cursor / Claude",
    badge: "Stoppar panikfixar",
    accent: "var(--code-blue)",
    prompt: "Skriv ingen kod än. Förklara först vad som faktiskt orsakar felet, hur du vet det, och vilka 2 alternativa lösningar som finns. Vänta på mitt godkännande innan du ändrar något.",
  },
  {
    slug: "forklara-felet-nybörjare",
    title: "Förklara felet som om jag är ny",
    tool: "ChatGPT",
    badge: "Nybörjarvänlig",
    accent: "var(--prompt-purple)",
    prompt: "Förklara det här felmeddelandet som om jag precis börjat koda. Vad betyder det på vanlig svenska, varför händer det, och vad gör jag steg för steg för att fixa det?",
  },
  {
    slug: "supabase-rls-steg-for-steg",
    title: "Skapa Supabase RLS steg för steg",
    tool: "Supabase",
    badge: "RLS-terapi",
    accent: "var(--supabase-green)",
    prompt: "Skriv Row Level Security-policies för den här tabellen så att användare bara kan läsa och ändra sina egna rader. Förklara varje policy med en kommentar och visa hur jag testar att de funkar.",
  },
];

// ─── Help questions ───────────────────────────────────────────────────────────
export interface SeedAnswer {
  author: string;
  username: string;
  avatarUrl: string;
  body: string;
  isAccepted?: boolean;
  createdAtLabel: string;
}

export interface HelpQuestion {
  slug: string;
  title: string;
  body: string;
  topic: string;
  accent: string;
  author: string;
  username?: string;
  answerCount: number;
  status: "Öppen" | "Löst";
  avatarUrl?: string;
  answers?: SeedAnswer[];
}

export const SEED_HELP_QUESTIONS: HelpQuestion[] = [
  {
    slug: "vercel-vagrar-deploya",
    title: "Vercel vägrar deploya efter Supabase-ändring",
    body: "Allt funkar lokalt men builden dör på env-variabler. Har kollat Vercel-loggen i tre timmar och förstår ingenting.",
    topic: "Vercel",
    accent: "var(--code-blue)",
    author: "Lina",
    username: "linabygger",
    answerCount: 4,
    status: "Öppen",
    avatarUrl: F,
    answers: [
      {
        author: "Christoffer",
        username: "christoffer",
        avatarUrl: M,
        body: "Klassiker! Det är förmodligen för att Vercel inte har din env-variabel inlagd. Gå till Project Settings → Environment Variables och lägg till NEXT_PUBLIC_SUPABASE_URL där. Kom ihåg att välja rätt miljöer (Production + Preview).",
        isAccepted: false,
        createdAtLabel: "för 20 min sen",
      },
      {
        author: "Pelle",
        username: "pelle",
        avatarUrl: M,
        body: "Lägg till variabeln i Vercel och kör en ny deploy manuellt — Vercel plockar inte upp ny env-config utan det. Går snabbt via 'Redeploy' i dashboarden.",
        isAccepted: false,
        createdAtLabel: "för 35 min sen",
      },
      {
        author: "Nina",
        username: "nina",
        avatarUrl: F,
        body: "Om NEXT_PUBLIC_-variabler saknas på Vercel är det ofta för att man lade till dem i .env.local (som inte pushas till git). Kontrollera att de finns i Vercel-dashboarden specifikt.",
        isAccepted: false,
        createdAtLabel: "för 1 tim sen",
      },
    ],
  },
  {
    slug: "claude-skrev-om-hela-layouten",
    title: "Claude skrev om hela layouten istället för en liten fix",
    body: "Bad om att fixa padding på en knapp, fick tillbaka en helt ny design med andra färger, grid och komponenter. Hur begränsar man Claude bättre?",
    topic: "Claude",
    accent: "var(--bug-red)",
    author: "Maja",
    username: "majawebb",
    answerCount: 7,
    status: "Öppen",
    avatarUrl: F,
    answers: [
      {
        author: "Sara",
        username: "sarapromptar",
        avatarUrl: F,
        body: "Hade exakt samma problem! Lägg alltid till: 'Jag ber dig bara ändra [specifik sak]. Rör INTE styling, layout eller andra komponenter. Visa mig BARA diff för de filer du ska ändra.' Fungerar nästan alltid.",
        isAccepted: true,
        createdAtLabel: "för 30 min sen",
      },
      {
        author: "Christoffer",
        username: "christoffer",
        avatarUrl: M,
        body: "Det finns en prompt för exakt det här i prompts-sektionen — 'Bygg utan att förstöra designen'. Har räddat mig flera gånger. Klistra in den i början av varje Claude-session.",
        isAccepted: false,
        createdAtLabel: "för 45 min sen",
      },
      {
        author: "Jonas",
        username: "jonasbygger",
        avatarUrl: M,
        body: "Jag brukar dela upp stora ändringar i flera steg. 'Ändra bara padding på denna knapp. Ingenting annat.' Sedan ett nytt meddelande för nästa sak. Claude håller sig mer avgränsad då.",
        isAccepted: false,
        createdAtLabel: "för 1 tim sen",
      },
    ],
  },
  {
    slug: "rls-blockerar-mina-egna-rader",
    title: "Min RLS-policy blockerar mig från mina egna rader",
    body: "Satte upp Row Level Security i Supabase men nu får jag tomt svar även på rader jag själv äger. auth.uid() verkar matcha — vad missar jag?",
    topic: "Supabase",
    accent: "var(--supabase-green)",
    author: "Frida",
    username: "frida",
    answerCount: 4,
    status: "Löst",
    avatarUrl: F,
  },
  {
    slug: "vercel-build-funkar-lokalt",
    title: "Build failar på Vercel men funkar lokalt",
    body: "Allt kör perfekt på min dator, men Vercel kastar 'Module not found' vid deploy. Case-sensitivt filnamn? Saknad env-variabel? Helt vilse.",
    topic: "Vercel",
    accent: "var(--code-blue)",
    author: "Oskar",
    username: "oskar",
    answerCount: 6,
    status: "Löst",
    avatarUrl: M,
  },
  {
    slug: "sessionen-forsvinner-vid-reload",
    title: "Inloggningen försvinner varje gång jag laddar om",
    body: "Firebase Auth loggar in fint, men vid reload är användaren utloggad igen. Något med persistence eller att jag läser state för tidigt?",
    topic: "Auth",
    accent: "var(--prompt-purple)",
    author: "Nina",
    username: "nina",
    answerCount: 3,
    status: "Öppen",
    avatarUrl: F,
  },
  {
    slug: "diven-vill-inte-centreras",
    title: "Diven vägrar centreras hur jag än gör",
    body: "Flexbox, grid, margin auto — har testat allt. Den sitter envist till vänster. Lägger med min CSS, snälla säg vad jag gör för dumt.",
    topic: "CSS",
    accent: "var(--warning-orange)",
    author: "Pelle",
    username: "pelle",
    answerCount: 5,
    status: "Öppen",
    avatarUrl: M,
  },
  {
    slug: "claude-skrev-om-hela-filen",
    title: "Claude skrev om hela filen istället för en rad",
    body: "Bad om en liten fix, fick tillbaka en helt omskriven komponent där halva funktionaliteten försvann. Hur håller jag ändringarna små?",
    topic: "Claude",
    accent: "var(--bug-red)",
    author: "Sara",
    username: "sarapromptar",
    answerCount: 7,
    status: "Löst",
    avatarUrl: F,
  },
  {
    slug: "stripe-webhook-200-men-inget-hander",
    title: "Stripe-webhooken svarar 200 men inget händer",
    body: "Webhooken tar emot eventet och svarar 200, men min databas uppdateras aldrig. Test- vs live-nycklar? Fel event-typ? Beloppet i ören?",
    topic: "Stripe",
    accent: "var(--hammer-yellow)",
    author: "Johan",
    username: "johan",
    answerCount: 2,
    status: "Öppen",
    avatarUrl: M,
  },
];
