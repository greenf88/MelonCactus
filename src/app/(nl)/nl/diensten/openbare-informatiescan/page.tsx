import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { ServiceCard } from "@/components/service-card";
import { StructuredData } from "@/components/structured-data";
import { publicProfileScanNl } from "@/config/site-nl";
import { languageAlternates } from "@/lib/i18n";
import { breadcrumbSchema, serviceSchema, socialImageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Openbare-informatiescan voor industriële bedrijven",
  description: "Een compacte scan voor €499 excl. btw van wat buitenstaanders uit uw bedrijfswebsite, officiële openbare kanalen en geselecteerd beeldmateriaal kunnen afleiden.",
  alternates: languageAlternates("/services/public-profile-exposure-scan", "nl"),
  openGraph: { title: "Openbare-informatiescan voor industriële bedrijven", ...socialImageMetadata("nl", "service", "Openbare-informatiescan", "openbare-informatiescan").openGraph },
};

const deliverables = [
  ["Waarnemingen", "Wat het afgesproken openbare materiaal rechtstreeks laat zien, met heldere bronverwijzingen."],
  ["Voorzichtige gevolgtrekkingen", "Wat een deskundige buitenstaander redelijkerwijs kan afleiden wanneer afzonderlijke publicaties samen worden bekeken."],
  ["Onbekenden", "Waar het beschikbare materiaal geen verantwoorde conclusie ondersteunt."],
  ["Prioriteiten", "Welke toekomstige publicaties extra aandacht verdienen en waarom."],
] as const;

export default function DutchPublicProfileExposureScanPage() {
  return (
    <>
      <PageHeader
        locale="nl"
        eyebrow="Defensieve beoordeling met vaste scope"
        title="Bekijk uw bedrijf door de ogen van een buitenstaander."
        intro="De openbare-informatiescan beoordeelt een afgebakende selectie van uw eigen openbare materiaal en laat zien wat afzonderlijke signalen samen mogelijk prijsgeven."
        breadcrumbs={[{ label: "Diensten", href: "/nl/diensten" }, { label: "Openbare-informatiescan" }]}
      />

      <section className="section">
        <Container className="split-content">
          <div><p className="eyebrow">Het doel</p><h2>Nuttige communicatie kan in combinatie meer prijsgeven.</h2></div>
          <div className="prose-block">
            <p>Een webpagina, bericht op sociale media, vacature, afbeelding of bedrijfsvideo zegt afzonderlijk misschien weinig. Samen kan openbaar materiaal een duidelijker beeld geven van richting, capaciteiten, relaties of operationele prioriteiten dan de organisatie bedoelde.</p>
            <p>De scan is defensief: hij helpt uw bedrijf bepalen waar een strengere publicatiecontrole zinvol is, zonder nuttige communicatie met klanten, medewerkers en partners onnodig te beperken.</p>
          </div>
        </Container>
      </section>

      <section className="section section-muted">
        <Container>
          <div className="content-heading"><p className="eyebrow">Compacte oplevering</p><h2>Wat u ontvangt.</h2><p>De beoordeling scheidt rechtstreeks bewijs van interpretatie en benoemt duidelijk waar het openbare beeld onvolledig blijft.</p></div>
          <div className="values-grid">
            {deliverables.map(([title, description], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </Container>
      </section>

      <section className="section pricing-section">
        <Container className="split-content">
          <div className="prose-block">
            <p className="eyebrow">Afgebakende scope</p>
            <h2>Bewust beperkt als bruikbaar vertrekpunt.</h2>
            <p>De vaste prijs omvat één primaire bedrijfswebsite, maximaal twee officiële openbare kanalen en geselecteerd beeldmateriaal dat het bedrijf zelf heeft gepubliceerd. De exacte selectie en onderzoeksperiode worden vóór aanvang bevestigd.</p>
            <p>De scan omvat geen besloten accounts, penetratietest, onderzoek naar netwerk- of softwarekwetsbaarheden, darkwebmonitoring, juridische complianceverklaring of doorlopende monitoring. Een bredere vraag wordt afzonderlijk afgebakend.</p>
          </div>
          <ServiceCard locale="nl" service={publicProfileScanNl} />
        </Container>
      </section>

      <section className="section">
        <Container className="split-content">
          <div><p className="eyebrow">Bewijsgrens</p><h2>Een signaal is niet automatisch een bevinding.</h2></div>
          <div className="prose-block"><p>Beeld en tekst worden in hun context beoordeeld. De scan beweert niet vast te stellen wat iedere concurrent weet en behandelt een aannemelijke interpretatie niet als feit. Conclusies blijven in verhouding tot het bewijs.</p><ButtonLink href="/nl/voorbeeldcase/openbaar-profiel" variant="secondary">Bekijk de fictieve voorbeeldcase</ButtonLink></div>
        </Container>
      </section>

      <section className="closing-cta"><Container className="closing-inner"><div><p className="eyebrow">Beoordeel uw eigen openbare profiel</p><h2>Vraag de scan met vaste scope aan.</h2><p>Wij bevestigen de openbare kanalen, selectie en grenzen voordat wij de opdracht accepteren. De prijs van €499 is exclusief btw; toepasselijke btw wordt in het schriftelijke voorstel opgeteld.</p></div><ButtonLink href={`/nl/contact?report=${encodeURIComponent(publicProfileScanNl.formValue ?? publicProfileScanNl.name)}`}>Vraag de scan van €499 aan</ButtonLink></Container></section>
      <StructuredData data={breadcrumbSchema("nl", [{ name: "Diensten", path: "/nl/diensten" }, { name: "Openbare-informatiescan", path: "/nl/diensten/openbare-informatiescan" }])} />
      <StructuredData data={serviceSchema({ path: "/nl/diensten/openbare-informatiescan", name: publicProfileScanNl.name, description: publicProfileScanNl.summary, locale: "nl", price: 499, priceNote: "Vaste prijs van €499 exclusief btw, na afbakening en schriftelijke bevestiging." })} />
    </>
  );
}
