# AIbyggare.se — Projektplan

> ⚠️ **STOP — LÄS DETTA FÖRST**
> Så fort du börjar arbeta i detta projekt innehar du en specifik roll som du ska leva efter.
> **Läs `CLAUDE.md` innan du fortsätter. Den gäller alltid. Inga undantag.**

> Sveriges community för dig som bygger appar, webbsidor och digitala produkter med AI.

---

## Vision och positionering

**Tagline:** Bygg med AI. Visa upp. Få hjälp.

**Kärnproblem:** Alla svenska AI-byggare är utspridda över Facebookgrupper, Discord-servrar, Reddit, SweClockers och verktygsspecifika forum. Det finns ingen samlingsplats.

**Målgrupp:** Vibe coders, nybörjare, indie hackers, självlärda byggare, småföretagare, kreatörer och utvecklare som använder AI i sitt arbetsflöde. Gemensamt: de vill gå från idé till MVP och de använder verktyg som Claude Code, Cursor, Lovable, Bolt, Replit, Supabase, Vercel, GitHub och ChatGPT.

**Ton:** Nybörjarvänlig, praktisk, prestigelös, lösningsfokuserad. Varm men inte barnslig.

**Grundfilosofi:** "Det är okej att vara ny. Det är inte okej att vara passiv. Visa vad du försökt, så hjälper communityn dig vidare."

---

## Designsystem

### Färgpalett

| Variabel | Ljust läge | Mörkt läge |
|----------|-----------|------------|
| Bakgrund primär | `#F7F5EF` | `#11130F` |
| Bakgrund alt | `#EFECE3` | `#191C16` |
| Kort/yta | `#FFFFFF` | `#191C16` |
| Text primär | `#151515` | `#F4F1E8` |
| Text sekundär | `#5F625D` | `#B7B2A4` |
| Border | `#DED9CC` | `#2A2E25` |
| Accent grön | `#A7C957` | `#B7E063` |
| Hover grön | `#8FB339` | — |
| Mörk grön | `#386641` | — |
| Varm orange | `#E79D45` | — |
| Blågrå | `#6B8F9C` | — |
| Sand | `#D8C3A5` | — |

Använd färg sparsamt. Whitespace och typografi ska bära designen.

### Typografi
- **Rubriker:** Geist eller Satoshi
- **Brödtext:** Inter eller Geist Sans
- **Kod/taggar:** Geist Mono eller JetBrains Mono

### Designprinciper
1. **Calm design** — visa bara det viktigaste. Göm avancerat tills det behövs.
2. **Community först** — människor, projekt och frågor är hjärtat. Inte marknadstexter.
3. **Tydlig hierarki** — användaren ska direkt förstå vad ett projekt, en fråga och en prompt är.
4. **Levande men kontrollerad** — subtila mikro­animationer, mjuka kort, tydliga taggar, fin spacing.
5. **Mobile first** — många kommer från mobil via sociala medier.

### Undvik
- Blå/lila gradients
- Generiska robotikoner eller "AI brain"-ikoner
- Stockbilder
- Glow-effekter och överdrivet glassmorphism
- Corporate-känsla och generisk SaaS-layout

### Visuella detaljer att använda
- Subtil bakgrundsgrid på hero
- Verktygs-badges: Claude Code, Cursor, Lovable, Bolt, Supabase, Vercel, React, Next.js, Stripe
- Status-pill för projekt: `Idé` · `MVP` · `Live` · `Söker feedback` · `Behöver testare` · `Söker medgrundare`
- Runda kort med tydliga borders och diskreta skuggor
- Microinteractions vid hover

---

## Teknisk stack

| Lager | Val |
|-------|-----|
| Framework | Next.js App Router |
| Språk | TypeScript |
| Styling | Tailwind CSS |
| Komponenter | shadcn/ui (kraftigt anpassad) |
| Databas | Firebase Firestore (NoSQL) |
| Auth | Firebase Auth (Google + GitHub) |
| Storage | Firebase Storage |
| Backend-säkerhet | Firebase Admin SDK (server-side) |
| Security Rules | Firestore Security Rules + Storage Rules |
| Hosting | Vercel |
| Formulär | React Hook Form + Zod |
| Datahämtning | TanStack Query (vid behov) |
| Animationer | Framer Motion (enbart subtilt) |
| Ikoner | Lucide (sparsamt) |
| Markdown | react-markdown eller MDX |

**Beslut 2026-06-22:** Firebase valdes framför Supabase. Hela stacken är Google Firebase — ingen Supabase-kod ska finnas i projektet.

**Princip:** Undvik överkomplexitet. Bygg robust och läsbart.

**Aktiva skydd (kvar för säkerhets skull):**
- `serverExternalPackages: ["firebase-admin"]` i `next.config.ts` (buntar inte admin-SDK:n)
- `"engines": { "node": ">=22" }` i `package.json` — kräver Node.js 22 som stöder `require(esm)`

---

