import type { ArticleVisual } from "@/data/article-visuals";
import { articleSources } from "@/data/article-sources";
import type { Insight } from "@/data/insights";

const supplyEvidenceVisual: ArticleVisual = {
  width: 1200,
  height: 760,
  mobileWidth: 760,
  mobileHeight: 1100,
  src: "/article-visuals/composiet-inkoopbewijs-nl.svg",
  mobileSrc: "/article-visuals/composiet-inkoopbewijs-nl-mobile.svg",
  alt: "Drie controles vóór een inkoopbesluit: leg de exacte productkwaliteit vast, verifieer de herkomst en leverroute, en laat kwaliteit het alternatief beoordelen.",
  title: "Drie bewijsstappen vóór een materiaalwissel",
  caption: "Vergelijk per productkwaliteit wat u kunt staven over de specificatie, de leverroute en de technische geschiktheid van een alternatief.",
  explanationLabel: "De drie controles uitgelegd",
  details: [
    { label: "Product vastleggen", text: "Koppel uw inkoopartikel aan de fabrikantcode, specificatie en laatste zending." },
    { label: "Leverroute verifiëren", text: "Vraag naar fabrikant, productielocatie en opgegeven oorsprong. Zet onbevestigde schakels apart." },
    { label: "Alternatief toetsen", text: "Vergelijk dezelfde technische eisen en laat kwaliteit bepalen welk bewijs nodig is vóór vrijgave." },
  ],
  afterSectionIndex: 1,
};

