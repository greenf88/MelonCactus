import type { ArticleVisual } from "@/data/article-visuals";
import { articleSources } from "@/data/article-sources";
import type { Insight } from "@/data/insights";

const productionPlanningVisual: ArticleVisual = {
  width: 1200,
  height: 760,
  mobileWidth: 760,
  mobileHeight: 1100,
  src: "/article-visuals/ai-productieplanning-proef-nl.svg",
  mobileSrc: "/article-visuals/ai-productieplanning-proef-nl-mobile.svg",
  alt: "Besliskader voor een productieplanningproef waarin hetzelfde historische orderpakket via een vaste planningsregel en een AI-voorstel wordt vergeleken op late orders, wachttijd, correcties en menselijke vrijgave.",
  title: "Eén orderpakket, twee planningen, dezelfde meetlat",
  caption: "Een eerlijke proef gebruikt in beide varianten dezelfde historische orders en alleen informatie die op het oorspronkelijke beslismoment beschikbaar was. Een planner beoordeelt de uitkomst vóór iedere vervolgstap.",
  explanationLabel: "Uitleg van de productieplanningproef in tekst",
  details: [
    { label: "Gelijke invoer", text: "De vaste regel en het AI-voorstel krijgen hetzelfde orderpakket, dezelfde materiaalstand en hetzelfde beslismoment." },
    { label: "Gelijke meetlat", text: "Vergelijk late orders, wachttijd, handmatige correcties en onuitvoerbare voorstellen zonder vooraf een besparing te veronderstellen." },
    { label: "Menselijke grens", text: "De planner controleert uitzonderingen en beslist of een beperkte vervolgproef verantwoord is; niets wordt automatisch vrijgegeven." },
  ],
  afterSectionIndex: 2,
};

