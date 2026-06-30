import { Sticker } from "@/components/ui/Sticker";
import Link from "next/link";

export const metadata = {
  title: "Användarvillkor — AIbyggare.se",
  description:
    "Villkoren för att använda AIbyggare.se — vad du får göra, vad du inte får göra, och vilka rättigheter du behåller.",
};

export default function AnvandarvillkorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <Sticker tilt={1} className="mb-4 bg-hammer-yellow">
        Juridik
      </Sticker>
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Användarvillkor
      </h1>
      <p className="mt-3 font-mono text-xs text-mud">
        Senast uppdaterad: 2026-06-30
      </p>
      <p className="mt-4 text-mud leading-relaxed">
        Genom att skapa ett konto eller använda AIbyggare.se accepterar du dessa
        villkor. Läs dem — de är skrivna för att vara begripliga, inte för att
        dölja något.
      </p>

      <div className="mt-10 space-y-10 text-ink">

        {/* 1. Tjänsten */}
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-4">
            1. Vad är AIbyggare.se?
          </h2>
          <p className="text-mud leading-relaxed">
            AIbyggare.se är en svensk community-plattform för människor som
            bygger appar, webbsidor och digitala produkter med AI. Tjänsten drivs
            av <strong>Ncom.se</strong> (nedan &quot;vi&quot; eller
            &quot;AIbyggare&quot;). Du kan använda plattformen för att visa upp
            projekt, ställa frågor, dela prompts och guider samt interagera med
            andra byggare.
          </p>
        </section>

        {/* 2. Konto */}
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-4">
            2. Ditt konto
          </h2>
          <ul className="space-y-3 text-mud leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px] bg-build-green" />
              <span>
                Du måste vara minst 13 år för att skapa ett konto. Är du under
                18 år behöver du målsmans medgivande.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px] bg-build-green" />
              <span>
                Du ansvarar för att hålla dina inloggningsuppgifter hemliga och
                för all aktivitet som sker via ditt konto.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px] bg-build-green" />
              <span>
                Du får bara ha ett aktivt konto. Skapar du konton för att kringgå
                avstängningar förbehåller vi oss rätten att radera alla konton.
              </span>
            </li>
          </ul>
        </section>

        {/* 3. Ditt innehåll */}
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-4">
            3. Ditt innehåll (UGC)
          </h2>
          <div className="chunky rounded-2xl bg-build-green/10 border-2 border-ink p-5 mb-4">
            <p className="font-bold text-ink mb-1">Du äger ditt innehåll.</p>
            <p className="text-sm text-mud leading-relaxed">
              Det du publicerar (projekt, frågor, svar, kommentarer, prompts) är
              ditt. Vi gör inga anspråk på äganderätten.
            </p>
          </div>
          <p className="text-mud leading-relaxed mb-3">
            Genom att publicera innehåll på AIbyggare.se ger du oss en{" "}
            <strong>icke-exklusiv, royaltyfri licens</strong> att visa, lagra och
            distribuera ditt innehåll inom ramen för tjänsten — inklusive att
            visa det för andra användare och i delningslänkar.
          </p>
          <p className="text-mud leading-relaxed">
            Denna licens upphör när du raderar innehållet eller ditt konto (med
            undantag för sådant som andra användare redan interagerat med, t.ex.
            besvarade frågor, där vi kan behålla en anonym version för
            communityns skull).
          </p>
        </section>

        {/* 4. Regler */}
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-4">
            4. Regler för uppträdande
          </h2>
          <p className="text-mud leading-relaxed mb-4">
            Fullständiga communityregler finns på{" "}
            <Link
              href="/community-rules"
              className="text-build-green hover:underline font-mono"
            >
              /community-rules
            </Link>
            . Kortfattat: du får aldrig publicera innehåll som:
          </p>
          <ul className="space-y-2 text-mud">
            {[
              "Är olagligt, kränkande, hotfullt eller diskriminerande",
              "Bryter mot någon annans upphovsrätt eller immateriella rättigheter",
              "Innehåller skadlig kod, phishing eller bedrägeri",
              "Är spam, reklam utan tillstånd eller massutskick",
              "Sprider medvetet vilseledande information",
              "Är pornografiskt eller sexuellt explicit",
            ].map((rule) => (
              <li key={rule} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px] bg-bug-red" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 5. Moderering */}
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-4">
            5. Moderering och kontoåtgärder
          </h2>
          <p className="text-mud leading-relaxed mb-4">
            Vi förbehåller oss rätten att:
          </p>
          <ul className="space-y-3 text-mud leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px] bg-hammer-yellow" />
              <span>
                Ta bort innehåll som bryter mot dessa villkor eller
                communityreglerna, utan förvarning.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px] bg-hammer-yellow" />
              <span>
                Stänga av eller permanent radera konton som upprepat bryter mot
                villkoren eller som används för att skada communityn eller
                tjänsten.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px] bg-hammer-yellow" />
              <span>
                Begränsa åtkomsten till tjänsten vid risk för missbruk, säkerhetsincidenter
                eller andra omständigheter som motiverar det.
              </span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-mud">
            Vi strävar efter att vara rättvisa. Om du anser att en åtgärd
            vidtagits felaktigt kan du alltid kontakta oss på{" "}
            <a
              href="mailto:info@aibyggare.se"
              className="text-build-green hover:underline font-mono"
            >
              info@aibyggare.se
            </a>
            .
          </p>
        </section>

        {/* 6. Ansvarsbegränsning */}
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-4">
            6. Ansvarsbegränsning
          </h2>
          <div className="chunky rounded-2xl bg-paper border-2 border-ink p-5 text-sm text-mud leading-relaxed space-y-3">
            <p>
              Tjänsten tillhandahålls &quot;som den är&quot; utan garantier om
              tillgänglighet, noggrannhet eller lämplighet för ett specifikt
              ändamål.
            </p>
            <p>
              Vi ansvarar inte för innehåll som publiceras av användare. Det är
              communityns innehåll — vi modererar men granskar inte allt i
              förväg.
            </p>
            <p>
              I den utsträckning lagen tillåter begränsar vi vårt skadeståndansvar
              till direkt skada och upp till det belopp du eventuellt betalat för
              tjänsten under de senaste 12 månaderna (för en gratis tjänst: noll
              kronor).
            </p>
            <p>
              Ingenting i dessa villkor begränsar dina rättigheter som
              konsument enligt tvingande svensk konsumentlagstiftning.
            </p>
          </div>
        </section>

        {/* 7. Immateriella rättigheter — vår kod */}
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-4">
            7. Vår plattform
          </h2>
          <p className="text-mud leading-relaxed">
            Plattformens design, kod och varumärke (logotyp, namn, grafik) ägs
            av Ncom.se. Du får inte kopiera, modifiera, distribuera eller skapa
            derivatverk av dessa utan skriftligt tillstånd.
          </p>
        </section>

        {/* 8. Lagstiftning */}
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-4">
            8. Tillämplig lag och tvistlösning
          </h2>
          <p className="text-mud leading-relaxed mb-3">
            Dessa villkor styrs av <strong>svensk rätt</strong>. Eventuella
            tvister ska i första hand lösas i godo. Om det inte är möjligt ska
            tvisten avgöras av{" "}
            <strong>Stockholms tingsrätt</strong> som första instans.
          </p>
          <p className="text-sm text-mud">
            Du som konsument har alltid rätt att vända dig till Allmänna
            reklamationsnämnden (ARN) eller EU:s tvistlösningsplattform (ODR).
          </p>
        </section>

        {/* 9. Ändringar */}
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-4">
            9. Ändringar av villkoren
          </h2>
          <p className="text-mud leading-relaxed">
            Vi kan komma att uppdatera dessa villkor. Väsentliga ändringar
            meddelas via e-post och/eller tydligt meddelande på sajten senast 30
            dagar innan de träder i kraft. Om du fortsätter använda tjänsten
            efter att ändringarna trätt i kraft anses du ha accepterat de nya
            villkoren.
          </p>
        </section>

        {/* 10. Kontakt */}
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-4">
            10. Kontakt
          </h2>
          <p className="text-mud leading-relaxed">
            Frågor om dessa villkor? Kontakta oss på{" "}
            <a
              href="mailto:info@aibyggare.se"
              className="text-build-green hover:underline font-mono"
            >
              info@aibyggare.se
            </a>
            {" "}eller via{" "}
            <a
              href="https://ncom.se"
              className="text-build-green hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ncom.se
            </a>
            .
          </p>
        </section>

      </div>
    </div>
  );
}
