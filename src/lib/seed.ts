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

// ─── Guides ───────────────────────────────────────────────────────────────────
export interface SeedGuide {
  slug: string;
  title: string;
  tool: string;
  category: string;
  accent: string;
  summary: string;
  body: string;
  readMinutes: number;
  author: string;
  authorHandle: string;
  authorAvatarUrl: string;
}

export const SEED_GUIDES: SeedGuide[] = [
  {
    slug: "bygg-fullstack-app-med-claude-pa-en-kvall",
    title: "Bygg en fullstack-app med Claude på en kväll",
    tool: "Claude Code",
    category: "Workflow",
    accent: "var(--bug-red)",
    summary: "Exakt det arbetsflöde jag följer varje gång: spec → skeleton → data → UI → deploy. Från idé till Vercel på 4–6 timmar utan att tappa tråden.",
    body: `Det här är mitt faktiska arbetsflöde — inte det ideala, utan det som faktiskt funkar när man har en kväll att bygga.

**Steg 1: Skriv en spec (30 min)**
Innan du öppnar terminalen — skriv en CLAUDE.md-fil. Vad ska appen göra? Vilken stack? Vilka sidor finns? Vad är MVP och vad är "nice to have"? Claude läser den här filen och fattar bättre beslut genom hela projektet.

**Steg 2: Skapa projektskelett (20 min)**
\`npx create-next-app@latest\` och Vercel-kopplingen direkt. Då kan du deploya i slutet av varje steg och se att det faktiskt funkar på riktigt.

**Steg 3: Datamodell och backend (1 tim)**
Beskriv datamodellen för Claude och låt den skriva Firestore-regler och typer. Seed-data direkt — en tom databas ser alltid trasig ut.

**Steg 4: UI komponenter (2 tim)**
En sida i taget. Håll Claude fokuserad på en fil i taget, annars börjar den skriva om saker som redan funkar.

**Steg 5: Deployen (20 min)**
\`git push\` och kolla att Vercel-bygget går igenom. Testa på mobil. Hitta tre saker som ser konstiga ut och fixa dem.

Det viktigaste tricket: committa efter varje steg som funkar. Då kan du alltid gå tillbaka om Claude plötsligt bestämmer sig för att "förbättra" arkitekturen.`,
    readMinutes: 4,
    author: "Christoffer",
    authorHandle: "christoffer",
    authorAvatarUrl: M,
  },
  {
    slug: "firebase-auth-pa-20-minuter",
    title: "Firebase Auth på 20 minuter — komplett guide",
    tool: "Firebase",
    category: "Setup-guide",
    accent: "var(--warning-orange)",
    summary: "Google + GitHub OAuth, skyddade routes med middleware, uid sparad i Firestore. Steg för steg utan onödigt krångel.",
    body: `Firebase Auth är snabbaste vägen till fungerande login — om man vet ordningen att göra saker.

**Förutsättningar**
- Firebase-projekt skapat på console.firebase.google.com
- \`firebase\`-paket installerat: \`npm install firebase firebase-admin\`

**Steg 1: Aktivera providers (5 min)**
Firebase Console → Authentication → Sign-in method → aktivera Google och GitHub. För GitHub: skapa en OAuth App på github.com/settings/applications och klistra in Client ID + Secret.

**Steg 2: Klientkonfiguration (5 min)**
Skapa \`src/lib/firebase/client.ts\`:
\`\`\`
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const app = getApps().length ? getApps()[0] : initializeApp({ /* config */ });
export const auth = getAuth(app);
\`\`\`

**Steg 3: Auth-context (5 min)**
En React context som lyssnar på \`onAuthStateChanged\` och exponerar \`user\` och \`loading\`. Lägg den i \`src/contexts/AuthContext.tsx\` och wrappa \`<body>\` i layout.tsx.

**Steg 4: Skyddad route med middleware (5 min)**
Next.js \`middleware.ts\` i projektroten — kolla \`__session\`-cookien (Firebase sätter den automatiskt) och redirecta till /login om den saknas.

**Gotcha**: Firebase Admin SDK kräver \`FIREBASE_SERVICE_ACCOUNT_KEY\` som env-variabel. Lägg ALDRIG in den i klientkod — bara i server-komponenter och API-routes.`,
    readMinutes: 5,
    author: "Nina",
    authorHandle: "nina",
    authorAvatarUrl: F,
  },
  {
    slug: "claude-code-som-teknisk-medgrundare",
    title: "Hur jag använder Claude Code som teknisk medgrundare",
    tool: "Claude Code",
    category: "Arbetsmetod",
    accent: "var(--bug-red)",
    summary: "CLAUDE.md, devlog och sessionshantering — hur jag fått en AI att minnas projektet, hålla arkitekturen konsekvent och stoppa mig från dåliga idéer.",
    body: `Det tog ett par veckor att inse att Claude Code inte är ett verktyg — det är en kollega. Och som alla kollegor presterar den bättre om den vet vad projektet handlar om.

**CLAUDE.md är allt**
Den viktigaste filen i projektet. Skriv: vad appen ska göra, vilken stack, vilka konventioner, vad som är MVP och vad som inte är det. Varje gång Claude missar sammanhanget — lägg till det i CLAUDE.md istället för att förklara om.

**Devlog som minne**
Jag håller en \`devlog.md\` som jag instruerar Claude att läsa i slutet av varje session och uppdatera med vad som gjordes. Nästa session börjar med: "Läs CLAUDE.md och devlog.md". Claude vet var vi befann oss.

**Sessionshantering**
Context tar slut. Istället för att tappa tråden mitt i en funktion — avsluta naturliga steg, committa, starta ny session. "Vi var på att implementera X, commit Y är senaste kända fungerande state."

**Den viktigaste regeln**
Be Claude förklara sin plan *innan* den skriver koden. "Vad tänker du ändra och varför?" En dålig plan är lättare att stoppa än dålig kod att städa upp.

Det tar 30 minuter att sätta upp det här första gången. Det sparar timmar varje vecka efter det.`,
    readMinutes: 4,
    author: "Christoffer",
    authorHandle: "christoffer",
    authorAvatarUrl: M,
  },
  {
    slug: "nextjs-vercel-deployment-checklista",
    title: "Next.js på Vercel: min deployment-checklista",
    tool: "Vercel",
    category: "Deployment",
    accent: "var(--code-blue)",
    summary: "Från npm run build till live. Env-variabler, domains, preview-deploys och de vanligaste fällorna — i rätt ordning.",
    body: `Jag har deployt tillräckligt många Next.js-appar för att veta exakt vad som går fel och när. Här är checklistan.

**Innan du pushar**
- [ ] \`npm run build\` lokalt — fixa alla fel innan CI behöver göra det
- [ ] Kolla att alla env-variabler finns i \`.env.local\` och är dokumenterade
- [ ] Ta bort alla \`console.log\` med känslig data

**I Vercel-dashboarden**
- [ ] Lägg in alla env-variabler under Settings → Environment Variables
- [ ] Välj rätt miljöer (Production, Preview, Development) per variabel
- [ ] Sätt \`NEXT_PUBLIC_SITE_URL\` till din faktiska domän — används av sitemap och OG-taggar

**Domänhantering**
- [ ] Lägg till custom domän under Settings → Domains
- [ ] Vänta på DNS-propagering (5 min–48 tim beroende på TTL)
- [ ] Kolla att HTTPS-certifikatet är aktivt

**Efter första deploy**
- [ ] Testa på mobil — inte bara på desktop
- [ ] Kolla Network-tabben i DevTools för 4xx/5xx-fel
- [ ] Verifiera att OG-bild och metadata ser bra ut via opengraph.xyz

**Vanligaste fällan**: env-variabeln finns lokalt men inte i Vercel. Appen crashar i production utan bra felmeddelande. Lösning: explicit kasta ett fel om kritiska variabler saknas i \`src/lib/config.ts\`.`,
    readMinutes: 3,
    author: "Oskar",
    authorHandle: "oskar",
    authorAvatarUrl: M,
  },
  {
    slug: "prompt-engineering-for-kodare",
    title: "Prompt-engineering för kodare: 5 tekniker som faktiskt funkar",
    tool: "Claude",
    category: "Prompt-teknik",
    accent: "var(--prompt-purple)",
    summary: "Inte filosofi — konkreta tekniker: role-prompting, constraint-lists, debug-first, chain-of-thought och iteration-loops. Med exempel du kan kopiera direkt.",
    body: `Efter hundratals timmar med AI-assisterad kodning har jag landat i fem tekniker som konsekvent ger bättre resultat än att bara beskriva vad man vill ha.

**1. Role-prompting**
"Du är en senior TypeScript-arkitekt med fokus på säkerhet. Granska den här koden." Rollen sätter förväntningarna på vad som ska prioriteras — utan den får du en generell genomgång.

**2. Constraint-lists**
Lista explicit vad AI:n INTE ska göra: "Rör inte befintliga typer. Lägg inte till nya npm-paket. Ändra inte fil-struktur." Utan constraints tenderar AI:n att 'förbättra' saker du inte bad om.

**3. Debug-first**
Innan du ber om en fix: "Förklara vad som orsakar felet, utan att skriva något kod." Du förstår problemet bättre och AI:n ger en mer träffsäker lösning. Dubbel vinst.

**4. Chain-of-thought**
"Tänk högt och lista stegen innan du kodar." AI:n avslöjar sin plan och du kan stoppa den om planen är fel — istället för att städa upp kod som var baserad på fel antaganden.

**5. Iteration-loops**
Dela upp stora uppgifter i explicita steg med check-points: "Bygg bara datalagret nu. Visa mig resultatet. Sedan gör vi UI." En AI som håller på med en sak i taget gör färre misstag.

Kombinera alla fem för komplexa uppgifter. Börja med constraint-list, be om chain-of-thought, och ha debug-first som default när något går fel.`,
    readMinutes: 5,
    author: "Sara",
    authorHandle: "sarapromptar",
    authorAvatarUrl: F,
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

// ─── Project details (rich content + seed comments for fallback) ─────────────

export interface SeedProjectComment {
  author: string;
  username: string;
  avatarUrl: string;
  body: string;
  daysAgo: number;
}

export interface SeedProjectDetail {
  description: string;
  problem: string;
  feedbackWanted?: string;
  projectUrl?: string;
  username: string;
  daysAgo: number;
  comments: SeedProjectComment[];
}

export const SEED_PROJECT_DETAILS: Record<string, SeedProjectDetail> = {
  "smartbok-se": {
    description: "Ladda upp ett foto på kvittot så kategoriserar AI:n kostnaden, matchar mot rätt konto och skapar en bokföringsrad. Målet är att göra bokföring nästan automatisk för soloföretagare — utan att man behöver förstå sig på kontoplan eller debet/kredit.",
    problem: "Bokföring tar timmar i månaden för en enskild firma och det är lätt att glömma kvitton. Jag ville ha ett verktyg som sköter jobbet automatiskt medan jag fokuserar på det jag faktiskt kan.",
    feedbackWanted: "Är flödet för kvittouppladdning enkelt nog? Och hur viktigt är export till Bokio/Fortnox — är det ett dealbreaker om det saknas i MVP?",
    projectUrl: "https://smartbok.se",
    username: "christoffer",
    daysAgo: 14,
    comments: [
      { author: "Lina", username: "linabygger", avatarUrl: F, body: "Snyggt upplägg! Hur löser du OCR-biten för kvittona — kör du något tredjepartsbibliotek eller ren Claude?", daysAgo: 12 },
      { author: "Adam", username: "adamcodes", avatarUrl: N, body: "Sitter med liknande utmaning för kvittoskanningar. Vilket OCR-API valde du till slut?", daysAgo: 11 },
      { author: "Jonas", username: "jonasbygger", avatarUrl: M, body: "Behövs verkligen i Sverige — Fortnox är en mardröm för enskilda firmor. Kör du Bokio-integration eller eget system?", daysAgo: 10 },
      { author: "Nina", username: "nina", avatarUrl: F, body: "Kör du server-side rendering för kvittodatan? Undrar hur du hanterar GDPR när kvittofoton lagras — lagrar du dem permanent eller raderar du efter analys?", daysAgo: 8 },
      { author: "Frida", username: "frida", avatarUrl: F, body: "Möjlighet att exportera till SIE-format (för Bokio/Fortnox) vore guld värt för mig.", daysAgo: 6 },
      { author: "Pelle", username: "pelle", avatarUrl: N, body: "Imponerande MVP! Fungerar det med kvitton som inte är på svenska, t.ex. från utländska restauranger?", daysAgo: 4 },
    ],
  },
  "aikostnad-se": {
    description: "En kalkylator som hjälper dig förstå och förutse kostnader för olika AI-modeller baserat på ditt faktiska användningsmönster. Jämför GPT-4o, Claude 3.5, Gemini Pro och flera andra sida vid sida — i kronor och ören, inte tokens.",
    problem: "Tokens och priser är svårt att räkna på. Jag ville ha ett enkelt verktyg som visar vad det faktiskt kostar att driva en AI-app eller använda en modell intensivt — innan fakturan kommer.",
    feedbackWanted: "Saknar ni några modeller i jämförelsen? Och hur viktigt är det att kunna spara och dela en beräkning med teamet?",
    projectUrl: "https://aikostnad.se",
    username: "oskar",
    daysAgo: 8,
    comments: [
      { author: "Sara", username: "sarapromptar", avatarUrl: F, body: "Exakt verktyget jag saknat. Kom ihåg att räkna in context-window-priset — det skenar fort om man kör långa konversationer.", daysAgo: 7 },
      { author: "Christoffer", username: "christoffer", avatarUrl: M, body: "Kanon! Kör du live-data från respektive modell-API eller hårdkodade priser som uppdateras manuellt?", daysAgo: 6 },
      { author: "Nina", username: "nina", avatarUrl: F, body: "Lade till ditt verktyg i min bokmärkesmapp direkt. Sparade mig en halv timme med Excel.", daysAgo: 5 },
      { author: "Lina", username: "linabygger", avatarUrl: F, body: "Har du tänkt på att lägga till en 'dela kostnad'-funktion för team — typ räkna ut total API-kostnad för hela teamet?", daysAgo: 4 },
      { author: "Jonas", username: "jonasbygger", avatarUrl: M, body: "Har du räknat in embeddings-kostnader? De glöms ofta bort men kan bli en stor del om man kör stora datamängder.", daysAgo: 3 },
      { author: "Pelle", username: "pelle", avatarUrl: N, body: "Claude 3.5 Haiku är faktiskt billigare via batch-API om man inte behöver realtidssvar. Kan vara värt att ha med som alternativ.", daysAgo: 2 },
      { author: "Maja", username: "majawebb", avatarUrl: F, body: "Ändrade direkt hur mycket jag kör streaming-svar efter att ha sett kostnaderna. Bra verktyg!", daysAgo: 1 },
    ],
  },
  "need-radar": {
    description: "En pipeline som varje dag kör igenom Reddit, Flashback och Hacker News och identifierar återkommande problem som ännu inte har en bra lösning. Resultaten aggregeras och presenteras med en relevansscore.",
    problem: "Jag vill hitta lönsamma SaaS-idéer men orkar inte manuellt läsa hundratals trådar varje dag. Ville automatisera prospekteringen och bara läsa igenom de bästa signalerna varje morgon.",
    feedbackWanted: "Är scoring-modellen för naiv? Hur skulle ni ranka marknadsmöjligheter på ett sätt som faktiskt funkar?",
    username: "jonasbygger",
    daysAgo: 21,
    comments: [
      { author: "Pelle", username: "pelle", avatarUrl: N, body: "Intressant idé. Reddit-API:et är ganska begränsat utan betald plan — har du kollat PushShift eller ett scrapers-baserat alternativ?", daysAgo: 20 },
      { author: "Maja", username: "majawebb", avatarUrl: F, body: "Hur hanterar du duplicerade trådar och cross-postning? Det verkar vara den svåraste biten.", daysAgo: 19 },
      { author: "Lina", username: "linabygger", avatarUrl: F, body: "Har du testat Hacker News Algolia-API:et också? Mer teknisk crowd men riktigt bra signal på vad devs saknar.", daysAgo: 17 },
      { author: "Oskar", username: "oskar", avatarUrl: M, body: "Kör du LLM för att ranka problemen eller rule-based? Gissar att LLM ger mer nyanserade träffar men kostar mer per körning.", daysAgo: 15 },
    ],
  },
  "menupilot-se": {
    description: "Skriv in vad du har i kylen och skafferiet — AI:n föreslår fem middagar som använder det du redan har, komplett med recept och inköpslista för det som saknas. Inga mer 'vad ska vi äta ikväll?'-diskussioner.",
    problem: "Ständiga diskussioner om mat trots ett fullt kylskåp. Ville lösa det med AI och sluta kasta mat som hade kunnat bli bra middagar.",
    feedbackWanted: "Onboarding-känslan och första intrycket — är det tydligt vad man ska göra? Och saknas något uppenbart i MVP?",
    projectUrl: "https://menupilot.se",
    username: "adamcodes",
    daysAgo: 10,
    comments: [
      { author: "Frida", username: "frida", avatarUrl: F, body: "Precis det här min familj behöver! Kan man utesluta ingredienser man inte vill ha, t.ex. lök?", daysAgo: 9 },
      { author: "Christoffer", username: "christoffer", avatarUrl: M, body: "Matrestor-idén är briljant. Hur mycket context skickar du med — hela kylen eller de 5 vanligaste ingredienserna?", daysAgo: 8 },
      { author: "Nina", username: "nina", avatarUrl: F, body: "Har testat och det fungerar bra! Saknar bara möjlighet att spara favoritmenyer mellan sessioner.", daysAgo: 7 },
      { author: "Pelle", username: "pelle", avatarUrl: N, body: "Hur hanterar du portionsstorlekar och kalorier? Det verkar vara nästa naturliga steg om du vill nå en bredare publik.", daysAgo: 6 },
      { author: "Sara", username: "sarapromptar", avatarUrl: F, body: "Imponerades av hur väl AI:n hanterade halvtomma kylskåp. Vilket prompt-upplägg kör du för ingrediens-till-meny-steget?", daysAgo: 5 },
      { author: "Jonas", username: "jonasbygger", avatarUrl: M, body: "Har du sett om folk återvänder eller är det mest one-shot-användning? Undrar om problemet löser sig med lite gamification.", daysAgo: 4 },
      { author: "Lina", username: "linabygger", avatarUrl: F, body: "Smart! Önskelistan: kom ihåg vilka rätter vi gillat och föreslå dem oftare nästa vecka.", daysAgo: 3 },
      { author: "Oskar", username: "oskar", avatarUrl: M, body: "Bra idé och clean execution. Funderar på att bygga något liknande för lunchförslag på jobbet.", daysAgo: 2 },
    ],
  },
  "amazon-snipe": {
    description: "Övervakar produktkategorier på Amazon och varnar via Telegram när priset sticker ut markant från normalintervallet — potentiellt felprissatt eller ovanlig kampanj. Byggt på Keepa API för historiska prisdata.",
    problem: "Missade för många bra deals för att jag inte kollade Amazon tillräckligt ofta. Nu kollar boten åt mig och skickar Telegram-notis direkt.",
    username: "sarapromptar",
    daysAgo: 30,
    comments: [
      { author: "Oskar", username: "oskar", avatarUrl: M, body: "Keepa-API:et är bra val. Har du stött på rate-limiting eller blockering från Amazon?", daysAgo: 29 },
      { author: "Pelle", username: "pelle", avatarUrl: N, body: "Vilken Telegram-bot-lib kör du — python-telegram-bot eller aiogram? Aiogram är async och hanterar hög last bättre.", daysAgo: 28 },
      { author: "Adam", username: "adamcodes", avatarUrl: N, body: "Snyggt projekt! Hur definierar du ett 'prisfel' — procent under historiskt snitt, eller något mer sofistikerat?", daysAgo: 27 },
      { author: "Maja", username: "majawebb", avatarUrl: F, body: "Kul projekt! Har du funderat på att utvidga till andra marknadsplatser, typ Prisjakt eller PriceRunner?", daysAgo: 25 },
      { author: "Nina", username: "nina", avatarUrl: F, body: "Hur lång är din historik-baseline för att avgöra om ett pris är 'avvikande'? En vecka? En månad?", daysAgo: 24 },
      { author: "Frida", username: "frida", avatarUrl: F, body: "Telegram-notiserna är en bra idé — push utan app. Kör du bot eller channel för utskicken?", daysAgo: 23 },
      { author: "Lina", username: "linabygger", avatarUrl: F, body: "Hur filtrerar du bort sponsrade produkter och Amazon Basics-varor med konstgjorda 'ordinarie priser'?", daysAgo: 21 },
      { author: "Christoffer", username: "christoffer", avatarUrl: M, body: "Keepa-datan är guld. Kör du historiska prisgraferna för att identifiera manufactured MSRP?", daysAgo: 20 },
      { author: "Jonas", username: "jonasbygger", avatarUrl: M, body: "Solid idé. En naturlig expansion vore att mejla en daglig digest istället för individuella notiser per träff.", daysAgo: 18 },
    ],
  },
  "btc-edge": {
    description: "Systematisk tradingbot för Polymarket som sätter och följer strikta regler för när man går in och ut ur positioner — eliminerar emotionella beslut och ersätter dem med fördefinierad logik.",
    problem: "Förlorade pengar på Polymarket för att jag inte höll mig till planen. Ville tvinga mig att vara disciplinerad genom att automatisera reglerna.",
    username: "pelle",
    daysAgo: 45,
    comments: [
      { author: "Johan", username: "johan", avatarUrl: N, body: "Go/no-go-regler låter rätt. Vilka signals triggar en 'go' — Kelly-kriteriet eller något eget?", daysAgo: 44 },
      { author: "Oskar", username: "oskar", avatarUrl: M, body: "Polymarket-API är ganska nytt. Hur stabil har du upplevt den under hög trading-aktivitet?", daysAgo: 43 },
      { author: "Sara", username: "sarapromptar", avatarUrl: F, body: "'Disciplin > hopp' är det bästa mottot för trading-botar. Imponerad av att du faktiskt byggt ett verktyg mot ditt eget beteende.", daysAgo: 42 },
    ],
  },
  "runnr": {
    description: "Genererar anpassade löpprogram baserade på din nuvarande kondition, tillgänglig tid och mål. Inga träningsjargonger — bara ett realistiskt schema du faktiskt kan hålla.",
    problem: "Alla träningsappar är designade för folk som redan tränar regelbundet. Ville ha något för oss som bara vill kunna springa 5k utan att dö.",
    feedbackWanted: "Letar testare — speciellt nybörjare som aldrig sprungit regelbundet. Vad saknas och vad klickar?",
    username: "nina",
    daysAgo: 7,
    comments: [
      { author: "Frida", username: "frida", avatarUrl: F, body: "Äntligen en löpapp som inte förutsätter att man redan springer 4 gånger i veckan! Finns det en iOS-build att testa?", daysAgo: 7 },
      { author: "Maja", username: "majawebb", avatarUrl: F, body: "React Native + Firebase är en riktigt bra kombination för just detta. Bra teknologival.", daysAgo: 6 },
      { author: "Lina", username: "linabygger", avatarUrl: F, body: "Testade via länken — träningsplanen kändes faktiskt realistisk för en nybörjare. Bra jobbat.", daysAgo: 5 },
      { author: "Adam", username: "adamcodes", avatarUrl: N, body: "Hur hanterar du progression — ökar programmet automatiskt svårighetsgraden baserat på historik, eller kör du statiska scheman?", daysAgo: 5 },
      { author: "Sara", username: "sarapromptar", avatarUrl: F, body: "Har en kompis som precis börjat träna och skickade länken till henne. Precis rätt nivå för nybörjare.", daysAgo: 4 },
      { author: "Christoffer", username: "christoffer", avatarUrl: M, body: "React Native + Firebase är ett bra val för detta. Planerar du att köra server-side schema-generering eller allt client-side?", daysAgo: 3 },
      { author: "Oskar", username: "oskar", avatarUrl: M, body: "Är AI-coachen proaktiv (påminner dig om du skippar ett pass) eller reaktiv (svarar bara på frågor)?", daysAgo: 2 },
      { author: "Pelle", username: "pelle", avatarUrl: N, body: "Ren och enkel. Den enda träningsappen jag faktiskt känt lust att testa på länge.", daysAgo: 1 },
    ],
  },
};

// ─── Help questions ───────────────────────────────────────────────────────────
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