export const productionPlanningInsightNl: Insight = {
  slug: "ai-productieplanning-maakindustrie-orderfamilie",
  title: "AI voor productieplanning in de maakindustrie: test één orderfamilie",
  description: "Een praktische handleiding voor een afgebakende AI-proef met historische productieorders, een eerlijke nulmeting en menselijke vrijgave.",
  date: "2026-11-09",
  displayDate: "9 november 2026",
  kind: "practical-ai-guide",
  visual: productionPlanningVisual,
  sources: [articleSources.kortProductionPlanning],
  sections: [
    {
      heading: "Begin met één planningsbeslissing",
      paragraphs: [
        "Productieplanning omvat materiaal, machines, mensen, bewerkingstijden, omstellingen, prioriteiten en leverafspraken. Wie al die variabelen tegelijk in een eerste AI-proef stopt, kan achteraf moeilijk uitleggen waarom een voorstel beter of slechter uitviel. Begin daarom met één terugkerende beslissing: welke volgorde krijgt één herkenbare orderfamilie op één deel van het proces?",
        "Kies bijvoorbeeld orders die dezelfde snij- en kantbewerkingen doorlopen. Leg vast welke regel de planner nu gebruikt, zoals eerst de vroegste beloofde datum en daarna groeperen op materiaalsoort. Die bestaande regel is de nulmeting. Een proef is pas informatief wanneer het nieuwe voorstel tegen diezelfde uitgangssituatie wordt beoordeeld.",
        { text: "De KORT-publicatie van FIP-AM@UT beschrijft een project met vier plaatwerkbedrijven waarin buffer- en bewerkingstijd centraal stonden. Het project leverde een proof-of-conceptalgoritme en visualisatie op die verder moesten worden ontwikkeld en aangepast aan de afzonderlijke productieomgevingen. Dat is bruikbare onderzoekscontext, maar geen bewijs dat dezelfde aanpak bij ieder maakbedrijf werkt of een bepaalde besparing oplevert.", sourceIds: ["kort-intelligent-production-planning"] },
      ],
    },
    {
      heading: "Baken orderfamilie, moment en meetlat af",
      paragraphs: [
        "Een orderfamilie is klein genoeg wanneer de orders een vergelijkbare route, materiaalsoort of machinegroep hebben en de planner de uitzonderingen nog kan beoordelen. Gebruik liever vijftig representatieve historische orders dan duizenden uiteenlopende orders waarvan de registratie niet vergelijkbaar is. Noteer ook waarom deze groep zakelijk relevant is: veel wachttijd, regelmatig te late levering of veel handmatige herschikking.",
        "Kies vervolgens één historisch beslismoment. Beide planningen mogen alleen gegevens gebruiken die toen bekend waren. Een materiaalvertraging die pas twee dagen later werd gemeld, mag het AI-voorstel niet met terugwerkende kracht helpen. Zonder deze tijdsgrens ontstaat datalekken uit de toekomst en lijkt het voorstel kunstmatig goed.",
      ],
      table: {
        caption: "Minimale proefafbakening voor één orderfamilie",
        headers: ["Vastleggen", "Praktische keuze", "Waarom dit nodig is"],
        rows: [
          ["Orderfamilie", "Eén route of machinegroep", "Voorkomt dat onvergelijkbare processen de uitkomst bepalen"],
          ["Beslismoment", "Datum en tijd van de oorspronkelijke planning", "Begrenst welke informatie beide varianten mogen gebruiken"],
          ["Nulmeting", "De huidige vaste planningsregel", "Maakt zichtbaar wat het voorstel daadwerkelijk toevoegt"],
          ["Meetperiode", "Hetzelfde historische orderpakket", "Houdt vraag, capaciteit en verstoringen gelijk"],
        ],
      },
    },
    {
      heading: "Gebruik een fictief plaatwerkvoorbeeld",
      paragraphs: [
        "Onderstaand voorbeeld is fictief en beschrijft geen klant, uitgevoerde opdracht of gemeten resultaat. Een plaatwerkbedrijf in Oost-Nederland kiest zestig historische orders die lasersnijden en kanten vereisen. De planner gebruikte destijds een vaste regel: vroegste beloofde datum eerst, met een beperkte materiaalgroepering om onnodige wissels te voorkomen.",
        "Voor iedere order wordt de toen bekende materiaalstatus, geplande bewerkingstijd, beloofde datum, gereedschapsbehoefte en machinebeschikbaarheid vastgelegd. De bestaande regel maakt planning A. Een afgeschermd model maakt planning B, zonder productieorders vrij te geven of gegevens uit de toekomst te zien. De planner ontvangt beide voorstellen met dezelfde ordernummers en controleert of de volgorde technisch uitvoerbaar is.",
        "Het doel is niet bewijzen dat ‘AI beter plant’. De vraag is smaller: levert planning B op dit orderpakket een bruikbare verbetering op zonder meer onuitvoerbare voorstellen of handmatige correcties? Als een eenvoudige aangepaste regel hetzelfde resultaat geeft, kan die regel de verstandigere oplossing zijn.",
      ],
    },
    {
      heading: "Vergelijk uitkomst én benodigde correcties",
      paragraphs: [
        "Alleen het aantal op tijd afgeronde orders vergelijken is te beperkt. Een voorstel kan een gunstige leverdatum tonen en tegelijk materiaal gebruiken dat nog niet beschikbaar was, een gereedschapswissel vergeten of een onrealistische bewerkingstijd aannemen. Registreer daarom zowel de uitkomst als het werk dat nodig is om de planning uitvoerbaar te maken.",
      ],
      table: {
        caption: "Vergelijkingsblad voor de nulmeting en het nieuwe voorstel",
        headers: ["Maatstaf", "Planning A: vaste regel", "Planning B: proefvoorstel", "Controle door planner"],
        rows: [
          ["Te late orders", "Aantal en totale vertraging", "Aantal en totale vertraging", "Zijn prioriteiten gelijk toegepast?"],
          ["Wachttijd", "Mediaan per processtap", "Mediaan per processtap", "Is wachten verplaatst naar een andere stap?"],
          ["Handmatige correcties", "Aantal herschikkingen", "Aantal herschikkingen", "Welke ontbrekende regel veroorzaakte de correctie?"],
          ["Onuitvoerbare voorstellen", "Niet van toepassing of vastgelegd", "Aantal en reden", "Ontbrak materiaal, capaciteit of proceskennis?"],
          ["Uitlegbaarheid", "Bekende regel", "Reden per prioriteitskeuze", "Kan de planner de keuze controleren?"],
        ],
      },
    },
    {
      heading: "Houd de planner aan de vrijgaveknop",
      paragraphs: [
        "Een historische proef heeft geen reden om rechtstreeks met ERP, MES of machines te schrijven. Exporteer alleen de noodzakelijke gegevens naar een afgeschermde testomgeving, beperk toegang en leg vast welke velden zijn gebruikt. Het resultaat is een intern voorstel. De planner controleert materiaal, capaciteit, bewerkingsvolgorde en uitzonderingen voordat een conclusie wordt getrokken.",
        "Bepaal vooraf welke fout de proef onmiddellijk stopt. Denk aan het inplannen van niet-beschikbaar materiaal, het overschrijden van een technische procesvolgorde of het geven van een leverbelofte zonder bevoegde beoordeling. Leg ook vast wie het model, de gebruikte gegevens en de uitkomst mag zien. Een proef die minder planningswerk belooft maar nieuwe onbeheerde risico's introduceert, is geen verbetering.",
        "Deze menselijke beslisgrens sluit aan op een beheerste industriële AI-beslislus: het systeem bereidt een voorstel voor, maar eigenaarschap, controle en vrijgave blijven benoemd. Pas na een overtuigende offline vergelijking is een kleine schaduwproef met actuele orders te overwegen. Ook dan blijft de bestaande planning leidend totdat een verantwoordelijke medewerker anders beslist.",
      ],
      bullets: [
        "Geen automatische wijziging van productieplanning of leverdatum",
        "Geen extra persoonsgegevens of bedrijfsgegevens verzamelen zonder noodzaak",
        "Geen modelbeoordeling zonder vastgelegde nulmeting en uitzonderingslog",
        "Geen opschaling voordat een benoemde planner de uitkomst heeft beoordeeld",
      ],
    },
    {
      heading: "Beslis op basis van vooraf gekozen criteria",
      paragraphs: [
        "Spreek vóór de proef af welke uitkomst een vervolg rechtvaardigt. Dat hoeft geen spectaculair percentage te zijn. Een voorstel kan waardevol zijn wanneer het bijvoorbeeld minder handmatige correcties vraagt, knelpunten eerder zichtbaar maakt of vergelijkbare leverprestaties geeft met een beter uitlegbare bufferkeuze. De drempel moet passen bij het werkelijke probleem en de kosten van gegevensvoorbereiding en beheer.",
        "Een negatieve uitkomst is eveneens bruikbaar. Misschien is de registratie van materiaalstatus te onbetrouwbaar, verschillen de orders te sterk of bevat de huidige planningsregel kennis die nog niet expliciet is vastgelegd. Dan is de volgende stap geen groter model, maar betere procesdata of een scherpere regel. Documenteer welke aanname niet standhield en welke informatie een nieuwe proef zou veranderen.",
      ],
      table: {
        caption: "Besluit na de offline vergelijking",
        headers: ["Uitkomst", "Passende beslissing"],
        rows: [
          ["Geen aantoonbaar verschil", "Behoud de huidige regel en onderzoek alleen een duidelijker knelpunt"],
          ["Verbetering met veel correcties", "Leg ontbrekende procesregels vast vóór een nieuwe proef"],
          ["Beperkte verbetering met weinig risico", "Overweeg een schaduwproef onder menselijke controle"],
          ["Onuitvoerbare of onverklaarbare voorstellen", "Stop en herzie gegevens, afbakening of methode"],
        ],
      },
    },
    {
      heading: "Maak de eerste werkdag concreet",
      paragraphs: [
        "Begin niet met een leveranciersdemo. Laat planner en proceseigenaar eerst één orderfamilie kiezen en schrijf de huidige beslisregel in gewone taal op. Selecteer daarna een beperkt historisch orderpakket, leg het oorspronkelijke beslismoment vast en controleer of materiaalstatus, bewerkingstijd en beloofde datum betrouwbaar genoeg zijn voor een vergelijking.",
        "Met die voorbereiding kan een technisch mkb-bedrijf in Twente, de Achterhoek of elders in Nederland gericht beoordelen of een AI-proef zinvol is. De regio is een praktische focus, geen grens aan de dienstverlening. De kern blijft overal gelijk: hetzelfde orderpakket, dezelfde beschikbare informatie, dezelfde meetlat en een mens die beslist wat er met het voorstel gebeurt.",
      ],
    },
  ],
};
