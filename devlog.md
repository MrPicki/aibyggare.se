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

*Nästa loggentry: När Fas 2 påbörjas.*
