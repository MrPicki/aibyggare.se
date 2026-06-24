// Delad seed-data för startsidan och undersidorna.
// Tills riktig data finns i Firestore drar både / och /projects, /help, /prompts
// från samma källa, så upplevelsen känns konsekvent och bebodd.

import type { ProjectCardProps } from "@/components/cards/ProjectCard";
import type { PromptCardProps } from "@/components/cards/PromptCard";

const F = "/seed/avatar-female.png";
const N = "/seed/avatar-neutral.png";
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
    avatarUrl: N,
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
  { title: "MenuPilot", tagline: "AI som gör veckomenyer från matresterna hemma. Skriv vad du har i kylen och få middagsförslag.", slug: "menupilot-se", status: "Behöver feedback", accent: "var(--build-green)", tags: ["ChatGPT", "Next.js", "Firebase"], upvotes: 21, commentCount: 8, authorName: "Adam", authorAvatarUrl: N, isFeatured: true },
  { title: "Amazon Snipe", tagline: "Prisfel-scanner för Amazon som tjuter när något är felprissatt.", slug: "amazon-snipe", status: "MVP på livstöd", accent: "var(--hammer-yellow)", tags: ["Keepa", "Telegram", "Bot"], upvotes: 11, commentCount: 9, authorName: "Sara", authorAvatarUrl: F },
  { title: "BTC Edge", tagline: "Polymarket-bot med hårda go/no-go-regler. Disciplin över hopp.", slug: "btc-edge", status: "Forskning först", accent: "var(--code-blue)", tags: ["Trading", "Backtest", "Bot"], upvotes: 9, commentCount: 3, authorName: "Pelle", authorAvatarUrl: N },
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
  tools?: string[];  // för filtrering (Firestore: tags; seed: derived from topic)
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
    answerCount: 3,
    status: "Löst",
    avatarUrl: F,
    answers: [
      {
        author: "Christoffer",
        username: "christoffer",
        avatarUrl: M,
        body: "RLS kräver separata policies för varje operation. Om du bara har en INSERT-policy blockeras SELECT helt — även för ägaren. Kör i SQL-editorn: `CREATE POLICY \"read_own\" ON din_tabell FOR SELECT USING (auth.uid() = user_id);`",
        isAccepted: false,
        createdAtLabel: "för 2 dagar sen",
      },
      {
        author: "Jonas",
        username: "jonasbygger",
        avatarUrl: M,
        body: "Glömmer man `FOR SELECT` sätter Postgres `FOR ALL` som standard. Det låter generöst men med RLS aktiverat betyder 'ALL' att varje operation kräver en matchande policy. Alltid explicit, alltid.",
        isAccepted: false,
        createdAtLabel: "för 2 dagar sen",
      },
      {
        author: "Frida",
        username: "frida",
        avatarUrl: F,
        body: "Löst! Problemet var precis som Christoffer sa — jag hade bara en INSERT-policy. Lade till en SELECT-policy och nu fungerar allt perfekt. Tack!",
        isAccepted: true,
        createdAtLabel: "för 1 dag sen",
      },
    ],
  },
  {
    slug: "vercel-build-funkar-lokalt",
    title: "Build failar på Vercel men funkar lokalt",
    body: "Allt kör perfekt på min dator, men Vercel kastar 'Module not found' vid deploy. Case-sensitivt filnamn? Saknad env-variabel? Helt vilse.",
    topic: "Vercel",
    accent: "var(--code-blue)",
    author: "Oskar",
    username: "oskar",
    answerCount: 3,
    status: "Löst",
    avatarUrl: M,
    answers: [
      {
        author: "Sara",
        username: "sarapromptar",
        avatarUrl: F,
        body: "99% av gångerna är det case-sensitivity. Mac är case-insensitive, Linux (Vercel) är det inte. Kolla dina imports — `Components/Button` vs `components/Button` gör skillnad i produktion.",
        isAccepted: false,
        createdAtLabel: "för 4 dagar sen",
      },
      {
        author: "Pelle",
        username: "pelle",
        avatarUrl: M,
        body: "Kan också vara en env-variabel som behövs vid build-tid men saknas i Vercel. Variabler utan `NEXT_PUBLIC_`-prefix läses vid server-runtime men de som används under build (som i getStaticProps) måste finnas i Vercel specifikt.",
        isAccepted: false,
        createdAtLabel: "för 4 dagar sen",
      },
      {
        author: "Oskar",
        username: "oskar",
        avatarUrl: M,
        body: "Löst! Sara hade rätt — ett filnamn med fel case. `Components/Button` vs `components/Button`. Vercel kör Linux och det är strikt med versaler. Fixade alla imports och builden gick igenom direkt.",
        isAccepted: true,
        createdAtLabel: "för 3 dagar sen",
      },
    ],
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
    answers: [
      {
        author: "Christoffer",
        username: "christoffer",
        avatarUrl: M,
        body: "Firebase Auth är asynkront — du läser förmodligen `currentUser` innan SDK:n hunnit återställa sessionen. Lyssna på `onAuthStateChanged` istället för att läsa `auth.currentUser` direkt. Den callbacken anropas alltid, även vid reload.",
        isAccepted: false,
        createdAtLabel: "för 10 min sen",
      },
      {
        author: "Jonas",
        username: "jonasbygger",
        avatarUrl: M,
        body: "Kollad persistence-inställningen? Som standard är Firebase Auth `browserLocalStorage` vilket borde hålla sessionen. Men om du kör i inkognito-läge eller har cookies blockerade tappar du sessionen vid stängning.",
        isAccepted: false,
        createdAtLabel: "för 25 min sen",
      },
      {
        author: "Sara",
        username: "sarapromptar",
        avatarUrl: F,
        body: "Kolla också att du inte läser `auth.currentUser` i en komponent som mountas innan Firebase-SDK:n initialiserats. Lägg in en `loading`-state som är true tills `onAuthStateChanged` har svarat minst en gång — och rendera ingenting auth-beroende förrän den flaggan är false.",
        isAccepted: false,
        createdAtLabel: "för 40 min sen",
      },
    ],
  },
  {
    slug: "diven-vill-inte-centreras",
    title: "Diven vägrar centreras hur jag än gör",
    body: "Flexbox, grid, margin auto — har testat allt. Den sitter envist till vänster. Lägger med min CSS, snälla säg vad jag gör för dumt.",
    topic: "CSS",
    accent: "var(--warning-orange)",
    author: "Pelle",
    username: "pelle",
    answerCount: 3,
    status: "Öppen",
    avatarUrl: N,
    answers: [
      {
        author: "Maja",
        username: "majawebb",
        avatarUrl: F,
        body: "Problemet är nästan alltid förälderelementet. Kolla att containern har `display: flex` och `justify-content: center`. Sen behöver diven antingen en fast bredd eller `max-w-[nåt]` + `w-full`. Annars tar den bara upp så mycket plats den behöver och 'är' redan centrerad ur CSS:ens perspektiv.",
        isAccepted: false,
        createdAtLabel: "för 2 dagar sen",
      },
      {
        author: "Nina",
        username: "nina",
        avatarUrl: F,
        body: "Vilken typ av centrering behöver du — horisontell, vertikal eller båda? För horisontell: `display: flex; justify-content: center;` på föräldern. För båda: lägg till `align-items: center; min-height: 100vh;`. Och kolla i devtools att föräldern faktiskt är full bredd — annars centerar du inuti en liten box.",
        isAccepted: false,
        createdAtLabel: "för 2 dagar sen",
      },
      {
        author: "Adam",
        username: "adamcodes",
        avatarUrl: M,
        body: "Öppna webbläsarens devtools, högerklicka på diven → Inspect och kolla box model. Ibland är det ett margin/padding längre upp i trädet som stör. `margin: 0 auto` funkar bara om elementet är block-level OCH har en satt bredd — det är lätt att missa.",
        isAccepted: false,
        createdAtLabel: "för 1 dag sen",
      },
    ],
  },
  {
    slug: "claude-skrev-om-hela-filen",
    title: "Claude skrev om hela filen istället för en rad",
    body: "Bad om en liten fix, fick tillbaka en helt omskriven komponent där halva funktionaliteten försvann. Hur håller jag ändringarna små?",
    topic: "Claude",
    accent: "var(--bug-red)",
    author: "Sara",
    username: "sarapromptar",
    answerCount: 3,
    status: "Löst",
    avatarUrl: F,
    answers: [
      {
        author: "Jonas",
        username: "jonasbygger",
        avatarUrl: M,
        body: "Ge Claude bara den relevanta funktionen — inte hela filen. Klistra in 20–50 rader och skriv 'ändra bara den här funktionen, ingenting annat'. Claude ändrar det den ser, så ge den mindre att se.",
        isAccepted: false,
        createdAtLabel: "för 5 dagar sen",
      },
      {
        author: "Maja",
        username: "majawebb",
        avatarUrl: F,
        body: "Jag lägger alltid till i prompten: 'Returnera BARA den ändrade raden/funktionen som en diff, inte hela filen.' Det håller Claude fokuserad och sparar massor av tid på att läsa igenom output.",
        isAccepted: false,
        createdAtLabel: "för 5 dagar sen",
      },
      {
        author: "Sara",
        username: "sarapromptar",
        avatarUrl: F,
        body: "Kombinerade Jonas och Majas tips och det fungerade! Min regel nu: ge Claude bara den specifika funktionen + skriv 'Visa din ändring som en minimal diff. Rör ingenting utanför dessa rader.' Håller sig till uppgiften nästan alltid.",
        isAccepted: true,
        createdAtLabel: "för 4 dagar sen",
      },
    ],
  },
  {
    slug: "stripe-webhook-200-men-inget-hander",
    title: "Stripe-webhooken svarar 200 men inget händer",
    body: "Webhooken tar emot eventet och svarar 200, men min databas uppdateras aldrig. Test- vs live-nycklar? Fel event-typ? Beloppet i ören?",
    topic: "Stripe",
    accent: "var(--hammer-yellow)",
    author: "Johan",
    username: "johan",
    answerCount: 3,
    status: "Öppen",
    avatarUrl: N,
    answers: [
      {
        author: "Christoffer",
        username: "christoffer",
        avatarUrl: M,
        body: "Första frågan: verifierar du webhook-signaturen med `stripe.webhooks.constructEvent(body, signature, secret)`? Om signaturen misslyckas och det kastas i en tyst catch-block returnerar du 200 men din handler-kod körs aldrig.",
        isAccepted: false,
        createdAtLabel: "för 3 dagar sen",
      },
      {
        author: "Adam",
        username: "adamcodes",
        avatarUrl: M,
        body: "Kör `stripe listen --forward-to localhost:3000/api/webhook` med Stripe CLI och kolla exakt vilket event-typ som skickas. Vanligaste misstaget: du lyssnar på `payment_intent.succeeded` men Stripe skickar `checkout.session.completed` beroende på vilket flöde du använder.",
        isAccepted: false,
        createdAtLabel: "för 3 dagar sen",
      },
      {
        author: "Oskar",
        username: "oskar",
        avatarUrl: M,
        body: "Klassisk Next.js-fälla: du läser `req.body` men Next.js parsar den som JSON automatiskt. Stripe-signaturen kräver raw body bytes, inte parsad JSON. Lägg till `export const config = { api: { bodyParser: false } }` i din API-route och läs body manuellt.",
        isAccepted: false,
        createdAtLabel: "för 2 dagar sen",
      },
    ],
  },
];
