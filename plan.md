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
| Databas/Auth/Storage | Firebase (Firestore + Auth + Storage) |
| Hosting | Vercel |
| Formulär | React Hook Form + Zod |
| Datahämtning | TanStack Query (vid behov) |
| Animationer | Framer Motion (enbart subtilt) |
| Ikoner | Lucide (sparsamt) |
| Markdown | react-markdown eller MDX |

**Princip:** Undvik överkomplexitet. Bygg robust och läsbart.

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
      help/page.tsx
      help/new/page.tsx
      help/[slug]/page.tsx
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
    /supabase
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

## Databasmodell (Supabase)

### profiles
```sql
id            uuid primary key references auth.users
username      text unique
display_name  text
bio           text
avatar_url    text
website_url   text
github_url    text
linkedin_url  text
tools         text[]
role          text          -- 'user' | 'admin'
created_at    timestamptz
updated_at    timestamptz
```

### projects
```sql
id              uuid primary key
user_id         uuid references profiles(id)
title           text
slug            text unique
tagline         text
description     text
problem         text
stack           text[]
status          text    -- 'idea' | 'mvp' | 'live' | 'feedback' | 'testers' | 'cofounder'
project_url     text
github_url      text
image_url       text
feedback_wanted text
is_featured     boolean default false
created_at      timestamptz
updated_at      timestamptz
```

### posts (hjälpfrågor, prompts, guider, diskussioner)
```sql
id                   uuid primary key
user_id              uuid references profiles(id)
type                 text    -- 'help' | 'prompt' | 'guide' | 'discussion'
title                text
slug                 text unique
body                 text
tool                 text
status               text    -- 'open' | 'solved' | 'archived'
tags                 text[]
is_featured          boolean default false
accepted_comment_id  uuid nullable
created_at           timestamptz
updated_at           timestamptz
```

### comments
```sql
id          uuid primary key
user_id     uuid references profiles(id)
project_id  uuid nullable references projects(id)
post_id     uuid nullable references posts(id)
parent_id   uuid nullable references comments(id)
body        text
is_accepted boolean default false
created_at  timestamptz
updated_at  timestamptz
```

### votes
```sql
id          uuid primary key
user_id     uuid references profiles(id)
project_id  uuid nullable references projects(id)
post_id     uuid nullable references posts(id)
comment_id  uuid nullable references comments(id)
value       int default 1
created_at  timestamptz
-- Unique: en röst per användare per project/post/comment
```

### bookmarks
```sql
id          uuid primary key
user_id     uuid references profiles(id)
project_id  uuid nullable
post_id     uuid nullable
created_at  timestamptz
```

### reports
```sql
id          uuid primary key
reporter_id uuid references profiles(id)
project_id  uuid nullable
post_id     uuid nullable
comment_id  uuid nullable
reason      text
status      text default 'open'
created_at  timestamptz
```

---

## Row Level Security

- Alla kan **läsa** publicerade projekt, posts, kommentarer och profiler.
- Endast inloggade kan **skapa** projekt, posts, kommentarer, votes, bookmarks.
- Användare kan bara **redigera/radera** sitt eget innehåll.
- Admin (`profiles.role = 'admin'`) kan moderera allt.
- Storage-bucket: upload tillåts för inloggade, läsning är publik.

---

## Auth och onboarding

**Loginmetoder:** Google, GitHub, (email magic link som bonus)

**Flöde efter första login:**
1. Supabase-trigger skapar profilrad automatiskt.
2. Redirect till `/onboarding`.
3. Onboarding samlar in: username, display name, kort bio, vilka verktyg de använder.
4. Redirect till `/projects/new` eller dashboard med CTA.

**Viktigt:** Onboardingen ska vara snabb — max 3–4 fält, inga långa formulär.

---

## Navigationsstruktur

**Primär navigation:**
`Byggen` · `Hjälp` · `Prompts` · `Guider` · `Community` · `[Lägg upp]`

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
| `supabase-rls` | Verifierar att alla tabeller har säkra RLS-policies |
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

### Fas 2 — Databas och auth
- [ ] Supabase SQL-migration med alla tabeller
- [ ] RLS policies
- [ ] Auth callback-route
- [ ] Auto-skapande av profilrad vid signup
- [ ] Onboarding-flöde

### Fas 3 — Projektflöde *(första leverans)*
- [ ] Lista projekt (flöde)
- [ ] Skapa projekt (formulär)
- [ ] Projektdetalj-sida
- [ ] Projektkort-komponent
- [ ] Upvotes
- [ ] Kommentarer
- [ ] Bildupload (Supabase Storage)

**Checkpoint fas 3:** Besök startsida → logga in → skapa profil → lägg upp projekt → se i flödet → öppna detalj. Allt ska fungera.

### Fas 4 — Hjälpfrågor
- [ ] Lista hjälpfrågor med filter
- [ ] Skapa hjälpfråga (strukturerat formulär)
- [ ] Frågedetalj-sida
- [ ] Svar och kommentarer
- [ ] Markera som löst

### Fas 5 — Prompts och guider
- [ ] Lista prompts/guider
- [ ] Skapa prompt (formulär med markdown-stöd)
- [ ] Prompt-detaljsida med kodruta och kopiera-knapp
- [ ] Bookmark/spara-funktion

### Fas 6 — Profiler
- [ ] Profilvisning (byggarportfolio)
- [ ] Redigera profil
- [ ] Visa användarens projekt, prompts, frågor
- [ ] Statiska badges

### Fas 7 — Admin och moderering
- [ ] Admin dashboard (antal användare, projekt, frågor, kommentarer)
- [ ] Rapporter-hantering
- [ ] Ta bort innehåll
- [ ] Markera featured project / featured guide

### Fas 8 — Polish
- [ ] Responsivitet-genomgång
- [ ] Accessibility-review
- [ ] Empty states, loading states, error states, skeletons
- [ ] SEO metadata + Open Graph
- [ ] Sitemap
- [ ] Performance-optimering
- [ ] `no-ai-look`-granskning

---

## SEO-strategi

Viktiga sidor att bygga med SEO i åtanke från dag ett:

- `/` — Startsida
- `/projects` — Alla byggen
- `/help` — Hjälpfrågor
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
- RLS är säker (ingen kan ändra andras innehåll)
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
| Fas 2 — Databas och auth | Ej påbörjad |
| Fas 3 — Projektflöde | Ej påbörjad |
| Fas 4 — Hjälpfrågor | Ej påbörjad |
| Fas 5 — Prompts/guider | Ej påbörjad |
| Fas 6 — Profiler | Ej påbörjad |
| Fas 7 — Admin | Ej påbörjad |
| Fas 8 — Polish | Ej påbörjad |

---

*Senast uppdaterad: 2026-06-21*