## Kodbasstruktur

```
/src
  /app
    /(marketing)
      page.tsx              ← Startsida
      about/page.tsx
    /(auth)
      login/page.tsx
      register/page.tsx
    /(app)
      projects/page.tsx
      projects/new/page.tsx
      projects/[slug]/page.tsx
      onboarding/page.tsx      ← profilsetup: avatar, username, e-post, bio, verktyg
      welcome/page.tsx         ← välkomstguide (5 feature-kort + action prompt)
      help/page.tsx            ← redirect → /problemhornan
      help/new/page.tsx        ← redirect → /problemhornan/new
      help/[slug]/page.tsx     ← redirect → /problemhornan/[slug]
      problemhornan/page.tsx
      problemhornan/new/page.tsx
      problemhornan/[slug]/page.tsx
      prompts/page.tsx
      prompts/new/page.tsx
      prompts/[slug]/page.tsx
      profile/[username]/page.tsx
      settings/page.tsx
      admin/page.tsx
  /components
    /ui
    /layout
    /cards
    /forms
    /comments
    /votes
    /profile
    /home
  /lib
    /firebase          ← client.ts, admin.ts, auth.ts, storage.ts
    /utils
    /validation
    /auth
    /constants
  /types
  /styles
  /hooks
  /server
```

---

## Databasmodell (Firebase Firestore)

Firestore är NoSQL — data lagras i collections med documents. Inga SQL-tabeller, inga JOINs.
Relationer hanteras via document-referenser (path-strängar) eller denormalisering.

### Collection: `users/{uid}`
```
uid             string (= Firebase Auth UID)
username        string (unique — enforced via Cloud Function eller transaktion)
displayName     string
bio             string
avatarUrl       string
websiteUrl      string
githubUrl       string
linkedinUrl     string
tools           string[]
role            string    // 'user' | 'admin'
createdAt       Timestamp
updatedAt       Timestamp
```

### Collection: `projects/{projectId}`
```
id              string (auto-id)
userId          string (ref → users/{uid})
userDisplayName string (denormaliserat för visning utan extra fetch)
userAvatarUrl   string (denormaliserat)
title           string
slug            string (unique — enforced server-side)
tagline         string
description     string
problem         string
stack           string[]
status          string    // 'idea' | 'mvp' | 'live' | 'feedback' | 'testers' | 'cofounder'
projectUrl      string
githubUrl       string
imageUrl        string
feedbackWanted  string
isFeatured      boolean
voteCount       number    // denormaliserat räknare (atomic increment)
commentCount    number    // denormaliserat räknare
createdAt       Timestamp
updatedAt       Timestamp
```

### Collection: `posts/{postId}`
Används för hjälpfrågor, prompts, guider och diskussioner.
```
id                  string (auto-id)
userId              string
userDisplayName     string (denormaliserat)
userAvatarUrl       string (denormaliserat)
type                string    // 'help' | 'prompt' | 'guide' | 'discussion'
title               string
slug                string
body                string
tool                string
status              string    // 'open' | 'solved' | 'archived'
tags                string[]
isFeatured          boolean
acceptedCommentId   string | null
voteCount           number
commentCount        number
createdAt           Timestamp
updatedAt           Timestamp
```

### Sub-collection: `projects/{projectId}/comments/{commentId}`
### Sub-collection: `posts/{postId}/comments/{commentId}`
```
id          string (auto-id)
userId      string
userDisplayName string (denormaliserat)
userAvatarUrl   string (denormaliserat)
body        string
parentId    string | null    // för nästlade svar
isAccepted  boolean
createdAt   Timestamp
updatedAt   Timestamp
```

### Collection: `votes/{userId_targetId}`
Document-ID = `{userId}_{projectId}` eller `{userId}_{postId}` — garanterar en röst per användare.
```
userId      string
targetId    string
targetType  string    // 'project' | 'post' | 'comment'
createdAt   Timestamp
```

### Collection: `bookmarks/{userId_targetId}`
```
userId      string
targetId    string
targetType  string    // 'project' | 'post'
createdAt   Timestamp
```

### Collection: `reports/{reportId}`
```
reporterId  string
targetId    string
targetType  string    // 'project' | 'post' | 'comment'
reason      string
status      string    // 'open' | 'resolved'
createdAt   Timestamp
```

---

## Firebase Security Rules

Firestore Rules och Storage Rules ersätter Supabase RLS. Reglerna sätts i `firestore.rules` och `storage.rules`.

**Grundprinciper:**
- Alla kan **läsa** publicerade projekt, posts, kommentarer och profiler.
- Endast inloggade (`request.auth != null`) kan **skapa** projekt, posts, kommentarer, votes, bookmarks.
- Användare kan bara **uppdatera/radera** dokument där `userId == request.auth.uid`.
- Admin-operationer (moderering, featured) görs via Firebase Admin SDK i Next.js API routes — aldrig direkt från klienten.
- Storage: inloggad användare kan ladda upp till `images/{uid}/...` — publik läsning.
- Alla skrivoperationer valideras även server-side med Zod innan de når Firestore.

