/**
 * Seed-skript: skapar riktiga Firebase Auth-konton och Firestore-dokument
 * för alla community-användare som används som seed-data.
 *
 * Kör med:
 *   npx dotenv -e .env.local -- npx tsx scripts/seed-firebase.ts
 *
 * Skriptet är idempotent — skapar inte dubbletter vid upprepade körningar.
 */

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// ── Init ──────────────────────────────────────────────────────────────────────

const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!key) {
  console.error("FIREBASE_SERVICE_ACCOUNT_KEY saknas. Kör med dotenv -e .env.local");
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(key)),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const auth = getAuth();
const db = getFirestore();

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://aibyggare.se";
const AVATAR_F = `${BASE_URL}/seed/avatar-female.png`;
const AVATAR_M = `${BASE_URL}/seed/avatar-male.png`;

// ── Seed-data ─────────────────────────────────────────────────────────────────

interface SeedUser {
  uid: string;           // deterministisk — seed_{username}
  username: string;
  displayName: string;
  bio: string;
  tools: string[];
  avatarUrl: string;
  email: string;         // seed-email, aldrig exponerad
}

const USERS: SeedUser[] = [
  {
    uid: "seed_christoffer",
    username: "christoffer",
    displayName: "Christoffer",
    email: "christoffer@seed.aibyggare.se",
    bio: "Bygger AI-verktyg för småföretagare. Supabase-fan och notorisk feature creeper.",
    tools: ["Supabase", "Claude", "Next.js", "Vercel"],
    avatarUrl: AVATAR_M,
  },
  {
    uid: "seed_linabygger",
    username: "linabygger",
    displayName: "Lina",
    email: "linabygger@seed.aibyggare.se",
    bio: "Bygger min första SaaS. Lär mig allt från scratch — inklusive att googla felmeddelanden.",
    tools: ["Next.js", "Vercel", "Supabase", "TypeScript"],
    avatarUrl: AVATAR_F,
  },
  {
    uid: "seed_adamcodes",
    username: "adamcodes",
    displayName: "Adam",
    email: "adamcodes@seed.aibyggare.se",
    bio: "Byggde MenuPilot när jag inte kom på vad som skulle lagas till middag. Nu testar folk det.",
    tools: ["ChatGPT", "Next.js", "Firebase", "React"],
    avatarUrl: AVATAR_M,
  },
  {
    uid: "seed_sarapromptar",
    username: "sarapromptar",
    displayName: "Sara",
    email: "sarapromptar@seed.aibyggare.se",
    bio: "Prompt-nörd. Har testat fler prompts än jag vill erkänna. Delar bara de som faktiskt funkade.",
    tools: ["Claude Code", "Claude AI", "Cursor", "Lovable"],
    avatarUrl: AVATAR_F,
  },
  {
    uid: "seed_jonasbygger",
    username: "jonasbygger",
    displayName: "Jonas",
    email: "jonasbygger@seed.aibyggare.se",
    bio: "Bygger NeedRadar — en pipeline som hittar marknadsgap i Reddit-trådar varje dag.",
    tools: ["Reddit", "Claude", "Supabase", "Python"],
    avatarUrl: AVATAR_M,
  },
  {
    uid: "seed_majawebb",
    username: "majawebb",
    displayName: "Maja",
    email: "majawebb@seed.aibyggare.se",
    bio: "Designer som försöker lära sig koda med hjälp av Lovable och Claude. Det går... ok.",
    tools: ["Lovable", "Claude", "Figma", "CSS"],
    avatarUrl: AVATAR_F,
  },
  {
    uid: "seed_pelle",
    username: "pelle",
    displayName: "Pelle",
    email: "pelle@seed.aibyggare.se",
    bio: "Bygger BTC Edge — en Polymarket-bot med hårda regler. Disciplin framför hopp.",
    tools: ["Trading", "Backtest", "Python", "Telegram"],
    avatarUrl: AVATAR_M,
  },
  {
    uid: "seed_nina",
    username: "nina",
    displayName: "Nina",
    email: "nina@seed.aibyggare.se",
    bio: "AI-löpcoach-byggare. Runnr är mitt försök att ta bort excuserna för att inte träna.",
    tools: ["AI Coach", "React Native", "Claude", "Firebase"],
    avatarUrl: AVATAR_F,
  },
  {
    uid: "seed_frida",
    username: "frida",
    displayName: "Frida",
    email: "frida@seed.aibyggare.se",
    bio: "Bygger verktyg för utbildningssektorn. Just nu kämpar jag med Supabase RLS.",
    tools: ["Supabase", "Next.js", "Vercel"],
    avatarUrl: AVATAR_F,
  },
  {
    uid: "seed_oskar",
    username: "oskar",
    displayName: "Oskar",
    email: "oskar@seed.aibyggare.se",
    bio: "Bakom AIkostnad.se — vill hjälpa folk förstå vad AI faktiskt kostar.",
    tools: ["Next.js", "API", "Vercel", "Claude"],
    avatarUrl: AVATAR_M,
  },
  {
    uid: "seed_johan",
    username: "johan",
    displayName: "Johan",
    email: "johan@seed.aibyggare.se",
    bio: "E-handlare som automatiserar för mycket. Stripe-webhook-hjälten (eller skurken).",
    tools: ["Stripe", "Next.js", "Vercel", "Supabase"],
    avatarUrl: AVATAR_M,
  },
];

// ── Hjälpfunktioner ───────────────────────────────────────────────────────────

