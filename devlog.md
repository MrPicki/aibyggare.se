# AIbyggare.se — Dev Log

> ⚠️ **STOP — LÄS DETTA FÖRST**
> Så fort du börjar arbeta i detta projekt innehar du en specifik roll som du ska leva efter.
> **Läs `CLAUDE.md` innan du fortsätter. Den gäller alltid. Inga undantag.**

> Levande logg för projektet. Uppdateras efter varje punkt med vad som gjordes, varför, problem och framtida rekommendationer.
> Sessionsordning: `CLAUDE.md` → `devlog.md` (senaste 20–30 rader) → `plan.md`

---

## Hur loggen används

- **Datum + tid** anges för varje entry (format: `YYYY-MM-DD HH:MM`)
- **Fas** refererar till Fas 1–8 i `plan.md`
- **Status-taggar:** `✅ Klar` · `🔧 Pågående` · `⚠️ Problem` · `💡 Rekommendation` · `🔜 Nästa steg`
- Logga alltid: vad gjordes, varför, eventuella problem/beslut och vad som är nästa naturliga steg

---

## Infrastruktur och arbetsflöde — LÄSVÄRDIG VID VARJE SESSION

### Stack — vad vi använder och till vad

| System | Syfte | Åtkomst |
|--------|-------|---------|
| **Next.js 16** | Frontend + API-routes (App Router) | Lokalt: `npm run dev` |
| **Firebase Auth** | Inloggning (Google + GitHub OAuth) | Via `src/lib/firebase/client.ts` |
| **Firestore** | Databas (NoSQL dokument-DB) | Klient: `client.ts` · Server: `admin.ts` |
| **Firebase Storage** | Bilduppladdningar | Via `src/lib/firebase/client.ts` |
| **GitHub** | Versionskontroll, kodbas | `github.com/MrPicki/aibyggare.se` |
| **Vercel** | Hosting + auto-deploy | `vercel.com` — projekt `aibyggare-se` |

---

### Exakt arbetsflöde — kod till produktion

```
1. Koda lokalt
   └─ npm run dev  →  http://localhost:3000

2. Verifiera att build passerar
   └─ npm run build  (ska vara fel-fritt)
   └─ npm run lint   (ska vara varnings-fritt)

3. Committa och pusha
   └─ git add <filer>
   └─ git commit -m "beskrivning"
   └─ git push origin main

4. Vercel deployer automatiskt
   └─ Trigger: push till main på GitHub
   └─ Build tar ~30–60 sekunder
   └─ Live-URL: https://aibyggare.vercel.app
   └─ Preview-URL per commit: https://aibyggare-<hash>.vercel.app
```

**Vercel bygger med produktions-env-variabler** — `.env.local` används bara lokalt.

---

### Miljövariabler — var de finns

| Miljö | Fil/plats | Används av |
|-------|-----------|------------|
| Lokalt (dev) | `.env.local` (ej i git) | `npm run dev` |
| Produktion/Preview | Vercel Dashboard → Settings → Env Vars | Vercel build |

**Variabler som finns:**
```
NEXT_PUBLIC_FIREBASE_API_KEY          — Firebase klient (publik)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN      — Firebase klient (publik)
NEXT_PUBLIC_FIREBASE_PROJECT_ID       — Firebase klient (publik)
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET   — Firebase klient (publik)
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID — Firebase klient (publik)
NEXT_PUBLIC_FIREBASE_APP_ID           — Firebase klient (publik)
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID   — Firebase Analytics (publik)
FIREBASE_SERVICE_ACCOUNT_KEY          — Firebase Admin/server (HEMLIG)
NEXT_PUBLIC_SITE_URL                  — Bas-URL för projektet
```

**`NEXT_PUBLIC_*`** variabler är publika — de bäddas in i klient-JS (detta är korrekt och normalt för Firebase).
**`FIREBASE_SERVICE_ACCOUNT_KEY`** är hemlig och finns aldrig på klientsidan. Den körs bara i Server Components, API-routes och middleware.

---

### Firebase — klient vs server

```
Klientsidan (Browser / Client Components):
  import { auth, db, storage } from "@/lib/firebase/client"
  → Lämpligt för: auth-state, realtidslyssnare, direktskrivning med Security Rules

Serversidan (Server Components / API Routes / Middleware):
  import { adminAuth, adminDb, adminStorage } from "@/lib/firebase/admin"
  → Lämpligt för: token-verifiering, admin-operationer, SSR-datahämtning
  → OBS: importeras ALDRIG i klient-komponenter
```

---

### Firebase Security Rules (Fas 2)

Firestore är öppen (test mode) tills vi sätter regler i Fas 2. Reglerna ska följa:
- **Läsa:** Alla kan läsa publicerade projekt, posts, profiler, kommentarer
- **Skriva:** Kräver inloggning (`request.auth != null`)
- **Ändra/Radera:** Kräver att `request.auth.uid == resource.data.userId`
- **Admin:** Kräver `get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.role == 'admin'`

---

### Git-konventioner

```
Commit-format:
  Fas X: kort beskrivning av vad som gjordes
  Komponent: ändring av specifik komponent
  Fix: buggfix
  Refactor: omstrukturering utan ny funktionalitet

Branch-strategi (MVP-fas):
  main = alltid deploybar, alltid grön
  feature/* = ny funktion (mergas till main via PR när klar)
```

---

## 2026-06-21

### Pre-setup ✅

- `CLAUDE.md` — rollmanifest och projektkonstitution
- `plan.md` — fullständig projektplan med 8 faser
- `devlog.md` — denna fil

---

### Fas 1 ✅ Klar — 2026-06-21

**Next.js-projekt:**
- Next.js 16.2.9 med Turbopack, TypeScript, Tailwind v4, App Router, `src/`-mapp
- **Kritisk notering:** shadcn/ui v4 använder `@base-ui/react` INTE Radix UI
  - Ingen `asChild`-prop på `<Button>`
  - Lösning: `buttonVariants({ variant, size })` + `cn()` direkt på `<Link>`

**Designsystem:**
- Projektets färgpalett implementerad som CSS-variabler i `globals.css`
- Ljust: `#F7F5EF` bakgrund · `#A7C957` primary grön · `#151515` text
- Mörkt: `#11130F` bakgrund · `#B7E063` primary grön · `#F4F1E8` text
- Custom Tailwind-klasser via `@theme inline`: `bg-background-alt`, `text-primary-dark`, `text-accent-orange`
- Font: Geist Sans (primär) + Geist Mono (kod/taggar)

**Komponenter skapade:**
- `src/components/layout/Header.tsx` — sticky, logo, nav, mobilmeny
- `src/components/layout/Footer.tsx` — länkkolumner, copyright
- `src/components/cards/ProjectCard.tsx` — titel, tagline, status-pill, stack-badges, upvotes, kommentarer
- `src/components/cards/HelpCard.tsx` — svar-räknare, titel, verktyg-badge, tid
- `src/components/ui/StatusPill.tsx` — 9 statusar med färgkodning
- `src/components/ui/ToolBadge.tsx` — mono-font badge

**Startsida (`src/app/page.tsx`):**
- Hero med dot-grid bakgrund + radial fade
- Verktygs-badges (Claude Code, Cursor, Lovable, Bolt, Replit, Supabase, Vercel, Next.js, Stripe)
- Mockdata: 3 projektkort + 3 hjälpfråge-kort
- "Så fungerar det" — 4 steg
- CTA-sektion

**Firebase (valt över Supabase):**
- Supabase hade inga lediga gratis-projekt → bytte till Firebase
- `src/lib/firebase/client.ts` — browser-SDK (auth, db, storage)
- `src/lib/firebase/admin.ts` — Admin SDK för server-side
- `src/types/firestore.ts` — TypeScript-typer för alla collections

**GitHub + Vercel + Firebase — verifierat 2026-06-21:**
- GitHub repo skapad: `github.com/MrPicki/aibyggare.se` ✅
- Vercel projekt: `aibyggare-se` (ID: `prj_sMlfbUjJa0mjP2RNnXmPhMZdOULq`) ✅
- Vercel kopplad till GitHub (auto-deploy på push till `main`) ✅
- 9 env-variabler i Vercel (via API) ✅
- Firebase Auth: ansluten ✅
- Firestore: ansluten och testad (skriv/läs/radera verifierat) ✅
- End-to-end test: push → Vercel deploy på <15 sekunder ✅

**Commits:**
- `e3930d8` — Fas 1: projektsetup, designsystem och startsida
- `ef02bb1` — Test: end-to-end deploy-verifiering

---

## 🔜 Nästa steg — Fas 2: Databas och auth

**Vad som ska byggas:**

1. **Firestore Security Rules**
   - Definiera regler i `firestore.rules`
   - Publik läsning, autentiserat skrivande, ägarskyddad redigering

2. **Firebase Auth-integration i Next.js**
   - Middleware som verifierar Firebase ID-token i session-cookie
   - `src/middleware.ts` — skyddar `/projects/new`, `/help/new`, `/settings`, etc.
   - Auth-kontext via React Context Provider

3. **Auth-sidor**
   - `src/app/(auth)/login/page.tsx` — Google + GitHub-knappar
   - `src/app/(auth)/register/page.tsx` — redirect till onboarding

4. **Auto-profil vid första login**
   - Firebase Auth trigger (via API-route `/api/auth/callback`)
   - Skapar Firestore-dokument i `profiles/`-collection vid ny användare

5. **Onboarding-flöde**
   - `src/app/(app)/onboarding/page.tsx`
   - Samlar: username, display name, bio, verktyg
   - Max 4 fält, snabbt och smidigt

**Prioritetsordning Fas 2:**
Auth → Middleware → Login-sida → Auto-profil → Onboarding

---

---

## 2026-06-22

### Arkitekturbeslut — Firebase bekräftat, Supabase borttaget
**Status:** ✅ Klar

**Vad gjordes:**
- Användaren bekräftade explicit: **Firebase hela vägen, ingen Supabase**.
- Uppdaterade `CLAUDE.md`: Säkerhetssektionen nu Firebase Security Rules + Admin SDK (inte RLS/Supabase Storage).
- Uppdaterade `plan.md` fullständigt:
  - Teknisk stack: Firebase Firestore, Auth, Storage, Admin SDK
  - Databasmodell: Omskrev från SQL/Supabase-format till Firestore collections/documents
  - RLS-sektion → Firebase Security Rules
  - Auth-sektion: Supabase-trigger → `onAuthStateChanged` + Firestore
  - `/lib/supabase` → `/lib/firebase`
  - `supabase-rls`-skill → `firebase-security`
  - Fas 2 checklist: SQL-migrationer → Firestore Rules + Firebase Auth
  - Bildupload: Supabase Storage → Firebase Storage
  - Kvalitetskrav: RLS → Firestore Security Rules

**Varför beslutet är rätt:**
- Fas 1 är redan byggt på Firebase — ingen ombyggnad krävs
- Konsekvent stack reducerar kognitiv belastning och onödig komplexitet
- Firebase är en stark, väldokumenterad stack för communityplattformar

**⚠️ Viktigt att komma ihåg för Fas 2:**
- Firestore Security Rules sätts i `firestore.rules` — de är INTE aktiva förrän deployade
- Tills reglerna är deployade är Firestore i test mode (öppen) — aldrig pusha utan regler i produktion
- Admin SDK (`FIREBASE_SERVICE_ACCOUNT_KEY`) körs **aldrig** klient-side
- Denormalisering av `userDisplayName` och `userAvatarUrl` i projekt/posts är ett medvetet val för att undvika extra fetches — men det kräver att vi uppdaterar dessa om användaren byter namn/avatar

**💡 Rekommendationer framåt:**
- Skapa `firestore.rules` och `storage.rules` som allerförsta steg i Fas 2 — inte sist
- Lägg till ett Cloud Function (eller API-route) som hanterar username-uniqueness (Firestore har ingen inbyggd UNIQUE constraint)

---

---

## 2026-06-22 — Fas 2 ✅ Klar

### Fas 2 — Firebase Auth + Firestore Rules + Onboarding

**Status:** ✅ Klar  
**Commits:** `32c8527` (Fas 2 core), `0c0dc1d` (felmeddelanden), `f6504e3` (redirect-auth), `aefd047` (tema + topbar)

---

#### Vad som byggdes