---

## Auth och onboarding

**Loginmetoder:** Google, GitHub

**Flöde efter första login:**
1. Firebase Auth hanterar inloggning (redirect-baserat OAuth, first-party cookie).
2. `getRedirectResult` + `onIdTokenChanged` detekterar ny användare — kontrollerar om `profiles/{uid}` finns och om `username` är satt.
3. Om profil saknas eller `username` är tomt → redirect till `/onboarding`.
4. `/onboarding` samlar in: avatar (tjej/neutral/kille), username, visningsnamn, e-post (readonly/privat), bio (valfri), verktyg (valfria). Sparas i `profiles/{uid}`.
5. Redirect till `/welcome` — en välkomstguide med 5 staplade feature-kort (Framer Motion, kortlek-animation). Avslutas med "Vad vill du göra nu?"-prompt: Lägg upp bygge / Jag har fastnat / Stäng.
6. `/welcome` är skyddad av middleware (kräver inloggning).

**Kommentarsspärr:** Inloggad utan `username` (onboarding ej klar) ser "Slutför din profil"-uppmaning istället för kommentarsformulär i `CommentSection` och `HelpCommentSection`.

**Avatarer:** Tre illustrerade alternativ — `avatar-female.png`, `avatar-neutral.png`, `avatar-male.png` (160×160px, ~40KB styck). Väljs i onboarding och settings.

---

## Navigationsstruktur

**Primär navigation:**
`Byggen` · `Problemhörnan` · `Prompts` · `Guider` · `Community` · `[Lägg upp]`

**Sekundär/profil:**
`Min profil` · `Mina projekt` · `Sparat` · `Inställningar` · `Logga ut`

---

## Startsida — sektioner och copy

### Hero
**Rubrik:** Bygg med AI. Visa upp. Få hjälp.
**Underrubrik:** AIbyggare.se är Sveriges community för dig som bygger appar, webbsidor och digitala produkter med AI.
**CTA:** `Lägg upp ditt bygge` / `Be om hjälp`
**Liten text:** För dig som använder Claude Code, Cursor, Lovable, Bolt, Replit, Supabase, Vercel, ChatGPT och andra AI-verktyg.
**Bakgrund:** Subtil grid, inga stockbilder, exempel på projektkort och verktygs-badges.

### Sektioner på startsidan
1. Senaste byggen
2. Hjälpfrågor som behöver svar
3. Populära prompts
4. Veckans bygge
5. Så fungerar det (4 steg)
6. Gå med i communityn
7. Footer

### Så fungerar det — copy
1. **Visa vad du bygger** — Lägg upp ditt projekt, berätta vad du använder och vad du vill ha feedback på.
2. **Få hjälp när du fastnar** — Ställ tydliga frågor och få svar från andra som bygger.
3. **Dela prompts och lärdomar** — Spara tid för andra genom att dela prompts, guider och workflows.
4. **Följ andra byggare** — Hitta människor som bygger liknande saker och följ deras resa.

---

## Komponenter — kravspec

### Projektkort
- Screenshot / genererad placeholder
- Titel + tagline
- Status-pill
- Stack/taggar (verktygs-badges)
- Upvote-räknare + kommentar-räknare
- Skapare + datum
- Indikator om projektet söker feedback
- Rent hover, mobilanpassat, klickbart

### Hjälpfrågekort
- Titel + kort utdrag
- Verktyg + taggar
- Status-pill: `Öppen` / `Löst`
- Antal svar
- Senast aktiv + skapare
- Filter: Alla · Obesvarade · Löst · Claude Code · Supabase · Vercel · Lovable · Cursor · Bolt · Stripe

### Promptkort
- Titel + verktyg + kategori
- Kort beskrivning
- Antal sparningar
- Kopiera-knapp (en-klick)
- Skapare

### Prompt-detaljsida
- Beskrivning
- Prompttext i snygg kodruta
- Kopiera-knapp
- "När ska den användas"
- Exempeloutput
- Kommentarer

### Profil
- Avatar, namn, username, bio
- Verktyg (badges)
- Externa länkar
- Projekt, prompts, hjälpfrågor (tabbar)
- Badges (MVP, statiska i fas 1):
  - Första bygget · Hjälpt någon · Delat prompt · Fått 10 upvotes · Projekt live

---

## Empty states — copy

| Situation | Text |
|-----------|------|
| Inga projekt | "Det är tomt här än så länge. Bli först med att visa vad du bygger." |
| Inga hjälpfrågor | "Inga öppna frågor just nu. Har du fastnat? Ställ första frågan." |
| Ej inloggad försöker kommentera | "Logga in för att svara och hjälpa andra byggare." |
| Inloggad utan profil (username saknas) | "Slutför din profil för att kommentera — det tar mindre än en minut." (länk till /onboarding) |
| Projekt publicerat | "Snyggt. Ditt bygge är live på AIbyggare." |

