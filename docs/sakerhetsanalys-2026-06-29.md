# Säkerhets- och efterlevnadsanalys — AIbyggare.se
**Datum:** 2026-06-29  
**Metod:** Fullständig kodgranskning (Firestore-regler, Storage-regler, alla API-routes, auth-infrastruktur, beroenden, HTTP-konfiguration, juridiska sidor) + websökning mot IMY/PTS/EDPB för aktuellt regelläge  
**Granskade routes:** 30 st (se docs/ux-analys-2026-06-28.md för fullständig inventering)  
**Scope:** Analys-fas — **inga kodändringar i denna runda**

---

## Live-testresultat — hårda bevis (2026-06-29)

Två av de allvarligaste tekniska påståendena har verifierats mot produktion med faktiska anrop. Testkonto skapades och raderades i samma session — ingen permanent testdata kvar.

### Bevis 1 — Counter-manipulation

```
Testkonto: security-test-1782760122@delete.test (UID: otpK794mc8XIMkgq6ZQrTuSezFl1)
Mål: projects/5kA7T8rt8P0f10YWvht4 (BTC Edge, ägare: seed_pelle)

FÖRE attack:  upvoteCount = 9   (verifierat via public GET)

ANGREPP (Firestore REST API PATCH, enbart upvoteCount-fältet):
  → HTTP 200 OK
  → Svar: {"fields": {"upvoteCount": {"integerValue": "99999"}}}
  → Direkt GET mot DB: upvoteCount = 99999  ✓ bekräftat skrivet

EFTER återställning: upvoteCount = 9   ✓
Testkonto raderat: INVALID_LOGIN_CREDENTIALS vid inloggningsförsök  ✓
```
**Slutsats:** BEKRÄFTAD SÅRBARHET. Ingen kod-tolkning — faktisk databasmanipulation utförd och verifierad.

---

### Bevis 2 — Cookie-flaggor

```
Metod: Playwright headless Chrome mot https://aibyggare.se/login
Inloggning: testkonto ovan (godkändes direkt — inga email-krav)

Set-Cookie header från server:  INGEN (curl -I https://aibyggare.se/ visar inga Set-Cookie)
__session sätts enbart client-side via document.cookie i AuthContext.tsx:165

Faktiska cookie-attribut (Playwright cookie inspector):
  name:     __session
  domain:   aibyggare.se
  path:     /
  httpOnly: False   ← tokenen är läsbar för JavaScript på sidan
  secure:   False   ← cookien skickas även om HTTP används
  sameSite: Lax
  expires:  1 h (matchar JWT exp-claim)

Verifiering JS-läsbarhet:
  document.cookie innehöll "__session=eyJhbGciOiJSUzI1NiIsImtpZCI6..." → BEKRÄFTAD ej HttpOnly
```
**Slutsats:** BEKRÄFTAT. Cookien saknar HttpOnly och Secure. En XSS-sårbarhet (i egenkod eller tredjepartsskript) kan stjäla Firebase ID-token och använda den direkt mot alla API-routes och Firestore REST API.

---

## Sammanfattande helhetsbedömning

### Säkerhet — **6 / 10**
Kodens säkerhetsnivå är märkbart högre än genomsnittet för ett projekt av denna storlek och ålder. Firestore Security Rules är välstrukturerade, adminverifiering sker kryptografiskt, API-routes har genomgående auth-check, och inga hemliga nycklar exponeras i klientbundlad kod. Det är påtagligt att säkerhet tänkts på från start.

Det som drar ner betyget är tre kvarstående systemiska brister: session-cookie utan HttpOnly/Secure-flaggor, total avsaknad av rate limiting på API-routes, och HTTP-säkerhetsheaders som saknas helt. Ingen av dessa är triviala att utnyttja, men de skapar en onödig attackyta inför skalning.