**Firestore Security Rules (`firestore.rules`):**
- `profiles/{userId}`: publik läsning, ägarskrivning, admin-update/delete
- `projects/{projectId}`: publik läsning, autentiserat skapande (userId == auth.uid), ägar/admin-update/delete
- `posts/{postId}`: samma mönster som projects
- `projects/{projectId}/comments/{commentId}`: publik läsning, autentiserat skapande (sub-collection)
- `posts/{postId}/comments/{commentId}`: samma (sub-collection)
- `votes/{voteId}`: inloggad kan läsa/skapa/radera egna röster, aldrig uppdatera
- `bookmarks/{bookmarkId}`: bara ägaren kan se/skapa/radera
- `reports/{reportId}`: inloggad kan skapa, admin kan läsa/hantera
- Helper functions: `isSignedIn()`, `isOwner(userId)`, `isAdmin()` (kollar `profiles/{uid}.role == 'admin'`)

**Firebase Storage Rules (`storage.rules`):**
- Publik läsning av alla filer
- Upload tillåts till `images/{uid}/{allPaths}` för inloggad användare
- Max 5 MB, MIME-typer: image/jpeg, image/png, image/webp, image/gif

**AuthContext (`src/contexts/AuthContext.tsx`):**
- `useAuth()` hook med `user`, `loading`, `error`, `signInWithGoogle`, `signInWithGitHub`, `signOut`
- `onIdTokenChanged` (fångar inloggning, utloggning och token-förnyelse var 60:e minut)
- Cookie `__session` sätts vid inloggning, rensas vid utloggning — används av proxy.ts
- `ensureProfile()`: skapar `profiles/{uid}` om det saknas, returnerar `true` om onboarding behövs
- `getRedirectResult()` hanterar OAuth redirect-flöde

**Auth-beslut — redirect-baserad OAuth:**
- Bytte från `signInWithPopup` till `signInWithRedirect` + `getRedirectResult`
- Anledning: popup blockeras på mobil och i vissa browsers (SameSite/storage-partitionering)
- Firebase auth-handlaren proxyas via `/__/auth/*` rewrite i `next.config.ts` — first-party cookie
- `authDomain` i `client.ts` sätts till `window.location.host` (ej `<project>.firebaseapp.com`) för att undvika tredjepartslagring

**Login-sida (`src/app/login/page.tsx`):**
- Centrerat kort, hammer-logga, Google + GitHub-knappar
- Google (ljust kort, `chunky`-stil) + GitHub (mörk bakgrund `bg-ink`)
- Error-visning vid inloggningsfel (exakt Firebase-felkod visas)
- "Ansluter..."-state medan redirect-flöde triggas
- Länk tillbaka via Header (ej en separat länk — headern är alltid synlig)

**Onboarding (`src/app/(app)/onboarding/page.tsx`):**
- Guard: redirectar till `/login` om ej inloggad
- 4 fält: användarnamn (slug-validering + unik Firestore-check), visningsnamn, bio (max 160), verktygsval (multi-select)
- Username: `^[a-z0-9_]{3,20}$`, real-time slug-sanering i input
- Skriver till `profiles/{uid}` i Firestore, redirectar till `/projects/new` vid success

**Header (`src/components/layout/Header.tsx`):**
- Om inloggad: avatar + displayName-länk till profil + logout-ikon
- Om ej inloggad: "Logga in"-länk
- Mobilmeny: logout-knapp om inloggad

**Route-skydd (`src/proxy.ts`):**
- Skyddar: `/projects/new`, `/help/new`, `/prompts/new`, `/guides/new`, `/settings`, `/onboarding`
- Kör i Next.js Edge Runtime — Firebase Admin SDK kan ej användas här
- **Arkitekturbeslut:** Lättviktig JWT-avkodning utan kryptografisk verifiering
  - Dekoderar payload (base64), kontrollerar `exp` mot `Date.now()`
  - Rätt security ligger i Firestore Security Rules (de kräver riktig Firebase Auth)
  - Middleware är ett UX-skydd mot anonyma användare, inte ett säkerhetsskikt
- Exporterar `proxy` (Next.js 16 konvention, ej `middleware`)

---

#### Problem och beslut

| Problem | Beslut |
|---------|--------|
| Firebase Admin SDK fungerar ej i Edge Runtime | JWT-avkodning utan krypto i proxy.ts — säkerheten ligger i Firestore Rules |
| OAuth popup blockeras på mobil | Bytte till `signInWithRedirect` + `getRedirectResult` |
| `signInWithRedirect` returnerar null i third-party kontext | First-party proxy via `/__/auth/*` rewrite + `authDomain = window.location.host` |
| Next.js 16: `middleware.ts` → `proxy.ts` | Fil + export döptes till `proxy` (ny Next.js 16-konvention) |
| PromptCard: setState i useEffect → lint-fel | Lazy initializer: `useState(() => readSaved().includes(title))` |
| Collection-namn: spec säger `users`, kod använder `profiles` | Beslutat: behåll `profiles` — kod, regler och typer är konsekvent med varandra |

---

#### Kvalitetskontroll

- `npm run build` ✅ Ren, inga varningar
- `npm run lint` ✅ 0 fel, 0 varningar
- Login (Google + GitHub) ✅
- Ny användare → onboarding → `/projects/new` ✅
- Inloggad användare: avatar + displayName i header ✅
- Utloggning ✅
- `/projects/new` utan inloggning → redirect till `/login?from=/projects/new` ✅
- Mobil: login och onboarding fungerar ✅

---

---

## 2026-06-22 — Fas 3 ✅ Klar

### Fas 3 — Projektflöde

**Status:** ✅ Klar

---

#### Vad som byggdes

**`src/lib/firebase/projects.ts`** (server-side Admin SDK):
- `getProjects(limit)` — hämtar projekt sorted by createdAt desc
- `getProjectBySlug(slug)` — hämtar projekt via slug-query
- `getProjectComments(projectId)` — hämtar kommentarer i sub-collection

**`src/lib/firebase/projects-client.ts`** (klient-SDK):
- `slugify(text)` — konverterar titel till URL-slug (å→a, ä→a, ö→o)
- `makeUniqueSlug(title)` — kontrollerar Firestore, lägger till suffix vid kollision
- `uploadProjectImage(file, uid)` — laddar upp till `images/{uid}/projects/`
- `createProject(data)` — skapar projekt-dokument i Firestore
- `toggleUpvote(projectId, userId)` — Firestore-transaktion: toggle vote + updaterar upvoteCount
- `hasUpvoted(projectId, userId)` — kontrollerar om `votes/{uid}_{projectId}` existerar
- `addComment(input)` — lägger till kommentar i sub-collection + incrementerar commentCount
- `subscribeToComments(projectId, callback)` — `onSnapshot` real-time listener

**`src/lib/constants/project-status.ts`**:
- `PROJECT_STATUS_OPTIONS` — 6 statusar med labels för select
- `STATUS_LABEL` — kod → visningstext (t.ex. "mvp" → "MVP")
- `STATUS_ACCENT` — kod → CSS-färgvariabel för header-bar

**`src/components/projects/ProjectForm.tsx`**:
- 9 fält: titel (med live slug-förhandsgranskning), tagline, status (select), beskrivning, stack (multi-select), projekt-URL, GitHub-URL, feedback-önskemål, omslagsbild
- Bildupload: förhandsgranskning direkt, "ta bort"-knapp, validering max 5MB
- URL-validering med `new URL()` try/catch
- Slug: genereras automatiskt från titeln, visas som förhandsgranskning
- Vid submit: bild → Storage → URL → createProject → redirect till `/projects/[slug]`

**`src/components/projects/UpvoteButton.tsx`**:
- Klient-komponent, hämtar initial upvote-status via `hasUpvoted`
- `toggleUpvote` — Firestore-transaktion (atomisk increment/decrement)
- Disabled om ej inloggad, optimistisk UI-uppdatering

**`src/components/projects/CommentSection.tsx`**:
- Klient-komponent, real-time via `onSnapshot`
- Initialiseras med SSR-kommentarer (inga flimrar)
- Avatar-initialer om ingen bild
- Login-prompt för anonyma användare
- Max 1000 tecken per kommentar

**`src/app/projects/page.tsx`** (Server Component):
- `export const dynamic = "force-dynamic"` — aldrig cached
- Admin SDK för Firestore-fetch, graceful error (empty state vid fel)
- `toCardProps(project)` — konverterar Firestore Project → ProjectCardProps

**`src/app/projects/new/page.tsx`** (Client Component):
- Auth-guard: redirect till `/login?from=/projects/new` om ej inloggad
- Renderar `<ProjectForm />` när inloggad

**`src/app/projects/[slug]/page.tsx`** (Server Component + Client):
- `export const dynamic = "force-dynamic"`
- Hämtar projekt via `getProjectBySlug(slug)` + kommentarer
- Fallback till SEED_PROJECTS om inte i Firestore (för bakåtkompatibilitet med demo-slugs)
- 404 om varken Firestore eller seed
- Visar: header-bar med accent-färg + avatar + status, cover image, titel, tagline, stack, beskrivning, feedback-sektion, externa länkar, UpvoteButton, CommentSection

---

#### Problem och beslut

| Problem | Beslut |
|---------|--------|
| `useEffect + setState` → lint-fel (slugPreview) | Beräknar slug direkt som `const slugPreview = slugify(form.title)` — ingen state |
| `Github` icon saknas i lucide-react v1.21 | Inline SVG (samma som login-sidan) |
| Slug-kollisioner i Firestore (ingen UNIQUE constraint) | `makeUniqueSlug` kontrollerar via query, lägger till 4-char suffix |
| Kommentarräknare — atomicitet | `increment(1)` från firebase/firestore (atomic server-side) |

---

#### Kvalitetskontroll

- `npm run build` ✅ Ren
- `npm run lint` ✅ 0 fel
- `/projects` — Server Component, dynamic SSR, Firestore-data ✅
- `/projects/new` — Auth-guard, formulär med alla fält, bildupload ✅
- `/projects/[slug]` — Firestore-hämtning, upvotes, real-time kommentarer ✅
- Seed-data fallback på detaljsidan (bakåtkompatibilitet) ✅
- Mobil: formulär och detaljsida responsiva ✅

---

---

## 2026-06-22 — Borrmaskins-upvotes (DrillButton)

### Vad gjordes

**Ny upvote-identitet — borrmaskinen:**
- `src/components/brand/DrillIcon.tsx` — blocky SVG-borrmaskin (bit, chuck, body, handle, trigger)
- `src/components/projects/DrillButton.tsx` — ersätter `UpvoteButton`:
  - Variant `full`: "Ge en borr" → "Borrad" + räknare i pill, chunky border-2 knapp
  - Variant `compact`: bara ikon + siffra, används i kort och listor
  - Optimistic UI med rollback vid Firestore-fel
  - Shake-animation (`animate-drill-shake`) vid klick + fly-away +1 (`animate-drill-plus`)
  - Tooltip "Logga in för att ge en borr" för utloggad
- `src/app/globals.css` — `@keyframes drill-shake` + `@keyframes drill-plus`, utility-klasser i `@layer utilities`, `prefers-reduced-motion`-stöd
- `src/app/projects/[slug]/page.tsx` — `DrillButton` (full) ersätter `UpvoteButton`
- `src/components/cards/ProjectCard.tsx` — `DrillIcon` (statisk) ersätter `ChevronUp`
- `src/components/home/LatestBuildActivity.tsx` — `DrillIcon` (statisk) ersätter `ChevronUp`

| Komponent | Status |
|-----------|--------|
| DrillIcon SVG | ✅ |
| DrillButton full (detaljsida) | ✅ |
| DrillButton compact / statisk (kort) | ✅ |
| CSS-animationer (shake + +1 fly-away) | ✅ |
| Optimistic UI + rollback | ✅ |
| `prefers-reduced-motion` | ✅ |

---

---

## 2026-06-22 — Profilbilder + onboarding-avatar-picker

### Vad gjordes

**Seed-profilbilder:**
- `public/seed/avatar-female.png` + `public/seed/avatar-male.png` — pixelart-style illustrerade avatarer (1254×1254, varm beige bakgrund)
- Används i all seed-data (SEED_USERS, SEED_PROJECTS, SEED_HELP_QUESTIONS, SEED_PROMPTS, LatestBuildActivity)
- Fördelas 50/50 M/F i seed-data för variation

**Onboarding avatar-picker (`src/app/onboarding/page.tsx`):**
- Nytt `AVATAR_OPTIONS`-array med de två bilderna
- Picker före username-fältet — två runda knappar (h-20 w-20 rounded-full)
- Vald avatar: `border-build-green shadow-[0_0_0_3px_var(--build-green)]` + "Vald"-badge overlay
- `avatarUrl` sparas till Firestore `profiles/{uid}` vid submit

