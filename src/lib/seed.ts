// Delad seed-data för startsidan och undersidorna.
// Tills riktig data finns i Firestore drar både / och /projects, /help, /prompts
// från samma källa, så upplevelsen känns konsekvent och bebodd.

import type { ProjectCardProps } from "@/components/cards/ProjectCard";
import type { PromptCardProps } from "@/components/cards/PromptCard";

export const SEED_PROJECTS: ProjectCardProps[] = [
  { title: "Smartbok.se", tagline: "AI-bokföring för enskild firma. Foton på kvitton in, ordning ut.", slug: "smartbok-se", status: "Hackig MVP", accent: "var(--supabase-green)", tags: ["Supabase", "Claude", "Vercel"], upvotes: 18, commentCount: 6 },
  { title: "AIkostnad.se", tagline: "Räkna ut vad AI faktiskt kostar dig per månad. Jämför modeller.", slug: "aikostnad-se", status: "Live men nervös", accent: "var(--build-green)", tags: ["Next.js", "API", "Kalkylator"], upvotes: 24, commentCount: 7 },
  { title: "Need Radar", tagline: "AI som dagligen letar marknadsmöjligheter i forum och trådar.", slug: "need-radar", status: "Byggs om", accent: "var(--warning-orange)", tags: ["Reddit", "Claude", "Automation"], upvotes: 15, commentCount: 4 },
  { title: "Amazon Snipe", tagline: "Prisfel-scanner för Amazon som tjuter när något är felprissatt.", slug: "amazon-snipe", status: "MVP på livstöd", accent: "var(--hammer-yellow)", tags: ["Keepa", "Telegram", "Bot"], upvotes: 11, commentCount: 9 },
  { title: "BTC Edge", tagline: "Polymarket-bot med hårda go/no-go-regler. Disciplin över hopp.", slug: "btc-edge", status: "Forskning först", accent: "var(--code-blue)", tags: ["Trading", "Backtest", "Bot"], upvotes: 9, commentCount: 3 },
  { title: "Runnr", tagline: "AI-löpcoach för vanliga människor som inte vill ha en PT-app.", slug: "runnr", status: "Behöver testare", accent: "var(--prompt-purple)", tags: ["AI Coach", "Running", "Mobile"], upvotes: 21, commentCount: 8 },
];

export const SEED_PROMPTS: Omit<PromptCardProps, "className">[] = [
  {
    title: "Bygg utan att förstöra designen",
    tool: "Claude Code",
    badge: "Räddar frontend",
    accent: "var(--warning-orange)",
    prompt: "Innan du ändrar något: lista exakt vilka filer och rader du tänker röra och varför. Rör inte styling, layout eller befintliga komponenter som inte är del av uppgiften. Gör minsta möjliga ändring.",
  },
  {
    title: "Debugga först, koda sen",
    tool: "Cursor / Claude",
    badge: "Stoppar panikfixar",
    accent: "var(--code-blue)",
    prompt: "Skriv ingen kod än. Förklara först vad som faktiskt orsakar felet, hur du vet det, och vilka 2 alternativa lösningar som finns. Vänta på mitt godkännande innan du ändrar något.",
  },
  {
    title: "Förklara felet som om jag är ny",
    tool: "ChatGPT",
    badge: "Nybörjarvänlig",
    accent: "var(--prompt-purple)",
    prompt: "Förklara det här felmeddelandet som om jag precis börjat koda. Vad betyder det på vanlig svenska, varför händer det, och vad gör jag steg för steg för att fixa det?",
  },
  {
    title: "Skapa Supabase RLS steg för steg",
    tool: "Supabase",
    badge: "RLS-terapi",
    accent: "var(--supabase-green)",
    prompt: "Skriv Row Level Security-policies för den här tabellen så att användare bara kan läsa och ändra sina egna rader. Förklara varje policy med en kommentar och visa hur jag testar att de funkar.",
  },
];

export interface HelpQuestion {
  slug: string;
  title: string;
  body: string;
  topic: string;
  /** CSS-färg för ämnessticker. */
  accent: string;
  author: string;
  answerCount: number;
  /** "Öppen" eller "Löst". */
  status: "Öppen" | "Löst";
}

export const SEED_HELP_QUESTIONS: HelpQuestion[] = [
  {
    slug: "rls-blockerar-mina-egna-rader",
    title: "Min RLS-policy blockerar mig från mina egna rader",
    body: "Satte upp Row Level Security i Supabase men nu får jag tomt svar även på rader jag själv äger. auth.uid() verkar matcha — vad missar jag?",
    topic: "Supabase",
    accent: "var(--supabase-green)",
    author: "Frida",
    answerCount: 4,
    status: "Löst",
  },
  {
    slug: "vercel-build-funkar-lokalt",
    title: "Build failar på Vercel men funkar lokalt",
    body: "Allt kör perfekt på min dator, men Vercel kastar 'Module not found' vid deploy. Case-sensitivt filnamn? Saknad env-variabel? Helt vilse.",
    topic: "Vercel",
    accent: "var(--code-blue)",
    author: "Oskar",
    answerCount: 6,
    status: "Löst",
  },
  {
    slug: "sessionen-forsvinner-vid-reload",
    title: "Inloggningen försvinner varje gång jag laddar om",
    body: "Firebase Auth loggar in fint, men vid reload är användaren utloggad igen. Något med persistence eller att jag läser state för tidigt?",
    topic: "Auth",
    accent: "var(--prompt-purple)",
    author: "Nina",
    answerCount: 3,
    status: "Öppen",
  },
  {
    slug: "diven-vill-inte-centreras",
    title: "Diven vägrar centreras hur jag än gör",
    body: "Flexbox, grid, margin auto — har testat allt. Den sitter envist till vänster. Lägger med min CSS, snälla säg vad jag gör för dumt.",
    topic: "CSS",
    accent: "var(--warning-orange)",
    author: "Pelle",
    answerCount: 5,
    status: "Öppen",
  },
  {
    slug: "claude-skrev-om-hela-filen",
    title: "Claude skrev om hela filen istället för en rad",
    body: "Bad om en liten fix, fick tillbaka en helt omskriven komponent där halva funktionaliteten försvann. Hur håller jag ändringarna små?",
    topic: "Claude",
    accent: "var(--bug-red)",
    author: "Sara",
    answerCount: 7,
    status: "Löst",
  },
  {
    slug: "stripe-webhook-200-men-inget-hander",
    title: "Stripe-webhooken svarar 200 men inget händer",
    body: "Webhooken tar emot eventet och svarar 200, men min databas uppdateras aldrig. Test- vs live-nycklar? Fel event-typ? Beloppet i ören?",
    topic: "Stripe",
    accent: "var(--hammer-yellow)",
    author: "Johan",
    answerCount: 2,
    status: "Öppen",
  },
];