### Juridisk efterlevnad — **2 / 10**
Läget är allvarligt. Sajten saknar integritetspolicy, användarvillkor, och cookie-information trots att personuppgifter samlas in. Login-sidans marknadsföringstext "Inga GDPR-popups, lovar." är tekniskt felaktig — GDPR kräver inte popups per se, men kräver information och vissa medgivanden. IMY kan utfärda sanktionsavgifter för avsaknad av integritetspolicy. Det juridiska arbetet är den enskilt viktigaste prioriteringen inför betalansering.

---

## DEL 1 — Teknisk säkerhetsanalys

### Firestore Security Rules

| Kollektion | Bedömning | Fynd |
|---|---|---|
| `feedback` | ✅ Korrekt | `allow read, write: if false` — enbart Admin SDK (server-side) kan skriva/läsa |
| `meta` | ✅ Korrekt | `allow read, write: if false` — founding-räknaren kan ej manipuleras klient-side |
| `profiles` | ✅ Korrekt | `role`, `totalXp`, `level`, `foundingMember` låsta även för ägaren; enbart Admin SDK |
| `profiles/xpEvents` | ✅ Korrekt | `allow write: if false` — XP kan ej manipuleras klient-side |
| `profiles/notifications` | ✅ Korrekt | Enbart mottagaren läser/raderar; `create: if false` — ingen kan spamma andras notiser |
| `projects` | ⚠️ Brist | Se nedan — räknare manipulerbara |
| `posts` | ⚠️ Brist | Samma problem som projects |
| `projects/comments` | ✅ Korrekt | Ägare och admin kan uppdatera/radera |
| `posts/comments` | ✅ Korrekt | Frågans ägare kan enbart sätta `isAccepted` |
| `votes` | ✅ Korrekt | Immutable (delete/recreate), ingen kan ändra befintlig röst |
| `bookmarks` | ✅ Korrekt | Strikt ägarskydd — `resource.data.userId == request.auth.uid` på läsning |
| `reports` | ✅ Korrekt | Enbart admin kan läsa; rapportör kan enbart skapa |

**Konkret brist — Counter-manipulation (LIVE-BEVISAD 2026-06-29):**  
Regeln för `projects` och `posts` innehåller:
```
|| (isSignedIn()
    && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['upvoteCount', 'commentCount']));
```
Detta tillåter valfri inloggad användare att sätta `upvoteCount` och `commentCount` till **godtyckliga värden** direkt via Firebase JS SDK — det räcker med ett Firestore REST API PATCH-anrop som enbart ändrar dessa fält. Applikationens transaktion (±1) kringgås enkelt.

**Testat live mot produktion** (2026-06-29, temporärt testkonto `security-test-1782760122@delete.test`, UID `otpK794mc8XIMkgq6ZQrTuSezFl1`, raderat efteråt):
```
# Mål: projects/5kA7T8rt8P0f10YWvht4 (BTC Edge, ägare seed_pelle, upvoteCount=9)
# Angrepp: PATCH med enbart upvoteCount-fältet från ett icke-ägar-konto
PATCH https://firestore.googleapis.com/v1/projects/aibyggare-c45c6/databases/(default)/documents/projects/5kA7T8rt8P0f10YWvht4?updateMask.fieldPaths=upvoteCount
Authorization: Bearer {testuser-idToken}
Body: {"fields": {"upvoteCount": {"integerValue": "99999"}}}

Svar: HTTP 200 — {"fields": {"upvoteCount": {"integerValue": "99999"}}}
Direkt verifiering mot DB: upvoteCount läst som 99999 (bekräftat skrivet)
Återställt till 9 via samma metod. Testkonto raderat.
```
**Slutsats:** Bekräftat exploiterbart. En angripare med ett legitimt konto kan manipulera sortering och synlig popularitet för valfritt projekt eller post.

**Positiv obs:** `isAdmin()`-funktionen läser profile-dokumentet vid varje anrop. Korrekt, men bör noteras att en komprometterad admin-session i webbläsaren inte kan eskalera vidare via Firestore direkt (role-fältet är låst).

---

### Tabell — Teknisk säkerhet