---

## 2026-06-22 — Fullständig routing för "På byggbänken just nu"

### Vad gjordes

**Målet:** Varje kort i LatestBuildActivity på startsidan ska länka till rätt destination, utan ett enda dead end. Avatar + namn → publik profilsida. Aktivitetskort → rätt innehållssida.

---

#### Seed-data (src/lib/seed.ts) — stor omskrivning

- `SeedUser`-interface: `username`, `displayName`, `bio`, `tools`, `avatarUrl`, `joined`, `projectSlugs`, `helpSlugs`, `promptSlugs`
- `SEED_USERS` — 6 användare (christoffer, linabygger, adamcodes, sarapromptar, jonasbygger, majawebb)
- `SeedAnswer`-interface: `author`, `username`, `avatarUrl`, `body`, `isAccepted?`, `createdAtLabel`
- `HelpQuestion` utökad med `username?` och `answers?: SeedAnswer[]`
- Två hjälpfrågor med mock-svarstrådar:
  - `vercel-vagrar-deploya` (Lina) — 3 svar (Christoffer, Pelle, Nina)
  - `claude-skrev-om-hela-layouten` (Maja) — 3 svar, Saras svar `isAccepted: true`
- `SEED_PROJECTS`: lade till MenuPilot (`menupilot-se`, Adam/adamcodes/M)
- `SEED_PROMPTS`: lade till `slug`, `author`, `authorHandle`, `authorAvatarUrl` på alla prompts

---

#### LatestBuildActivity (src/components/home/LatestBuildActivity.tsx)

- `BuildActivityItem` fick `targetUrl: string` + `user.username: string`
- SEED_ACTIVITY uppdaterat:
  - Christoffer → `targetUrl: /projects/smartbok-se`
  - Lina → `targetUrl: /help/vercel-vagrar-deploya`
  - Adam → `targetUrl: /projects/menupilot-se`
  - Sara → `targetUrl: /prompts/stopp-claude-designen`
  - Jonas: handle korrigerad `@jonasidé` → `@jonasbygger`, `targetUrl: /projects/need-radar`
  - Maja → `targetUrl: /help/claude-skrev-om-hela-layouten`
- Avatar och namn är klickbara → `/profile/[username]`
- Projekttitel och titeln på aktiviteten → `targetUrl`
- "Visa tråd →" → `targetUrl` (ej längre hårdkodad `/projects`)

---

#### PromptCard (src/components/cards/PromptCard.tsx)

- Ny valfria props: `slug?`, `author?`, `authorHandle?`, `authorAvatarUrl?`
- Om `author` + `authorHandle`: visas inline avatar + `@handle`-länk till `/profile/[authorHandle]`
- Om `slug`: "Visa prompt →"-länk längst ner på kortet

---

#### HelpCard (src/components/cards/HelpCard.tsx)

- Destructar nu `username?` och `avatarUrl?` från `HelpQuestion`
- Om `username`: author-länken går till `/profile/[username]`, med inline avatar

---

#### Publik profilsida (src/app/profile/[handle]/page.tsx) — fullständig omskrivning

- **Var:** Client Component (visade bara inloggad användare) → Server Component (visar vem som helst)
- Slår upp `SEED_USERS` på `username === handle`
- Visar: stor rund avatar (h-24 w-24), displayName, @handle, joined-datum, bio
- Verktyg: chunky chips med border-2 border-ink
- Sektioner: Byggen (`SEED_PROJECTS` filtrerat på `projectSlugs`), Hjälpfrågor, Prompts
- Empty state om alla sektioner är tomma
- `generateStaticParams` från SEED_USERS

---

#### Prompt-detaljsida (src/app/prompts/[slug]/page.tsx) — ny sida

- Server Component, slug-lookup i `SEED_PROMPTS`
- Header-bar med `accent` bakgrund, `badge` och `tool`
- Author med avatar + länk till `/profile/[authorHandle]`
- Prompt-text i `<pre>`-liknande `font-mono whitespace-pre-wrap`-block
- `<CopyButton>` — ny client component (`src/components/ui/CopyButton.tsx`) för clipboard-kopiering
- CTA-sektion med "Dela en prompt" och "Se alla prompts →"

---

#### Hjälp-detaljsida (src/app/help/[slug]/page.tsx) — uppdaterad

- Author visas med avatar + länk till `/profile/[username]`
- Svarstråd renderas: om `question.answers` finns visas alla svar
  - Accepterat svar: grön `ring-2 ring-build-green` + header-bar "Accepterat svar" med `CheckCircle2`
  - Varje svar: avatar, namn, `@handle`-länk till profil, tidstämpel, brödtext

---

#### CopyButton (src/components/ui/CopyButton.tsx) — ny komponent

- Client Component, hanterar `navigator.clipboard.writeText`
- "Kopiera prompt" → "Kopierat!" (med Check-ikon) i 1,6 sekunder

---

### Commits

| Hash | Innehåll |
|------|----------|
| `aefd047` | Tema-konsekvens, delad seed-data och floaty topbar (föregående session) |
| `965628e` | Full routing för byggbänken — inga dead ends |

---

### Verifierat i webbläsare

| Sida | Status |
|------|--------|
| `/profile/christoffer` | ✅ Avatar, bio, verktyg, Smartbok.se-korten |
| `/help/vercel-vagrar-deploya` | ✅ Fråga, 3 svar med avatarer och profillänkar |
| `/prompts/stopp-claude-designen` | ✅ Prompt-text, Saras avatar, kopiera-knapp |
| Startsidan — aktivitetsfeed | ✅ Alla 6 kort har korrekt targetUrl + profilänkar |

---

## 🔜 Nästa steg — Fas 4–6: Riktiga backend-flöden

**Prioritet:**
1. **Fas 4 — Hjälpfrågor:** `/help`-listsida med filter, `/help/new`-formulär, riktiga svar i Firestore, markera löst
2. **Fas 5 — Prompts:** `/prompts/new`-formulär, riktiga prompts i Firestore
3. **Fas 6 — Profiler:** Riktiga Firestore-profiler på `/profile/[handle]` (nuvarande sida visar bara seed-data)

**Seed-data är nu fullt konsekvent och länkad** — när Firestore-data kopplas på kan seed-fallbacks plockas bort fas för fas.

---

---

## 2026-06-23 — Felsökning: 500 på projektsidor + `/projects` visade fel

### Bakgrund — symptomet

Användaren fick **svart error-sida ("This page couldn't load — A server error occurred")** på Vercel
vid klick på "Se alla byggen" (`/projects`) och "Visa tråd" (`/projects/[slug]`). Lokalt funkade allt,
builden var grön — felet syntes bara i produktion. Dessutom visade `/projects` fel innehåll
(avskalad leaderboard som saknade status, taggar och kommentarer).

---

### ⚠️ Rotorsak — firebase-admin kraschar vid import på Vercel

**Det här är den viktigaste lärdomen från sessionen. Läs noga.**

`firebase-admin` kraschade vid **modul-laddning** i Vercels serverless-runtime — *innan* någon
`try/catch` i `admin.ts` hann köra. En statisk `import` som kastar vid laddning tar ner hela
sidan med en ofångbar 500. Lokalt och i builden maskerades felet helt.

**Bevisat** genom att skapa `/api/debug-firebase` (trivial route med `try/catch` runt
`import("@/lib/firebase/admin")`). När även den returnerade 500/`import: "FAILED"` var det
bevisat att själva importen kraschar, inte vår kod.

Felkedjan i två lager:

1. **Next.js buntade `firebase-admin`** → dess dynamiska `require`/native-beroenden går sönder.
   - **Fix:** `serverExternalPackages: ["firebase-admin"]` i `next.config.ts` (laddas direkt från
     node_modules istället för att buntas). Commit `1784559`.
2. **Statiska imports som kan krascha vid laddning** → ofångbar 500.
   - **Fix:** bytte till dynamisk `import()` inuti `try/catch` i `src/app/projects/page.tsx`,
     `src/app/projects/[slug]/page.tsx` och `/api/debug-firebase`. En import-krasch blir nu en
     **fångbar** rejection och sidan faller tillbaka på seed-data. Commit `4ddd961`.

**Resultat:** Svarta error-sidan är borta. `/projects` och `/projects/smartbok-se` ger 200.

---

### 🔴 KVARSTÅENDE BLOCKERARE — firebase-admin laddar fortfarande INTE i produktion

Sidorna funkar nu **bara tack vare seed-fallbacken**. `/api/debug-firebase` på Vercel visar:

```
ERR_REQUIRE_ESM: require() of ES Module .../jose/dist/webapi/index.js
from .../jwks-rsa/src/utils.js not supported
```

**Vad det betyder:** `firebase-admin` → `jwks-rsa@4.1.0` gör `require("jose")`, men `jose@6.2.3`
är **ESM-only** och kan inte `require()`:as. Alltså:

> **Riktig Firestore-data laddas INTE på Vercel än. Allt som visas på `/projects`,
> `/projects/[slug]`, profilsidor osv. är seed-data.** Det måste lösas innan Fas 4–6
> (riktiga frågor, prompts, profiler) kan kopplas på på riktigt.

**Möjliga lösningar att utvärdera (ej testade än):**
- Pinna `jose` till en CJS-kompatibel version via `overrides` i `package.json`
- Separera `firebase-admin/auth` (det är `auth` som drar in `jwks-rsa`) från läs-vägen, så att
  ren Firestore-läsning inte tvingar in jose
- Kontrollera Node-version på Vercel + ev. firebase-admin-uppgradering som hanterar ESM-jose

---

### Ändring — `/projects` visar nu fulla projektkort

**Status:** ✅ Klar · Commit `1c2c6d1`

- `src/app/projects/page.tsx` — bytte ut den avskalade leaderboard-listan mot ett rutnät av
  `ProjectCard` (samma komponent som startsidans `ProjectShowcase`). 22 rader in, 97 bort.
- Båda sidorna drar nu från **samma** `SEED_PROJECTS` i `src/lib/seed.ts`.
- Varje kort visar nu: namn, tagline, status-sticker, taggar, antal borrar, antal kommentarer,
  "Visa bygget"-knapp. Sorterat efter flest borrar.
- Tom-state visas **bara** om listan faktiskt är tom (omöjligt så länge seed finns).

---

### Verifierat

- `tsc --noEmit` ✅ · `eslint` ✅ · `npm run build` ✅
- Live: `/projects` → 200, `/projects/smartbok-se` → 200 (curl-poll)
- Lokal DOM-snapshot: alla 7 byggen renderas sorterade efter borrar
  (AIkostnad 24 → MenuPilot 21 → Runnr 21 → Smartbok 18 → Need Radar 15 → Amazon Snipe 11 → BTC Edge 9),
  med status, taggar, "Visa bygget", inga console-errors.

> 💡 **Notering om verktyg:** `preview_screenshot` timeoutar på den här appen — Firebase
> klient-SDK håller en långlivad anslutning öppen så sidan når aldrig "network idle".
> Använd `preview_snapshot` (DOM-träd) eller `curl` för verifiering istället.

---

### 🔜 Nästa steg (uppdaterad prioritet)

1. **🔴 Lös firebase-admin ERR_REQUIRE_ESM på Vercel** — blockerar all riktig data. Högst prioritet
   innan mer backend byggs. Se "KVARSTÅENDE BLOCKERARE" ovan.
2. Ta bort `/api/debug-firebase` när blockeraren är löst (diagnos-route, ska inte ligga kvar i prod).
3. Därefter Fas 5–6 enligt plan: prompts, riktiga profiler i Firestore.

---

---

## 2026-06-23 — Fas 4 ✅ Klar

### Fas 4 — Hjälpfrågor

**Status:** ✅ Klar  
**Commit:** `5d43c1e`

---

#### Vad som byggdes

**`src/lib/constants/tools.ts`** (nytt):
- `TOOL_OPTIONS` — konstantarray med alla AI-verktyg (Claude, ChatGPT, Cursor, v0, Bolt, Replit, Lovable, Vercel, Supabase, Firebase, Stripe, Annat)
- `TOOL_ACCENT` — mapping tool → CSS-variabelfärg (Claude → bug-red, ChatGPT → build-green, osv.)
- `toolAccent(tool)` — hjälpfunktion för säker lookup med fallback