---

## Seed-innehåll (mockdata fas 1)

### Exempelprojekt
1. **Smartbok.se** — AI-bokföringsassistent för enskild firma
2. **AIkostnad.se** — Kalkylator för att förstå AI-kostnader
3. **Need Radar** — AI som hittar marknadsmöjligheter dagligen
4. **Amazon Snipe** — Automatisk scanner för prisfel
5. **BTC Edge** — Algoritmisk tradingidé för Polymarket
6. **Runnr** — AI-löpcoach

### Exempelhjälpfrågor
- "Hur kopplar jag Supabase Auth till Next.js?"
- "Varför misslyckas min Vercel deploy?"
- "Hur får jag Claude Code att inte skriva om hela designen?"
- "Hur strukturerar jag databasen för projekt och kommentarer?"
- "Hur gör jag en säker RLS-policy i Supabase?"

### Exempelprompts
- "Claude Code: Bygg utan att ändra befintlig design"
- "Claude Code: Debugga först, koda sen"
- "Lovable: Gör sidan mer premium utan AI-look"
- "Supabase: Skapa RLS-policy steg för steg"

---

## Claude Code Skills

Placering: `.claude/skills/`

| Skill | Syfte |
|-------|-------|
| `product-architect` | Stoppar feature creep — varje funktion ska stödja en av kärnhandlingarna |
| `ui-craft` | Modern, välbalanserad UI — tydlig spacing, konsekventa komponenter |
| `no-ai-look` | Tar bort generisk AI-design, ersätter med mänsklig copy och nordisk identitet |
| `accessibility-review` | Kontrast, tangentbord, aria, fokus, semantisk HTML — körs före UI-commits |
| `firebase-security` | Verifierar Firestore Rules + Storage Rules + Admin SDK-anrop — ersätter supabase-rls |
| `community-safety` | Moderering, rapportering, rate limiting, input-validering |
| `copywriting-sv` | Tydlig, varm, konkret svenska utan corporate-floskler |
| `component-polish` | Förbättrar spacing, hover, empty/loading/error states och skeletons |
| `mobile-first-review` | Verifierar att varje sida fungerar riktigt bra på mobil |
| `code-review` | TypeScript, lint, dead code, auth, edge cases, error handling |

---

## Byggfaser

### Fas 1 — Projektsetup
- [x] Skapa Next.js-projekt med TypeScript
- [x] Installera Tailwind CSS
- [x] Installera och anpassa shadcn/ui
- [x] Sätt upp Firebase client + admin
- [x] Skapa `.env.example`
- [x] Bygg grundlayout (header, footer, shell)
- [x] Implementera färgtema och typografi
- [x] Startsida — första version

### Fas 2 — Databas och auth ✅
- [x] Firestore Security Rules (firestore.rules)
- [x] Firebase Storage Rules (storage.rules)
- [x] Firebase Auth: Google + GitHub providers
- [x] `onIdTokenChanged` → kontroll om profil finns → redirect onboarding
- [x] Auto-skapande av `profiles/{uid}` dokument vid första login
- [x] Onboarding-flöde (/onboarding)
- [x] Route-skydd via proxy.ts (Edge Runtime JWT-check + Firestore Rules)

### Fas 3 — Projektflöde ✅
- [x] Lista projekt (flöde) — Firestore, dynamic SSR
- [x] Skapa projekt (formulär) — titel, tagline, status, stack, URL:er, bild
- [x] Projektdetalj-sida — Firestore + seed-fallback
- [x] Projektkort-komponent — adapter Firestore → card props
- [x] Upvotes (borrmaskin) — DrillButton, Firestore-transaktion, en röst per användare, shake-animation
- [x] Kommentarer — sub-collection, real-time subscription
- [x] Bildupload (Firebase Storage) — images/{uid}/projects/

**Checkpoint fas 3:** ✅ Besök startsida → logga in → skapa profil → lägg upp projekt → se i flödet → öppna detalj. Allt fungerar.

### Fas 4 — Hjälpfrågor ✅
- [x] Frågedetalj-sida med seed-data (slug-lookup, topic, status, author med avatar + profillänk)
- [x] Svarstråd i seed-data (accepterat svar markerat med grön ring + "Accepterat svar"-bar)
- [x] Lista hjälpfrågor med filter (Alla/Öppna/Löst + verktygsfilter) — `HelpFilterList` client component
- [x] Skapa hjälpfråga (strukturerat formulär) — `/help/new` med auth guard
- [x] Svar i Firestore (`posts/{postId}/comments`, real-time subscription, `AnswerSection`)
- [x] Markera som löst (acceptera svar — Firestore batch, Security Rules uppdaterade)