export const compositeSupplyInsightNl: Insight = {
  slug: "herkomst-composietgrondstoffen-leveranciersrisico",
  title: "Herkomst van composietgrondstoffen controleren vóór u van leverancier wisselt",
  description: "Breng voor één hars of glasvezelversterking de herkomst, leverroute en technische geschiktheid van een alternatief in kaart met een fictief inkoopblad.",
  date: "2026-11-25",
  displayDate: "25 november 2026",
  visual: supplyEvidenceVisual,
  sources: [articleSources.euCompositeSafeguardAnnouncement, articleSources.euCompositeSafeguardNotice],
  sections: [
    {
      heading: "Wat verandert er voor uw inkoopbesluit?",
      paragraphs: [
        "U koopt al jaren dezelfde hars bij een Nederlandse distributeur. Dan verschijnt een bericht over een Europees onderzoek naar de invoer van composietgrondstoffen. Kunt u afwachten, moet u aanvullende informatie opvragen of is het verstandig alvast een tweede product te laten beoordelen? Om die keuze te maken, moet u het marktbericht kunnen koppelen aan uw eigen inkoopartikel en de manier waarop dat bij u terechtkomt.",
        {
          text: "De Europese Commissie startte op 23 november 2026 een onderzoek naar mogelijke vrijwaringsmaatregelen voor bepaalde ingevoerde grondstoffen voor composieten. Het bekendgemaakte bereik omvat onder meer glasvezelversterkingen, bepaalde epoxy-, onverzadigde polyester- en vinylesterharsen en enkele chemische inputs. De bekendmaking in het Publicatieblad specificeert de onderzochte producten en vermeldt goederencodes. De start van dit onderzoek legt op zichzelf geen nieuwe heffing op en geeft geen uitsluitsel over uw prijs of levertijd.",
          sourceIds: ["eu-composites-safeguard-announcement-2026", "eu-composites-safeguard-notice-2026"],
        },
        "Laat bij twijfel over toepasselijkheid de productomschrijving en indeling controleren door de verantwoordelijke voor douanezaken. Een brede productnaam in een catalogus is daarvoor onvoldoende. Voor inkoop is de directe vraag welk artikelnummer geraakt kán worden en welke ontbrekende documentatie u nu kunt opvragen.",
      ],
    },
    {
      heading: "Volg één materiaal van specificatie tot ontvangen partij",
      paragraphs: [
        "Begin bij een materiaal waarvan uw productie afhankelijk is, bijvoorbeeld een hars waarvoor u nog geen alternatief hebt vrijgegeven. Leg het eigen artikelnummer naast de exacte fabrikantcode en de versie van de technische specificatie. Voeg een recent leverdocument toe, zodat u de dossiergegevens kunt koppelen aan wat u werkelijk ontvangt.",
        "Houd de verkopende partij, fabrikant, productielocatie en opgegeven oorsprong als aparte velden bij. Een factuur of verzendadres geeft u een aanknopingspunt voor de leverroute. Vraag aanvullend bewijs voor de herkomst van het concrete product of de partij. Dit onderscheid helpt ook bij een tweede offerte. Twee distributeurs kunnen hetzelfde product verkopen en bij een verstoring op dezelfde productielocatie zijn aangewezen.",
      ],
    },
    {
      heading: "Fictief inkoopblad voor één vinylesterhars",
      paragraphs: [
        "Dit werkvoorbeeld is fictief. Een producent van industriële afdekkappen koopt vinylesterhars bij distributeur A. Distributeur B biedt een hars onder eigen handelsnaam aan en noemt die vergelijkbaar. De inkoper wil weten of B een tweede leverroute kan bieden en of het de moeite waard is om een technische proef in te plannen.",
      ],
      table: {
        caption: "Vijf vragen voor het dossier van dit inkoopartikel",
        headers: ["Vraag", "Wat ligt er nu?", "Welke controle volgt?"],
        rows: [
          ["Welk product?", "Van A is de fabrikantcode bekend. B noemt een handelsnaam.", "Vraag B om de exacte kwaliteit en de actuele productspecificatie."],
          ["Welke oorsprong?", "A vermeldt een verzendadres op het leverdocument.", "Vraag naar opgegeven oorsprong en onderbouwing voor een recente partij."],
          ["Wie levert feitelijk?", "A en B zijn verschillende verkopers.", "Breng fabrikant, productielocatie en route voor beide offertes in kaart."],
          ["Welk alternatief is zichtbaar?", "B geeft een indicatieve offerte.", "Laat B bevestigen welke kwaliteit, hoeveelheid en levertermijn de offerte betreft."],
          ["Welk bewijs ontbreekt voor vrijgave?", "B heeft een algemene datasheet aangeleverd.", "Laat kwaliteit per eis vaststellen welke gegevens of proeven nodig zijn voor het eigen proces."],
        ],
      },
    },
    {
      heading: "Beslis apart over leverroute en technische vrijgave",
      paragraphs: [
        "Een andere leverroute heeft pas waarde als u weet welk knelpunt zij kan opvangen. Een tweede distributeur kan helpen bij een verkoop- of voorraadprobleem bij de eerste. Als beide op dezelfde fabriek zijn aangewezen, blijft uitval van die fabriek een gedeeld risico. Schrijf daarom per alternatief op tegen welke verstoring het een uitwijkmogelijkheid zou bieden en welk bewijs die inschatting draagt.",
        "Laat kwaliteit en productie vervolgens het aangeboden product vergelijken met uw eigen criteria. Denk in dit fictieve voorbeeld aan verwerkbaarheid in het bestaande proces en de eisen aan het afgewerkte onderdeel. Een datasheet kan een eerste vergelijking ondersteunen. De bevoegde medewerker bepaalt of een proefbatch en eventuele klantgoedkeuring nodig zijn.",
        "In dit voorbeeld begint de inkoper met twee gerichte uitvragen: laat A de opgegeven oorsprong voor een recente partij onderbouwen en laat B de fabrikantcode, productielocatie en technische documentatie bevestigen. Noteer wie elk antwoord beoordeelt en op welke datum u beslist of het alternatief naar een proef gaat. Zolang bewijs ontbreekt, houdt u de tweede route in het dossier als kandidaat.",
      ],
    },
  ],
};