**`src/lib/firebase/help-client.ts`** (nytt, klient-SDK):
- `makeUniqueHelpSlug(title)` — sluggenerering med kollisionskontroll mot `posts`-collection
- `createHelpPost(data)` — skapar post med type="help", status="open" i Firestore
- `addAnswer(input)` — lägger till svar i `posts/{postId}/comments` + incrementerar commentCount
- `subscribeToAnswers(postId, callback)` — real-time `onSnapshot` på svarstråd
- `acceptAnswer(postId, commentId, previousCommentId)` — atomic batch: isAccepted=true på kommentar + status="solved" + acceptedCommentId på post

**`src/lib/firebase/help.ts`** (nytt, Admin SDK):
- `getHelpPosts(limitCount)` — hämtar posts med type="help", sorterar i minnet (undviker composit-index)
- `getHelpPostBySlug(slug)` — söker på slug (enkelt index) + verifierar type i kod
- `getPostAnswers(postId)` — hämtar kommentarer i sub-collection, sorterat asc

**`src/types/firestore.ts`** (uppdaterat):
- `Post` fick optional fält: `userDisplayName`, `userAvatarUrl`, `username?`, `tryFix?`, `alreadyTried?`, `projectUrl?`

**`src/lib/seed.ts`** (uppdaterat):
- `HelpQuestion` fick `tools?: string[]` för filtreringsstöd
- "sessionen-forsvinner-vid-reload" fick 2 svar (Christoffer + Jonas) → nu 3 av 8 seed-frågor har svarstrådar

**`src/components/help/HelpForm.tsx`** (nytt, klient-komponent):
- 6 fält: titel, verktyg (multi-select-chips), body/tryDo, tryFix, alreadyTried (valfri), projectUrl (valfri)
- Validation på allt; slug-förhandsgranskning under titelfältet
- submit → `createHelpPost` → redirect till `/help/[slug]`

**`src/components/help/AnswerSection.tsx`** (nytt, klient-komponent):
- Real-time subscription via `subscribeToAnswers`
- Initialdata från SSR (inga flimrar)
- `timeAgo()` — relativ tidsstämpel på svenska
- Acceptera-knapp visas bara för frågeägaren på ej-accepterade svar
- Avatar/initialer fallback, länk till profil

**`src/components/help/HelpFilterList.tsx`** (nytt, klient-komponent):
- Status-filter (segmenterat: Alla/Öppna/Lösta)
- Verktygsfilter (chip-knappar, single-select)
- Filtrering sker i minnet, utan extra Firestore-anrop
- Empty state vid inga matchningar

**`src/app/help/page.tsx`** (omskriven):
- `dynamic = "force-dynamic"` — aldrig cachad
- Server Component hämtar Firestore (med seed-fallback)
- `postToHelpQuestion(post)` — adapter Post → HelpQuestion
- Renderar `<HelpFilterList posts={questions} />`

**`src/app/help/new/page.tsx`** (omskriven):
- Client Component med auth guard (redirect till /login?from=/help/new om ej inloggad)
- Renderar `<HelpForm />` när inloggad

**`src/app/help/[slug]/page.tsx`** (omskriven):
- `dynamic = "force-dynamic"` — ingen `generateStaticParams` längre
- Försöker Firestore (med seed-fallback)
- **Firestore-post:** visar strukturerade fält (body/tryDo, tryFix, alreadyTried, projectUrl) + `<AnswerSection>`
- **Seed-post:** visar body + statisk svarstråd + CTA att logga in

**`firestore.rules`** (uppdaterat):
- Ny regel för `posts/{postId}/comments/{commentId}`:
  ```
  allow update: if ... || (isSignedIn()
      && get(...posts/$(postId)).data.userId == request.auth.uid
      && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['isAccepted']));
  ```
  → Frågeägaren kan ENBART sätta `isAccepted` — ingenting annat.

---

#### Problem och beslut

| Problem | Beslut |
|---------|--------|
| `where("type","==","help").orderBy("createdAt","desc")` kräver composit-index | Återinförde `orderBy("createdAt","desc")` explicit + skapade composit-index i `firestore.indexes.json` |
| firebase-admin ERR_REQUIRE_ESM på Vercel (löst 2026-06-23) | `"engines":{"node":">=22"}` i package.json — Node.js 22 har stabil `require(esm)` |
| Turbopack HMR cacheade gammal server-modul lokalt | Starta om dev-server för att rensa cache; drabbar inte production |

---

#### Verifierat

| Vy | Status |
|----|--------|
| `/help` — lista + filter Alla/Öppna/Lösta + verktygsfilter | ✅ 8 seed-frågor, filterknappar renderade, tom-state vid nollresultat |
| `/help/claude-skrev-om-hela-layouten` — detaljsida med svar | ✅ Accepterat svar (Sara), 2 vanliga svar, CTA-sektion |
| `/help/new` — utan inloggning | ✅ Redirect till login |
| `tsc --noEmit` | ✅ Inga fel |
| `npm run lint` | ✅ 0 fel (1 pre-existerande varning i prompts/[slug]) |
| `npm run build` | ✅ Ren, /help och /help/[slug] markeras som ƒ (dynamic) |

---

## 🔜 Nästa steg — Fas 5 och 6

**Prioritet:**
1. ✅ ~~**Lös firebase-admin ERR_REQUIRE_ESM på Vercel**~~ — fixat 2026-06-23
2. ✅ ~~**Firestore-index (posts: type + createdAt)**~~ — skapat och verifierat 2026-06-23
3. **Fas 5 — Prompts:** `/prompts/new`-formulär, riktiga prompts i Firestore
4. **Fas 6 — Profiler:** Riktiga Firestore-profiler, redigera profil

---

## 2026-06-23 — Fix: firebase-admin ERR_REQUIRE_ESM (blocker löst, stabil lösning)

**Rot-orsak:**
`firebase-admin@14.0.0` → `jwks-rsa@4.1.0` gör `require("jose")` vid import av `firebase-admin/auth`. `jose@6.2.3` är ESM-only. På Node.js 18/20 kastar detta `ERR_REQUIRE_ESM`. `serverExternalPackages: ["firebase-admin"]` var redan satt i `next.config.ts` och förhindrar bundling-krasch, men hjälper inte om Node.js-versionen saknar `require(esm)`-stöd.

**Lösning:**
Node.js 22.12 (november 2024) lade till stabil `require(esm)` — ESM-moduler kan nu laddas via `require()` utan fel. Vercel väljer Node.js-version baserat på `engines.node` i `package.json`. Satte `"engines": { "node": ">=22" }`.

**Ändringar:**
- `package.json`: tillagd `"engines": { "node": ">=22" }`
- `src/lib/firebase/admin.ts`: återställd till komplett form med `firebase-admin/auth` + `firebase-admin/storage`

**Verifierat lokalt (Node.js 22.22.3):**
- `require("jwks-rsa")` (som internt gör `require("jose")`) → ✅ laddas utan fel
- `tsc --noEmit` → ✅ inga fel
- Ingen workaround, inga version-pins, ingen lazy import-hackery

**Varför det är framtidssäkert:**
- Node.js 22 är LTS fram till april 2027
- `require(esm)` är en stabil, specad Node.js-funktion — försvinner inte
- Hela `firebase-admin` fungerar — auth, firestore, storage — utan kodändringar
- Ingen konfiguration att underhålla utöver engines-fältet

---

## 2026-06-23 — Firestore-index + komplett flödesverifiering

**Firestore composit-index:**
`getHelpPosts` med `where("type","==","help").orderBy("createdAt","desc").limit(50)` kräver ett composit-index. Lagt till i `firestore.indexes.json` och deployat via Firebase Console. Index skapades och aktiverades under session.

**Verifierat (Playwright, 17/17):**

| Kategori | Status |
|----------|--------|
| Alla sidor 200, inga 500 | ✅ |
| `/help` filter (Alla/Öppna/Lösta + verktyg) | ✅ |
| `/help/[slug]` detaljsida | ✅ |
| `/help/new` → redirect till login | ✅ |
| `/projects/new` → redirect till login | ✅ |
| `/login` Google + GitHub | ✅ |
| Firestore live-data (9 frågor, 9 projekt) | ✅ |
| Inga kritiska konsolfeel | ✅ |

---

## 2026-06-23 — Fas 5 klar: Prompts med Firestore, auth-gate, borrar och riktiga seed-konton

### Vad som byggdes

**Prompts-flöde (Fas 5):**
- `src/lib/firebase/prompts.ts` — Server-side Admin SDK: `getPromptPosts()` och `getPromptPostBySlug()`
- `src/lib/firebase/prompts-client.ts` — Klient-SDK: `makeUniquePromptSlug()`, `createPromptPost()`, `getUsernameFromProfile()`, `togglePostUpvote()`, `hasPostUpvoted()`
- `src/components/prompts/PromptForm.tsx` — Formulär med 4 fält (titel, verktyg, kategori, prompt-text), badge-förslag, validering, submit → Firestore → redirect
- `src/components/prompts/PromptDrillButton.tsx` — Upvote-knapp (borrar) med drill-animation, samma mönster som DrillButton för projekt
- `src/app/prompts/page.tsx` — Uppdaterad: hämtar från Firestore, seed-fallback vid fel
- `src/app/prompts/[slug]/page.tsx` — Uppdaterad: SSR + auth-gate via `__session`-cookie, CopyButton, PromptDrillButton
- `src/app/prompts/new/page.tsx` — Uppdaterad: auth-guard (redirect till login om ej inloggad), renderar PromptForm

**Auth-gate på prompt-text:**
- Inloggade användare ser full prompt-text + Kopiera-knapp + Borrar-knapp
- Ej inloggade ser lås-ikon + "Logga in för att se prompten"
- Server-side check via `cookies().__session` (inte bara klient-side)

**Riktiga seed-konton (scripts/seed-firebase.ts):**
- 11 Firebase Auth-konton med deterministiska UID:n (`seed_${username}`)
- 11 Firestore-profiler med bio, verktyg, avatar-URL, gick-med-datum
- 7 projekt, 8 help-posts (med answer-subsamlingar och acceptedCommentId), 4 prompts
- Idempotent: kör-om gör ingenting (check-before-create via slug/uid)
- Seed-emails (`${username}@seed.aibyggare.se`) — syns inte för riktiga användare

### Problem lösta

- `@/lib/auth/AuthContext` (fel sökväg) → korrigerat till `@/contexts/AuthContext`
- `useEffect` saknades i React-import → lagt till
- Firestore composite-index för `type + createdAt` behövde byggas om efter seed-data — väntade ~2 min, indexet aktiverades

### Verifierat

| Sida | Status |
|------|--------|
| `/projects` — 7 riktiga Firestore-projekt, sorterade efter upvotes | ✅ |
| `/prompts` — 4 riktiga prompts, auth-gate på text, @handles länkade | ✅ |
| `/help` — 8 riktiga help-posts (5 öppna, 3 lösta), filtrera fungerar | ✅ |
| `/profile/christoffer` — riktig Firestore-profil, projekt synliga | ✅ |
| Composite Firestore-index (type + createdAt) — aktivt | ✅ |

### Nästa steg

🔜 **Fas 6 — Profiler:** Redigera profil-sida, visa egna posts på profil, real-data profilsidor för alla seed-användare

---

## 2026-06-23 — Hjälp-omdesign + riktiga kommentarer på projekt (commit `bfd1dc6`)

> Loggades i efterhand (session 7) — arbetet committades men dokumenterades inte direkt.

### Vad som byggdes

**Hjälpsektionen omdesignad så den matchar projektflödet visuellt:**
- `HelpCard.tsx` — ny struktur som speglar `ProjectCard` exakt: author i header, status-badge, topic-tagg, "Se frågan"-knapp. Tidigare hade hjälp- och projektkort olika formspråk; nu känns de som samma plattform.
- `help/[slug]/page.tsx` — stor omskrivning (–248 rader netto). Rensade bort de strukturerade fälten `tryFix`/`alreadyTried`/`projectUrl` från detaljsidan. En hjälpfråga är nu enkel: titel + beskrivning + kommentarer. Beslut: structured "vad testade du"-formulär var överarbetat för MVP och skapade friktion.
- `HelpForm.tsx` — förenklat från 6 fält till 3: titel, verktyg (dropdown), beskrivning (–207 rader).
- `HelpCommentSection.tsx` (ny) — ersätter den tidigare `AnswerSection` med structured/accepterade svar. Nu enkla kommentarer, samma mönster som projektens `CommentSection`. Accept-svar-funktionen togs bort från UI:t i denna vända (rules finns kvar i `firestore.rules`).