### Fas 5 — Prompts och guider ✅
- [x] Prompt-detaljsida med kodruta, kopiera-knapp, author-länk (`/prompts/[slug]`)
- [x] Kopiera-knapp (`CopyButton`-komponent, clipboard API)
- [x] Bookmark/spara-funktion på PromptCard (localStorage, klient-side)
- [x] Lista prompts — hämtar från Firestore, seed-fallback vid fel
- [x] Skapa prompt (formulär) — `/prompts/new` med auth-guard
- [x] Riktiga prompts i Firestore (4 seed-prompts + användarflöde klart)
- [x] Auth-gate på prompt-text — inloggade ser full text, övriga ser lås-ikon
- [x] Borrar-knapp på prompts (`PromptDrillButton`) — upvote med `votes`-subcollection
- [x] Riktiga seed-konton — 11 Firebase Auth-konton + Firestore-profiler, 7 projekt, 8 help-posts, 4 prompts (idempotent seed-script)

### Fas 6 — Profiler
- [x] Publik profilsida (`/profile/[handle]`) — visar seed-användare med avatar, bio, verktyg, byggen, frågor, prompts
- [x] Avatar-picker i onboarding (tre illustrerade avatarer: tjej/neutral/kille, sparas i Firestore)
- [x] Riktiga Firestore-profiler på profilsidan — läser `profiles` + användarens projekt/posts från Firestore, seed-fallback vid fel
- [x] Redigera profil (settings-sida `/settings`) — namn, username, bio, verktyg, avatar, externa länkar
- [x] Statiska badges — 5 community-märken härledda från användarens egen data (Första bygget, Hjälpt någon, Delat prompt, 10 borrar, Projekt live)

### Fas 7 — Admin och moderering ✅
- [x] Admin dashboard (`/admin`) — antal användare, projekt, frågor, prompts, kommentarer, öppna rapporter
- [x] Rapporter-hantering — användares rapportknapp + admin löser rapporter
- [x] Ta bort innehåll — admin raderar projekt/inlägg via säker API-route
- [x] Markera featured project / featured guide — admin togglar `isFeatured`
- [x] **Säkerhet:** server-side admin-verifiering (verifyIdToken + role), tätade privilege-escalation (role + isFeatured) i Firestore Rules
- [x] **Admin-management UI** — `/admin`-sidan har avsnitt för att lägga till/ta bort admins via e-post; alla admins har identiska befogenheter
- [x] `/api/admin/manage-admins` — GET (lista admins) + POST (grant/revoke via Admin SDK), kräver befintlig admin-token
- [x] `scripts/set-admin.ts` — bootstrap-script för första admin (kör lokalt med service account)
- [x] `scripts/deploy-rules.ts` — programmatisk Firestore-rules-deploy via REST API (firebase CLI ej inloggat)
- [x] **Hårdare Firestore-regler** — `role`-fältet skrivskyddat för ALLA klienter (även autentiserade admins via Firestore SDK); bara Admin SDK kan ändra det
- [x] **Verifierat med riktigt autentiserat testkonto:** inloggad icke-admin nekas på alla tre vektorer: (a) READ reports → 403, (b) WRITE role=admin på egen profil → 403 + Admin SDK-kontroll bekräftar role="user", (c) POST /api/admin/manage-admins → 403

### Fas 8 — Polish ✅
- [x] Empty states, loading states, error states, skeletons — `loading.tsx` (skeletons) för projects/help/prompts/profile, `error.tsx`, `not-found.tsx` (branded)
- [x] SEO metadata + Open Graph — root `metadataBase`, title-mall, keywords, OG + Twitter Card (OG-bild kvar, se manuella steg)
- [x] Sitemap — `sitemap.ts` (statiska + innehåll via Firestore/seed) + `robots.ts`
- [x] Community soul — About manifesto, Testimonials med riktiga byggare, TabStrip med 5 flikar
- [x] Aktiv nav-markering i Header (usePathname + hammer-yellow active style)
- [x] Live aktivitetsfeed på startsidan (async server component, Firestore + seed-fallback)
- [x] CommunityMarquee — dubbel rad (tools på rad 2, reverse-animation)
- [x] Community-sida (`/community`) — "Möt byggarna" med stats, byggarkort, how-to och CTA
- [ ] Responsivitet-genomgång — kräver webbläsare (manuellt steg)
- [ ] Accessibility-review — kräver tangentbord/skärmläsare (manuellt steg)
- [ ] Performance-optimering — kör Lighthouse på produktion (manuellt steg)
- [x] `no-ai-look`-granskning — designsystemet är redan nordiskt/mänskligt; inga blå-lila gradients eller AI-klyschor

### Fas 9 — SEO, domän & delningsbilder ✅
- [x] Domän `aibyggare.se` live på Vercel, `www` → naked-redirect, `NEXT_PUBLIC_SITE_URL` satt
- [x] Brandad favicon (`icon.svg`, dark-mode-aware) + `apple-icon.tsx` (180×180)
- [x] JSON-LD `WebSite`-schema + SearchAction, canonical, robots, noindex på privata ytor
- [x] OG-delningsbilder (next/og) för start/projekt/problem/prompt — statisk TTF buntad (`public/fonts/og-font.ttf`) pga Satori-begränsning
- [x] Start-OG i sajtens chunky retro-stil (cream, stickers, LVL-badge, founding-stjärna)
- [x] Firebase Auth: `aibyggare.se` auktoriserad + Google/GitHub OAuth-redirect konfigurerad
- [x] Mobil zoom-lås (viewport `maximumScale=1`)