function ts(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

function user(username: string): SeedUser {
  const u = USERS.find((u) => u.username === username);
  if (!u) throw new Error(`Okänd användare: ${username}`);
  return u;
}

// ── Steg 1: Firebase Auth-konton ──────────────────────────────────────────────

async function ensureAuthUsers() {
  console.log("\n── Skapar Firebase Auth-konton ──");
  for (const u of USERS) {
    try {
      await auth.getUser(u.uid);
      console.log(`  ⏭  ${u.username} finns redan`);
    } catch {
      await auth.createUser({
        uid: u.uid,
        displayName: u.displayName,
        photoURL: u.avatarUrl,
        email: u.email,
        emailVerified: false,
        disabled: false,
      });
      console.log(`  ✅ Skapade Auth-konto: ${u.username}`);
    }
  }
}

// ── Steg 2: Firestore-profiler ────────────────────────────────────────────────

async function ensureProfiles() {
  console.log("\n── Skapar Firestore-profiler ──");
  for (const u of USERS) {
    const ref = db.collection("profiles").doc(u.uid);
    const snap = await ref.get();
    if (snap.exists) {
      console.log(`  ⏭  Profil finns: ${u.username}`);
      continue;
    }
    await ref.set({
      userId: u.uid,
      username: u.username,
      displayName: u.displayName,
      email: u.email,
      photoURL: u.avatarUrl,
      bio: u.bio,
      tools: u.tools,
      role: "user",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`  ✅ Profil skapad: ${u.username}`);
  }
}

// ── Steg 3: Projekt ───────────────────────────────────────────────────────────

interface ProjectSeed {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  problem: string;
  stack: string[];
  status: string;
  projectUrl: string;
  upvoteCount: number;
  commentCount: number;
  authorUsername: string;
  daysAgo: number;
}

const PROJECTS: ProjectSeed[] = [
  {
    slug: "smartbok-se",
    title: "Smartbok.se",
    tagline: "AI-bokföring för enskild firma. Foton på kvitton in, ordning ut.",
    description: "Ladda upp ett foto på kvittot så kategoriserar AI:n kostnaden, matchar mot rätt konto och skapar en bokföringsrad. Syftar till att göra bokföring nästan automatisk för soloföretagare.",
    problem: "Bokföring tar timmar i månaden för enskild firma och det är lätt att glömma kvitton. Ville ha ett verktyg som gör jobbet åt mig.",
    stack: ["Supabase", "Claude", "Next.js", "Vercel", "TypeScript"],
    status: "mvp",
    projectUrl: "https://smartbok.se",
    upvoteCount: 18,
    commentCount: 6,
    authorUsername: "christoffer",
    daysAgo: 14,
  },
  {
    slug: "aikostnad-se",
    title: "AIkostnad.se",
    tagline: "Räkna ut vad AI faktiskt kostar dig per månad. Jämför modeller.",
    description: "Kalkylator som hjälper dig förstå och förutse kostnader för olika AI-modeller baserat på ditt faktiska användningsmönster. Jämför GPT-4o, Claude 3.5, Gemini och fler.",
    problem: "Tokens och priser är svårt att räkna på. Ville ha ett enkelt verktyg som visar vad det kostar i kronor och ören.",
    stack: ["Next.js", "API", "Vercel", "TypeScript"],
    status: "live",
    projectUrl: "https://aikostnad.se",
    upvoteCount: 24,
    commentCount: 7,
    authorUsername: "oskar",
    daysAgo: 8,
  },
  {
    slug: "need-radar",
    title: "Need Radar",
    tagline: "AI som dagligen letar marknadsmöjligheter i forum och trådar.",
    description: "En pipeline som varje dag kör igenom Reddit, Flashback och Hacker News och identifierar återkommande problem som ännu inte har en bra lösning. Aggregeras och presenteras med en poäng.",
    problem: "Vill hitta SaaS-idéer men orkar inte manuellt läsa hundratals trådar. Ville automatisera prospekteringen.",
    stack: ["Reddit API", "Claude", "Supabase", "Python", "Vercel"],
    status: "idea",
    projectUrl: "",
    upvoteCount: 15,
    commentCount: 4,
    authorUsername: "jonasbygger",
    daysAgo: 21,
  },
  {
    slug: "menupilot-se",
    title: "MenuPilot",
    tagline: "AI som gör veckomenyer från matresterna hemma.",
    description: "Skriv in vad du har i kylen och skafferiet — AI:n föreslår fem middagar som använder det du har, med recept och inköpslista för det som saknas.",
    problem: "Ständiga diskussioner om 'vad ska vi äta ikväll?' trots fullt kylskåp. Ville lösa det med AI.",
    stack: ["ChatGPT", "Next.js", "Firebase", "React", "Vercel"],
    status: "feedback",
    projectUrl: "https://menupilot.se",
    upvoteCount: 21,
    commentCount: 8,
    authorUsername: "adamcodes",
    daysAgo: 10,
  },
  {
    slug: "amazon-snipe",
    title: "Amazon Snipe",
    tagline: "Prisfel-scanner för Amazon som tjuter när något är felprissatt.",
    description: "Övervakar produktkategorier på Amazon och varnar via Telegram när priset sticker ut från normalintervallet — potentiellt felprissatt eller kampanj.",
    problem: "Missade för många bra deals för att jag inte kollade Amazon tillräckligt ofta. Nu kollar boten åt mig.",
    stack: ["Keepa API", "Telegram Bot", "Python", "Cron"],
    status: "mvp",
    projectUrl: "",
    upvoteCount: 11,
    commentCount: 9,
    authorUsername: "sarapromptar",
    daysAgo: 30,
  },
  {
    slug: "btc-edge",
    title: "BTC Edge",
    tagline: "Polymarket-bot med hårda go/no-go-regler. Disciplin över hopp.",
    description: "Systematisk tradingbot för Polymarket. Sätter och följer strikta regler för när man ska gå in och ut ur positioner — eliminerar emotionella beslut.",
    problem: "Förlorade pengar på Polymarket för att jag inte höll mig till planen. Ville tvinga mig att vara disciplinerad.",
    stack: ["Polymarket API", "Python", "Backtest", "Telegram"],
    status: "idea",
    projectUrl: "",
    upvoteCount: 9,
    commentCount: 3,
    authorUsername: "pelle",
    daysAgo: 45,
  },
  {
    slug: "runnr",
    title: "Runnr",
    tagline: "AI-löpcoach för vanliga människor som inte vill ha en PT-app.",
    description: "Genererar anpassade löpprogram baserade på din nuvarande kondition, tillgänglig tid och mål. Inga träningsjargonger — bara ett schema du faktiskt kan följa.",
    problem: "Alla träningsappar är designade för seriösa atleter. Ville ha något för oss som bara vill kunna springa 5k utan att dö.",
    stack: ["Claude", "React Native", "Firebase", "Vercel"],
    status: "testers",
    projectUrl: "",
    upvoteCount: 21,
    commentCount: 8,
    authorUsername: "nina",
    daysAgo: 7,
  },
];

async function ensureProjects() {
  console.log("\n── Skapar projekt ──");
  for (const p of PROJECTS) {
    const existing = await db.collection("projects").where("slug", "==", p.slug).limit(1).get();
    if (!existing.empty) {
      console.log(`  ⏭  Projekt finns: ${p.slug}`);
      continue;
    }
    const author = user(p.authorUsername);
    await db.collection("projects").add({
      userId: author.uid,
      userDisplayName: author.displayName,
      userAvatarUrl: author.avatarUrl,
      username: author.username,
      title: p.title,
      slug: p.slug,
      tagline: p.tagline,
      description: p.description,
      problem: p.problem,
      stack: p.stack,
      status: p.status,
      projectUrl: p.projectUrl,
      githubUrl: "",
      imageUrl: "",
      feedbackWanted: "",
      isFeatured: p.upvoteCount >= 20,
      upvoteCount: p.upvoteCount,
      commentCount: p.commentCount,
      createdAt: ts(p.daysAgo),
      updatedAt: ts(p.daysAgo),
    });
    console.log(`  ✅ Projekt: ${p.title}`);
  }
}

// ── Steg 4: Help-posts + svar ─────────────────────────────────────────────────

interface AnswerSeed {
  authorUsername: string;
  body: string;
  isAccepted: boolean;
  hoursAgo: number;
}

interface HelpSeed {
  slug: string;
  title: string;
  body: string;
  tryFix: string;
  tool: string;
  tags: string[];
  status: "open" | "solved";
  authorUsername: string;
  daysAgo: number;
  answers: AnswerSeed[];
}

const HELP_POSTS: HelpSeed[] = [
  {
    slug: "vercel-vagrar-deploya",
    title: "Vercel vägrar deploya efter Supabase-ändring",
    body: "Allt funkar lokalt men builden dör på env-variabler. Har kollat Vercel-loggen i tre timmar och förstår ingenting.",
    tryFix: "Kollat loggar, kört om deploy flera gånger. Ingenting verkar hjälpa.",
    tool: "Vercel",
    tags: ["Vercel", "Supabase"],
    status: "open",
    authorUsername: "linabygger",
    daysAgo: 2,
    answers: [
      {
        authorUsername: "christoffer",
        body: "Klassiker! Det är förmodligen för att Vercel inte har din env-variabel inlagd. Gå till Project Settings → Environment Variables och lägg till NEXT_PUBLIC_SUPABASE_URL där. Kom ihåg att välja rätt miljöer (Production + Preview).",
        isAccepted: false,
        hoursAgo: 20,
      },
      {
        authorUsername: "pelle",
        body: "Lägg till variabeln i Vercel och kör en ny deploy manuellt — Vercel plockar inte upp ny env-config utan det. Går snabbt via 'Redeploy' i dashboarden.",
        isAccepted: false,
        hoursAgo: 35,
      },
      {
        authorUsername: "nina",
        body: "Om NEXT_PUBLIC_-variabler saknas på Vercel är det ofta för att man lade till dem i .env.local (som inte pushas till git). Kontrollera att de finns i Vercel-dashboarden specifikt.",
        isAccepted: false,
        hoursAgo: 60,
      },
    ],
  },
  {
    slug: "claude-skrev-om-hela-layouten",
    title: "Claude skrev om hela layouten istället för en liten fix",
    body: "Bad om att fixa padding på en knapp, fick tillbaka en helt ny design med andra färger, grid och komponenter. Hur begränsar man Claude bättre?",
    tryFix: "Har provat att vara mer specifik i instruktioner men Claude fortsätter göra stora ändringar.",
    tool: "Claude",
    tags: ["Claude", "Claude Code"],
    status: "solved",
    authorUsername: "majawebb",
    daysAgo: 3,
    answers: [
      {
        authorUsername: "sarapromptar",
        body: "Hade exakt samma problem! Lägg alltid till: 'Jag ber dig bara ändra [specifik sak]. Rör INTE styling, layout eller andra komponenter. Visa mig BARA diff för de filer du ska ändra.' Fungerar nästan alltid.",
        isAccepted: true,
        hoursAgo: 30,
      },
      {
        authorUsername: "christoffer",
        body: "Det finns en prompt för exakt det här i prompts-sektionen — 'Bygg utan att förstöra designen'. Har räddat mig flera gånger. Klistra in den i början av varje Claude-session.",
        isAccepted: false,
        hoursAgo: 45,
      },
      {
        authorUsername: "jonasbygger",
        body: "Jag brukar dela upp stora ändringar i flera steg. 'Ändra bara padding på denna knapp. Ingenting annat.' Sedan ett nytt meddelande för nästa sak. Claude håller sig mer avgränsad då.",
        isAccepted: false,
        hoursAgo: 70,
      },
    ],
  },
  {
    slug: "rls-blockerar-mina-egna-rader",
    title: "Min RLS-policy blockerar mig från mina egna rader",
    body: "Satte upp Row Level Security i Supabase men nu får jag tomt svar även på rader jag själv äger. auth.uid() verkar matcha — vad missar jag?",
    tryFix: "Testat att inaktivera RLS och aktivera igen. Kollat att auth.uid() returnerar rätt värde i SQL-editorn.",
    tool: "Supabase",
    tags: ["Supabase"],
    status: "solved",
    authorUsername: "frida",
    daysAgo: 7,
    answers: [
      {
        authorUsername: "christoffer",
        body: "RLS-problem nr 1: du har troligen en policy för INSERT men inte för SELECT. I Supabase måste du skapa separata policies för varje operation. Gå till Authentication → Policies och lägg till en SELECT-policy: `(auth.uid() = user_id)`.",
        isAccepted: false,
        hoursAgo: 160,
      },
      {
        authorUsername: "jonasbygger",
        body: "Kontrollera att policy-typen är rätt. `FOR ALL` täcker SELECT, INSERT, UPDATE och DELETE men kan bete sig oväntat. Byt till explicita policies per operation — det är tydligare och enklare att debugga.",
        isAccepted: false,
        hoursAgo: 130,
      },
      {
        authorUsername: "frida",
        body: "Hittade det! Hade glömt att sätta user_id på raden vid INSERT — så auth.uid() matchade aldrig. Fixade INSERT-logiken och lade till en explicit SELECT-policy. Allt funkar nu, tack!",
        isAccepted: true,
        hoursAgo: 100,
      },
    ],
  },
  {
    slug: "vercel-build-funkar-lokalt",
    title: "Build failar på Vercel men funkar lokalt",
    body: "Allt kör perfekt på min dator, men Vercel kastar 'Module not found' vid deploy. Case-sensitivt filnamn? Saknad env-variabel? Helt vilse.",
    tryFix: "Rensat node_modules, kontrollerat import-paths och kört build lokalt igen. Allt fungerar bara inte på Vercel.",
    tool: "Vercel",
    tags: ["Vercel", "Next.js"],
    status: "solved",
    authorUsername: "oskar",
    daysAgo: 10,
    answers: [
      {
        authorUsername: "sarapromptar",
        body: "Vanligaste orsaken till 'Module not found' på Vercel men inte lokalt: case-sensitivity i filnamn. Mac-filsystemet är case-insensitive men Vercel kör på Linux. Kolla att import-sökvägen matchar exakt — `./button` vs `./Button` spelar roll.",
        isAccepted: false,
        hoursAgo: 230,
      },
      {
        authorUsername: "pelle",
        body: "En annan vanlig orsak: env-variabler som saknas på Vercel. Kolla att alla `.env.local`-variabler är inlagda i Vercel Dashboard → Settings → Environment Variables.",
        isAccepted: false,
        hoursAgo: 210,
      },
      {
        authorUsername: "oskar",
        body: "Löste det! Det var ett case-sensitivity-problem i ett import-alias i `tsconfig.json`. Hade `@/Components` men filen hette `components`. Bytte till lowercase och bygget passerade direkt.",
        isAccepted: true,
        hoursAgo: 180,
      },
    ],
  },
  {
    slug: "sessionen-forsvinner-vid-reload",
    title: "Inloggningen försvinner varje gång jag laddar om",
    body: "Firebase Auth loggar in fint, men vid reload är användaren utloggad igen. Något med persistence eller att jag läser state för tidigt?",
    tryFix: "Kollat att auth.currentUser inte är null precis efter login. Sessionen finns men försvinner vid nästa sidladdning.",
    tool: "Firebase",
    tags: ["Firebase", "Auth"],
    status: "open",
    authorUsername: "nina",
    daysAgo: 1,
    answers: [
      {
        authorUsername: "christoffer",
        body: "Firebase Auth är asynkront — du läser förmodligen `currentUser` innan SDK:n hunnit återställa sessionen. Lyssna på `onAuthStateChanged` istället för att läsa `auth.currentUser` direkt. Den callbacken anropas alltid, även vid reload.",
        isAccepted: false,
        hoursAgo: 10,
      },
      {
        authorUsername: "jonasbygger",
        body: "Kollad persistence-inställningen? Som standard är Firebase Auth `browserLocalStorage` vilket borde hålla sessionen. Men om du kör i inkognito-läge eller har cookies blockerade tappar du sessionen vid stängning.",
        isAccepted: false,
        hoursAgo: 25,
      },
      {
        authorUsername: "sarapromptar",
        body: "Ett annat tips: visa inte UI:t förrän `onAuthStateChanged` har kallats minst en gång — annars flashar du inloggad/utloggad. Lägg en `loading`-state som är `true` tills Firebase bekräftat session-status.",
        isAccepted: false,
        hoursAgo: 15,
      },
    ],
  },
  {
    slug: "diven-vill-inte-centreras",
    title: "Diven vägrar centreras hur jag än gör",
    body: "Flexbox, grid, margin auto — har testat allt. Den sitter envist till vänster. Lägger med min CSS, snälla säg vad jag gör för dumt.",
    tryFix: "Provat display:flex, justify-content:center, margin:auto, text-align:center. Inget funkar.",
    tool: "Annat",
    tags: ["CSS"],
    status: "open",
    authorUsername: "pelle",
    daysAgo: 4,
    answers: [
      {
        authorUsername: "majawebb",
        body: "Vanligaste problemet: föräldern har ingen `display: flex` eller saknar höjd. Flexbox centrerar bara barn om föräldern faktiskt tar upp plats. Lägg `flex justify-center items-center` på rätt element — inte på barnet.",
        isAccepted: false,
        hoursAgo: 90,
      },
      {
        authorUsername: "nina",
        body: "Är det horisontell eller vertikal centrering som inte funkar? `justify-content: center` är horisontell i `flex-row` (standard), men vertikal i `flex-column`. Och `align-items: center` är tvärtom. Blandas de ihop hamnar man snett.",
        isAccepted: false,
        hoursAgo: 70,
      },
      {
        authorUsername: "adamcodes",
        body: "Öppna DevTools och inspektera föräldern — se hur mycket plats den faktiskt tar. Ofta är det att man har `height: auto`, vilket gör att flex-containern är lika hög som innehållet. Prova `min-h-screen` på body eller main-elementet.",
        isAccepted: false,
        hoursAgo: 45,
      },
    ],
  },
  {
    slug: "claude-skrev-om-hela-filen",
    title: "Claude skrev om hela filen istället för en rad",
    body: "Bad om en liten fix, fick tillbaka en helt omskriven komponent där halva funktionaliteten försvann. Hur håller jag ändringarna små?",
    tryFix: "Provat att specificera exakt rad och funktion. Claude ignorerar det och gör om allt ändå.",
    tool: "Claude",
    tags: ["Claude", "Claude Code"],
    status: "solved",
    authorUsername: "sarapromptar",
    daysAgo: 12,
    answers: [
      {
        authorUsername: "jonasbygger",
        body: "Ge Claude mycket mindre kontext. Klipp ut bara den specifika funktionen du vill ändra istället för hela filen. Claude tenderar att 'städa upp' hela kontexten den ser.",
        isAccepted: false,
        hoursAgo: 270,
      },
      {
        authorUsername: "majawebb",
        body: "Lägg till i prompten: 'Visa bara diff-formatet för ändringarna du gör. Skriv inte om rader som inte förändras.' Det håller Claude fokuserat på det som faktiskt ska ändras.",
        isAccepted: false,
        hoursAgo: 250,
      },
      {
        authorUsername: "sarapromptar",
        body: "Kombinerade båda tipsen — gav Claude bara den specifika funktionen och bad om diff. Funkar perfekt nu. Tack!",
        isAccepted: true,
        hoursAgo: 220,
      },
    ],
  },
  {
    slug: "stripe-webhook-200-men-inget-hander",
    title: "Stripe-webhooken svarar 200 men inget händer",
    body: "Webhooken tar emot eventet och svarar 200, men min databas uppdateras aldrig. Test- vs live-nycklar? Fel event-typ? Beloppet i ören?",
    tryFix: "Kollat Stripe Dashboard → Webhooks → loggar. Eventet skickas och 200 tas emot. Databasen påverkas inte.",
    tool: "Stripe",
    tags: ["Stripe"],
    status: "open",
    authorUsername: "johan",
    daysAgo: 5,
    answers: [
      {
        authorUsername: "christoffer",
        body: "Kontrollera att du verifierar webhook-signaturen rätt. Om du läser `request.body` som JSON *innan* du kallar `stripe.webhooks.constructEvent()` får du verifieringsfel. Body måste vara rå buffer/string.",
        isAccepted: false,
        hoursAgo: 110,
      },
      {
        authorUsername: "adamcodes",
        body: "Dubbelkolla vilka event-typer du faktiskt lyssnar på. I Stripe Dashboard → Webhooks → din endpoint ser du exakt vad som skickas. Om du lyssnar på `payment_intent.succeeded` men datan kräver `checkout.session.completed` händer ingenting.",
        isAccepted: false,
        hoursAgo: 90,
      },
      {
        authorUsername: "oskar",
        body: "Next.js 13+ kräver `export const config = { api: { bodyParser: false } }` i webhook-route-filen. Annars parsar Next JSON åt dig och signaturen stämmer aldrig.",
        isAccepted: false,
        hoursAgo: 70,
      },
    ],
  },
];

async function ensureHelpPosts() {
  console.log("\n── Skapar help-posts ──");
  for (const h of HELP_POSTS) {
    const existing = await db.collection("posts").where("slug", "==", h.slug).limit(1).get();
    if (!existing.empty) {
      console.log(`  ⏭  Help-post finns: ${h.slug}`);
      continue;
    }

    const author = user(h.authorUsername);
    const acceptedAnswer = h.answers.find((a) => a.isAccepted);

    const postRef = db.collection("posts").doc();
    await postRef.set({
      userId: author.uid,
      userDisplayName: author.displayName,
      userAvatarUrl: author.avatarUrl,
      username: author.username,
      type: "help",
      title: h.title,
      slug: h.slug,
      body: h.body,
      tryFix: h.tryFix,
      alreadyTried: null,
      projectUrl: null,
      tool: h.tool,
      tags: h.tags,
      status: h.status,
      isFeatured: false,
      acceptedCommentId: null,
      upvoteCount: 0,
      commentCount: h.answers.length,
      createdAt: ts(h.daysAgo),
      updatedAt: ts(h.daysAgo),
    });

    // Svar (sub-collection)
    let acceptedCommentId: string | null = null;
    for (const a of h.answers) {
      const answerAuthor = user(a.authorUsername);
      const commentRef = postRef.collection("comments").doc();
      await commentRef.set({
        userId: answerAuthor.uid,
        userDisplayName: answerAuthor.displayName,
        userAvatarUrl: answerAuthor.avatarUrl,
        username: answerAuthor.username,
        postId: postRef.id,
        projectId: null,
        parentId: null,
        body: a.body,
        isAccepted: a.isAccepted,
        createdAt: ts(h.daysAgo - a.hoursAgo / 24),
        updatedAt: ts(h.daysAgo - a.hoursAgo / 24),
      });
      if (a.isAccepted) acceptedCommentId = commentRef.id;
    }

    // Uppdatera med acceptedCommentId om det finns
    if (acceptedAnswer && acceptedCommentId) {
      await postRef.update({ acceptedCommentId });
    }

    console.log(`  ✅ Help-post: ${h.slug} (${h.answers.length} svar)`);
  }
}

// ── Steg 4b: Saknade svar på befintliga help-posts ────────────────────────────

async function ensureMissingAnswers() {
  console.log("\n── Lägger till saknade svar på befintliga help-posts ──");
  for (const h of HELP_POSTS) {
    if (h.answers.length === 0) continue;

    const postSnap = await db.collection("posts").where("slug", "==", h.slug).limit(1).get();
    if (postSnap.empty) {
      console.log(`  ⚠️  Post inte funnen: ${h.slug}`);
      continue;
    }
    const postDoc = postSnap.docs[0];
    const commentsRef = postDoc.ref.collection("comments");
    const existing = await commentsRef.limit(1).get();
    if (!existing.empty) {
      console.log(`  ⏭  Svar finns redan: ${h.slug}`);
      continue;
    }

    const acceptedAnswer = h.answers.find((a) => a.isAccepted);
    let acceptedCommentId: string | null = null;

    for (const a of h.answers) {
      const answerAuthor = user(a.authorUsername);
      const commentRef = commentsRef.doc();
      await commentRef.set({
        userId: answerAuthor.uid,
        userDisplayName: answerAuthor.displayName,
        userAvatarUrl: answerAuthor.avatarUrl,
        username: answerAuthor.username,
        postId: postDoc.id,
        projectId: null,
        parentId: null,
        body: a.body,
        isAccepted: a.isAccepted,
        createdAt: ts(h.daysAgo - a.hoursAgo / 24),
        updatedAt: ts(h.daysAgo - a.hoursAgo / 24),
      });
      if (a.isAccepted) acceptedCommentId = commentRef.id;
    }

    const updateData: Record<string, unknown> = {
      commentCount: h.answers.length,
      status: h.status,
    };
    if (acceptedAnswer && acceptedCommentId) {
      updateData.acceptedCommentId = acceptedCommentId;
    }
    await postDoc.ref.update(updateData);
    console.log(`  ✅ Lade till ${h.answers.length} svar: ${h.slug}`);
  }
}

// ── Steg 4c: Projekt-kommentarer ─────────────────────────────────────────────

interface ProjectCommentSeed {
  projectSlug: string;
  comments: { authorUsername: string; body: string; hoursAgo: number }[];
}

const PROJECT_COMMENTS: ProjectCommentSeed[] = [
  {
    projectSlug: "smartbok-se",
    comments: [
      { authorUsername: "linabygger", body: "Snyggt upplägg! Hur löser du OCR-biten för kvittona — kör du något tredjepartsbibliotek eller ren Claude?", hoursAgo: 300 },
      { authorUsername: "adamcodes", body: "Sitter med liknande utmaning för kvittoskanningar. Vilket OCR-API valde du till slut?", hoursAgo: 250 },
      { authorUsername: "jonasbygger", body: "Behövs verkligen i Sverige — Fortnox är en mardröm för enskilda firmor. Kör du Bokio-integration eller eget system?", hoursAgo: 200 },
    ],
  },
  {
    projectSlug: "aikostnad-se",
    comments: [
      { authorUsername: "sarapromptar", body: "Exakt verktyget jag saknat. Kom ihåg att räkna in context-window-priset — det skenar fort om man kör långa konversationer.", hoursAgo: 180 },
      { authorUsername: "christoffer", body: "Kanon! Kör du live-data från respektive modell-API eller hårdkodade priser som uppdateras manuellt?", hoursAgo: 150 },
      { authorUsername: "nina", body: "Lade till ditt verktyg i min bokmärkesmapp direkt. Sparade mig en halv timme med Excel.", hoursAgo: 100 },
    ],
  },
  {
    projectSlug: "need-radar",
    comments: [
      { authorUsername: "pelle", body: "Intressant idé. Reddit-API:et är ganska begränsat utan betald plan — har du kollat PushShift eller ett scrapers-baserat alternativ?", hoursAgo: 480 },
      { authorUsername: "majawebb", body: "Hur hanterar du duplicerade trådar och cross-postning? Det verkar vara den svåraste biten.", hoursAgo: 420 },
      { authorUsername: "linabygger", body: "Har du testat Hacker News Algolia-API:et också? Mer teknisk crowd men riktigt bra signal på vad devs saknar.", hoursAgo: 360 },
    ],
  },
  {
    projectSlug: "menupilot-se",
    comments: [
      { authorUsername: "frida", body: "Precis det här min familj behöver! Kan man utesluta ingredienser man inte vill ha, t.ex. lök?", hoursAgo: 220 },
      { authorUsername: "christoffer", body: "Matrestor-idén är briljant. Hur mycket context skickar du med — hela kylen eller de 5 vanligaste ingredienserna?", hoursAgo: 200 },
      { authorUsername: "nina", body: "Har testat och det fungerar bra! Saknar bara möjlighet att spara favoritmenyer mellan sessioner.", hoursAgo: 160 },
    ],
  },
  {
    projectSlug: "amazon-snipe",
    comments: [
      { authorUsername: "oskar", body: "Keepa-API:et är bra val. Har du stött på rate-limiting eller blockering från Amazon?", hoursAgo: 700 },
      { authorUsername: "pelle", body: "Vilken Telegram-bot-lib kör du — python-telegram-bot eller aiogram? Aiogram är async och hanterar hög last bättre.", hoursAgo: 650 },
      { authorUsername: "adamcodes", body: "Snyggt projekt! Hur definierar du ett 'prisfel' — procent under historiskt snitt, eller något mer sofistikerat?", hoursAgo: 600 },
    ],
  },
  {
    projectSlug: "btc-edge",
    comments: [
      { authorUsername: "johan", body: "Go/no-go-regler låter rätt. Vilka signals triggar en 'go' — Kelly-kriteriet eller något eget?", hoursAgo: 1000 },
      { authorUsername: "oskar", body: "Polymarket-API är ganska nytt. Hur stabil har du upplevt den under hög trading-aktivitet?", hoursAgo: 900 },
      { authorUsername: "sarapromptar", body: "'Disciplin > hopp' är det bästa mottot för trading-botar. Imponerad av att du faktiskt byggt ett verktyg mot ditt eget beteende.", hoursAgo: 800 },
    ],
  },
  {
    projectSlug: "runnr",
    comments: [
      { authorUsername: "frida", body: "Äntligen en löpapp som inte förutsätter att man redan springer 4 gånger i veckan! Finns det en iOS-build att testa?", hoursAgo: 160 },
      { authorUsername: "majawebb", body: "React Native + Firebase är en riktigt bra kombination för just detta. Bra teknologival.", hoursAgo: 120 },
      { authorUsername: "linabygger", body: "Testade via länken — träningsplanen kändes faktiskt realistisk för en nybörjare. Bra jobbat.", hoursAgo: 80 },
    ],
  },
];

async function ensureProjectComments() {
  console.log("\n── Skapar projekt-kommentarer ──");
  for (const pc of PROJECT_COMMENTS) {
    // Hitta projektet
    const projectSnap = await db.collection("projects").where("slug", "==", pc.projectSlug).limit(1).get();
    if (projectSnap.empty) {
      console.log(`  ⚠️  Projekt inte hittat: ${pc.projectSlug}`);
      continue;
    }
    const projectDoc = projectSnap.docs[0];
    const commentsRef = projectDoc.ref.collection("comments");

    // Kolla om kommentarer redan finns
    const existing = await commentsRef.limit(1).get();
    if (!existing.empty) {
      console.log(`  ⏭  Kommentarer finns redan: ${pc.projectSlug}`);
      continue;
    }

    for (const c of pc.comments) {
      const author = user(c.authorUsername);
      await commentsRef.add({
        userId: author.uid,
        userDisplayName: author.displayName,
        userAvatarUrl: author.avatarUrl,
        username: author.username,
        projectId: projectDoc.id,
        postId: null,
        parentId: null,
        body: c.body,
        createdAt: ts(c.hoursAgo / 24),
        updatedAt: ts(c.hoursAgo / 24),
      });
    }

    // Uppdatera commentCount till faktiskt antal
    await projectDoc.ref.update({ commentCount: pc.comments.length });
    console.log(`  ✅ Kommentarer: ${pc.projectSlug} (${pc.comments.length} st)`);
  }
}

const EXTRA_PROJECT_COMMENTS: ProjectCommentSeed[] = [
  {
    projectSlug: "smartbok-se",
    comments: [
      { authorUsername: "nina", body: "Kör du server-side rendering för kvittodatan? Undrar hur du hanterar GDPR när kvittofoton lagras — lagrar du dem permanent eller raderar du efter analys?", hoursAgo: 170 },
      { authorUsername: "frida", body: "Möjlighet att exportera till SIE-format (för Bokio/Fortnox) vore guld värt för mig.", hoursAgo: 140 },
      { authorUsername: "pelle", body: "Imponerande MVP! Fungerar det med kvitton som inte är på svenska, t.ex. från utländska restauranger?", hoursAgo: 90 },
    ],
  },
  {
    projectSlug: "aikostnad-se",
    comments: [
      { authorUsername: "linabygger", body: "Lade till ett bokmärke direkt. Har du tänkt på att lägga till en 'dela kostnad'-funktion för team — typ räkna ut total API-kostnad för hela teamet?", hoursAgo: 80 },
      { authorUsername: "jonasbygger", body: "Har du räknat in embeddings-kostnader? De glöms ofta bort men kan bli en stor del om man kör stora datamängder.", hoursAgo: 70 },
      { authorUsername: "pelle", body: "Claude 3.5 Haiku är faktiskt billigare via batch-API om man inte behöver realtidssvar. Kan vara värt att ha med som alternativ.", hoursAgo: 50 },
      { authorUsername: "majawebb", body: "Ändrade direkt hur mycket jag kör streaming-svar efter att ha sett kostnaderna. Bra verktyg!", hoursAgo: 30 },
    ],
  },
  {
    projectSlug: "need-radar",
    comments: [
      { authorUsername: "oskar", body: "Kör du LLM för att ranka problemen eller rule-based? Gissar att LLM ger mer nyanserade träffar men kostar mer per körning.", hoursAgo: 300 },
    ],
  },
  {
    projectSlug: "menupilot-se",
    comments: [
      { authorUsername: "pelle", body: "Hur hanterar du portionsstorlekar och kalorier? Det verkar vara nästa naturliga steg om du vill nå en bredare publik.", hoursAgo: 140 },
      { authorUsername: "sarapromptar", body: "Imponerades av hur väl AI:n hanterade halvtomma kylskåp. Vilket prompt-upplägg kör du för ingrediens-till-meny-steget?", hoursAgo: 120 },
      { authorUsername: "jonasbygger", body: "Har du sett om folk återvänder eller är det mest one-shot-användning? Undrar om problemet löser sig med lite gamification.", hoursAgo: 100 },
      { authorUsername: "linabygger", body: "Smart! Önskelistan: kom ihåg vilka rätter vi gillat och föreslå dem oftare nästa vecka.", hoursAgo: 80 },
      { authorUsername: "oskar", body: "Bra idé och clean execution. Funderar på att bygga något liknande för lunchförslag på jobbet.", hoursAgo: 50 },
    ],
  },
  {
    projectSlug: "amazon-snipe",
    comments: [
      { authorUsername: "majawebb", body: "Kul projekt! Har du funderat på att utvidga till andra marknadsplatser, typ Prisjakt eller PriceRunner?", hoursAgo: 560 },
      { authorUsername: "nina", body: "Hur lång är din historik-baseline för att avgöra om ett pris är 'avvikande'? En vecka? En månad?", hoursAgo: 520 },
      { authorUsername: "frida", body: "Telegram-notiserna är en bra idé — push utan app. Kör du bot eller channel för utskicken?", hoursAgo: 480 },
      { authorUsername: "linabygger", body: "Hur filtrerar du bort sponsrade produkter och Amazon Basics-varor med konstgjorda 'ordinarie priser'?", hoursAgo: 440 },
      { authorUsername: "christoffer", body: "Keepa-datan är guld. Kör du historiska prisgraferna för att identifiera manufactured MSRP?", hoursAgo: 400 },
      { authorUsername: "jonasbygger", body: "Solid idé. En naturlig expansion vore att mejla en daglig digest istället för individuella notiser per träff.", hoursAgo: 360 },
    ],
  },
  {
    projectSlug: "runnr",
    comments: [
      { authorUsername: "adamcodes", body: "Hur hanterar du progression — ökar programmet automatiskt svårighetsgraden baserat på historik, eller kör du statiska scheman?", hoursAgo: 60 },
      { authorUsername: "sarapromptar", body: "Har en kompis som precis börjat träna och skickade länken till henne. Precis rätt nivå för nybörjare.", hoursAgo: 50 },
      { authorUsername: "christoffer", body: "React Native + Firebase är ett bra val för detta. Planerar du att köra server-side schema-generering eller allt client-side?", hoursAgo: 45 },
      { authorUsername: "oskar", body: "Är AI-coachen proaktiv (påminner dig om du skippar ett pass) eller reaktiv (svarar bara på frågor)?", hoursAgo: 35 },
      { authorUsername: "pelle", body: "Ren och enkel. Den enda träningsappen jag faktiskt känt lust att testa på länge.", hoursAgo: 20 },
    ],
  },
];

async function ensureExtraProjectComments() {
  console.log("\n── Lägger till extra projekt-kommentarer ──");
  for (const ec of EXTRA_PROJECT_COMMENTS) {
    const projectSnap = await db.collection("projects").where("slug", "==", ec.projectSlug).limit(1).get();
    if (projectSnap.empty) {
      console.log(`  ⚠️  Projekt inte hittat: ${ec.projectSlug}`);
      continue;
    }
    const projectDoc = projectSnap.docs[0];
    const commentsRef = projectDoc.ref.collection("comments");

    let added = 0;
    for (const c of ec.comments) {
      const dup = await commentsRef.where("body", "==", c.body).limit(1).get();
      if (!dup.empty) continue;

      const author = user(c.authorUsername);
      await commentsRef.add({
        userId: author.uid,
        userDisplayName: author.displayName,
        userAvatarUrl: author.avatarUrl,
        username: author.username,
        projectId: projectDoc.id,
        postId: null,
        parentId: null,
        body: c.body,
        createdAt: ts(c.hoursAgo / 24),
        updatedAt: ts(c.hoursAgo / 24),
      });
      added++;
    }

    if (added > 0) {
      const allComments = await commentsRef.get();
      await projectDoc.ref.update({ commentCount: allComments.size });
      console.log(`  ✅ Lade till ${added} kommentarer: ${ec.projectSlug}`);
    } else {
      console.log(`  ⏭  Kommentarer finns redan: ${ec.projectSlug}`);
    }
  }
}

// ── Steg 5: Prompts ───────────────────────────────────────────────────────────

interface PromptSeed {
  slug: string;
  title: string;
  body: string;
  tool: string;
  badge: string;
  authorUsername: string | null;
  daysAgo: number;
}

const PROMPTS: PromptSeed[] = [
  {
    slug: "stopp-claude-designen",
    title: "Bygg utan att förstöra designen",
    body: "Innan du ändrar något: lista exakt vilka filer och rader du tänker röra och varför. Rör inte styling, layout eller befintliga komponenter som inte är del av uppgiften. Gör minsta möjliga ändring.",
    tool: "Claude Code",
    badge: "Räddar frontend",
    authorUsername: "sarapromptar",
    daysAgo: 20,
  },
  {
    slug: "debugga-forst-koda-sen",
    title: "Debugga först, koda sen",
    body: "Skriv ingen kod än. Förklara först vad som faktiskt orsakar felet, hur du vet det, och vilka 2 alternativa lösningar som finns. Vänta på mitt godkännande innan du ändrar något.",
    tool: "Cursor",
    badge: "Stoppar panikfixar",
    authorUsername: "christoffer",
    daysAgo: 25,
  },
  {
    slug: "forklara-felet-nybörjare",
    title: "Förklara felet som om jag är ny",
    body: "Förklara det här felmeddelandet som om jag precis börjat koda. Vad betyder det på vanlig svenska, varför händer det, och vad gör jag steg för steg för att fixa det?",
    tool: "ChatGPT",
    badge: "Nybörjarvänlig",
    authorUsername: "linabygger",
    daysAgo: 18,
  },
  {
    slug: "supabase-rls-steg-for-steg",
    title: "Skapa Supabase RLS steg för steg",
    body: "Skriv Row Level Security-policies för den här tabellen så att användare bara kan läsa och ändra sina egna rader. Förklara varje policy med en kommentar och visa hur jag testar att de funkar.",
    tool: "Supabase",
    badge: "RLS-terapi",
    authorUsername: "jonasbygger",
    daysAgo: 30,
  },
];

async function ensurePrompts() {
  console.log("\n── Skapar prompts ──");
  for (const p of PROMPTS) {
    const existing = await db.collection("posts").where("slug", "==", p.slug).limit(1).get();
    if (!existing.empty) {
      console.log(`  ⏭  Prompt finns: ${p.slug}`);
      continue;
    }
    const author = p.authorUsername ? user(p.authorUsername) : null;
    await db.collection("posts").add({
      userId: author?.uid ?? "system",
      userDisplayName: author?.displayName ?? "AIbyggare",
      userAvatarUrl: author?.avatarUrl ?? "",
      username: author?.username ?? "aibyggare",
      type: "prompt",
      title: p.title,
      slug: p.slug,
      body: p.body,
      tool: p.tool,
      tags: [p.badge],
      status: "open",
      isFeatured: false,
      acceptedCommentId: null,
      upvoteCount: 0,
      commentCount: 0,
      createdAt: ts(p.daysAgo),
      updatedAt: ts(p.daysAgo),
    });
    console.log(`  ✅ Prompt: ${p.title}`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Startar seed av AIbyggare.se Firebase-data...");
  await ensureAuthUsers();
  await ensureProfiles();
  await ensureProjects();
  await ensureProjectComments();
  await ensureExtraProjectComments();
  await ensureHelpPosts();
  await ensureMissingAnswers();
  await ensurePrompts();
  console.log("\n🎉 Seed klar! All data är nu i Firebase.");
}

main().catch((err) => {
  console.error("Fel vid seeding:", err);
  process.exit(1);
});