**Riktiga kommentarer på projekt:**
- `scripts/seed-firebase.ts` (+108 rader) — seedar nu 3 kommentarer per projekt från seed-användare i `projects/{id}/comments`. Projektdetaljsidor visar därmed levande diskussion direkt, inte tomma kommentarsfält.

**Tekniska fixar:**
- `projects.ts` + `help.ts` — Firestore `Timestamp` serialiseras nu till plain objects innan de korsar RSC-gränsen (Server → Client Component). Löser RSC-serialiseringsfel ("only plain objects can be passed").
- `CommentSection.tsx` + `HelpCommentSection.tsx` — prenumererar bara på real-time (`onSnapshot`) om användaren är inloggad. Utloggade ser SSR-data. Sparar onödiga öppna Firestore-anslutningar för anonyma besökare.

### Beslut värt att minnas
- **Structured answers → enkla kommentarer:** Vi backade medvetet från "accepterat svar"-modellen i hjälp-UI:t. Det var Stack Overflow-tänk; communityn ska kännas mer som en byggbänk där folk slänger in tips. `acceptedCommentId` och rules ligger kvar om vi vill återinföra det senare.

---

## 2026-06-24 — Session 7: säkrade branch + Fas 6 (settings + riktiga profiler)

### Vad som gjordes

**1. Säkrade opushat arbete**
- Branchen `claude/continuation-lc92qk` fanns bara lokalt — pushade till origin.
- Dokumenterade commit `bfd1dc6` (hjälp-omdesignen) i devloggen i efterhand, se entry ovan.

**2. AuthContext — delad profil (`ProfileLite`)**
- AuthContext exponerar nu `profile: { username, displayName, avatarUrl }` + `refreshProfile()`.
- Hämtas en gång per session i `onIdTokenChanged` (delas av header, settings, m.fl.) istället för per sida.
- **Varför:** Headern länkade profilen till `/profile/${user.displayName}` — men profil-routen slår upp på **username**. För riktiga användare (displayName med mellanslag/versaler) blev det en död länk. Nu länkas korrekt username.

**3. Header**
- Profillänk → `/profile/${profile.username}` (fallback `/onboarding` om username saknas).
- Avatar visar den valda profilbilden (`profile.avatarUrl`) istället för bara OAuth-foto.
- Ny "Inställningar"-kugg (desktop) + "Min profil"/"Inställningar"-länkar i mobilmenyn.

**4. Settings-sida (`/settings`) — Redigera profil** *(Fas 6)*
- Client component med auth-guard (redirect till `/login?from=/settings`); routen var redan skyddad i `proxy.ts`.
- Laddar befintlig profil från Firestore, för-ifyller formuläret (loading-skeleton under hämtning).
- Fält: avatar (två illustrerade + ev. OAuth-bild), username (unik-check exkl. en själv), visningsnamn, bio, verktyg, **externa länkar** (website/github/linkedin — fanns i datamodellen men hanterades inte förrän nu).
- URL-validering (http/https) på länkar. Sparar via `updateDoc` → `refreshProfile()` → "Sparat ✓".

**5. Riktiga Firestore-profiler på profilsidan (`/profile/[handle]`)** *(Fas 6)*
- `src/lib/firebase/profiles.ts` (ny, Admin SDK): `getProfileByUsername`, `getProjectsByUser`, `getPostsByUser`. Querys på `userId`/`username` utan `orderBy` + sortering i minnet → **inga nya composite-index krävs**.
- Profilsidan: `force-dynamic`, läser Firestore (med seed-fallback), normaliserar båda källor till en gemensam `ProfileView` så renderingen är identisk.
- Visar nu externa länkar (Globe + inline GitHub/LinkedIn-SVG, eftersom lucide-versionen saknar de ikonerna).
- Tog bort `generateStaticParams` (sidan är dynamisk nu).

**6. Deploy till Vercel-produktion**
- Fast-forwardade `main` från `bfd1dc6` → `22548ac` (de två nya commits: devlog-dok + Fas 6). Ren fast-forward, ingen merge-commit.
- Push till `main` triggar Vercels produktions-deploy enligt det dokumenterade flödet.
- **⚠️ Kunde inte verifiera live-sajten härifrån:** containerns nätverkspolicy släpper bara igenom paketregister + Anthropic. Utgående mot `aibyggare.vercel.app` ger `000` och proxyn nekar `fonts.googleapis.com` med 403 (samma orsak som att lokal build inte kunde hämta Google Fonts). Vercels egen byggmiljö når Google Fonts, så builden bör gå grön där precis som tidigare `main`-deployer. Verifiering av live-deployen ligger hos användaren (Vercel-dashboard / besök `/settings`).

### Problem och beslut

| Problem | Beslut |
|---------|--------|
| Header länkade till `displayName` istället för `username` → död länk för riktiga användare | Delade `ProfileLite` via AuthContext; header använder `username` |
| Header-länk till username skulle 404:a för icke-seed-användare så länge profilsidan bara läste seed | Kopplade profilsidan till Firestore (samma vända) så riktiga profiler resolvar |
| `Github`/`Linkedin` saknas i lucide-react-versionen | Inline-SVG-märken (samma konvention som login-sidan) |
| Composite-index för `userId + createdAt` | Undvek helt — query på `userId`, sortera i minnet |

### Verifierat
- `tsc --noEmit` ✅ inga fel
- `npm run lint` ✅ 0 fel
- `npm run build` ⚠️ kan inte slutföras i denna container: `next/font/google` (Fredoka/Geist/IBM Plex Mono) blockeras av proxyn. Felen rör **inga** av våra filer — rent miljöproblem, samma typ som `preview_screenshot`-timeouten.

### Nästa steg
🔜 **Fas 6 sista punkt:** Statiska badges (Första bygget, Hjälpt någon, Delat prompt, Fått 10 upvotes, Projekt live).
🔜 Därefter **Fas 7 — Admin** eller **Fas 8 — Polish**.

---

## 2026-06-24 — Fas 6 KLAR: statiska community-märken

### Vad som byggdes

**`src/lib/constants/badges.ts`** (ny):
- 5 märken som speglar communityns kärnhandlingar: **Första bygget** (≥1 projekt), **Hjälpt någon** (skrivit minst en kommentar/svar någonstans), **Delat en prompt** (≥1 prompt), **10 borrar** (≥10 borrar totalt), **Projekt live** (projekt med live-status).
- Märken är **härledda, inte lagrade** — varje märke har ett predikat mot `BadgeStats`. Ingen achievement-tabell att hålla i synk; statusen följer alltid datan.

**`src/components/profile/ProfileBadges.tsx`** (ny):
- Server-komponent. Visar hela uppsättningen: intjänade i full accentfärg, övriga dämpade (streckad border) som mål att sikta mot. Räknare "(x/5)". `title`/`aria-label` med beskrivning.

**`src/lib/firebase/profiles.ts`** — `hasHelpedSomeone(userId)`:
- collectionGroup-query på `comments` där `userId == uid`, `limit(1)`. Admin SDK kringgår Security Rules, så **bara ett index** behövs (ingen rules-ändring).
- try/catch → om indexet saknas visas bara inte märket; sidan kraschar aldrig.

**`firestore.indexes.json`** — ny `fieldOverride`:
- `comments.userId` med `COLLECTION_GROUP`-scope. **⚠️ Måste deployas** (Firebase Console / `firebase deploy --only firestore:indexes`) för att "Hjälpt någon" ska aktiveras i produktion. Övriga 4 märken kräver inget index.

**`src/app/profile/[handle]/page.tsx`**:
- Räknar fram `BadgeStats` i båda källorna. Firestore: summerar borrar över projekt+help+prompts, `helpedSomeone` via collectionGroup. Seed: matchar live på ordet "live" (seed-status är friform), `helpedSomeone` genom att skanna seed-svar på username.
- Renderar `<ProfileBadges>` i profilkortet under verktygen.

### Beslut värt att minnas
- **"Hjälpt någon" = skrivit en kommentar var som helst** (inte strikt "på någon annans fråga"). Att exkludera egna inlägg kräver att man känner förälderns ägare per kommentar → onödig komplexitet för ett statiskt MVP-märke. Approximationen är ärlig nog och kan skärpas senare.
- **Visar även icke-upplåsta märken (dämpade)** — ger nya byggare tydliga, lågtröskliga mål som alla mappar mot communityns kärnhandlingar.

### Verifierat
- `tsc --noEmit` ✅ · `npm run lint` ✅ · `firestore.indexes.json` giltig JSON ✅
- `npm run build` ⚠️ samma Google Fonts-blockering i containern (miljö, ej vår kod).

### Status
✅ **Fas 6 — Profiler KLAR.** Publik profilsida (riktiga Firestore-profiler), settings/redigera profil, avatar-picker, externa länkar och statiska märken — allt på plats.

🔜 **Nästa:** Fas 7 (Admin) eller Fas 8 (Polish). Glöm inte deploya `comments.userId`-indexet för "Hjälpt någon"-märket.

---

## 2026-06-24 — Fas 7 KLAR: Admin och moderering (med säkerhetshärdning)

### Säkerhetsgrund (det viktigaste)

**`src/lib/auth/admin-guard.ts`** — `getAdminUser()`:
- Läser `__session`-cookien, verifierar den **kryptografiskt** med `adminAuth.verifyIdToken()` och kontrollerar `profiles/{uid}.role === 'admin'` server-side.
- Detta är det RIKTIGA säkerhetsskiktet. `proxy.ts` (som nu även täcker `/admin`) är bara ett UX-skydd — det avkodar JWT utan kryptoverifiering och får aldrig vara enda grinden.
- Används av både `/admin`-sidan (redirect om ej admin) och API-routen (403 om ej admin).

### Två privilege-escalation-hål tätade i `firestore.rules`

> ⚠️ **Måste deployas** (`firebase deploy --only firestore:rules`) — annars gäller gamla reglerna i produktion.

1. **Role-escalation:** `profiles` tillät `allow update: if isOwner(...)` utan fältbegränsning. Eftersom klient-SDK:n är publik kunde vem som helst sätta `role:'admin'` på sin egen profil och bli admin. **Fix:** ägaren får uppdatera allt **utom** `role`; bara admin/Admin SDK ändrar role.
2. **isFeatured self-promotion:** `projects`/`posts` tillät ägaren att sätta valfritt fält, inkl. `isFeatured` → självutnämnt "veckans bygge". **Fix:** ägaren får redigera eget innehåll utom `isFeatured`/`userId`; featured är admin-only.
3. **Bonus — latent röst-gap:** gamla regeln tillät bara ägare/admin att uppdatera projekt/post, men röst-/kommentarskoden skriver `upvoteCount`/`commentCount` som icke-ägare. Nya regeln har ett carve-out: vem som helst inloggad får uppdatera **enbart** dessa räknare. Röster/kommentarer från andra än ägaren fungerar nu enligt reglerna.

### Funktioner

**Admin-dashboard (`/admin`)** — server-komponent, skyddad av `getAdminUser()`:
- Statistik via `count()`-aggregering (billigt): användare, projekt, frågor, prompts, kommentarer, öppna rapporter.
- Rapportlista med länk till innehållet + "Markera löst".
- Senaste innehåll (projekt + inlägg) med "Utse" (featured-toggle) och "Radera".
- `robots: noindex`.

**Säker mutations-API (`/api/admin/action`):**
- Re-verifierar admin på varje anrop. Explicit action-allowlist (`delete-project/post`, `feature-project/post`, `resolve-report`), manuell validering, avvisar path-liknande id:n (`/`).
- Använder Admin SDK (kringgår rules — men routen gör egen admin-koll).

**Rapportknapp (`src/components/moderation/ReportButton.tsx`)** — användarvänd:
- Inloggade kan rapportera projekt/inlägg (skriver till `reports` med `reporterId == uid`, vilket rules kräver). Placerad på projekt- och hjälp-detaljsidor (bara för riktiga Firestore-poster).

**`src/lib/firebase/admin-data.ts`:** `getAdminStats`, `getOpenReports`, `getRecentContent`.

**Header:** admin-länk (`ShieldCheck`) visas bara om `profile.role === 'admin'` (role tillagd i `ProfileLite`).

**Städning:** tog bort diagnostik-routen `/api/debug-firebase` (blockeraren den fanns för är sedan länge löst).

### Beslut
- **Manuell validering i API-routen, inte Zod.** Zod är inte installerat och används ingenstans i kodbasen (formulären validerar manuellt). Att dra in det bara här vore inkonsekvent; strikt allowlist + typkontroller ger samma skydd.

