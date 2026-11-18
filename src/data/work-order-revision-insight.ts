import type { ArticleVisual } from "@/data/article-visuals";
import { articleSources } from "@/data/article-sources";
import type { Insight } from "@/data/insights";

const workOrderRevisionVisual: ArticleVisual = {
  width: 1200,
  height: 760,
  mobileWidth: 760,
  mobileHeight: 1100,
  src: "/article-visuals/werkbon-tekeningrevisie-proef-nl.svg",
  mobileSrc: "/article-visuals/werkbon-tekeningrevisie-proef-nl-mobile.svg",
  alt: "Besliskader voor vijf fictieve werkbonnen: een vaste regel vergelijkt tekeningnummer, revisie en vrijgavestatus; AI helpt alleen bij scan- of tekstextractie en werkvoorbereiding beslist.",
  title: "Vijf werkbonnen, drie bronvelden, één menselijke vrijgave",
  caption: "Vergelijk eerst tekeningnummer, revisie en vrijgavestatus met vaste regels. Gebruik AI alleen voor het uitlezen van ongestructureerde invoer en behandel twijfel als een reden om te stoppen en te controleren.",
  explanationLabel: "Uitleg van de werkbon- en revisiecontrole in tekst",
  details: [
    { label: "Vaste controle", text: "Vergelijk tekeningnummer, revisie en vrijgavestatus rechtstreeks zodra deze velden gestructureerd beschikbaar zijn." },
    { label: "Begrensde AI-hulp", text: "Gebruik AI of OCR alleen om velden uit scans of vrije tekst voor te stellen; bewaar bronpassage, onzekerheid en een route voor onleesbare invoer." },
    { label: "Menselijke beslissing", text: "Werkvoorbereiding beoordeelt iedere afwijking en bepaalt of de werkbon doorgaat, wordt gecorrigeerd of teruggaat naar de documenteigenaar." },
  ],
  afterSectionIndex: 3,
};