### Fas 10 — Gamification: Byggkraft (XP) + levels ✅
- [x] `lib/xp/levels.ts` — XP-belopp, level-kurva 0–10, titlar, `levelProgress()`
- [x] Säker XP-backend `/api/xp/grant` — belopp styrs server-side av event-typ, idempotent via `xpEvents/{eventType}`, transaktion
- [x] Profile + `totalXp`/`level`/`builderStatus`; verifierad token via jose (`lib/auth/verify-token.ts`)
- [x] `LevelBadge` bredvid alla avatarer, `LevelProgressBar` på profil (live), `LevelUpBurst`-animation
- [x] First-action XP (första bygge/problem +25 → Level 1)

### Fas 11 — Ny onboarding (karaktärsbygge) ✅
- [x] `OnboardingFlow` — 6 kort + sista kortet, kortstack-animation, XP-toast, `OnboardingXpBar`
- [x] `FirstActionCard` — skapar första bygget/problemet inline (ser level-up), beskrivning ≤1000 tecken + räknare + valfritt länk-fält
- [x] Robust onboarding-grind + e-post/lösenord-inloggning

### Fas 12 — Notissystem ✅
- [x] `/api/notify` — server-side notis till ägaren vid borr/kommentar/svar, aldrig self-notify
- [x] `profiles/{uid}/notifications` + regler (mottagaren läser/markerar/raderar)
- [x] `NotificationBell` (desktop + mobil) — olästa-räknare, live onSnapshot, klick → rätt ställe

### Fas 13 — Founding Member-badge (första 30) ✅
- [x] `/api/founding/claim` — idempotent, räknare i `meta/stats`, seed-oberoende
- [x] `lib/founding.ts` — `FOUNDING_MEMBER_LIMIT` + `FOUNDING_BADGE_ENABLED` (lätt att stänga av)
- [x] `FoundingBadge` — guld-stämpel runt avataren (profil) + hörnstämpel (flöde/header)

### Fas 14 — Feedback-inhämtning ✅
- [x] Svävande `FeedbackButton` på alla sidor (inloggad) — popup, text + valfri skärmdump
- [x] `/api/feedback` — sparar i samlad `feedback`-collection (userId, namn, meddelande, sid-URL, bild, datum)
- [x] Övrigt: sök + sortering, radera bygge/problem, radera konto, borr-fix (regler deployade), beta-versionering

### Fas 15 — Säkerhet & juridik ✅ (v0.21.0–0.22.8)
Baserat på säkerhetsanalysen `docs/sakerhetsanalys-2026-06-29.md`. Alla 8 kodbara fynd åtgärdade och live-verifierade.
- [x] Counter-manipulation stängd — `upvoteCount`/`commentCount` skrivs enbart server-side via `/api/upvote` + `/api/comment`
- [x] Session-cookie `HttpOnly + Secure + SameSite=Lax` via `/api/auth/session` + `/api/auth/signout`
- [x] Rate limiting (Firestore sliding-window) på `/api/feedback` (10/h) och `/api/notify` (100/h)
- [x] HTTP-säkerhetsheaders: CSP, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy
- [x] Komplett kontoradering — även votes, bookmarks, reports, ratelimits och Storage-filer
- [x] Inaktivitetsradering 150 dagar — Vercel Cron `/api/cron/cleanup-inactive` (⚠️ kräver `CRON_SECRET`, se manuella steg)
- [x] Dataportabilitet — `GET /api/account/export` + "Ladda ner min data"-knapp i `/settings` (GDPR Art. 20)
- [x] Lösenord minst 8 tecken (client-side)
- [x] `/integritetspolicy` + `/anvandarvillkor` — fullständiga juridiska sidor (⚠️ org.nr-platshållare kvar, se manuella steg)
- [x] Nyhetsbrev — riktigt API (`/api/newsletter/subscribe` + unsubscribe), Firestore-lagring, Resend-integration (⚠️ kräver `RESEND_API_KEY`, se manuella steg)