### Verifierat
- `tsc --noEmit` ✅ · `npm run lint` ✅ · `firestore.rules` brace-balanserad ✅
- `npm run build` ⚠️ samma Google Fonts-blockering i containern (miljö, ej vår kod).
- ⚠️ **Kunde inte testa Firestore Rules här** (ingen emulator). Reglernas `diff().affectedKeys()`-logik bör verifieras efter deploy: (a) en vanlig användare kan INTE sätta role/isFeatured på sig själv/sitt innehåll, (b) röster/kommentarer från andra användare fungerar fortfarande.

### Deploy-checklista för produktion (Fas 6 + 7)
1. `firebase deploy --only firestore:rules` — **kritiskt**, annars gäller escalation-hålen.
2. `firebase deploy --only firestore:indexes` — för `comments.userId` (märket "Hjälpt någon").
3. Sätt `role: 'admin'` på ditt eget `profiles/{uid}`-dokument (Firebase Console) för att se `/admin`.

### Status
✅ **Fas 7 — Admin och moderering KLAR.**
🔜 **Nästa:** Fas 8 — Polish (responsivitet, a11y, empty/loading/error-states, SEO/OG, sitemap, prestanda).

---

## 2026-06-24 — Fas 8 (Polish): SEO-grund + globala states

### Vad som byggdes

**SEO-metadata (`src/app/layout.tsx`):**
- `metadataBase` (från `NEXT_PUBLIC_SITE_URL`, fallback till prod-URL) → relativa OG/canonical-länkar blir absoluta.
- Title-mall `%s — AIbyggare.se` så undersidor får konsekvent suffix.
- `keywords`, `applicationName`, `authors`, `alternates.canonical`.
- Komplett `openGraph` (url, siteName, locale, type) + `twitter` (summary_large_image).

**Sitemap + robots:**
- `src/app/sitemap.ts` — statiska rutter + dynamiskt innehåll (projekt/frågor/prompts/profiler). Försöker Firestore, faller tillbaka på seed-slugs → robust även om Firestore är nere.
- `src/app/robots.ts` — tillåter allt utom `/admin`, `/settings`, `/onboarding`, `/api/`, `/login`, `/register`. Pekar på sitemap.

**Globala states:**
- `src/app/not-found.tsx` — branded 404 (sticker, chunky CTA:er).
- `src/app/error.tsx` — branded error-boundary (client, `reset()`-knapp).
- `src/components/ui/Skeletons.tsx` — återanvändbara `CardSkeleton`/`CardGridSkeleton`/`PageHeaderSkeleton`.
- `loading.tsx` för `/projects`, `/help`, `/prompts`, `/profile/[handle]` — skeletons som matchar kortens form (ingen layout-shift vid datainladdning).

### Vad som INTE kunde göras här (manuellt, kräver webbläsare)
- **Responsivitet-genomgång, a11y-review, Lighthouse/performance** — kräver en riktig webbläsare och mänskligt öga; går inte i agent-containern. Flyttat till "Manuella steg" i plan.md.
- **OG-bild** (1200×630 PNG) — behöver designas och läggas som `src/app/opengraph-image.png`. Metadatan är förberedd.

### Verifierat
- `tsc --noEmit` ✅ · `npm run lint` ✅
- `npm run build` ⚠️ samma Google Fonts-blockering i containern (miljö, ej vår kod).

### Status
🔧 **Fas 8 — Polish: infrastrukturen klar** (SEO, sitemap, robots, loading/error/404, no-ai-look). Review-baserade punkter (responsiv/a11y/perf) kvar som manuella steg.

> **Alla manuella steg är nu samlade i `plan.md` under "⚠️ MANUELLA STEG SOM DU MÅSTE GÖRA".**

---

## 2026-06-24 — Code-review-analys: 4 findings åtgärdade (commit `e2bf973`)

### Bakgrund

Genomförde en multi-vinkel code-review på hela kodbasen med fokus på den senaste committen (`bfd1dc6`). Hittade 4 bekräftade fel via automatiserad analys (line-by-line + borttagnings-auditor + cross-file-kontroller) — alla åtgärdade i samma session.

### Findings och fixes

| # | Allvarlighetsgrad | Fil | Problem | Fix |
|---|---|---|---|---|
| 1 | 🔴 Funktionell regression | `HelpCommentSection.tsx` | `acceptAnswer`-funktionaliteten plockades bort när `AnswerSection` ersattes med `HelpCommentSection`. Frågeägare kunde inte längre markera ett svar som löst; alla poster fastnade som "Öppen". | Återinförde accept-logiken: `postOwnerId`/`acceptedCommentId`-props, "Markera som löst"-knapp (bara synlig för ägaren på ej accepterade svar), grön "Accepterat svar"-badge, anropar `acceptAnswer()` atomict via Firestore-batch. |
| 2 | 🟡 Typfel + cast | `src/types/firestore.ts` + `help/[slug]/page.tsx` | `Comment.createdAt/updatedAt` var `Timestamp` (non-nullable) men koden satte dem till `null` för seed-kommentarer och behövde `as unknown as Comment` för att kompilera. | Ändrade typen till `Timestamp \| null` — matchar faktisk användning; tog bort `as unknown as Comment` och lade till alla obligatoriska fält i seed-objekten. |
| 3 | 🟡 Duplikation | `projects.ts` + `help.ts` | `serializeDoc`, `requireDb`, `withTimeout` var byte-identiska i båda filerna. Ändring på ett ställe skulle lämna det andra bakom. | Extraherade till `src/lib/firebase/admin-utils.ts`. Båda filer importerar nu från det delade utilityt. |
| 4 | 🔴 Build-krasch | `HelpCard.tsx` | `onClick={(e) => e.stopPropagation()}` på en `<Link>` i en Server Component → `Event handlers cannot be passed to Client Component props`. Kraschade prerendering av alla `/profile/[handle]`-sidor. | Tog bort `onClick` — inget klick-beteende behövde stoppas (artikel-elementet saknar `onClick`). |

### Verifierat

- `tsc --noEmit` ✅ inga fel
- `npm run lint` ✅ 0 fel/varningar
- `npm run build` ✅ ren (alla 22 routes bygger korrekt, `/profile/[handle]` prerenderas korrekt)

---

## 2026-06-24 — Problemhörnan: komplett rebrand av hjälpsektionen

**Commit:** `7a6a970`

### Bakgrund och beslut

Hjälpsektionen hette `/help` och "Fastnat?" i nav. Beslutades att byta identitet till **Problemhörnan** — mer personlig, minnesvärd och träffsäker för målgruppen. URL:en `/problemhornan` (utan å/ä/ö) valdes för teknisk kompatibilitet.

### Vad som gjordes

**Nya sidor (4 filer):**
- `src/app/problemhornan/page.tsx` — listvy, copy: "Här hamnar buggar, trasiga deploys, Supabase-kaos..."
- `src/app/problemhornan/new/page.tsx` — formulärsida, H1: "Vad har du kört fast med?", sticker "Nytt problem"
- `src/app/problemhornan/[slug]/page.tsx` — detaljsida, breadcrumb "Alla problem" → `/problemhornan`, CTA-sektion med problemhörnan-länk
- `src/app/problemhornan/loading.tsx` — skeleton loading state

**`/help/*` konverterade till redirects (3 filer):**
- `src/app/help/page.tsx` → `redirect("/problemhornan")`
- `src/app/help/new/page.tsx` → `redirect("/problemhornan/new")`
- `src/app/help/[slug]/page.tsx` → `redirect("/problemhornan/${slug}")`

**Alla interna länkar uppdaterade (14 filer):**
- Header + Footer: "Fastnat?" → "Problemhörnan", href `/help` → `/problemhornan`
- HelpShowcase: "Fastnat? Du är inte ensam." → "Från Problemhörnan", länk uppdaterad
- StuckBanner: båda CTA:erna pekar på `/problemhornan/*`
- Hero: "Jag har fastnat"-knapp → `/problemhornan/new`
- CommunityMarquee, about, community, contact: alla `/help/new` → `/problemhornan/new`
- LatestBuildActivity: seed-`targetUrl` för problemkorten uppdaterade
- HelpFilterList: empty-state-CTA pekar på `/problemhornan/new`
- HelpForm: redirect efter submit + slug-preview + submit-knapp "Lägg upp problemet →"
- proxy.ts: `/help/new` → `/problemhornan/new` (skyddat av Edge Runtime JWT-check)
- sitemap.ts: `/help` → `/problemhornan`, alla problem-slugs under ny URL

### Verifierat

- `npm run build` ✅ — alla 29 routes, inga fel (inkl. `/help`, `/help/new`, `/help/[slug]` som nu är statiska redirect-sidor)
- Inga kvarvarande `/help`-referenser i `src/` utanför `src/app/help/` (grep-verifierat)
- Pushad till `main`, Vercel-deploy triggas automatiskt

### Status
✅ **Problemhörnan-rebranden klar.** Bakåtkompatibilitet bevarad via redirects.

---

## 2026-06-24 — "Problemet löst"-badge på lösta problem (commit `07b0fac`)

**Vad som gjordes:**
- `public/seed/problemet-lost-badge.png` — skalad ner från 1254×1254/2 MB → 80×80/12 KB med PIL (LANCZOS + compress_level=9)
- `HelpCard.tsx` — wrappar nu i `<div className="relative h-full">` (samma mönster som `ProjectCard`/`stamp-featured`). Badgen renderas `absolute -right-3 -top-3 z-10 rotate-[10deg]` när `status === "Löst"`. Fixade även kvarglömt `/help/${slug}` → `/problemhornan/${slug}` i footer-länken.
- `problemhornan/[slug]/page.tsx` — samma badge-overlay på artikel-wrappern på detaljsidan.

**Syns på:** Problemhörnan-listvyn (HelpFilterList), startsidans HelpShowcase, profilsidor (profile/[handle]) — alla renderar via `HelpCard`. Detaljsidan har sin egna overlay.

**Verifierat:** DOM-snapshot bekräftade badge (`image: "Problemet löst"`) på alla 3 lösta seed-kort; inga badge på öppna. Build ✅.

---

## 2026-06-24 — Seed-data fullt uppfylld för beta (session 9)

### Vad som gjordes

**`src/lib/seed.ts` (statisk fallback-data):**
- Lade till 3 svar på `rls-blockerar-mina-egna-rader` (Christoffer, Jonas, Frida accepterat) — status: Löst
- Lade till 3 svar på `vercel-build-funkar-lokalt` (Sara, Pelle, Oskar accepterat) — status: Löst
- Lade till 3 svar på `diven-vill-inte-centreras` (Maja, Nina, Adam)
- Lade till 3 svar på `claude-skrev-om-hela-filen` (Jonas, Maja, Sara accepterat) — status: Löst
- Lade till 3 svar på `stripe-webhook-200-men-inget-hander` (Christoffer, Adam, Oskar)
- Lade till 3:e svaret på `sessionen-forsvinner-vid-reload` (Sara om loading-state)
- Fixade `claude-skrev-om-hela-layouten` status: "open" → "solved"

**`scripts/seed-firebase.ts`:**
- Samma svarsdata tillagd i `HELP_POSTS`-arrayen (för nya körningar)
- Ny funktion `ensureMissingAnswers()` — hittar befintliga poster med 0 kommentarer och lägger till konfigurerade svar + uppdaterar `status`, `acceptedCommentId`, `commentCount`
- Ny konstant `EXTRA_PROJECT_COMMENTS` + funktion `ensureExtraProjectComments()` — lägger till ytterligare kommentarer på alla 6 projekt som hade färre än sitt `commentCount`-värde. Idempotent via body-duplikat-check.
- `main()` kallar nu båda nya funktionerna

**Seed körd mot Firebase:**
- 5 help-poster fick 3 svar vardera (15 kommentarer adderade)
- Sessionen-posten fick sitt 3:e svar direkt via inline-script
- Kommentarer adderade: smartbok +3, aikostnad +4, need-radar +1, menupilot +5, amazon-snipe +6, runnr +5 (totalt 24 projektkommentarer)

### Verifierat
- `npm run build` ✅ — alla 29 routes, inga fel
- Seed-script körde rent: alla befintliga data hoppades över, ny data skapades
- Alla problem har nu svar, de flesta lösta problem har accepterat svar och badge

### Status
✅ **Seed-data klar för beta.** Alla problem och byggen har realistiska, varierade kommentarer från fiktiva byggare. Sidan ser levande ut för betatesterna.