| Yta / Funktion | Allvarlighetsgrad | Fynd | Rekommenderad åtgärd |
|---|---|---|---|
| **Session cookie — HttpOnly/Secure** | 🔴 HÖG | Cookie `__session` sätts via `document.cookie` i `AuthContext.tsx:165`. **Live-verifierat mot produktion (2026-06-29):** `httpOnly: False`, `secure: False`, `sameSite: Lax`. Cookien är läsbar via `document.cookie` i webbläsarens JavaScript. Servern sätter INGEN `Set-Cookie`-header — cookien existerar enbart som client-side JS-cookie. Innehåller en giltig Firebase ID-token (RS256 JWT, 1 h giltighetstid) som ger full API-åtkomst om den stjäls. | Skapa server-side API-route (`/api/auth/session`) som sätter cookien med `Set-Cookie: __session=...; HttpOnly; Secure; SameSite=Lax` via Firebase Admin `createSessionCookie()`. |
| **Rate limiting — API-routes** | 🔴 HÖG | Ingen av de 8 API-routes har rate limiting. `/api/notify` kan spamma notiser till andra användare. `/api/feedback` kan skicka tusentals stora meddelanden + bilduppladdningar (6 MB/req → kostnad). `/api/xp/grant` är idempotent per event-typ men event-rymden är inte begränsad. | Implementera rate limiting via Upstash Redis + `@upstash/ratelimit` eller Vercel KV. Prioritet: `/api/notify` och `/api/feedback`. |
| **Counter-manipulation (Firestore Rules)** | 🟡 MEDEL | Inloggad användare kan sätta `upvoteCount`/`commentCount` till godtyckligt värde på alla projekt och posts (se detalj ovan). | Ta bort regeln som tillåter klientuppdatering av räknarna. Flytta upvote/kommentar-räkning till server-side API-routes som använder Admin SDK med `FieldValue.increment()`. |
| **HTTP Security Headers** | 🟡 MEDEL | `next.config.ts` definierar inga `headers()`. Saknas: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy`. | Lägg till `async headers()` i `next.config.ts`. Börja med `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`. CSP är komplexare (Firebase/Vercel kräver undantag) men bör planeras. |
| **Lösenordsstyrka** | 🟡 MEDEL | Minimilösenord är 6 tecken (Firebase-default). Inga komplexitetskrav. Inga klientvalidering utöver Firebase-felet. | Lägg till klientsidesvalidering: minst 8 tecken. Firebase Password Policy (kräver Blaze-plan) kan höja gränsen server-side. |
| **E-postverifiering** | 🟡 MEDEL | E-postverifiering krävs inte. Användare kan registrera sig med vilken e-postadress som helst utan bekräftelse. Risk: felaktig kontaktväg, spam-konton. | Lägg till `sendEmailVerification()` vid registrering och visa en uppmaning att verifiera. Kan göras mjukt (visas som banner, blockerar inte). |
| **Middleware — JWT-avkodning utan signaturverifiering** | 🟢 LÅGA | `proxy.ts` avkodar JWT utan kryptografisk verifiering (kommenterad avsiktlig design). Skyddar bara UI-routes mot oautentiserade användare. Faktisk säkerhet sitter i API-routes och Firestore-regler. | Dokumenterat och medvetet. Ingen åtgärd krävs om det förstås att detta är UI-skydd, inte säkerhetsgräns. |
| **XSS — dangerouslySetInnerHTML** | 🟢 LÅGA | Används enbart i `layout.tsx` för JSON-LD structured data (kontrollerat serverdata). Inga andra förekomster. Guide-markdown renderas via anpassad React-komponent (ej `dangerouslySetInnerHTML`). | Inget att åtgärda. |
| **Secrets-hantering** | 🟢 OK | `FIREBASE_SERVICE_ACCOUNT_KEY` är server-only (ej `NEXT_PUBLIC_`). Firebase-klientkredentialer (`NEXT_PUBLIC_FIREBASE_*`) exponeras korrekt i klientbundle — detta är designat av Firebase och säkert givet att Firestore Security Rules är korrekta. | Inget att åtgärda. |
| **npm-beroenden** | 🟢 LÅGA | `npm audit`: 0 kritiska, 0 höga, 8 moderata. Moderata inkluderar PostCSS XSS (build-tool, ej runtime) och uuid buffer-check i firebase-admin. Fix kräver breaking change (Next.js 9.3.3 / firebase-admin 10.3.0). | Kör `npm audit fix` för icke-breaking fixes. Notera att breaking fixes väntar tills next/firebase-admin är redo att uppgraderas. |
| **Storage Rules** | 🟢 OK | Max 5 MB, enbart `image/(jpeg\|png\|webp\|gif)` — SVG blockerat. Upload enbart till eget `images/{uid}/`-katalog. Public read (acceptabelt för produktbilder). | Inget kritiskt. Överväg att sätta `Cache-Control` på statiska assets. |
| **File upload — klientvalidering** | 🟢 LÅGA | `uploadProjectImage()` validerar inte filtyp/storlek klient-side innan upload. Firebase Storage-reglerna hanterar detta server-side. Användare får ett fel efter att ha laddat upp ogiltig fil, inte innan. | Lägg till klientsidesvalidering (`file.type`, `file.size`) i formuläret för bättre UX. Inte en säkerhetsrisk. |
| **Firebase Analytics** | 🟢 OK | `measurementId` finns i klientkonfigurationen men `getAnalytics()` anropas **aldrig** i koden. Analytics är inte aktiverat. Inga analytics-cookies sätts. | Inget att åtgärda (se juridisk del om Analytics ska aktiveras framöver). |
| **Nyhetsbrev-formulär** | 🟡 MEDEL | `NewsletterForm.tsx` visar bekräftelse men skickar ingen data — e-postadressen samlas aldrig in eller lagras. Funktionen är dead code som vilseleder användare. | Ta bort formuläret eller integrera det mot ett riktigt e-postsystem (Resend, Mailchimp). |

---

### API-routes — Samlad bedömning

Alla 8 routes kontrollerade:

| Route | Auth-check | Input-validering | Rate limiting | Felhantering |
|---|---|---|---|---|
| `POST /api/account/delete` | ✅ Token + uid | ✅ (implicit) | ❌ Saknas | ✅ Generisk |
| `POST /api/admin/action` | ✅ Admin-guard | ✅ Allowlist + id-validering | ❌ Saknas | ✅ Generisk |
| `GET /api/admin/feedback` | ✅ Admin-guard | N/A | ❌ Saknas | ✅ Generisk |
| `POST /api/admin/feedback` | ✅ Admin-guard | ✅ id-validering | ❌ Saknas | ✅ Generisk |
| `DELETE /api/admin/feedback` | ✅ Admin-guard | ✅ id-validering | ❌ Saknas | ✅ Generisk |
| `GET/POST /api/admin/manage-admins` | ✅ Admin-guard | ✅ email/uid-validering | ❌ Saknas | ✅ Generisk |
| `POST /api/feedback` | ✅ Token | ⚠️ Min 3 tecken men inget max | ❌ Saknas | ✅ Generisk |
| `POST /api/founding/claim` | ✅ Token | ✅ (idempotent, inga fält) | ❌ Saknas | ✅ Generisk |
| `POST /api/notify` | ✅ Token | ✅ Allowlist-validering, preview 120 tecken | ❌ Saknas | ✅ Generisk |
| `POST /api/xp/grant` | ✅ Token | ✅ XP_AMOUNTS-allowlist | ❌ Saknas | ✅ Generisk |

**Positiv obs:** Inga stacktraces eller interna feldetaljer exponeras till klienten. Alla fel returnerar generiska meddelanden.

---

## DEL 2 — Juridisk efterlevnad

*Källor: [IMY.se — Dataskyddsförordningen](https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/), [IMY — Registrerades rättigheter](https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/de-registrerades-rattigheter/), [EDPB Cookie Banner Taskforce](https://www.edpb.europa.eu/our-work-tools/our-documents/other/report-work-undertaken-cookie-banner-taskforce_en), [PTS — Tillgänglighetsdirektivet](https://pts.se/digital-inkludering/lagen-om-vissa-produkters-och-tjansters-tillganglighet/)*

### Tabell — Juridisk efterlevnad

| Krav | Uppfyllt | Konkret fynd | Vad som krävs |
|---|---|---|---|
| **Integritetspolicy (GDPR Art. 13/14)** | 🔴 NEJ | Ingen `/privacy`, `/integritetspolicy` eller liknande sida finns. Footerns länkkarta saknar hänvisning. Login-sidan säger "Inga GDPR-popups, lovar." vilket är missvisande. | Sidan måste ha en integritetspolicy som täcker: vilka uppgifter som samlas in (e-post, namn, avatar, IP), syfte, rättslig grund (avtalsuppfyllande för auth, berättigat intresse för community-funktioner), lagringstid, Google/Firebase som personuppgiftsbiträde, ev. dataöverföring utanför EU/EES, kontaktuppgifter för dataskyddsfrågor, registrerades rättigheter. |
| **Rättslig grund för behandling** | 🔴 NEJ | Finns ingen policy som definierar på vilken rättslig grund data behandlas. | Definiera och dokumentera: auth = avtalsuppfyllande (Art. 6.1.b), community-aktivitet = berättigat intresse (Art. 6.1.f), eventuell marknadsföring = samtycke (Art. 6.1.a). |
| **Registrerades rätt till information** | 🔴 NEJ | Ingen kanal eller process för att hantera GDPR-förfrågningar (radering, rättelse, export, invändning). Kontaktsidan nämner inget om dataskyddsfrågor. | Lägg till dataskyddskontakt (hej@aibyggare.se räcker om den faktiskt hanteras). Dokumentera processen internt. |
| **Rätt till radering** | ⚠️ DELVIS | `/api/account/delete` raderar Firestore-data (profil, byggen, inlägg med sub-collections). **Saknas:** röster (`votes`), bokmärken (`bookmarks`), rapporter (`reports`), Storage-filer (avatarer, projektbilder), Firebase Auth-kontot (görs klient-side). | Utöka account/delete-routen att även radera votes, bookmarks, reports och Storage-filer. Firebase Auth-kontot bör raderas server-side via `adminAuth.deleteUser(uid)`. |
| **Rätt till dataportabilitet** | 🔴 NEJ | Ingen dataexport-funktion finns. | Implementera en export-funktion (t.ex. JSON-nedladdning av allt innehåll kopplat till användaren). Kan vara en later-feature men bör finnas när skala ökar. |
| **Cookies och tracking (LEK/ePrivacy)** | 🟡 DELVIS | Firebase Analytics är INTE aktiverat (measurementId finns i konfigurationen men `getAnalytics()` anropas aldrig). `__session`-cookien sätts men är nödvändig för autentisering (LEK-undantag för "strictly necessary"). **Risk:** Om Analytics aktiveras utan samtyckesbanner bryter det mot LEK kap. 9 § 28. | Bekräfta att Analytics aldrig aktiveras utan föregående cookie-samtyckesbanner. Om Analytics ska aktiveras framöver — implementera consent management (t.ex. Cookiebot eller en enkel banner) INNAN. |
| **Användarvillkor** | 🔴 NEJ | Ingen `/villkor`, `/terms` eller liknande sida. Footern saknar hänvisning. Det finns community-rules-sidan men den är inte ett juridiskt bindande avtal. | Lägg till användarvillkor som reglerar: accepterat beteende, UGC-rättigheter (vem äger vad användare publicerar), Pickis ansvarsbegränsning, rätt att ta bort innehåll/konton som bryter mot regler, och jurisdiktion (Sverige/EU). |
| **Tillgänglighet (EAA/Tillgänglighetsdirektivet)** | ⚠️ OKÄND | Lagen (2023:254) om vissa produkters och tjänsters tillgänglighet trädde i kraft 28 juni 2025. Täcker "tjänster som tillhandahålls på distans via webbplats." **Undantag:** mikroföretag (< 10 anställda, < 2 MEUR omsättning) kan vara befriade. AIbyggare.se är troligen ett mikroföretag. Grundläggande WCAG-efterlevnad (semantisk HTML, kontrast, alt-text) verkar rimlig men har ej provats systematiskt. | Om verksamheten växer bortom mikroföretagsgränsen — WCAG 2.1 AA gäller. Gör en grundläggande WCAG-genomgång (kontrastförhållanden, alt-text på bilder, tangentbordsnavigering). |
| **Marknadsföring / nyhetsbrev** | 🔴 VILSELEDANDE | Nyhetsbrev-formuläret i footern samlar in e-postadresser (syns visuellt) men sparar dem aldrig — formuläret är dead code som visar en bekräftelse utan att faktiskt göra något. Inga e-post skickas. | Tekniskt ingen GDPR-risk (inget sparas). Men det är vilseledande mot användare. Antingen implementera nyhetsbrev eller ta bort formuläret. Om nyhetsbrev implementeras: opt-in-samtycke, avsikt och avregistreringslänk i varje mail. |
| **Verksamhetsinformation (e-handelsdirektivet)** | ⚠️ DELVIS | Kontaktadress (hej@aibyggare.se) finns. Saknas: organisationsnamn, organisationsnummer, registrerad adress. Footer visar "© 2026 AIbyggare.se" utan mer info. | Lägg till bolagets fullständiga namn, org.nr och adress (i footer eller på Om-sidan / ny Imprint-sida). Detta krävs av e-handelsdirektivet (2000/31/EG, impl. i Sverige) om tjänsten bedrivs som en kommersiell verksamhet. |
| **Google/Firebase som personuppgiftsbiträde** | 🔴 NEJ | Firebase (Google LLC) behandlar personuppgifter på uppdrag av AIbyggare.se. Detta kräver ett Personuppgiftsbiträdesavtal (DPA). Google erbjuder automatiskt DPA via sina användarvillkor för Firebase — men det måste accepteras och dokumenteras i integritetspolicyn. | Bekräfta att Firebase DPA är accepterat i Firebase Console (Project Settings → General → Data Privacy). Dokumentera Google LLC som personuppgiftsbiträde och dataöverföring till USA (Standard Contractual Clauses) i integritetspolicyn. |

---

## Topp 5 mest akuta risker (säkerhet + juridik blandat)

Sorterade efter verklig risk — sanktionsrisk och faktisk skadepotential samvägd:

### 🔴 1. Avsaknad av integritetspolicy (KRITISK — JURIDISK)
**Risk:** IMY kan utfärda sanktionsavgifter på upp till 4% av global årsomsättning eller 20 MEUR (Art. 83.5 GDPR) för bristfällig information till registrerade. Sajten behandlar personuppgifter (e-post, namn, avatar, IP via Vercel, användarinnehåll) utan att ha dokumenterat detta någonstans. En enda anmälan från en användare är tillräckligt för en granskning.  
**Vad Picki behöver göra:** Avgöra på vilken rättslig grund varje databehandling vilar, ta fram en integritetspolicy (kan börja enkelt med IMY:s malltext), besluta om lagringstider, och sätta upp en dataskyddskontakt.

### 🔴 2. Session-cookie utan HttpOnly och Secure (HÖG — TEKNISK)
**Risk:** Firebase ID-token (giltig i 1 h) lagras i en JavaScript-läsbar cookie. Om XSS uppnås via en tredjepartsscript eller framtida XSS-sårbarhet kan en angripare stjäla token och impersonera användaren mot Firebase samt alla API-routes. Vercel/Firebase autentiserar på token, inte på IP/user-agent.  
**Fix:** Flytta cookie-sättningen server-side med HttpOnly+Secure-flaggor.

### 🔴 3. Inga användarvillkor (HÖG — JURIDISK)
**Risk:** Utan TOS har Picki inget juridiskt stöd för att ta bort användarinnehåll, stänga av konton, eller begränsa ansvar för UGC. Om communityn växer och någon publicerar olagligt innehåll (upphovsrättsbrott, förtal, spam) finns inget avtal att hänvisa till.  
**Vad Picki behöver göra:** Skriva grundläggande TOS (UGC ägs av skaparen men licens ges till AIbyggare.se att visa, rätt att moderera, ansvarsbegränsning, svensk jurisdiktion).

### 🔴 4. Inga API rate limits (HÖG — TEKNISK)
**Risk:** `/api/notify` låter en inloggad användare skicka obegränsat med notiser till en annan användare. `/api/feedback` möjliggör kostnadsattack via upprepade 6 MB bilduppladdningar till Firebase Storage (Storage-kostnader). `/api/xp/grant` kan anropas med alla tillgängliga event-typer i snabb följd.  
**Uppskattad konsekvens:** En ihärdig angripare kan generera Firebase Firestore/Storage-kostnader för hundratals kronor per dag.

### 🟡 5. Counter-manipulation via Firestore-regler (MEDEL — TEKNISK)
**Risk:** Valfri inloggad användare kan skriva direkt till Firestore och sätta `upvoteCount` till godtyckligt värde på andras projekt. Gamifiering och sortering i appen baseras på dessa värden. En angripare kan manipulera rangordning, ge egna projekt falsk popularitet, eller nollställa andras räknare.  
**Fix:** Ta bort klientens direktskrivningsregel för räknarna; flytta all räkning server-side.

---

## Vad Picki konkret behöver bidra med själv

Följande punkter kan inte lösas av kodändringar — de kräver Pickis beslut och/eller verklig information:

1. **Organisationsinformation** — Bolagets fullständiga namn, organisationsnummer, och registrerad adress. Behövs i footer/imprint-sida och integritetspolicy. Om AIbyggare.se drivs som privatperson (ej bolag) — avgör hur det ska presenteras.

2. **Beslut om datalagring** — Hur länge ska användardata lagras? Vad händer med data när ett konto raderas (backup-kopior, logs)? Vercel bevarar access logs — hur länge? Firebase Firestore har inga automatiska raderingsregler.

3. **Rättslig grund för varje databehandling** — Picki måste bestämma: är community-aktivitet (kommentarer, upvotes) baserad på "berättigat intresse" eller "samtycke via TOS"? Detta är ett affärsbeslut, inte ett tekniskt.

4. **Firebase DPA-bekräftelse** — Logga in i Firebase Console och bekräfta att Google LLC:s Data Processing Agreement är accepterat för projektet (Project Settings → General → Data Privacy / Cloud Terms).

5. **Beslut om nyhetsbrev** — Ska det implementeras på riktigt eller tas bort? Om det ska vara en funktion behövs ett beslut om e-posttjänst (t.ex. Resend + Loops, Mailchimp) och ett samtyckes-flöde.

6. **Kontaktpunkt för dataskyddsfrågor** — hej@aibyggare.se räcker om e-post faktiskt hanteras. GDPR kräver svar inom 30 dagar på förfrågningar om radering/export/rättelse.

7. **Eventuell DPO** — Vid liten skala (< ca 100 000 användare, ej känslig data) krävs inget utsett dataskyddsombud. Kan noteras i integritetspolicyn.

---

*Rapport sparad i `docs/sakerhetsanalys-2026-06-29.md`*  
*Nästa steg: Picki läser rapporten och beslutar om implementationsordning. Föreslaget: juridik-sprint (integritetspolicy + TOS) parallellt med teknisk sprint (rate limiting + cookie-fix + security headers).*

---

**Källor:**
- [IMY — Det här gäller enligt GDPR](https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/)
- [IMY — De registrerades rättigheter](https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/de-registrerades-rattigheter/)
- [EDPB — Cookie Banner Taskforce Report](https://www.edpb.europa.eu/our-work-tools/our-documents/other/report-work-undertaken-cookie-banner-taskforce_en)
- [PTS — Lagen om tillgänglighet till vissa produkter och tjänster](https://pts.se/digital-inkludering/lagen-om-vissa-produkters-och-tjansters-tillganglighet/)
- [Firebase Privacy & Security](https://firebase.google.com/support/privacy)
- [iubenda — Firebase Cloud and GDPR](https://www.iubenda.com/en/help/23040-firebase-cloud-gdpr-how-to-be-compliant/)