### Fas 16 — UX-sprintar ✅ (v0.19.0 + v0.23.0–0.23.3)
Baserat på UX-analysen `docs/ux-analys-2026-06-28.md` (helhetspoäng 6.8/10 → alla kodbara brister åtgärdade).
- [x] Community-sidan: riktig Firestore-statistik + riktiga profiler (ersatte hårdkodad fake-data)
- [x] Prompts-listan: sökning + verktygsfilter + sortering (`PromptFilterList`); preview-fade istället för lås-ikon för utloggade
- [x] Kommentarer på prompt- och guide-detaljsidor (`PostCommentSection`)
- [x] "Glömt lösenord?"-länk + `/register` startar i signup-läge
- [x] CTA-dropdown i headern — "Lägg upp" → Bygge / Hjälpfråga / Prompt (portal-renderad, desktop + mobil)
- [x] Drill-down (borr) på hjälpfrågornas detaljsidor
- [x] 404-fix: `decodeURIComponent` på slugs med svenska tecken (problemhörnan, guider; prompts sedan v0.16.0)
- [x] Welcome-guiden: tillbaka-navigation, klickbara progress-dots, "Plattformsguide →"-länk i settings

### Fas 17 — Discovery & tillväxt 🔜 NÄSTA SPRINT

> **Läge:** Koden är beta-redo. Det som saknas nu är synlighet och innehåll — inte fler features.
> Nästa sprint ska driva trafik och göra befintligt innehåll hittbart.

**P1 — högst ROI, börja här:**
- [ ] **`/tools/[tool]`-sidor** — SEO-landningssidor för Claude Code, Cursor, Lovable, Bolt, Supabase, Vercel.
      Varje sida listar projekt + hjälpfrågor + prompts för verktyget (datan finns redan — `stack`/`tool`-fälten).
      Det största SEO-hålet i sajten; planerad sedan dag ett (se SEO-strategin nedan) men aldrig byggd.
- [ ] **"Veckans bygge" på startsidan** — sektion som lyfter admin-utsett featured-projekt.
      `isFeatured`-togglen finns redan i admin; det saknas bara en synlig plats på startsidan.

**P2 — bra att ha:**
- [ ] **Bookmarks i Firestore + `/sparat`-sida** — dagens bookmark på PromptCard är localStorage-only
      (försvinner vid enhetsbyte). `bookmarks`-collectionen finns redan i datamodell och Security Rules.
- [ ] **`/guides/new`** — community-genererade guider. ⚠️ Beslut krävs från Picki: ska guider vara
      öppna för alla att skapa, eller kurerade (admin/seed)? Bygg inte förrän beslutet är taget.

**P3 — manuella review-steg (kräver människa + riktig webbläsare):**
- [ ] Responsivitetsgenomgång på riktiga enheter
- [ ] Accessibility-review (tangentbord + skärmläsare)
- [ ] Lighthouse på produktion

---

## SEO-strategi

Viktiga sidor att bygga med SEO i åtanke från dag ett:

- `/` — Startsida
- `/projects` — Alla byggen
- `/problemhornan` — Problemhörnan (hjälpfrågor)
- `/prompts` — Prompts
- `/guides` — Guider
- `/tools/claude-code` — Projekt + frågor + prompts om Claude Code
- `/tools/lovable` — Samma för Lovable
- `/tools/cursor` — Cursor
- `/tools/supabase` — Supabase
- `/tools/vercel` — Vercel

Verktygsspecifika sidor blir ett starkt SEO-fundament över tid.

---

## Community-regler

1. Var nybörjarvänlig.
2. Visa vad du har testat.
3. Ge konkret feedback.
4. Inget hån mot nybörjare.
5. Dela lärdomar, inte bara länkar.
6. Bygg öppet.
7. Hjälp andra när du kan.

---

## Kvalitetskrav före leverans av fas

Innan en fas markeras som klar:
- Sidan fungerar på mobil
- Auth fungerar som förväntat
- Firestore Security Rules är satta (ingen kan ändra andras innehåll)
- Alla formulär har validering (Zod)
- Användaren får feedback vid loading / error / success
- Designen känns modern och inte generisk
- Inga placeholder-texter finns kvar
- Empty states finns
- `tsc --noEmit` och lint passerar
- Alla viktiga flöden är testade end-to-end

---

## Inspektionskällor (ej kopiera, bara inspireras)

| Källa | Lärdomar att låna |
|-------|------------------|
| Product Hunt | Projektkort, upvotes, launches, topplista, "veckans bygge" |
| Indie Hackers | Byggresor, transparens, "vad bygger du just nu?" |
| Replit Community | Showcase, hjälpsektion, nybörjartrygghet |
| Linear | Calm design, ren layout |
| Notion | Enkelhet, tydlig typografi |
| Vercel | Teknisk premiumkänsla |
| Raycast | Command/search-känsla |
| GitHub | Profilsidor, byggaridentitet |

**Kombinera till:** Nordisk byggarcommunity för AI-eran.

---

## Status