export const workOrderRevisionInsightNl: Insight = {
  slug: "werkbon-tekeningrevisie-controleren-voor-productie",
  title: "Werkbon en tekeningrevisie controleren vóór productie",
  description: "Test een vaste revisiecontrole met vijf fictieve werkbonnen en gebruik AI alleen voor scan- of tekstextractie onder menselijke vrijgave.",
  date: "2026-11-18",
  displayDate: "18 november 2026",
  kind: "practical-ai-guide",
  visual: workOrderRevisionVisual,
  sources: [articleSources.nistProductDataIdentifiers],
  sections: [
    {
      heading: "Begin met de vrijgavevraag, niet met AI",
      paragraphs: [
        "Een werkbon kan een bekend revisieteken tonen en toch naar het verkeerde tekeningnummer verwijzen. Andersom kan het juiste tekeningnummer aanwezig zijn terwijl de revisie ontbreekt, verouderd is of nog niet voor productie is vrijgegeven. De eerste vraag is daarom niet welk AI-model u nodig hebt, maar welke combinatie van bronvelden moet kloppen voordat werkvoorbereiding de opdracht mag doorzetten.",
        "Baken die beslissing af. In deze proef vergelijkt u per werkbon minimaal het tekeningnummer, de revisie en de vrijgavestatus met de actuele, beheerde productdefinitie. Leg ook vast welk systeem of document voor ieder veld de gezaghebbende bron is. Een bestandsnaam, e-mailbijlage of handgeschreven notitie is niet automatisch de vrijgegeven bron.",
        "De uitkomst van de controle is een intern signaal: overeenkomst, afwijking, ontbrekende informatie of onleesbare invoer. Werkvoorbereiding beoordeelt het signaal en beslist of de bon doorgaat, wordt gecorrigeerd of teruggaat naar de documenteigenaar. De proef wijzigt geen werkbon, tekening, inspectieplan of productiestatus automatisch.",
      ],
    },
    {
      heading: "Maak eerst een vaste vergelijking",
      paragraphs: [
        "Als werkbon en vrijgegeven tekening al gestructureerde velden bevatten, is een vaste regel meestal de beste eerste stap. Normaliseer alleen afgesproken schrijfwijzen, bijvoorbeeld spaties of hoofdletters, en vergelijk daarna de volledige waarden. Controleer tekeningnummer en revisie als afzonderlijke velden; revisie C op tekening 4711 is niet gelijk aan revisie C op tekening 4712.",
        "Voeg de vrijgavestatus toe aan dezelfde controle. Een gelijk nummer en gelijke revisie betekenen nog niet dat het document voor deze productiestap is vrijgegeven. De status moet uit de aangewezen bron komen en de regel moet zichtbaar maken wanneer die bron niet bereikbaar of niet eenduidig is. Onbekend is een geldige uitkomst, geen reden om stilzwijgend een oudere waarde over te nemen.",
      ],
      table: {
        caption: "Minimale vaste controle vóór een werkbon doorgaat",
        headers: ["Bronveld", "Vergelijking", "Stopreden"],
        rows: [
          ["Tekeningnummer", "Volledige waarde tegen de beheerde bron", "Ontbreekt, wijkt af of verwijst naar een ander onderdeel"],
          ["Revisie", "Exacte revisie bij hetzelfde tekeningnummer", "Ontbreekt, is ouder of hoort bij een andere tekening"],
          ["Vrijgavestatus", "Actuele status uit het aangewezen systeem", "Niet vrijgegeven, ingetrokken of onbekend"],
          ["Bronidentiteit", "Bestand of record is herleidbaar naar de bron", "Losse kopie zonder controleerbare herkomst"],
        ],
      },
    },
    {
      heading: "Gebruik AI alleen waar uitlezen echt nodig is",
      paragraphs: [
        "AI voegt weinig toe wanneer drie betrouwbare databasevelden rechtstreeks kunnen worden vergeleken. De mogelijke rol begint bij ongestructureerde invoer: een gescande werkbon, een opmerking in vrije tekst of een oud document waarvan de velden niet als data beschikbaar zijn. OCR of een taalmodel kan dan een voorstel doen voor tekeningnummer, revisie en status, maar de vaste vergelijkingsregel blijft daarna hetzelfde.",
        "Bewaar bij elk voorgesteld veld de bronlocatie en een onzekerheidsaanduiding. Laat de interface de oorspronkelijke uitsnede naast de uitgelezen waarde zien. Een ontbrekende of onduidelijke waarde mag niet worden aangevuld met wat waarschijnlijk lijkt. Wanneer twee tekens op elkaar lijken, een stempel over tekst valt of meerdere revisies in één document staan, gaat het document naar handmatige beoordeling.",
        "Test extractie en beslissing afzonderlijk. Eerst meet u of de juiste bronvelden zijn uitgelezen. Pas daarna controleert u of de vaste regel de juiste afwijking signaleert. Zo voorkomt u dat een toevallig juiste einduitkomst een fout in het uitlezen verbergt.",
      ],
      bullets: [
        "Geen AI voor velden die al betrouwbaar en gestructureerd beschikbaar zijn",
        "Geen automatisch herstel van ontbrekende nummers, revisies of statussen",
        "Geen productievrijgave op basis van modelschatting of waarschijnlijkheid",
        "Geen koppeling die bronbestanden wijzigt tijdens de eerste proef",
      ],
    },
    {
      heading: "Test vijf fictieve werkbonnen",
      paragraphs: [
        "Onderstaand proefblad is volledig fictief. Het beschrijft geen klant, uitgevoerde opdracht of gemeten resultaat. Gebruik vijf documenten met één vooraf bekende afwijking per document. Houd product, route en beoordelaar gelijk, zodat u kunt zien welk onderdeel van de controle werkt en waar correctiewerk ontstaat.",
        "Laat de werkvoorbereider vóór de test de verwachte uitkomst vastleggen zonder de systeemuitvoer te zien. Voer daarna dezelfde documenten door de controle. Bij een scan beoordeelt u eerst de extractie en vervolgens de regel. De werkvoorbereider vergelijkt beide stappen met de bron en noteert welke vervolgactie werkelijk nodig is.",
      ],
      table: {
        caption: "Fictief proefblad met vijf werkbonnen",
        headers: ["Document", "Fictieve invoer", "Verwacht signaal", "Beslissing werkvoorbereiding"],
        rows: [
          ["WB-01", "Tekening 4711, revisie C, vrijgegeven", "Overeenkomst", "Bron controleren en volgens normale procedure doorzetten"],
          ["WB-02", "Tekening 4711, revisie B; bron staat op C", "Afwijkende revisie", "Stoppen en juiste revisie laten bevestigen"],
          ["WB-03", "Tekening 4711, revisie ontbreekt", "Ontbrekende revisie", "Niet doorzetten totdat de bronwaarde is aangevuld"],
          ["WB-04", "Revisie C, maar tekening 4712 in plaats van 4711", "Verkeerd tekeningnummer", "Onderdeel en opdracht opnieuw koppelen"],
          ["WB-05", "Scan met onleesbaar nummer en revisiestempel", "Onzeker of onleesbaar", "Handmatig controleren of een leesbare bron opvragen"],
        ],
      },
    },
    {
      heading: "Meet verschillen, valse meldingen en correctiewerk",
      paragraphs: [
        "Een proef met vijf documenten bewijst geen algemene nauwkeurigheid. Zij laat wel zien of de keten de bedoelde afwijkingen kan behandelen en welke fouten u vóór een grotere test moet oplossen. Tel per bronveld hoeveel waarden correct zijn uitgelezen, hoeveel echte verschillen zijn gemist en hoeveel overeenkomsten onterecht als afwijking zijn gemarkeerd.",
        "Meet ook het werk rond de uitkomst. Noteer hoeveel minuten de werkvoorbereider nodig heeft om bron, signaal en vervolgactie te controleren. Leg vast of het systeem de juiste documentuitsnede toont, of de stopreden begrijpelijk is en hoeveel correcties nodig zijn voordat een bon beoordeeld kan worden. Een extra melding zonder bruikbare bronverwijzing kan meer werk veroorzaken dan zij voorkomt.",
      ],
      table: {
        caption: "Meetlat voor de eerste revisiecontrole",
        headers: ["Maatstaf", "Wat u telt", "Waarom dit telt"],
        rows: [
          ["Gemiste verschillen", "Echte afwijkingen zonder signaal", "Een fout kan ongezien naar de volgende stap gaan"],
          ["Onterechte meldingen", "Correcte documenten die toch worden gestopt", "Te veel ruis ondermijnt de controle"],
          ["Extractiefouten", "Verkeerd of niet uitgelezen bronveld", "Maakt zichtbaar of scan of vrije tekst het probleem is"],
          ["Correctiewerk", "Handelingen en tijd voor controle en herstel", "Toont of de werkwijze praktisch bruikbaar is"],
          ["Onverklaarde uitkomsten", "Signalen zonder duidelijke bron of regel", "Zijn niet geschikt voor productiebeslissingen"],
        ],
      },
    },
    {
      heading: "Laat productie en inspectie naar dezelfde wijziging verwijzen",
      paragraphs: [
        { text: "NIST beschrijft in AMS 300-12 een use case voor de vrijgave van ontwerp naar productie. Een herziene productdefinitie houdt bestaande identificaties waar passend vast, terwijl gewijzigde onderdelen via het kwaliteitswijzigingsproces worden beheerst. Productie- en inspectieplannen worden vervolgens aangepast aan de gewijzigde technische eisen, met behoud van herleidbaarheid. Dat ondersteunt het belang van een samenhangend wijzigingsspoor, maar bewijst niet dat de eenvoudige proef in dit artikel geschikt is voor iedere fabriek of elk documentbeheersysteem.", sourceIds: ["nist-product-data-identifiers-2024"] },
        "Neem daarom niet alleen de werkbon in beeld. Controleer of een relevante wijziging ook doorwerkt naar het inspectieplan, de meetinstructie en andere documenten die dezelfde productdefinitie gebruiken. Dit hoeft niet in de eerste automatiseringsstap te worden gebouwd. Maak wel zichtbaar welke vervolgdocumenten de werkvoorbereider bij een afwijking moet laten beoordelen.",
        "De gezaghebbende bron, vrijgavestatus en verantwoordelijkheden verschillen per organisatie, klant en kwaliteitssysteem. Dit artikel geeft geen technisch vrijgaveadvies en vervangt geen toepasselijke contract-, norm- of kwaliteitsafspraken. Leg de eigen bronhiërarchie en bevoegdheden vast voordat u de proef met operationele documenten uitvoert.",
      ],
    },
    {
      heading: "Beslis vooraf wanneer de proef stopt of doorgaat",
      paragraphs: [
        "Bepaal vóór de uitvoering wat een bruikbare uitkomst is. Bij slechts vijf documenten is een foutpercentage geen betrouwbare prestatieclaim. Gebruik de proef als poortcontrole: worden alle vijf bedoelde situaties herkend, blijft de bron zichtbaar en kan de werkvoorbereider iedere uitkomst uitleggen en afhandelen? Eén gemist verschil of één verzonnen waarde is voldoende reden om niet te koppelen aan een productiestap.",
        "Een geslaagde kleine proef rechtvaardigt alleen een grotere, afgeschermde test met representatieve historische documenten. Voeg dan variatie toe in sjablonen, scancondities, leveranciers en revisienotaties. Houd de vaste regel als nulmeting en meet opnieuw de gemiste verschillen, onterechte meldingen en het correctiewerk. Productie blijft buiten de automatische keten totdat een bevoegde eigenaar afzonderlijk over een volgende fase beslist.",
      ],
      table: {
        caption: "Besluit na de proef met vijf documenten",
        headers: ["Uitkomst", "Passende vervolgstap"],
        rows: [
          ["Vaste velden zijn betrouwbaar beschikbaar", "Gebruik de eenvoudige regel en voeg geen AI toe"],
          ["Scanextractie werkt, maar vraagt veel correcties", "Verbeter documentkwaliteit of invoer voordat u opschaalt"],
          ["Een verschil wordt gemist of een waarde wordt verzonnen", "Stop; herzie extractie, regels en menselijke controle"],
          ["Alle situaties zijn herleidbaar afgehandeld", "Overweeg een grotere historische test zonder productiekoppeling"],
        ],
      },
    },
    {
      heading: "Maak de eerste werkdag concreet",
      paragraphs: [
        "Laat werkvoorbereiding, documentbeheer en kwaliteit samen één bestaande productroute kiezen. Schrijf op welke bron voor tekeningnummer, revisie en vrijgavestatus leidend is. Maak daarna de vijf fictieve documenten, leg de verwachte uitkomst vast en bouw eerst de vaste vergelijking. Voeg pas een extractiestap toe voor het document dat werkelijk ongestructureerde invoer bevat.",
        "Deze aanpak past bij technische mkb-bedrijven in Twente, de Achterhoek en elders in Nederland die een kleine AI-proef willen toetsen zonder meteen productieprocessen te automatiseren. De regio is een praktische focus, geen grens aan de dienstverlening. De beslisregel blijft overal gelijk: geen betrouwbare bronwaarde, geen automatische doorgang; de bevoegde medewerker beslist.",
      ],
    },
  ],
};
