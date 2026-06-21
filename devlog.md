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

## 2026-06-21

### 09:XX — Projektmapp skapad
**Fas:** Pre-setup
**Status:** ✅ Klar

**Vad gjordes:**
- Skapade mappen `/home/picki/code/aibyggare.se/`

---

### 09:XX — plan.md skapad
**Fas:** Pre-setup
**Status:** ✅ Klar

**Vad gjordes:**
- Analyserade hela projektbriefens 32 punkter.
- Skrev om briefen till ett strukturerat planeringsdokument: `plan.md`
- Inkluderade: vision, designsystem, teknisk stack, databasmodell, RLS-regler, auth-flöde, komponentkrav, empty states, seed-innehåll, 10 Claude Code Skills och 8 byggfaser med checklistor.

---

### 09:XX — devlog.md skapad (denna fil)
**Fas:** Pre-setup
**Status:** ✅ Klar

---

### 09:XX — CLAUDE.md skapad (rollmanifest)
**Fas:** Pre-setup
**Status:** ✅ Klar

**Vad gjordes:**
- Formaliserade rollen, mandatet och arbetsfilosofin.
- Skapade `CLAUDE.md` — projektets konstitution.

---

### 21:XX — Fas 1 Genomförd
**Fas:** Fas 1 — Projektsetup
**Status:** ✅ Klar

**Vad gjordes:**

1. **Next.js-projekt skapat**
   - `npx create-next-app@latest . --typescript --tailwind --app --src-dir --eslint --no-git`
   - Next.js 16.2.9 med Turbopack, TypeScript, Tailwind v4, App Router, `src/`-mapp, ESLint

2. **shadcn/ui installerat och konfigurerat**
   - Initialiserat med `style: base-nova` (shadcn v4 med Base UI)
   - **Viktigt:** shadcn v4 använder `@base-ui/react` istället för Radix — ingen `asChild`-prop
   - Lösning: Använde `buttonVariants()` + `cn()` direkt på `<Link>`-element istället
   - Installerade komponenter: button, card, badge, avatar, input, textarea, separator, dropdown-menu, dialog, sonner

3. **Typografi**
   - Geist Sans som primär font via `next/font/google`
   - Geist Mono för kod/mono-element
   - Satt `--font-sans: var(--font-geist-sans)` i CSS-root

4. **Färgtema implementerat**
   - Komplett projekts färgpalett i `globals.css` som CSS-variabler
   - Ljust läge: #F7F5EF bakgrund, #A7C957 primary grön, #151515 text
   - Mörkt läge: #11130F bakgrund, #B7E063 primary grön, #F4F1E8 text
   - Utökat `@theme inline` med custom Tailwind-klasser: `bg-background-alt`, `text-primary-dark`, `text-accent-orange`, `text-accent-blue`, `text-accent-sand`

5. **Grundlayout**
   - `src/components/layout/Header.tsx` — sticky header, logo, desktop nav, mobilmeny (hamburger)
   - `src/components/layout/Footer.tsx` — länkkolumner, copyright, green brand accent
   - `src/app/layout.tsx` — metadata på svenska, lang="sv", Header + Footer shell

6. **Startsida (src/app/page.tsx)**
   - Hero med dot grid bakgrund, badge, headline, två CTA-knappar
   - Verktygs-badges-rad (Claude Code, Cursor, Lovable, Bolt, Replit, Supabase, Vercel, Next.js, Stripe)
   - Sektion "Senaste byggen" med 3 projektkort (mockdata)
   - Sektion "Behöver hjälp just nu" med 3 hjälpfråge-kort (mockdata)
   - Sektion "Så fungerar det" (4 steg med ikon + text)
   - CTA-sektion med grön bakgrund

7. **Återanvändbara komponenter**
   - `src/components/cards/ProjectCard.tsx` — titel, tagline, status-pill, stack-badges, upvotes, kommentarer, skapare
   - `src/components/cards/HelpCard.tsx` — svar-räknare, titel, verktyg-badge, tid
   - `src/components/ui/StatusPill.tsx` — 9 statusar med färgkodning
   - `src/components/ui/ToolBadge.tsx` — mono-font badge med border

8. **Firebase (ej Supabase)**
   - **Beslut:** Bytte från Supabase till Firebase eftersom Supabase gratis-projekts var uppfyllda
   - Installerade: `firebase`, `firebase-admin`
   - `src/lib/firebase/client.ts` — Firebase app, auth, db (Firestore), storage
   - `src/lib/firebase/admin.ts` — Firebase Admin SDK för server-side
   - `src/types/firestore.ts` — TypeScript-typer för alla Firestore-collections (Profile, Project, Post, Comment, Vote, Bookmark)
   - `.env.example` och `.env.local` med Firebase-config
   - Firebase projekt-ID: `aibyggare-c45c6`

9. **Env och säkerhet**
   - `.env.local` med faktisk Firebase-config (täcks av `.gitignore` via `.env*`-regel)
   - `.env.example` dokumenterar alla variabler

**Tekniska problem/beslut:**
- `create-next-app` nekade befintliga filer — löstes med temporär flytt av CLAUDE.md/plan.md/devlog.md
- shadcn/ui v4 använder `@base-ui/react` (ej Radix) → `asChild` finns ej, använd `buttonVariants()` direkt
- `--font-sans: var(--font-sans)` i `@theme inline` är självrefererande → lade till `--font-sans: var(--font-geist-sans)` i `:root`

**Kvalitetskontroll:**
- `npm run build` → ✅ ingen fel
- `npm run lint` → ✅ inga varningar
- Dev-server → 200 OK på `/`

**💡 Rekommendationer:**
- Firebase Hosting behövs INTE — vi deployar till Vercel
- Generera Service Account-nyckel inför Fas 2 (Firebase Console → Project Settings → Service accounts)
- Aktivera i Firebase Console inför Fas 2: Google Auth, GitHub Auth, Firestore, Storage

---

## 🔜 Nästa steg — Fas 2: Databas och auth

1. Aktivera Firestore i Firebase Console (production mode)
2. Aktivera Google + GitHub i Firebase Auth
3. Aktivera Firebase Storage
4. Generera Service Account-nyckel och lägg i `.env.local`
5. Skapa Firestore Security Rules (ersätter Supabase RLS)
6. Auth-callbacks i Next.js (middleware för session-cookies)
7. Auto-skapande av användarprofil vid första login
8. Onboarding-flöde

---

*Nästa loggentry: När Fas 2 påbörjas.*
