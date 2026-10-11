import type { Insight } from "@/data/insights";
import { industrialInsights } from "@/data/industrial-insights";
import { articleSources } from "@/data/article-sources";
import { articleVisuals } from "@/data/article-visuals";

const originalInsightsNl: readonly Insight[] = [
  {
    slug: "wat-is-industriele-concurrentie-intelligentie",
    title: "Wat is industriële concurrentie-informatie?",
    description: "Een praktische gids voor onderbouwd onderzoek naar concurrenten, bedoeld voor industriële beslissers.",
    date: "2026-09-22",
    displayDate: "22 september 2026",
    modifiedDate: "2026-10-09",
    displayModifiedDate: "9 oktober 2026",
    visual: articleVisuals.nl.industrialIntelligence,
    sources: [articleSources.scipEthics, articleSources.espacenet, articleSources.ted, articleSources.phiaStandards],
    sections: [
      {
        heading: "Een hulpmiddel voor beslissingen, geen verzamelwoede",
        paragraphs: [
          "Industriële concurrentie-informatie ontstaat door rechtmatig toegankelijke gegevens over bedrijven, technologieën, capaciteiten en markten gestructureerd te verzamelen en te duiden. Het doel is een betere beslissing: een markt betreden, op een concurrent reageren, een partner beoordelen, een productplanning aanpassen of een strategische aanname toetsen.",
          "Dat onderscheid is belangrijk. Een grote map documenten is nog geen bruikbaar inzicht. Goede analyse koppelt bewijs aan een afgebakende vraag, legt uit hoe betrouwbaar de bronnen zijn en laat zien welke conclusies worden ondersteund. Ook onzekerheid blijft zichtbaar. Juist in technische markten, waar productclaims vaak onvolledig zijn en leveranciers verschillende termen gebruiken, telt die discipline meer dan de hoeveelheid materiaal.",
        ],
      },
      {
        heading: "Welke bronnen kunnen iets zeggen?",
        paragraphs: [
          { text: "Bruikbare signalen staan vaak verspreid in publicaties voor uiteenlopende doelgroepen. Jaarverslagen kunnen strategie toelichten; productdocumentatie beschrijft beoogde prestaties. Octrooipublicaties tonen geclaimde uitvindingen en kunnen een technische richting aangeven. Vacatures wijzen op benodigde vaardigheden. Aanbestedingsberichten, vergunningen en certificeringen voegen context toe over timing, locatie of naleving. Openbare foto’s en video’s kunnen helpen toetsen of een geclaimde capaciteit fysiek aannemelijk is.", sourceIds: ["epo-espacenet", "eu-ted"] },
          { text: "Geen enkele bron is automatisch doorslaggevend. Materiaal van bedrijven en leveranciers is primair bewijs van wat de uitgever beweert, geen onafhankelijke bevestiging dat de claim klopt. Beelden kunnen context missen en openbare databanken kunnen onvolledig zijn. De analist beoordeelt herkomst, actualiteit, samenhang en publicatiedoel en toetst signalen aan onafhankelijk materiaal.", sourceIds: ["phia-standards"] },
        ],
        bullets: [
          "Primaire publicaties van bedrijven, toezichthouders en technische organisaties",
          "Octrooien, certificeringen, aanbestedingen en planningsdocumenten",
          "Vacatures, leveranciersverwijzingen en beursmateriaal",
          "Openbaar gepubliceerd beeldmateriaal van locaties, apparatuur en producten",
        ],
      },
      {
        heading: "Het verschil met marktonderzoek",
        paragraphs: [
          "Marktonderzoek begint vaak bij een productcategorie: hoe groot is de markt, wie koopt en hoe ontwikkelt de vraag zich? Industriële concurrentieanalyse begint doorgaans bij een smallere beslissing en een specifieke onzekerheid. Kan deze concurrent op de geclaimde schaal produceren? Welke partners lijken bij een programma betrokken? Is een nieuw product echt beschikbaar, of vooral een ontwikkelsignaal?",
          "De vakgebieden overlappen, maar de concurrentievraag is meestal sterker gericht op bewijs en uitvoering. Daarvoor kan het nodig zijn technische tekeningen te lezen, veranderingen op een locatie door de tijd te vergelijken, bedrijfsrelaties te volgen of tegenstrijdige claims te wegen. Het resultaat moet bruikbaar zijn voor strategie, engineering, inkoop en commerciële teams, niet alleen voor onderzoekers.",
        ],
      },
      {
        heading: "Een betrouwbaar rapport scheidt kennis van oordeel",
        paragraphs: [
          { text: "Een professioneel rapport onderscheidt directe waarneming van interpretatie. Een planningsdocument kan bevestigen dat een uitbreiding is vergund. Openbare beelden kunnen aangeven dat er is gebouwd. Vacatures kunnen de beoordeling ondersteunen dat een bedrijf zich op een grotere doorvoer voorbereidt. Geen van deze bronnen bewijst op zichzelf de huidige productiecapaciteit.", sourceIds: ["phia-standards"] },
          { text: "Duidelijke zekerheidsniveaus helpen u dat onderscheid te begrijpen. Een zekerheidsaanduiding hoort de kwaliteit en volledigheid van de informatiebasis en de zorgvuldigheid van de analyse te weerspiegelen; zij vervangt de uitleg van onzekerheid niet. Matige of indicatieve signalen kunnen nuttig zijn, maar zijn vragen om te toetsen, geen vaststaande feiten om te herhalen.", sourceIds: ["phia-standards"] },
        ],
      },
      {
        heading: "Wanneer is gericht onderzoek zinvol?",
        paragraphs: [
          { text: "Onderzoek heeft de meeste waarde wanneer de beslissing belangrijk is, openbare informatie versnipperd is en een onjuiste aanname gevolgen kan hebben. Een goede opdracht omschrijft de beslissing, het doel, de termijn en de bewijsstandaard. Ook de juridische en ethische grenzen horen erbij: gebruik alleen openbare bronnen, doe u niet voor als een ander, zoek geen ongeoorloofde toegang en gebruik geen onrechtmatig verkregen materiaal.", sourceIds: ["scip-ethics"] },
          "Een scherp afgebakende vraag levert meestal meer op dan het verzoek om alles over een bedrijf te vinden. Begin bij de onzekerheid die uw beslissing kan veranderen. Het onderzoek kan vervolgens aangeven wat bekend, aannemelijk of onbekend is en welke vervolgvraag de onzekerheid het meest verkleint.",
        ],
      },
    ],
  },
  {
    slug: "wat-publieke-beelden-vertellen-over-industriele-capaciteiten",
    title: "Wat openbare beelden kunnen vertellen over industriële capaciteiten",
    description: "Gebruik openbare foto’s en video’s als technisch bewijs zonder meer te concluderen dan zij toelaten.",
    date: "2026-09-22",
    displayDate: "22 september 2026",
    modifiedDate: "2026-10-09",
    displayModifiedDate: "9 oktober 2026",
    visual: articleVisuals.nl.publicImages,
    sources: [articleSources.berkeleyProtocol, articleSources.iptcMetadata, articleSources.npsaCommunications],
    sections: [
      {
        heading: "Beelden zijn bewijs, maar zelden het hele antwoord",
        paragraphs: [
          { text: "Een openbare foto kan details vastleggen die in tekst ontbreken: de opstelling van een productielijn, de omvang van een schone ruimte, het soort transportapparatuur, de zichtbare ontwikkeling van een prototype of de ligging van gebouwen op een terrein. Video voegt volgorde en beweging toe en kan processtromen, personeelsinzet of de bediening van apparatuur tonen.", sourceIds: ["npsa-security-minded-communications"] },
          "Deze waarnemingen kunnen een analyse van industriële capaciteiten ondersteunen, maar beelden spreken niet voor zichzelf. Datum, locatie, bewerking, camerahoek en publicatiedoel bepalen mede wat u eruit kunt afleiden. Een foto kan actueel of jaren oud zijn. Een machine kan aanwezig zijn zonder te werken. Een demonstratiemodel hoeft geen serieproductie te vertegenwoordigen.",
        ],
      },
      {
        heading: "Begin bij herkomst en context",
        paragraphs: [
          { text: "Stel vóór de interpretatie vast waar het beeld vandaan komt, wanneer het is gepubliceerd, of de genoemde locatie geloofwaardig is en of er oudere versies bestaan. Bedrijfswebsites, beursberichten, leverancierscases, wervingsmateriaal en openbare planningsdocumenten kunnen hetzelfde beeld met verschillende bijschriften tonen. Die verschillen kunnen betekenis hebben.", sourceIds: ["ohchr-berkeley-protocol"] },
          { text: "Ook de omringende pagina telt mee. Een leverancier kan een geïnstalleerd model en een leverdatum noemen; dat blijft een leveranciersclaim totdat ander bewijs haar bevestigt. Een bedrijfsbijschrift kan de lijn of het klantprogramma duiden. Een planningsdocument kan het gebouw bevestigen. Bewaar de oorspronkelijke URL, vastlegdatum en relevante context, zodat het bronspoor controleerbaar blijft en niet op een losgeraakte schermafbeelding berust.", sourceIds: ["ohchr-berkeley-protocol"] },
        ],
      },
      {
        heading: "Zichtbare kenmerken zijn nog geen bewezen capaciteit",
        paragraphs: [
          { text: "Een goede analyse beschrijft eerst wat rechtstreeks zichtbaar is en pas daarna wat dit mogelijk betekent. Een beeld kan apparatuur, herhaalde werkstations, gemarkeerde productiezones, ventilatievoorzieningen, opslag of beschermingsmaatregelen tonen. Dat zijn waarnemingen. Voor de conclusie dat een locatie een bepaald proces kan uitvoeren, is aanvullend technisch bewijs en context nodig.", sourceIds: ["ohchr-berkeley-protocol"] },
          { text: "Verborgen specificaties blijven verborgen. Pixels bewijzen geen materiaalsamenstelling. De buitenkant van een behuizing onthult geen interne toleranties. Een schone uitstraling bewijst geen gecertificeerde reinheidsklasse. Beeldmetadata kan, als die aanwezig is, context geven over datum, locatie of beheer, maar moet zelf worden geverifieerd en bewijst geen authenticiteit. Beelden kunnen mogelijkheden inperken of een claim tegenspreken, maar maken ontoegankelijke details niet kenbaar.", sourceIds: ["iptc-photo-metadata"] },
        ],
        bullets: [
          "Beschrijf zichtbare objecten, labels en ruimtelijke relaties",
          "Leg beelddatum, bron en vermoedelijk publicatiedoel vast",
          "Vergelijk apparatuur met handleidingen of leveranciersdocumentatie",
          "Benoem alternatieve verklaringen en resterende beperkingen",
        ],
      },
      {
        heading: "Vergelijkingen die echt iets toevoegen",
        paragraphs: [
          "Sterke visuele bevindingen ontstaan vaak door vergelijking. Beelden van verschillende momenten kunnen bouwvoortgang, een gewijzigde indeling of nieuwe apparatuur laten zien. Meerdere gezichtspunten helpen toetsen of een kenmerk echt is of door perspectief ontstaat. Leveranciersmateriaal kan apparatuur helpen identificeren; productinformatie en vacatures kunnen aangeven of ook de benodigde vaardigheden en processen aanwezig lijken.",
          "Houd conclusies in verhouding tot het bewijs. Machines die op elkaar lijken kunnen andere specificaties hebben. Een nieuw ingerichte ruimte kan nog in de inbedrijfstellingsfase zijn. Wat niet op een foto staat, hoeft niet op de locatie te ontbreken. Elke conclusie moet de werkelijke bewijskracht weerspiegelen.",
        ],
      },
      {
        heading: "Verantwoord rapporteren over beelden",
        paragraphs: [
          { text: "Een bruikbaar rapport koppelt elke belangrijke beeldwaarneming aan bron, beoordeling, zekerheid en beperking. Uitsneden met toelichting kunnen details voor lezers zichtbaar maken, zolang de toelichting het oorspronkelijke bewijs niet verhult. Als een beeld onvoldoende is, moet het rapport dat helder zeggen en aanwijzen welke volgende openbare bron de kwestie kan toetsen.", sourceIds: ["ohchr-berkeley-protocol"] },
          "Visuele analyse is waardevol als extra bewijsstroom, niet als manier om onzekerheid te omzeilen. In combinatie met technische documenten, openbare registers en commerciële context kan zij inconsistenties tonen, een capaciteitsbeoordeling versterken en u helpen preciezere vragen te stellen.",
        ],
      },
    ],
  },
  {
    slug: "onderscheid-tussen-bewijs-beoordeling-en-gevolgtrekking",
    title: "Bewijs, beoordeling en gevolgtrekking uit elkaar houden",
    description: "Een helder kader om conclusies uit openbare bronnen herleidbaar en evenwichtig te houden.",
    date: "2026-09-22",
    displayDate: "22 september 2026",
    modifiedDate: "2026-10-09",
    displayModifiedDate: "9 oktober 2026",
    visual: articleVisuals.nl.evidenceAssessmentInference,
    sources: [articleSources.odniStandards, articleSources.phiaStandards, articleSources.phiaUncertainty],
    sections: [
      {
        heading: "Waarom het onderscheid telt",
        paragraphs: [
          "Onderzoek in openbare bronnen bestaat uit fragmenten. Een bedrijf kondigt een investering aan, plaatst een vacature en verschijnt in een leverancierscase. Die signalen kunnen dezelfde richting aanwijzen, maar de conclusie vergt nog steeds een oordeel. Als een rapport dat oordeel als feit presenteert, kan de lezer het niet toetsen en kan een onbewezen claim in een belangrijke beslissing terechtkomen.",
          { text: "Door bewijs, beoordeling en gevolgtrekking te scheiden, wordt de redenering zichtbaar. Het rapport wordt daardoor niet zwakker: u ziet juist waarop de zekerheid berust en waar extra verificatie nuttig is. Dat is vooral belangrijk wanneer technisch bewijs onvolledig is of bronnen een commercieel belang hebben bij grote claims.", sourceIds: ["odni-icd-203", "phia-standards"] },
        ],
      },
      {
        heading: "Bewijs: wat de bron rechtstreeks ondersteunt",
        paragraphs: [
          "Bewijs is inspecteerbaar materiaal: een gedateerd jaarverslag, een octrooiaanvraag, een foto, een planningsdocument, een vacature of een productspecificatieblad. Een rapport beschrijft de relevante inhoud nauwkeurig en legt de herkomst vast. Een kort citaat kan nuttig zijn, maar een zorgvuldige samenvatting met bronverwijzing is vaak duidelijker.",
          { text: "De kwaliteit van bewijs verschilt. Een officieel register kan betrouwbaar zijn voor de datum van een aanvraag, maar niets zeggen over de huidige bedrijfsvoering. Een bedrijfs- of leveranciersbrochure is primair bewijs van wat de uitgever beweert, geen onafhankelijke bevestiging dat die claim klopt. Beschrijf nooit meer dan de bron werkelijk ondersteunt.", sourceIds: ["odni-icd-203"] },
        ],
      },
      {
        heading: "Beoordeling: een onderbouwd analytisch oordeel",
        paragraphs: [
          "Een beoordeling legt uit wat meerdere bewijselementen samen betekenen. Een vergunde uitbreiding, nieuwe productiefuncties en verwijzingen van leveranciers naar ingebruikname kunnen bijvoorbeeld een beoordeling met hoge zekerheid ondersteunen dat capaciteitsuitbreiding gaande is. De bronnen blijven apart zichtbaar; de beoordeling is de beredeneerde conclusie.",
          { text: "Een beoordeling vermeldt de mate van zekerheid en de belangrijkste onderbouwing. Zekerheid gaat over de deugdelijkheid en stabiliteit van de analytische basis en is iets anders dan de waarschijnlijkheid dat een oordeel waar is. Ook tegenbewijs hoort erbij. Als een bedrijf later een introductie uitstelt of vacatures onvervuld blijven, moet het rapport uitleggen hoe dat het oordeel beïnvloedt, in plaats van alleen gunstige bronnen te kiezen.", sourceIds: ["phia-uncertainty", "phia-standards"] },
        ],
        bullets: [
          "Formuleer precies welke conclusie wordt beoordeeld",
          "Verwijs naar het sterkste ondersteunende én tegenstrijdige bewijs",
          "Leg uit waarom bronnen betrouwbaar of beperkt zijn",
          "Stem de zekerheid af op de resterende onzekerheid",
        ],
      },
      {
        heading: "Gevolgtrekking: een aannemelijke stap voorbij het bewijs",
        paragraphs: [
          "Een gevolgtrekking is een redelijke mogelijkheid die uit bewijs voortvloeit, maar er niet rechtstreeks door wordt vastgesteld. Een reeks nieuwe functies kan op een programma wijzen. Een leveranciersrelatie kan een technische aanpak suggereren. Een verandering aan een locatie kan bij een proces passen. Zulke signalen helpen bij strategie en vervolgonderzoek, maar zijn geen vaststaande feiten.",
          { text: "De nuttigste gevolgtrekkingen laten alternatieven zien. Als een uitbreiding zowel meer volume als een nieuwe productlijn kan ondersteunen, moeten beide verklaringen zichtbaar blijven totdat een andere bron onderscheid maakt. Zo wordt een mogelijke verklaring niet ongemerkt tot zekerheid verheven.", sourceIds: ["odni-icd-203", "phia-standards"] },
        ],
      },
      {
        heading: "Ook het onbekende hoort bij het antwoord",
        paragraphs: [
          "Sommige vragen kunnen niet verantwoord met openbaar bewijs worden beantwoord. Productierendement, interne kosten, klantspecifieke afspraken en verborgen procesparameters kunnen onbekend blijven. Een betrouwbaar rapport benoemt die lacunes en vult ze niet op met algemene aannames.",
          "Onbekend betekent niet nutteloos. Het laat u zien waar risico overblijft, op welke claim u beter niet kunt vertrouwen en welk aanvullend openbaar bewijs het beeld kan verbeteren. Het doel is geen zekerheid tegen elke prijs, maar een beter afgewogen beslissing.",
        ],
      },
      {
        heading: "Begin bij een beslissing en een toetsbare claim",
        paragraphs: [
          "Leg vóór het zoeken vast welke beslissing het onderzoek moet ondersteunen. 'Een concurrent begrijpen' is te breed om te toetsen. 'Kunnen wij de aangekondigde fabriek volgend jaar meetellen als extra aanbod van het product dat wij inkopen?' maakt periode, product en zakelijke consequentie concreet. Ook de aannames worden zichtbaar: is de locatie voor dit product bedoeld, is het proces gekwalificeerd en zijn leveringen al begonnen? Een goede onderzoeksvraag begrenst het zoeken zonder het antwoord vooraf vast te leggen.",
          "Bepaal vervolgens wat direct bewijs zou zijn, welk gegeven de claim verzwakt en wat mogelijk ontoegankelijk blijft. Een vergunning kan de toestemming voor een bepaalde uitbreiding bevestigen. Een bedrijfsbericht kan bevestigen dat de directie zegt apparatuur te installeren. Geen van beide bewijst noodzakelijkerwijs gekwalificeerde output. Een latere productspecifieke mededeling, naast ander gedateerd materiaal, kan het oordeel veranderen. Vooraf vastgelegde criteria voorkomen dat u de norm ongemerkt verlegt zodra een aantrekkelijke bron verschijnt.",
        ],
      },
      {
        heading: "Leg bronnen vast zonder de context te verliezen",
        paragraphs: [
          { text: "Een conclusie moet terug te voeren zijn op materiaal dat een lezer kan controleren. Noteer bij elk belangrijk stuk de uitgever, oorspronkelijke locatie, publicatiedatum, datum van de beschreven gebeurtenis en de gebruikte uitspraak of zichtbare eigenschap. Die data kunnen uiteenlopen. Een bericht uit september over een opening in het volgende jaar is geen bewijs van productie in september. Bewaar ook de reikwijdte: een capaciteitsclaim voor een hele locatie beantwoordt niet vanzelf de vraag naar één component of productlijn.", sourceIds: ["phia-standards"] },
          "Let daarnaast op de onafhankelijkheid van bronnen. Meerdere nieuwsartikelen kunnen hetzelfde persbericht herhalen en zo de schijn van bevestiging wekken zonder nieuwe waarneming. Een leverancierscitaat, bedrijfsbericht en nieuwsbericht kunnen allemaal op dezelfde belanghebbende teruggaan. Een openbaar register kan een locatie of vergunning juist onafhankelijk bevestigen, maar niets zeggen over output. Een goed bronoverzicht maakt zulke relaties zichtbaar in plaats van elke URL als afzonderlijke stem voor de conclusie te tellen.",
        ],
      },
      {
        heading: "Toets de sterkste alternatieve verklaring",
        paragraphs: [
          { text: "Vraag bij een beoordeling wat dezelfde signalen nog meer kunnen betekenen. Het werven van ingenieurs kan passen bij een nieuw productieprogramma, maar ook bij vervanging van vertrokken medewerkers of versterking van een bestaande lijn. Een nieuw gebouw kan meer ruimte bieden terwijl productie alleen verhuist. Gepubliceerde beelden kunnen demonstratieapparatuur tonen in plaats van machines die op commerciële schaal draaien. Dat maakt de signalen niet waardeloos; het bepaalt hoe voorzichtig de conclusie moet zijn.", sourceIds: ["odni-icd-203", "phia-standards"] },
          "Rangschik de verklaringen naar de beschikbare onderbouwing en benoem welke nieuwe waarneming onderscheid zou maken. Een gedateerde melding van ingebruikname kan een stap na de bouw bevestigen; een productkwalificatie kan de vraag verder vernauwen; een leveringsclaim kan commerciële activiteit aanwijzen, maar vraagt nog steeds om afbakening. Als geen openbare bron tussen redelijke verklaringen kan kiezen, blijft het resultaat een gevolgtrekking of een onbekende. Ook dat kan een beslisser tonen welke aanname het meeste risico draagt.",
        ],
      },
      {
        heading: "Maak van het oordeel een bruikbaar beslisdocument",
        paragraphs: [
          "Een directielid heeft een kort antwoord nodig dat aan de oorspronkelijke beslissing is gekoppeld, geen chronologisch verslag van elke zoekactie. Vermeld de bevinding, de mate van zekerheid, het sterkste bewijs, de belangrijke tegenspraak en het gevolg als de beoordeling onjuist blijkt. Voeg daarna het bronspoor toe zodat een technische collega de redenering kan bevragen. Als het bewijs meerdere uitkomsten ondersteunt, beschrijf dan wanneer elke uitkomst relevant wordt in plaats van ze in één voorspelling samen te persen.",
          "Benoem tot slot waardoor herbeoordeling nodig wordt. Een gewijzigd bedrijfstijdpad, nieuw registergegeven, productspecifieke klantmededeling of verifieerbare productiemijlpaal kan de zekerheid veranderen. Het rapport hoeft geen doorlopende monitoring te beloven; het kan aangeven welke signalen bij een volgende beslissing moeten worden gecontroleerd. Zo krijgt onzekerheid een praktische rol: zij laat zien wat u als volgende moet verifiëren, wat u intussen niet mag aannemen en hoe zwaar het huidige bewijs kan meewegen.",
        ],
      },
    ],
  },
  {
    slug: "hoe-industriele-bedrijven-concurrentie-informatie-prijsgeven",
    title: "Hoe industriële bedrijven onbedoeld concurrentie-informatie prijsgeven",
    description: "Veelvoorkomende openbare informatiesporen en een proportionele manier om ze te beoordelen.",
    date: "2026-09-22",
    displayDate: "22 september 2026",
    modifiedDate: "2026-10-09",
    displayModifiedDate: "9 oktober 2026",
    visual: articleVisuals.nl.cumulativeDisclosure,
    sources: [articleSources.npsaCommunications, articleSources.ncscSharing, articleSources.ncscPublishing, articleSources.gdprArticle5],
    sections: [
      {
        heading: "Het totaalbeeld ontstaat stap voor stap",
        paragraphs: [
          "Industriële organisaties publiceren informatie met goede redenen: klanten winnen, specialisten werven, aan regels voldoen, leveranciers ondersteunen en investeerders informeren. Eén bericht zegt misschien weinig. Het concurrentiebeeld ontstaat wanneer kleine openbaarmakingen uit verschillende perioden en bronnen worden samengevoegd.",
          { text: "Een vacature kan apparatuur en processen noemen. Een leverancierscase kan een locatie en installatie noemen; dat blijft een leveranciersclaim totdat onafhankelijk bewijs haar bevestigt. Een beursvideo kan de opstelling rond een prototype tonen. Een planningsdocument kan het gebruik van een gebouw aangeven. Samen kunnen die bronnen een buitenstaander meer inzicht geven in koers, gereedheid of capaciteit dan de organisatie bedoelde.", sourceIds: ["npsa-security-minded-communications"] },
        ],
      },
      {
        heading: "Waar bruikbare signalen verschijnen",
        paragraphs: [
          { text: "De meest zichtbare bronnen zijn niet altijd de meest onthullende. Bedrijfspresentaties kunnen een formele controle doorlopen, terwijl lokale vacaturepagina’s, conferentieslides van medewerkers, aanbestedingen, certificeringsregisters en portfolio’s van aannemers een ander publicatieproces kunnen hebben. Ook oudere bestanden of links kunnen zichtbaar blijven nadat de hoofdwebsite is gewijzigd.", sourceIds: ["ncsc-sharing-online", "ncsc-social-publishing"] },
          { text: "Openbare berichten op sociale media verdienen extra aandacht: ze verschijnen vaak en bevatten veel beeldmateriaal. Een onschuldige fabrieksfoto kan passen, labels, whiteboards, aantallen werkplekken of apparatuurmodellen tonen. Het risico zit niet alleen in die foto, maar in de combinatie met openbare informatie over werving, klanten en investeringen.", sourceIds: ["npsa-security-minded-communications"] },
        ],
        bullets: [
          "Wervingsmateriaal met namen van gereedschap, processen of programmafasen",
          "Portfolio’s van leveranciers en aannemers met klant- of locatiegegevens",
          "Foto’s waarop labels, schermen, tekeningen of toegangspassen te zien zijn",
          "Gearchiveerde documenten met verouderde maar nog gevoelige context",
          "Overlappende aankondigingen die samen meer onthullen",
        ],
      },
      {
        heading: "Beoordeling moet rechtmatig en proportioneel blijven",
        paragraphs: [
          "Een analyse van openbaar gemaakte informatie kijkt naar materiaal dat een gewone gebruiker rechtmatig kan bereiken. Zij omzeilt geen beveiliging, doet zich niet voor als medewerker, gebruikt geen gelekte gegevens en benadert medewerkers niet onder valse voorwendselen. Het doel is zicht op de openbare voetafdruk, niet het zonder toestemming testen van technische verdediging.",
          { text: "Wanneer een beoordeling persoonsgegevens verwerkt, moeten die gegevens toereikend, ter zake dienend en beperkt zijn tot wat voor het omschreven doel noodzakelijk is. Namen en individuele profielen zijn vaak niet nodig, tenzij zij rechtstreeks relevant zijn voor de toegestane zakelijke vraag. Bevindingen richten zich op patronen binnen de organisatie en op de praktische betekenis van de informatie voor concurrenten.", sourceIds: ["gdpr-article-5"] },
        ],
      },
      {
        heading: "Geef combinaties voorrang boven losse curiositeiten",
        paragraphs: [
          "Een bruikbare beoordeling rangschikt bevindingen op vindbaarheid, geloofwaardigheid, de mate waarin andere bronnen ze versterken en de zakelijke beslissing die zij kunnen beïnvloeden. Een technische term in één vacature kan weinig risico opleveren. Dezelfde term in een locatieaankondiging, leveranciersverwijzing en conferentiepresentatie kan een strategisch programma zichtbaar maken.",
          { text: "Ook maatregelen moeten proportioneel zijn. Alle technische details weghalen kan werving en verkoop schaden. Betere waarborgen zijn duidelijk eigenaarschap voor publicaties, voorafgaande controle bij gevoelige programma’s, periodiek zoeken naar verouderde documenten en richtlijnen voor medewerkers die beelden van hun werkplek delen.", sourceIds: ["ncsc-social-publishing", "ncsc-sharing-online", "npsa-security-minded-communications"] },
        ],
      },
      {
        heading: "Maak van de beoordeling een terugkerend proces",
        paragraphs: [
          "Begin met wat beschermd moet worden: introductiedata, productiebeperkingen, leveranciersrelaties, proceskeuzes of klantprogramma’s. Breng de openbare kanalen in kaart waar die informatie kan opduiken. Beoordeel actueel en gearchiveerd materiaal en onderzoek hoe afzonderlijke uitingen samenhangen. Leg bron, blootstelling, vermoedelijk publiek en aanbevolen maatregel vast.",
          "Het doel is geen geheimhouding om de geheimhouding. Het is bewuste openbaarmaking. Industriële bedrijven kunnen geloofwaardig communiceren en tegelijk onnodige concurrentiesignalen beperken, als zij weten welk totaalbeeld van buiten zichtbaar is.",
        ],
      },
    ],
  },
];

export const insightsNl: readonly Insight[] = [
  ...industrialInsights.filter((insight) => insight.locale === "nl"),
  ...originalInsightsNl,
];

export function getInsightNl(slug: string) {
  return insightsNl.find((insight) => insight.slug === slug);
}
