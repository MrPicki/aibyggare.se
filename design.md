# design.md — AIbyggare.se visuell identitet & redesign

> Analys av redesign-uppdraget + det designsystem vi bygger efter.
> Inspiration: energin och charmen i aurabora.com — **inte** innehållet. Allt här
> är original för AIbyggare.se. Inga Aura Bora-assets, fonter, texter eller bilder.

---

## 1. Vad uppdraget egentligen ber om

Dagens sida är kompetent men "lugn premium-SaaS". Den saknar **själ och igenkänning**.
Uppdraget vill ha en sida med:

- **Karaktär** — något man minns och vill återvända till.
- **Humor med självdistans** — byggarens verklighet (deploy failed, RLS, halvfärdigt).
- **Retro-handgjord känsla** — chunky typografi, hard offset shadows, stickers, squiggles.
- **Egen värld** — "en retro-digital svensk byggplats där AI-projekt blir till."

Det vi **inte** vill ha: Aura Bora med utbytt text, barnslig Minecraft-sida, generisk
AI-template, blå/lila gradient, robotar, Dribbble-överdesign.

Känslokompass: *lekfull · retro · handritad · varm · lite knäpp · tydlig · mänsklig ·
premium men inte stel · rolig men seriös.*

---

## 2. Konceptet: "Byggbänken"

Den bärande metaforen är **byggbänken / snickarboden** — fast digital.
Aura Boras burkar & frukter → våra **kodblock, hammare, terminaler, buggar, prompts,
ritningslappar, deploys**.

Återkommande visuella objekt (alla original-SVG/CSS i komponenterna):

| Objekt | Betydelse | Var |
|---|---|---|
| Blockig hammare `</>` + hammare | logotyp / byggande | Header, hero, footer |
| Kodblock (byggstenar) | kod / projekt | hero-bakgrund, dekor |
| Terminalfönster | deploy / dev | tool switcher, stickers |
| Databas-cylinder | Supabase/data | tool switcher, projektkort |
| Liten SVG-bugg | felsökning | dekor, stuck-banner |
| Raket | deploy | tool switcher, community |
| Tejplapp / sticker | taggar, badges | överallt |
| Squiggles, pilar, stjärnor | handritat liv | rubriker, CTA |

---

## 3. Typografi

Öppna Google Fonts (inga Aura Bora-fontfiler). Svenska tecken (å ä ö) måste stödjas.

- **Display / rubriker → `Fredoka`** (variabel 400–700). Chunky, puffig, rundad,
  full latin-ext. Används stort med outline/drop-shadow för "puffy" känsla.
- **Mono / nav / labels / metadata → `IBM Plex Mono`** (400/500/600/700). Tydlig,
  teknisk, bra å ä ö. Uppercase + letter-spacing på labels och knappar.
- **Brödtext → `Geist Sans`** (behålls). Läsbarhet först; aldrig för litet (≥15px).

Regler:
- Stora rubriker: Fredoka 600/700, tajt line-height, ev. `text-outline` + offset-shadow.
- Labels/kicker/metadata: IBM Plex Mono, uppercase, `tracking-wide`, ~11–13px.
- Knappar: mono, medium/semibold.

---

## 4. Färgpalett (CSS-variabler)

Varm, retro, organisk men digital. Cream-bakgrund, mörk oliv-bläck text, färgade zoner.

```
--cream:          #F6F1EC   /* sidbakgrund            */
--paper:          #FFFAF2   /* kort / paneler         */
--ink:            #373927   /* text + alla outlines   */
--mud:            #6B665B   /* sekundär text          */

--build-green:    #64B26A   /* primär / bygg / live   */
--hammer-yellow:  #F0D76A   /* accent / marquee / CTA */
--warning-orange: #F2A65A   /* fastnat / status       */
--bug-red:        #B25A44   /* buggar / fel           */
--code-blue:      #6F9FB5   /* kod / idéer            */
--prompt-purple:  #B498C8   /* prompts                */
--supabase-green: #7BBF8A   /* Supabase               */
--soft-olive:     #C4B757
--soft-teal:      #A7C4C3
```

Användning: färger som **stora zoner och korttema**, inte tunna accenter. Varje
AI-verktyg får en egen färg (se §6). Ingen neon, ingen standard-AI-gradient.
Mörkt läge behålls tekniskt men startsidan är optimerad för det ljusa.

---

## 5. Utilities / stilprinciper (globals.css)

Centraliserade så hela sidan är konsekvent:

- **`.chunky`** — `border: 2px solid var(--ink); box-shadow: 5px 5px 0 var(--ink);`
- **`.pressable`** — hover/active: `translate(2px,2px)` + krympande shadow → "tryck ner".
- **`.sticker`** — liten roterad tejplapp-känsla (border, offset-shadow, ev. tilt).
- **`.text-outline`** — puffy rubrik med mörk kontur + ljus highlight.
- **Marquee** — `@keyframes marquee` (oändlig horisontell scroll), pausar på `hover`.
- **Float/bob** — `@keyframes float` för dekorelement, `prefers-reduced-motion` respekteras.
- **Reveal** — mild fade/slide-in på scroll (IntersectionObserver, lätt hook).
- Radius: stora, mjuka — `1.25–1.75rem` på kort/knappar.

---

## 6. AI-verktyg (tool switcher) — färg + sticker + copy

| Verktyg | Accent | Illustration | Copy |
|---|---|---|---|
| Claude Code | warning-orange | kodblock + hammare | "Bra på att bygga. Ännu bättre på att skriva om allt." |
| Cursor | code-blue | terminal + cursor-blink | "Autocomplete som ibland läser dina tankar." |
| Lovable | prompt-purple | browserfönster + pensel | "Snyggt snabbt. Sedan börjar det riktiga jobbet." |
| Supabase | supabase-green | databas-cylinder + varningsskylt | "Det var RLS. Det är alltid RLS." |
| Vercel | ink | raket + terminal | "Deploy failed, men vi försöker igen." |
| Bolt | hammer-yellow | blixt + kodblock | "Noll till app innan kaffet kallnar." |

---

## 7. Copy-ton

Svensk, rak, självdistanserad, nybörjarvänlig — aldrig barnslig, aldrig corporate.
Bank av rader (används i marquees, hero, banners, empty states):

- "För oss som bygger först och förstår sen."
- "Lägg upp ditt bygge innan du hinner överge det."
- "Funkar lokalt? Det räknas som emotionellt stöd."
- "Halvfärdigt är också byggt."
- "En MVP är bara en bugg med ambition."
- "Deploy failed, men drömmen lever."
- "Det var RLS. Det är alltid RLS."
- "Välkommen till byggbänken."

Undvik: "Sveriges community för…", "AI-powered", "Nästa generation", "Skapa framtiden".

---

## 8. Startsidans sektioner (en lång scroll)

1. **AnnouncementMarquee** — gul/cream bar, mono uppercase, infinite scroll.
2. **Header** — sticky, center-wordmark + hammar-logo, pill-nav, chunky CTA, hamburger.
3. **Hero** — kicker, chunky headline, sub, CTA×2, microcopy + interaktiv **ToolSwitcherCard**.
4. **TabStrip** — "Vad gör man här?" (Visa byggen / Få hjälp / Dela prompts / Hitta byggare).
5. **StatementBlock** — stor typografi med färgade highlights + verktygs-chips.
6. **ProjectShowcase** — "Just nu på bänken", chunky byggkort i carousel.
7. **StuckBanner** — gul fullbredd "FASTNAT?" med klickbara ämnes-labels.
8. **PromptShowcase** — "Prompts som faktiskt funkade", chunky promptkort.
9. **Testimonials** — "De fattar grejen", masonry quote cards (märkta placeholder).
10. **CommunityMarquee** — band "BYGGEN · BUGGAR · PROMPTS · DEPLOYS · KAFFE · ENVISHET" + CTA.
11. **Footer** — varm, hammar-logo, nyhetsbrev, länkkolumner, mänsklig bottenrad.

---

## 9. Komponentinventering

`home/`: AnnouncementMarquee, Hero (+ ToolSwitcherCard), TabStrip, StatementBlock,
ProjectShowcase, StuckBanner, PromptShowcase, Testimonials, CommunityMarquee.
`layout/`: Header, Footer.
`cards/`: ProjectCard, PromptCard (chunky-omgjorda), HelpCard (behålls/justeras).
`ui/`: ChunkyButton, Sticker, DecorativeBlob, PixelHammerLogo, Marquee, tool-stickers.

---

## 10. Regler under bygget

- Rör **inte** auth/databas/routing mer än nödvändigt. Behåll befintliga routes.
- Mobile-first. Inga horisontella overflow-buggar. Bra touch-targets.
- Inga tunga animationsbibliotek — CSS + en liten reveal-hook räcker.
- Tillgänglighet: dekor `aria-hidden`, reducerad rörelse respekteras, kontrast hålls.
- Lint + typecheck + build ska vara grönt innan leverans.

*Mål: en användare ska känna "den här sidan fattar exakt hur det känns att bygga med AI."*