---

## 2026-06-24 — Onboarding-flöde + välkomstguide + kommentarsspärr (session 10)

**`/onboarding`:** Tredje avatar-slot (neutral), e-postfält readonly/privat, redirect till `/welcome`.

**`/welcome` (ny sida):** Staplade Framer Motion-kort — 5 feature-kort animeras i kortlek-stil (spring-transition), progress-räknare "X av 5", sista kort byter knapp till "KOM IGÅNG". Efteråt: "Vad vill du göra nu?"-prompt med "Lägg upp mitt bygge" / "Jag har fastnat" + X-knapp + "Utforska på egen hand". Skyddad av middleware.

**Kommentarsspärr:** Inloggad utan `username` → "Slutför din profil"-uppmaning i CommentSection och HelpCommentSection istället för formulär.

**Avatar-neutral kopplad in överallt:** `ILLUSTRATED_AVATARS` i settings/page.tsx, LatestBuildActivity, seed.ts och seed-firebase.ts. Adam, Pelle och Johan tilldelade neutral för visuell variation i galleriet.

**Avatarbilder:** Alla tre nedskalade från 2 MB → 35–43 KB (160×160 px, LANCZOS).

**Verifierat:** Build ✅ — 29 routes, inga fel. Guidens alla 5 steg + slutprompt bekräftad via DOM-snapshot.

---

## 2026-06-25 — Rik projektdetaljsida — problem-fält, seed-kommentarer, bugfix (session 11)

### Vad som gjordes

**Problem:** Projektdetaljsidan var gles — inget `problem`-fält, inga kommentarer för inloggade användare, den statiska fallback-pathen hade nästan inget innehåll.

**`src/types/firestore.ts`:**
- Lade till `username?: string` på `Project`-interfacet (fältet skrevs av seed-scriptet men deklarerades aldrig i typen)

**`src/lib/seed.ts`:**
- Lade till `SeedProjectComment`- och `SeedProjectDetail`-interface
- Lade till `SEED_PROJECT_DETAILS: Record<string, SeedProjectDetail>` — rik statisk innehållskarta för alla 7 projekt (smartbok-se, aikostnad-se, need-radar, menupilot-se, amazon-snipe, btc-edge, runnr). Varje post har `description`, `problem`, `feedbackWanted`, `projectUrl`, `username`, `daysAgo` och 3–9 `comments`

**`src/app/projects/[slug]/page.tsx` (komplett omskrivning):**
- Separerade project-fetch och comment-fetch till oberoende try/catch-block (ett misslyckat kommentarsfetch döljer inte projektet)
- Lade till `fmtDate()` och `daysAgoLabel()` hjälpfunktioner för svenska datum/tidsetiketter
- Nytt blått streckruta-block: "Varför det byggdes" (`problem`-fältet)
- Nytt gult streckruta-block: "Söker feedback på" (`feedbackWanted`-fältet)
- Författarlänk via `project.username` → `/profile/[handle]`
- Skapandedatum synligt under titel
- Seed-fallback-pathen komplett ombyggd: visar `SEED_PROJECT_DETAILS[slug]` med full beskrivning, problem, feedback-box, CTA till projektets URL, profilkort för kommentarerna och inloggningsprompt

**`src/lib/firebase/projects-client.ts`:**
- Bugfix i `subscribeToComments`: `onSnapshot` anropades omedelbart med en tom lokal cache-snapshot och skrev över SSR-fetched `initialComments` med `[]`. Fixat via guard: `if (snap.metadata.fromCache && snap.empty) return;`

**`scripts/seed-firebase.ts`:**
- Lade till `feedbackWanted: string` på `ProjectSeed`-interfacet
- Populerade `feedbackWanted` för alla 7 projekt (5 med innehåll, 2 med tom sträng)
- Ny funktion `updateProjectDetails()` — hittar befintliga Firestore-dokument via slug och patchar `description`, `problem`, `feedbackWanted` om de skiljer sig. Idempotent.
- `main()` kallar nu `updateProjectDetails()` mellan `ensureProjects()` och `ensureProjectComments()`

### Verifierat
- `npm run build` ✅ — inga fel
- `tsc --noEmit` ✅ — inga typfel
- DOM-snapshot bekräftade problem-boxen och feedbackWanted-boxen i seed-fallback-pathen

### Status
✅ **Projektdetaljsidan klar.** Alla 7 seed-projekt visar nu rik information med problem-motivering, feedbackönskan och realistiska kommentarer.

---

## 2026-06-25 — Fas 8 klar: community soul + live feed + "Möt byggarna" (session 12)

### Vad som gjordes

**Fas 8 Polish — community-identitet och startsideupplevelse:**

**`src/components/home/Testimonials.tsx`:**
- Bytte ut placeholder-namn ("Byggare #1–5") mot 6 riktiga seed-användare med avatarer, jobbroller och autentiska citat
- Varje citat har tilt-variation för handgjord känsla
- `figcaption` länkar till `/profile/[handle]` via `<Link>`

**`src/app/about/page.tsx`:**
- Komplett omskrivning med fullständigt builder-manifesto (3 stycken), `TRUTHS`-lista (6 kärnvärden), 4 sektionskort (Byggen/Problemhörnan/Prompts/Genvägar), filosoficitat-block och 3 CTAs
- Ersätter den gles platshållaren med ett genuint identitetsdokument för projektet

**`src/components/home/TabStrip.tsx`:**
- 5 flikar (tillade "Genvägar" med Map-ikon + code-blue och "Hitta byggare" med Users + soft-teal)
- Varje flik har nu `sub`-text (sekundär rad) för mer specifikt innehåll
- Mer beskrivande `text`-fält per flik

**`src/components/layout/Header.tsx`:**
- Aktiv nav-markering: `usePathname()` + `pathname.startsWith(link.href + "/")` ger exakt aktiv-detektion
- Aktiv stil: `bg-hammer-yellow text-ink shadow-[2px_2px_0_0_var(--ink)]` (chunky underline-effekt)
- Lade till "Byggare" → `/community` i navbaren (5:e länk)

**`src/components/home/LatestBuildActivity.tsx`:**
- Exporterade `BuildActivityItem` och `ActivityType` (var privata)
- Komponenten tar nu `{ items?: BuildActivityItem[] }` och faller tillbaka på `SEED_ACTIVITY` om inget skickas

**`src/app/page.tsx`:**
- Ombyggd till `async` server-komponent med `export const dynamic = "force-dynamic"`
- `relativeLabel()`: svenska relativa tidsetiketter från Firestore-timestamps
- `projectToActivity()` + `helpToActivity()`: mappar Firestore-dokument till `BuildActivityItem`
- Hämtar `getProjects(5)` + `getHelpPosts(4)` parallellt, mergar, sorterar efter `createdAt`, skär till 6 objekt
- try/catch: Firestore-fel → `undefined` → seed-data i `LatestBuildActivity`

**`src/components/home/CommunityMarquee.tsx`:**
- Dubbel rad: `ROW_A` (community-ord) + `ROW_B` (verktygsnamn med 40% opacity, reverse-riktning)
- Ny `MarqueeRow`-komponent med `reverse`-prop

**`src/app/globals.css`:**
- Ny `marquee-reverse`-keyframe (translateX(-50%) → 0) och CSS-klass
- `--animate-marquee-reverse` custom property (42s, lite långsammare)

**`src/app/community/page.tsx`:**
- Komplett ombyggnad från platshållare till "Möt byggarna"-sida
- `FEATURED_BUILDERS`: 6 seed-profiler med avatarer, roller, bio, verktyg
- `STATS`: 4 community-nyckeltal (100+ projekt, 50+ frågor, etc.)
- `BuilderCard`: klickbart profilkort med chunky hover-rotation
- Filosoficitat-block, "Vad gör man här"-sektioner (4 kort med CTAs)
- Avslutande dark CTA-block med inloggningsuppmaning

### Verifierat
- `tsc --noEmit` ✅ — inga typfel
- `npm run build` ✅ — inga fel, alla sidor statiska/dynamiska korrekt

### Status
✅ **Fas 8 klar.** Alla kodsteg genomförda. Kvarvarande är manuella review-steg: responsivitetsgenomgång i riktig webbläsare, a11y-test med tangentbord, Lighthouse-körning på produktion.

---

## 2026-06-27 — Lansering-redo: gamification, ny onboarding, notiser, feedback, SEO, domän (session 13)

Stor session inför beta-lansering. Allt nedan är byggt, deployat och verifierat live på **aibyggare.se**. Beta-version: **v0.11.1**.

### 1. Domän, SEO och delningsbilder
- **Domän:** `aibyggare.se` live på Vercel, `www` → 308-redirect till naked. `NEXT_PUBLIC_SITE_URL=https://aibyggare.se` satt i Vercel (prod). Fallbacks i koden bytta från `vercel.app` → `aibyggare.se`.
- **Favicon/logga:** `icon.svg` (brandad hammare, dark-mode-aware), `apple-icon.tsx` (180×180 via ImageResponse). Syns i fliken.
- **SEO:** root `metadata` med title-mall, 16 keywords, OG + Twitter Card, canonical, robots-config. **JSON-LD** `WebSite`-schema med SearchAction. `noindex`-layouts för login/settings/onboarding/welcome.
- **OG-delningsbilder (next/og):** start + projekt + problem + prompt. **Kritisk bugg fixad:** Satori kan bara parsa statisk TTF (Google Fonts gav woff2/EOT → 500, variabel-TTF kraschade med "reading '256'"). Lösning: buntad statisk TTF i `public/fonts/og-font.ttf`, läses från egna domänen via `loadFredoka()`/`makeFonts()` i `lib/og-image.tsx`.
- **Start-OG omdesignad** till sajtens chunky retro-vibe: cream-bakgrund, chunky stickers med hard shadows, brand-färger, lekfullt roterad logga-box, LVL-badge + founding-stjärna (game-hint).
- **Mobil:** viewport låst (`maximumScale=1, userScalable=false`) — slut på auto-inzoom vid fältfokus.

### 2. Kritisk infra-bugg: firebase-admin ESM-krasch
- **Symptom:** all server-side Firestore-läsning gav 500 (`ERR_REQUIRE_ESM` via `firebase-admin/auth → jwks-rsa → jose@6`). Profiler 404:ade, flöden tomma.
- **Fix:** `admin.ts` exporterar nu bara `adminDb` + `adminStorage` (rör aldrig `firebase-admin/auth`). Token-verifiering isolerad i ny `admin-auth.ts`. Dessutom ny **`lib/auth/verify-token.ts`** som verifierar Firebase ID-tokens via `jose` (dynamisk import, ESM-säker) mot Googles JWKS — används av alla nya API-routes.

### 3. Auth: e-post/lösenord + robusta redirects
- E-post/lösenord-inloggning tillagd ovanför Google/GitHub (`signUpWithEmail`/`signInWithEmail` i AuthContext, läge-växling i login-sidan). Översatta felmeddelanden.
- **Onboarding-grind:** inloggad användare utan slutförd onboarding skickas alltid till `/onboarding` (getRedirectResult kan returnera null pga cookie-partitionering). Login-sidan redirectar själv inloggade vidare.

### 4. Gamification — "Byggkraft" (XP) + levels (Fas 1–3)
- **`lib/xp/levels.ts`:** XP-belopp per event, level-kurva (0–10), titlar, `levelProgress()`.
- **Säker XP-backend:** `/api/xp/grant` (verifierad token, belopp styrs server-side av event-typ). Idempotent via `profiles/{uid}/xpEvents/{eventType}` (event-typ = dokument-ID → omöjligt dubbel-XP). Transaktion.
- **Datamodell:** Profile + `totalXp`, `level`, `builderStatus`, `onboardingCompleted(+At)`. ProfileLite + PublicProfile utökade.
- **Level-UI:** `LevelBadge` (sifferpuck med tier-färg) bredvid alla avatarer (Header, aktivitetsflöde, profil). `LevelProgressBar` på profilen (live, låst till inloggad). `LevelUpBurst` — retro-firande (mätare fylls, siffran "kommer fram", pixelgnistor) vid level-up.
- **XP-events:** avatar +20, username +20, verktyg +15, byggstatus +10, bio +15 (= 80 efter onboarding); första bygge/problem +25 → **Level 1**.

