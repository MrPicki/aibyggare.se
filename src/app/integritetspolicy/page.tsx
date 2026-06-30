import { Sticker } from "@/components/ui/Sticker";

export const metadata = {
  title: "Integritetspolicy — AIbyggare.se",
  description:
    "Hur AIbyggare.se hanterar dina personuppgifter — vad vi samlar in, varför, hur länge och vilka rättigheter du har.",
};

export default function IntegritetspolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <Sticker tilt={-1} className="mb-4 bg-code-blue">
        Juridik
      </Sticker>
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Integritetspolicy
      </h1>
      <p className="mt-3 font-mono text-xs text-mud">
        Senast uppdaterad: 2026-06-30
      </p>

      <div className="mt-10 space-y-10 text-ink">

        {/* 1. Personuppgiftsansvarig */}
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-4">
            1. Personuppgiftsansvarig
          </h2>
          <p className="text-mud leading-relaxed">
            AIbyggare.se drivs av <strong>Ncom.se</strong>, ett svenskt
            företag. Kontakta oss för dataskyddsfrågor:
          </p>
          <div className="chunky mt-4 rounded-2xl bg-paper p-5 font-mono text-sm space-y-1">
            <p>
              <span className="text-mud">Företag:</span>{" "}
              <span className="font-bold">Ncom.se</span>
            </p>
            <p>
              <span className="text-mud">Org.nr:</span>{" "}
              <span className="rounded bg-hammer-yellow/60 px-1 font-bold text-ink">
                8812134016
              </span>
            </p>
            <p>
              <span className="text-mud">Adress:</span>{" "}
              <span className="rounded bg-hammer-yellow/60 px-1 font-bold text-ink">
                Kronetorpsgatan, Malmö
              </span>
            </p>
            <p>
              <span className="text-mud">Webb:</span>{" "}
              <a
                href="https://ncom.se"
                className="text-build-green hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                ncom.se
              </a>
            </p>
            <p>
              <span className="text-mud">GDPR-förfrågningar:</span>{" "}
              <a
                href="mailto:info@aibyggare.se"
                className="text-build-green hover:underline"
              >
                info@aibyggare.se
              </a>
            </p>
          </div>
          <p className="mt-3 text-sm text-mud">
            Vi svarar på alla dataskyddsfrågor inom 30 dagar.
          </p>
        </section>

        {/* 2. Vilka uppgifter vi behandlar */}
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-4">
            2. Vilka uppgifter vi behandlar
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-2 border-ink rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-ink text-paper font-mono text-xs uppercase tracking-widest">
                  <th className="text-left px-4 py-3">Uppgift</th>
                  <th className="text-left px-4 py-3">Varifrån</th>
                  <th className="text-left px-4 py-3">Varför</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-border">
                <tr className="bg-paper">
                  <td className="px-4 py-3 font-mono">E-postadress</td>
                  <td className="px-4 py-3 text-mud">Du (vid registrering)</td>
                  <td className="px-4 py-3 text-mud">Inloggning, kommunikation</td>
                </tr>
                <tr className="bg-cream">
                  <td className="px-4 py-3 font-mono">Namn / användarnamn</td>
                  <td className="px-4 py-3 text-mud">Du (vid registrering)</td>
                  <td className="px-4 py-3 text-mud">Identifiering i communityn</td>
                </tr>
                <tr className="bg-paper">
                  <td className="px-4 py-3 font-mono">Profilbild</td>
                  <td className="px-4 py-3 text-mud">Du (valfritt)</td>
                  <td className="px-4 py-3 text-mud">Visas på din profil</td>
                </tr>
                <tr className="bg-cream">
                  <td className="px-4 py-3 font-mono">Innehåll du publicerar</td>
                  <td className="px-4 py-3 text-mud">Du (byggen, frågor, kommentarer)</td>
                  <td className="px-4 py-3 text-mud">Kärntjänsten</td>
                </tr>
                <tr className="bg-paper">
                  <td className="px-4 py-3 font-mono">IP-adress</td>
                  <td className="px-4 py-3 text-mud">Automatiskt (serverloggar)</td>
                  <td className="px-4 py-3 text-mud">Säkerhet, missbruksdetektering</td>
                </tr>
                <tr className="bg-cream">
                  <td className="px-4 py-3 font-mono">Inloggningstidpunkt</td>
                  <td className="px-4 py-3 text-mud">Automatiskt</td>
                  <td className="px-4 py-3 text-mud">Inaktivitetsbaserad radering</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Rättslig grund */}
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-4">
            3. Rättslig grund för behandlingen
          </h2>
          <p className="text-mud leading-relaxed mb-4">
            Vi tillämpar tre olika rättsliga grunder beroende på ändamål:
          </p>

          <div className="space-y-4">
            <div className="chunky rounded-2xl bg-build-green/10 border-2 border-ink p-5">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-mud mb-2">
                Avtal — Art. 6.1.b GDPR
              </p>
              <p className="font-bold text-ink mb-1">
                Konto, profil, projekt, kommentarer, hjälpfrågor
              </p>
              <p className="text-sm text-mud leading-relaxed">
                Behandlingen är nödvändig för att tillhandahålla den tjänst du
                begärt (ett konto och tillgång till communityns funktioner).
                Denna grund kräver inte separat samtycke.
              </p>
            </div>

            <div className="chunky rounded-2xl bg-hammer-yellow/20 border-2 border-ink p-5">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-mud mb-2">
                Samtycke — Art. 6.1.a GDPR
              </p>
              <p className="font-bold text-ink mb-1">
                Nyhetsbrev och marknadsföringsutskick
              </p>
              <p className="text-sm text-mud leading-relaxed">
                Du lämnar aktivt samtycke när du prenumererar. Du kan
                avregistrera dig närsomhelst via avregistreringslänken i varje
                utskick eller genom att kontakta info@aibyggare.se. Att inte
                prenumerera påverkar inte din tillgång till övriga funktioner.
              </p>
            </div>

            <div className="chunky rounded-2xl bg-cream border-2 border-ink p-5">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-mud mb-2">
                Berättigat intresse — Art. 6.1.f GDPR
              </p>
              <p className="font-bold text-ink mb-1">
                Säkerhetsloggar och missbruksdetektering
              </p>
              <p className="text-sm text-mud leading-relaxed">
                Vi behandlar IP-adresser och åtkomsttidpunkter för att skydda
                tjänsten och andra användare mot missbruk. Intresset av en
                trygg community väger tyngre än integritetsintresset för denna
                begränsade behandling.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Lagringstider */}
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-4">
            4. Hur länge sparar vi dina uppgifter?
          </h2>
          <ul className="space-y-3 text-mud leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px] bg-build-green" />
              <span>
                <strong className="text-ink">Aktivt konto:</strong> Vi sparar
                dina uppgifter så länge ditt konto är aktivt.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px] bg-build-green" />
              <span>
                <strong className="text-ink">150 dagars inaktivitet:</strong>{" "}
                Om du inte loggat in på 150 dagar raderas ditt konto och
                tillhörande personuppgifter automatiskt.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px] bg-build-green" />
              <span>
                <strong className="text-ink">Kontoradering:</strong> Du kan
                när som helst radera ditt konto via dina inställningar. All
                data raderas omedelbart.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px] bg-build-green" />
              <span>
                <strong className="text-ink">Serverloggar:</strong> Vercels
                åtkomstsloggar sparas i enlighet med Vercels dataskyddspolicy
                (typiskt 30–90 dagar).
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px] bg-build-green" />
              <span>
                <strong className="text-ink">Nyhetsbrev:</strong>{" "}
                E-postadressen sparas tills du avregistrerar dig.
              </span>
            </li>
          </ul>
        </section>

        {/* 5. Personuppgiftsbiträden */}
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-4">
            5. Personuppgiftsbiträden och dataöverföring
          </h2>
          <p className="text-mud leading-relaxed mb-4">
            Vi anlitar följande biträden som behandlar personuppgifter för vår
            räkning:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-2 border-ink rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-ink text-paper font-mono text-xs uppercase tracking-widest">
                  <th className="text-left px-4 py-3">Leverantör</th>
                  <th className="text-left px-4 py-3">Ändamål</th>
                  <th className="text-left px-4 py-3">Land</th>
                  <th className="text-left px-4 py-3">Skyddsåtgärd</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-border">
                <tr className="bg-paper">
                  <td className="px-4 py-3 font-mono">Google LLC (Firebase)</td>
                  <td className="px-4 py-3 text-mud">Databas, auth, lagring</td>
                  <td className="px-4 py-3 text-mud">USA / EU</td>
                  <td className="px-4 py-3 text-mud">SCC + Firebase DPA</td>
                </tr>
                <tr className="bg-cream">
                  <td className="px-4 py-3 font-mono">Vercel Inc.</td>
                  <td className="px-4 py-3 text-mud">Webbhosting</td>
                  <td className="px-4 py-3 text-mud">USA / EU</td>
                  <td className="px-4 py-3 text-mud">SCC + Vercel DPA</td>
                </tr>
                <tr className="bg-paper">
                  <td className="px-4 py-3 font-mono">Resend Inc.</td>
                  <td className="px-4 py-3 text-mud">Nyhetsbrev (e-post)</td>
                  <td className="px-4 py-3 text-mud">USA</td>
                  <td className="px-4 py-3 text-mud">SCC + Resend DPA</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-mud">
            SCC = Standard Contractual Clauses (EU-kommissionens
            standardavtalsklausuler för dataöverföring till tredjeland).
            Överföringen av personuppgifter till USA sker med stöd av dessa
            klausuler (Art. 46.2.c GDPR).
          </p>
        </section>

        {/* 6. Dina rättigheter */}
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-4">
            6. Dina rättigheter
          </h2>
          <p className="text-mud leading-relaxed mb-4">
            Enligt GDPR har du följande rättigheter:
          </p>
          <div className="space-y-3">
            {[
              {
                right: "Rätt till tillgång",
                desc: "Du kan begära en kopia av alla personuppgifter vi behandlar om dig.",
              },
              {
                right: "Rätt till rättelse",
                desc: "Du kan begära att felaktiga uppgifter korrigeras.",
              },
              {
                right: "Rätt till radering",
                desc: "Du kan radera ditt konto direkt i inställningarna. Du kan också begära radering via e-post.",
              },
              {
                right: "Rätt till dataportabilitet",
                desc: "Du kan begära dina uppgifter i ett strukturerat, maskinläsbart format.",
              },
              {
                right: "Rätt att invända",
                desc: "Du kan invända mot behandling som grundas på berättigat intresse.",
              },
              {
                right: "Rätt att dra tillbaka samtycke",
                desc: "Om du prenumererar på nyhetsbrevet kan du avregistrera dig närsomhelst utan negativa konsekvenser.",
              },
              {
                right: "Rätt att klaga",
                desc: "Du kan anmäla klagomål till Integritetsskyddsmyndigheten (IMY) på imy.se.",
              },
            ].map(({ right, desc }) => (
              <div key={right} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px] bg-build-green" />
                <div>
                  <span className="font-bold text-ink">{right}: </span>
                  <span className="text-mud">{desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-mud">
            Skicka dina förfrågningar till{" "}
            <a
              href="mailto:info@aibyggare.se"
              className="text-build-green hover:underline font-mono"
            >
              info@aibyggare.se
            </a>
            . Vi svarar inom 30 dagar.
          </p>
        </section>

        {/* 7. Cookies */}
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-4">
            7. Cookies
          </h2>
          <p className="text-mud leading-relaxed mb-3">
            Vi använder en enda cookie:
          </p>
          <div className="chunky rounded-2xl bg-paper border-2 border-ink p-5 font-mono text-sm">
            <p>
              <span className="text-mud">Namn:</span>{" "}
              <span className="font-bold">__session</span>
            </p>
            <p className="mt-1">
              <span className="text-mud">Syfte:</span> Autentisering (nödvändig
              för inloggning)
            </p>
            <p className="mt-1">
              <span className="text-mud">Giltighetstid:</span> 1 timme
            </p>
            <p className="mt-1">
              <span className="text-mud">Typ:</span> Strikt nödvändig — kräver
              inte samtycke (LEK § 22 d)
            </p>
          </div>
          <p className="mt-3 text-sm text-mud">
            Vi använder inga spårningscookies eller annonscookies. Firebase
            Analytics är inte aktiverat.
          </p>
        </section>

        {/* 8. Ändringar */}
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-4">
            8. Ändringar i denna policy
          </h2>
          <p className="text-mud leading-relaxed">
            Vi kan komma att uppdatera denna integritetspolicy. Väsentliga
            ändringar meddelas via e-post till registrerade användare och/eller
            via ett tydligt meddelande på sajten. Datumet &quot;Senast
            uppdaterad&quot; överst på sidan visar när senaste revision gjordes.
          </p>
        </section>

      </div>
    </div>
  );
}