| Fas | Status |
|-----|--------|
| Fas 1 — Projektsetup | ✅ Klar |
| Fas 2 — Databas och auth | ✅ Klar |
| Fas 3 — Projektflöde | ✅ Klar |
| Fas 4 — Hjälpfrågor | ✅ Klar |
| Fas 5 — Prompts/guider | ✅ Klar |
| Fas 6 — Profiler | ✅ Klar |
| Fas 7 — Admin | ✅ Klar |
| Fas 8 — Polish | ✅ Klar (manuella review-steg kvar: responsivitet, a11y, Lighthouse) |
| Fas 9 — SEO, domän & delningsbilder | ✅ Klar |
| Fas 10 — Gamification (Byggkraft/XP + levels) | ✅ Klar |
| Fas 11 — Ny onboarding (karaktärsbygge) | ✅ Klar |
| Fas 12 — Notissystem | ✅ Klar |
| Fas 13 — Founding Member-badge (första 30) | ✅ Klar |
| Fas 14 — Feedback-inhämtning | ✅ Klar |
| Fas 15 — Säkerhet & juridik | ✅ Klar (3 manuella steg kvar — se nedan) |
| Fas 16 — UX-sprintar | ✅ Klar |
| Fas 17 — Discovery & tillväxt | 🔜 Nästa sprint |

> **Beta-lansering:** Sidan är live på **aibyggare.se** (v0.23.3), säker och redo för de första 30 testarna.
> Säkerhetssprinten är komplett och live-verifierad. Det som blockerar full drift är de manuella stegen nedan.

---

## ⚠️ MANUELLA STEG — PICKI MÅSTE GÖRA DESSA

> Allt kodarbete är pushat och live. Följande kan **inte** göras via git/Vercel —
> de kräver dig. P0-listan tar totalt ca 30 minuter och blockerar juridik + nyhetsbrev.
> Markera av när klart.

### 🔴 P0 — Blockerare (gör nu, ~30 min totalt)

- [ ] **1. `CRON_SECRET` i Vercel** — Vercel Dashboard → projekt `aibyggare-se` →
  Settings → Environment Variables. Skapa värdet med `openssl rand -hex 32`.
  *Utan detta:* inaktivitetsraderingen (GDPR, 150 dagar) körs oskyddad/inte alls.
- [ ] **2. `RESEND_API_KEY` i Vercel** — skapa konto/nyckel på resend.com, lägg in
  som env-variabel i Vercel.
  *Utan detta:* nyhetsbrevsprenumeranter sparas men får aldrig välkomstmail.
- [ ] **3. Acceptera Firebase DPA** — [Firebase Console](https://console.firebase.google.com)
  → projekt `aibyggare-c45c6` → Project Settings → General → Data Privacy →
  "Review and accept" under Data Processing and Security Terms. Ta en skärmdump till `docs/`.
  *Utan detta:* teknisk GDPR-brist (Art. 28 — biträdesavtal saknas).
- [ ] **4. Org.nr + adress** — skicka Ncom.se:s organisationsnummer och adress till Claude
  i en session, så uppdateras platshållarna i `/integritetspolicy` och `/anvandarvillkor`.
  *Utan detta:* juridiska sidor visar synliga platshållare för alla besökare.
- [ ] **5. Deploya Firestore-index** — kör `firebase login` en gång, sedan
  `firebase deploy --only firestore:indexes`. (Alternativ: skapa `comments.userId`
  COLLECTION_GROUP-index manuellt i Firebase Console.)
  *Utan detta:* badgen "Hjälpt någon" fungerar inte i produktion.

### 🟡 P1 — Verifiera (efter P0, ~15 min)

- [ ] Testa nyhetsbrevsflödet: prenumerera med riktig e-post → välkomstmail kommer →
      avregistreringslänken fungerar.
- [ ] Testa hela kärnflödet på mobil: logga in → skapa projekt → kommentera →
      borra → ställ fråga → redigera profil.
- [ ] Verifiera att `storage.rules` är deployade: `firebase deploy --only storage`
      (går snabbt när `firebase login` är gjort i P0 steg 5).

### 🟢 P2 — Löpande (kräver mänskligt öga, ingen deadline)

- [ ] **Responsivitet-genomgång** på riktiga enheter (mobil + surfplatta).
- [ ] **Accessibility-review** med tangentbord + skärmläsare.
- [ ] **Lighthouse** på produktion (performance-baslinje inför tillväxt).

### ✅ Redan gjort (behålls som kvitto)

- [x] Firestore Security Rules deployade (hela regeluppsättningen live, verifierad med attack-tester)
- [x] Admin satt: `christoffer.nolet@gmail.com` har `role: 'admin'` (session 15)
- [x] OG-delningsbilder live (next/og — start/projekt/problem/prompt)
- [x] `NEXT_PUBLIC_SITE_URL` satt i Vercel → `https://aibyggare.se`
- [x] Firebase Auth: Google + GitHub aktiverade
- [x] Vercel env-variabler satta
- [x] Escalation-tester körda mot prod: icke-admin nekas på alla vektorer (403)

---

---

*Senast uppdaterad: 2026-07-01 — planen omskriven mot faktiskt läge: Fas 15–16 (säkerhet/juridik + UX-sprintar) dokumenterade som klara, Fas 17 (Discovery & tillväxt) definierad som nästa sprint, manuella steg konsoliderade och prioriterade (P0–P2).*