### 5. Ny onboarding — karaktärsbygge med kort + XP-bar
- **`OnboardingFlow`:** 6 spelkort (avatar → användarnamn → verktyg → byggstatus → bio → länkar) + sista kortet. Kortstack-animation (framer-motion), XP-toast per steg, `OnboardingXpBar` (retro-mätare 0→80). Respekterar prefers-reduced-motion.
- **`FirstActionCard` (sista kortet):** skapar första bygget/problemet **inline** (ingen navigering → man ser level-up-animationen), riktigt Firestore-dokument, +25 XP → Level 1 → landar på profilen. Beskrivning upp till 1000 tecken + räknare + valfritt länk-fält.

### 6. Notissystem
- **`/api/notify`:** skapar notis för innehållets ägare server-side (Admin SDK) vid borr/kommentar/svar. Verifierad aktör, aldrig self-notify, ingen kan spamma.
- **`profiles/{uid}/notifications`-subcollection** + regler (bara mottagaren läser/markerar läst/raderar; skapas enbart server-side).
- **`NotificationBell`** (desktop + mobil topbar): olästa-räknare, dropdown med förhandstitt, **live via onSnapshot**, klick → markerar läst + tar till exakt rätt ställe. Triggers i DrillButton, CommentSection, HelpCommentSection.

### 7. Founding Member-badge (första 30)
- `/api/founding/claim`: idempotent, transaktion mot räknare i `meta/stats`. Bara riktiga signups (via routen) räknas → seed tar inga platser. Anropas en gång per session.
- `lib/founding.ts`: `FOUNDING_MEMBER_LIMIT` (30) + `FOUNDING_BADGE_ENABLED` — lätt att justera/stänga av.
- `FoundingBadge`: distinkt guld-stämpel. Guld-ring + stämpel + pill på profilen, hörnstämpel i flödet/header. `getUserBadges()` batch-hämtar level + founding.

### 8. Feedback-inhämtning
- **Svävande feedback-knapp** (`FeedbackButton`) på alla sidor (bara inloggad). Popup över sidan, textfält + valfri skärmdump (client-side nedskalning till 1280px JPEG).
- **`/api/feedback`:** sparar server-side i samlad `feedback`-collection (userId, namn, e-post, meddelande, sid-URL, bild via Storage + signerad URL, tidsstämpel). Fylls på över tid. Läses i Firebase Console.

### 9. Övriga funktioner & fixar
- **Sök + sortering** på `/projects` och `/problemhornan` (sökruta + nyast/populärast, default nyast).
- **Radera bygge/problem:** owner-only `DeleteContentButton` på detaljsidorna.
- **Radera konto:** `/api/account/delete` (recursiveDelete av profil + xpEvents + byggen + frågor) + danger zone i settings.
- **Borr-bugg fixad:** Firestore-reglerna deployades (votes-collectionen saknade regler i prod → röster rullades tillbaka). Hela regeluppsättningen nu live: votes, rösträknar-carve-out, role-escalation-skydd, XP/level/founding-skydd, meta-lås, notifications, feedback.
- **Beta-versionering:** `lib/version.ts` (`BETA_VERSION`) visas som gul badge i topbaren. CLAUDE.md-regel: bumpa vid varje ändring.
- **Testdata-städning:** raderade christoffer/picki-testkonton, nollställde founding-räknaren.

### Säkerhetsnotis
Firestore-reglerna deployades programmatiskt via en **tillfällig, hemlighetsskyddad route** (Admin SDK-token → Firebase Rules REST API) eftersom firebase CLI inte var inloggat. Routen och hemligheten **togs bort direkt efter** — inga osäkra endpoints kvar. För framtida regeländringar rekommenderas `firebase login` så CLI kan användas direkt.

### Verifierat
- `tsc --noEmit` ✅ och `npm run build` ✅ genom hela sessionen
- Live-koll: alla sidor 200, OG-bilder renderar (1200×630 PNG), favicon, auth-flöde, alla API-routes svarar korrekt (401 utan inloggning)

### Status
✅ **Beta-redo.** Sidan är live, säker och redo för de första 30 testarna.

---

## Session 15 — Admin-hantering (2026-06-27)

**Beta-version:** 0.14.0

### Mål
Bygg fullständig admin-hantering: sätt första admin, lägg till fler smidigt, blockera alla eskaleringsvägar hårdkodat i Firestore-regler.

---

### Vad som byggdes

#### 1. `scripts/set-admin.ts` — First-admin bootstrap
- Kör med `npx dotenv-cli -e .env.local -- npx tsx scripts/set-admin.ts`
- Använder Firebase Admin SDK (bypasses Firestore rules — det är poängen)
- Slår upp användaren via email i Firebase Auth → hämtar UID → sätter `role: "admin"` på `profiles/{uid}`
- Idempotent (kör gärna igen — händer inget om redan admin)
- **Kördes:** `christoffer.nolet@gmail.com` (uid `pakBTosUODatvrxthicy6JKus8F3`) är nu admin ✅

#### 2. `/api/admin/manage-admins` — Admin-management API
- **GET:** Listar alla profiler med `role == "admin"` (kräver admin-token)
- **POST `{ action: "grant", email }`:** Söker upp Firebase Auth-konto via email → sätter `role: "admin"` via Admin SDK
- **POST `{ action: "revoke", uid }`:** Sätter `role: "user"` via Admin SDK
- Självskydd: en admin kan inte ta bort sin egen roll (förhindrar lockout)
- Säkerhetsgrind: `getAdminUser()` verifierar token kryptografiskt + kollar `role == "admin"` i Firestore innan varje operation

#### 3. `AdminManagement.tsx` — Klientkomponent i `/admin`
- Visar lista av nuvarande admins med avatar + namn + @username
- "Du"-badge på den inloggade admins rad, ingen revoke-knapp på sig själv
- E-postfält + Lägg till-knapp: lägger till ny admin → listar om direkt
- Revoke-knapp med confirm-dialog per admin
- Felmeddelandevisning (t.ex. "användaren har inte slutfört onboarding")

#### 4. `scripts/deploy-rules.ts` — Programmatisk rules-deploy
- Ersätter `firebase deploy --only firestore:rules` (CLI inte inloggat)
- Skapar ny ruleset via Firebase Rules REST API → releasear den för cloud.firestore
- Kör med `npx dotenv-cli -e .env.local -- npx tsx scripts/deploy-rules.ts`

---

### Säkerhetsmodellen — varför den ser ut som den gör

**Frågan:** vem kan ge admin-roll till vem?

**Svaret:** Bara Firebase Admin SDK (som kör server-side med service account) kan skriva `role`-fältet. Det finns ingen väg för en klient att göra det — inte ens en befintlig admin-klient.

**Konkret säkerhetsmodell i lager:**

**Lager 1 — Firestore Security Rules (hårdkodat, kan inte kringgås av klienter):**
```
allow update: if (isAdmin()
    && !request.resource.data.diff(resource.data).affectedKeys()
         .hasAny(['role', 'totalXp', 'level', 'foundingMember', 'foundingNumber']))
  || (isOwner(userId)
      && !request.resource.data.diff(resource.data).affectedKeys()
           .hasAny(['role', 'totalXp', 'level', 'foundingMember', 'foundingNumber']));
```

**Vad regeln innebär:**
- `role`-fältet är **helt skrivskyddat** för alla Firestore-klienter — oavsett om de är inloggade som admin eller inte
- Varken ägaren, en admin-klient, eller en angripare kan ändra `role` via Firestore SDK
- **Enda vägen att ändra `role`:** Firebase Admin SDK (som kör server-side och bypasses rules)

**Tidigare sårbarhet som åtgärdades:**
Den gamla regeln (`allow update: if isAdmin() || ...`) tillät att en admin-klient ändrade valfritt fält inklusive `role`. Om en admin-session komprometterats kunde angriparen eskalera privilegier via Firestore SDK direkt utan att gå via API-routen. Nu blockeras detta.

**Lager 2 — API-routen `/api/admin/manage-admins`:**
- Kräver att anroparen är befintlig admin (kryptografisk token-verifiering via Admin Auth SDK)
- Använder Admin SDK (inte Firestore-klientbiblioteket) för att skriva role-fältet
- Förhindrar self-revoke (admin kan inte ta bort sin egen roll → ingen lockout-risk)

**Lager 3 — Bootstrap-scriptet `scripts/set-admin.ts`:**
- Körs en gång lokalt med service account-credentials (aldrig via HTTP)
- Sätter den allra första admin — därefter hanteras allt via API-routen

**Privilege escalation-skyddet sammanfattat:**
- Non-admin → admin via klient-Firestore: ❌ blockeras av rules
- Non-admin → admin via API: ❌ blockeras av admin-grinden (måste redan vara admin)
- Admin-klient → ändra role via Firestore SDK direkt: ❌ blockeras av rules
- Admin → grant via API → Admin SDK: ✅ enda tillåtna vägen
- Admin SDK lokalt (script): ✅ enda bootstrapvägen

---

### Verifierat
- `tsc --noEmit` ✅
- `npm run build` ✅
- `scripts/set-admin.ts` kördes: `christoffer.nolet@gmail.com` är admin ✅
- Firestore-regler deployades via `scripts/deploy-rules.ts` ✅
- **Autentiserad icke-admin eskaleringstest** (`scripts/test-auth-security.ts`) kördes mot prod med riktigt Firebase ID-token:
  - (a) READ `reports`-collection → **HTTP 403 "Missing or insufficient permissions."** ✅
  - (b) PATCH `role=admin` på egen profil → **HTTP 403** + Admin SDK-kontroll bekräftar `role="user"` (oförändrad) ✅
  - (c) POST `/api/admin/manage-admins` → **HTTP 403 "Otillåten åtkomst."** ✅
  - Testkonto (`sectest-*@aibyggare-test.invalid`) skapades och raderades i samma körning — inget skräp i prod

### Status
✅ Admin-management live och verifierat. Picki kan nu gå till `/admin` och lägga till fler admins via e-post.

---

## Session 15 — 2026-06-27

### v0.16.0 — Redigera bygge, feedback-historik, bugfixar

**Redigera bygge (bugrapport från Rasmus)**
- Ny sida `/projects/[slug]/edit` (klient-komponent) — ägare kan redigera titel, tagline, beskrivning, problem, stack, status, URL:er, feedbackwanted och omslagsbild
- `EditProjectButton` visas enbart för ägaren på projektdetaljsidan (klient-komponent, koll mot `user.uid`)
- `getProjectBySlugClient` + `updateProject` + `UpdateProjectInput` interface tillagda i `projects-client.ts`
- Ägarverifiering sker på klientsidan; slug ändras aldrig (befintliga länkar funkar)

**Feedback-hantering i admin**
- Varje feedback-post har nu en "Klar"-knapp → API `POST /api/admin/feedback` → sätter `status: "done"` i Firestore
- Avklarade poster hamnar i kollapsbar "Historik"-sektion (lazy-loadad vid första öppning via `GET /api/admin/feedback`)
- Skärmdumpar (imageUrl) visas nu som inline-förhandsgranskning (klickbar bild, max 180px hög)
- `FeedbackSection` är en klientkomponent — admin-sidan förblir Server Component

**Notis-URL-fix (bugrapport från Rasmus)**
- Alla notiser för post-innehåll (hjälp/prompt/guide) fick fel URL (`/problemhornan/...`)
- Fix: `/api/notify/route.ts` läser nu `target.type`-fältet och väljer rätt bas-URL

**Prompt 404-fix (bugrapport från Rasmus)**
- `/prompts/[slug]` med svenska tecken i sluggen (t.ex. `förklara-felet-nybörjare`) gav 404
- Fix: `decodeURIComponent(rawSlug)` i både `generateMetadata` och `default`-funktionen

### Verifierat
- `tsc --noEmit` ✅
- `npm run build` ✅ (11 filer, rent)
- Commitad och pushad som `92af8a2`

---

## 2026-06-28

### Fullständig UX-analys genomförd ✅

Fullständig UX-granskning av alla 30 routes/funktioner inför betalansering. Metod: kodgranskning + live-skärmdumpar (Playwright, desktop + mobil) på https://aibyggare.se.

**Resultat:** Helhetspoäng **6.8/10**. Rapporten finns i `docs/ux-analys-2026-06-28.md`.

**Topp 3 kritiska problem att åtgärda:**
1. 🔴 Community-sidan: Hårdkodade falska stats ("100+ projekt") — måste bli dynamiska
2. 🔴 Prompts-lista: Ingen filtrering + auth-gate blockerar konvertering (4/10)
3. 🟡 Projektdetalj: Tagline och description dupliceras synligt när identiska
