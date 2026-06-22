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

## 🔜 Nästa steg — Fas 3: Projektflöde

**Fas 3 börjar med:**
1. Lista projekt (flöde) — `/projects`
2. Skapa projekt (formulär + bildupload) — `/projects/new`
3. Projektdetalj-sida — `/projects/[slug]`
4. Upvotes (atomic increment i Firestore)
5. Kommentarer (sub-collection)

**Checkpoint Fas 3:** Besök startsida → logga in → skapa profil → lägg upp projekt → se i flödet → öppna detalj. Allt fungerar.
