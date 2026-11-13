import type { ArticleVisual } from "@/data/article-visuals";
import { articleSources } from "@/data/article-sources";
import type { Insight } from "@/data/insights";

const weldPhotoTrialVisual: ArticleVisual = {
  width: 1200,
  height: 760,
  mobileWidth: 760,
  mobileHeight: 1100,
  src: "/article-visuals/ai-lasnaadinspectie-proef-nl.svg",
  mobileSrc: "/article-visuals/ai-lasnaadinspectie-proef-nl-mobile.svg",
  alt: "Besliskader voor een AI-proef met lasnaadfoto's: vaste beeldopname, labels van een vakbeoordelaar, een afgescheiden testset, foutentelling en menselijke kwaliteitsvrijgave.",
  title: "Eén lasnaadtype, één fotoprotocol, één vooraf gekozen meetlat",
  caption: "De proef vergelijkt AI-uitvoer met vooraf vastgelegde vaklabels op dezelfde afgescheiden testbeelden. Twijfel, onbruikbare foto's en aanvullende meting blijven afzonderlijke uitkomsten.",
  explanationLabel: "Uitleg van de lasnaadfotoproef in tekst",
  details: [
    { label: "Vaste opname", text: "Gebruik één lasnaadtype en leg camera, afstand, hoek, verlichting en criteria voor een onbruikbare foto vooraf vast." },
    { label: "Onafhankelijke toets", text: "Een vakbeoordelaar labelt de referentie; de definitieve testbeelden blijven buiten modelontwikkeling en afstelling." },
    { label: "Veilige beslissing", text: "Tel gemiste zichtbare afwijkingen, onterechte meldingen en herbeoordelingstijd. Een bevoegde medewerker beslist over vrijgave of aanvullende meting." },
  ],
  afterSectionIndex: 3,
};

export const weldPhotoInspectionInsightNl: Insight = {
  slug: "ai-lasnaadinspectie-test-bestaande-fotos",
  title: "AI bij lasnaadinspectie: test eerst één type lasnaad met bestaande foto's",
  description: "Een praktische handleiding voor een afgebakende AI-proef met bestaande lasnaadfoto's, vaklabels, een afgescheiden testset en menselijke kwaliteitsvrijgave.",
  date: "2026-11-13",
  displayDate: "13 november 2026",
  kind: "practical-ai-guide",
  visual: weldPhotoTrialVisual,
  sources: [
    articleSources.zeissTalosInspection2026,
    articleSources.iso17637VisualWeldTesting,
    articleSources.fraunhoferWeldVision2024,
  ],
  sections: [
    {
      heading: "Begin met één vraag die een foto kan helpen beantwoorden",
      paragraphs: [
        "Een eerste AI-proef voor lasnaadinspectie hoeft geen automatische kwaliteitscontrole te zijn. Kies één terugkerende visuele vraag bij één lasnaadtype, bijvoorbeeld: bevat deze foto een vooraf omschreven zichtbare afwijking, is de foto onbruikbaar of is beoordeling door een vakmens nodig? Zo blijft duidelijk wat de proef wel en niet onderzoekt.",
        "Maak vóór de selectie van software een korte probleembeschrijving. Noteer welk product en lasnaadtype in scope zijn, op welk moment de foto wordt gemaakt, welke beslissing erop volgt en wie die beslissing mag nemen. De uitkomst van het model is in de proef alleen een signaal. Zij verandert geen vrijgavestatus en vervangt geen voorgeschreven inspectie.",
        { text: "ZEISS noemde op 5 november 2026 lasnaden als een mogelijke toepassing van zijn TALOS-meetrobot. Het bedrijf beschrijft een systeem voor geautomatiseerde oppervlakte- en kenmerkmetingen. Dat is actuele leverancierscontext voor digitale inspectie, maar geen bewijs dat een eenvoudige fotoproef dezelfde meetmogelijkheden of prestaties heeft.", sourceIds: ["zeiss-talos-inspection-2026"] },
      ],
    },
    {
      heading: "Scheid zichtbaar beeld van kwaliteitsvrijgave",
      paragraphs: [
        "Een tweedimensionale foto kan alleen kenmerken tonen die onder de gekozen opnamecondities zichtbaar zijn. Interne onvolkomenheden, exacte geometrie buiten beeld, materiaaleigenschappen of de sterkte van de verbinding volgen er niet automatisch uit. De vakbeoordelaar bepaalt daarom vooraf welke categorieën op de foto beoordeelbaar zijn en wanneer een andere inspectiemethode nodig blijft.",
        { text: "De openbare ISO-pagina bij ISO 17637:2016 vermeldt dat de norm visueel onderzoek van smeltlasverbindingen in metalen specificeert. De pagina zegt niet dat een gewone foto op zichzelf voldoende is voor acceptatie. Een bedrijf moet zijn toepasselijke normen, klantafspraken, lasprocedures en bevoegdheden afzonderlijk vastleggen; het artikel geeft daar geen certificering of technisch vrijgaveadvies voor.", sourceIds: ["iso-17637-visual-weld-testing"] },
      ],
      table: {
        caption: "Vier uitkomsten die in de proef niet op één hoop mogen",
        headers: ["Uitkomst", "Betekenis in de proef", "Vervolgactie"],
        rows: [
          ["Zichtbare afwijking volgens fotocriterium", "De afgesproken beeldkenmerken zijn aanwezig", "Vakbeoordelaar controleert en bepaalt het kwaliteitsvervolg"],
          ["Geen zichtbare afwijking volgens fotocriterium", "De kenmerken zijn op deze bruikbare foto niet gezien", "Geen automatische vrijgave; geldende controle blijft leidend"],
          ["Twijfel", "Beeld of kenmerk ondersteunt geen betrouwbare keuze", "Handmatige beoordeling en zo nodig aanvullende meting"],
          ["Onbruikbare foto", "Belichting, scherpte, hoek of zicht is onvoldoende", "Foto opnieuw maken volgens het vaste protocol"],
        ],
      },
    },
    {
      heading: "Maak van bestaande foto's eerst een betrouwbare referentieset",
      paragraphs: [
        "Bestaande foto's zijn aantrekkelijk omdat er geen nieuwe cameracel nodig is. Toch mogen ze niet zonder controle als trainings- of testmateriaal worden gebruikt. Selecteer alleen beelden waarvan het lasnaadtype, product, opnamemoment en beoordelingscontext bekend zijn. Verwijder dubbelen en voorkom dat vrijwel dezelfde foto van één onderdeel zowel in ontwikkeling als in de eindtoets terechtkomt.",
        "Laat een bevoegde vakbeoordelaar iedere foto labelen zonder de AI-uitvoer te zien. Gebruik minimaal de vier uitkomsten uit het schema hierboven en noteer bij twijfel waarom een keuze niet mogelijk was. Bespreek een steekproef met een tweede beoordelaar. Verschil tussen beoordelaars is geen ruis die moet worden weggepoetst; het kan aantonen dat de fotocriteria nog niet scherp genoeg zijn.",
        "Leg daarnaast een eenvoudig opnameprotocol vast voor een eventuele vervolgset: camera en lens, afstand, hoek, verlichting, achtergrond, schaalreferentie, reiniging en bestandsidentificatie. Als historische foto's te verschillend zijn, kan de verantwoordelijke keuze zijn eerst een kleine consistente set opnieuw te maken in plaats van een model op onvergelijkbare beelden te beoordelen.",
      ],
    },
    {
      heading: "Werk één fictieve proef uit voor een metaalbedrijf in Twente",
      paragraphs: [
        "Het volgende voorbeeld is volledig fictief. Het beschrijft geen klant, uitgevoerde opdracht of gemeten resultaat. Een metaalbedrijf in Twente maakt stalen machinebeugels met één terugkerend hoeklasdetail. De kwaliteitsmedewerker beschikt over bestaande foto's die tijdens eerdere controles zijn gemaakt. Het bedrijf wil weten of een AI-proef foto's met een mogelijk zichtbare afwijking kan voorselecteren zonder de kwaliteitsbeslissing te automatiseren.",
        "Eerst kiest de vakbeoordelaar alleen foto's van hetzelfde product, lasproces en lasnaadtype. De medewerker markeert zichtbare afwijking volgens het afgesproken fotocriterium, geen zichtbare afwijking, twijfel of onbruikbaar. Foto's met spiegeling, onscherpte of onvoldoende zicht worden niet alsnog als goed of fout gelabeld. Ze vormen een aparte categorie die laat zien hoeveel werk een beter opnameproces vraagt.",
        "Daarna wordt de set per fysiek onderdeel gescheiden. Eén deel mag voor ontwikkeling en afstelling worden gebruikt. De definitieve testset blijft gesloten totdat de methode en beslisdrempel zijn vastgelegd. Zo kan een leverancier of intern team het model niet ongemerkt op de eindtoets afstemmen.",
      ],
      table: {
        caption: "Fictief proefblad vóór de eerste modelvergelijking",
        headers: ["Vastleggen", "Keuze in het fictieve voorbeeld", "Bewijsgrens"],
        rows: [
          ["Scope", "Eén hoeklasdetail op één stalen machinebeugel", "Geen uitspraak over andere producten of lasprocessen"],
          ["Referentie", "Labels van een aangewezen vakbeoordelaar", "Label is een beoordeling onder het fotocriterium, geen universele waarheid"],
          ["Testset", "Afgescheiden per fysiek onderdeel", "Geen foto of bijna-duplicaat uit de testset tijdens afstelling"],
          ["AI-uitkomst", "Voorselectie voor menselijke controle", "Geen directe vrijgave, blokkade of proceswijziging"],
          ["Stopregel", "Test stoppen bij onherleidbare fouten of instabiele opnamekwaliteit", "Geen opschaling om een zwakke proef alsnog positief te maken"],
        ],
      },
    },
    {
      heading: "Meet fouten én het extra beoordelingswerk",
      paragraphs: [
        { text: "Fraunhofer IPT beschreef in 2024 een demonstratie waarbij een vooraf getraind deep-learningmodel camerabeelden van lasnaden op batterijmodules analyseerde. Dat laat zien dat beeldanalyse op een specifiek lasprobleem technisch kan worden onderzocht. De publicatie valideert echter niet een andere las, camera, beoordelingsregel of productieomgeving en levert geen resultaat voor het fictieve voorbeeld in dit artikel.", sourceIds: ["fraunhofer-weld-vision-2024"] },
        "Vergelijk de AI-uitvoer daarom alleen met de vooraf vastgelegde labels op dezelfde gesloten testset. Tel niet slechts hoeveel foto's overeenkomen. Een gemiste zichtbare afwijking heeft een andere betekenis dan een onterechte melding. Ook een grote groep twijfelgevallen of onbruikbare foto's kan de proef onpraktisch maken, zelfs wanneer de overige classificaties vaak overeenkomen.",
        "Meet tenslotte de minuten die de vakbeoordelaar nodig heeft om meldingen, twijfel en onbruikbare foto's te herbeoordelen. Een systeem dat veel markeert kan op papier voorzichtig lijken en toch meer werk veroorzaken. Het relevante resultaat is niet alleen modelnauwkeurigheid, maar de kwaliteit en belasting van de volledige beslisroute.",
      ],
      table: {
        caption: "Minimale meetlat voor de gesloten testset",
        headers: ["Maatstaf", "Wat u telt", "Waarom dit de beslissing beïnvloedt"],
        rows: [
          ["Gemiste zichtbare afwijkingen", "Referentielabel afwijking, maar niet door AI gemarkeerd", "Bepaalt of voorselectie een onaanvaardbare blinde vlek heeft"],
          ["Onterechte meldingen", "AI markeert een afwijking die de referentie niet bevat", "Laat extra controlewerk en mogelijke verstoring zien"],
          ["Twijfel en onbruikbaar", "Aantal en reden per categorie", "Maakt opnameproblemen en criteria die menselijke beoordeling vragen zichtbaar"],
          ["Herbeoordelingstijd", "Minuten per vaste hoeveelheid foto's", "Toont of de werkwijze werkelijk werk vermindert of verplaatst"],
          ["Herleidbaarheid", "Foto-ID, modelversie, drempel en beoordelaar", "Maakt fouten bespreekbaar en een herhaling van de proef mogelijk"],
        ],
      },
    },
    {
      heading: "Leg drie vervolgroutes vast vóór u test",
      paragraphs: [
        "Een melding hoeft niet rechtstreeks naar goed- of afkeur te leiden. Ontwerp drie routes: de foto opnieuw maken als de opname onvoldoende is; aanvullende meting of inspectie uitvoeren als het beeld de relevante eigenschap niet kan aantonen; en de bevoegde vakbeoordelaar laten beslissen wanneer het beeld bruikbaar is maar interpretatie nodig blijft.",
        "Benoem ook wie de kwaliteitstatus in het bronsysteem mag aanpassen. In een eerste offline proef hoeft geen koppeling met QMS, ERP of productieapparatuur te bestaan. Een export met minimale, gepseudonimiseerde identificatie en een apart resultatenblad is vaak beter controleerbaar. De geldende werkinstructie en normale vrijgave blijven tijdens de proef ongewijzigd.",
      ],
      bullets: [
        "Foto opnieuw maken bij onscherpte, spiegeling, verkeerde hoek of onvoldoende dekking",
        "Aanvullende meting gebruiken voor eigenschappen die de foto niet betrouwbaar toont",
        "Vakbeoordelaar laten beslissen over afwijkingen, twijfel en vrijgave",
        "Geen automatische statuswijziging, machine-ingreep of klantmelding vanuit de proef",
      ],
    },
    {
      heading: "Beslis klein: stoppen, beeldproces verbeteren of schaduwproef",
      paragraphs: [
        "Spreek vóór de test af welke uitkomst een vervolg kan rechtvaardigen. Een vervolg is niet automatisch passend bij een hoog gemiddeld overeenkomstpercentage. Kijk eerst naar gemiste zichtbare afwijkingen, stabiliteit per opnamesituatie, herbeoordelingstijd en de vraag of fouten begrijpelijk en herstelbaar zijn.",
        "Als veel foto's onbruikbaar zijn, verbeter dan eerst de beeldopname. Als vakbeoordelaars structureel van mening verschillen, verduidelijk dan de criteria of beperk de vraag. Als de gesloten testset voldoende stabiel is en de foutsoorten binnen vooraf afgesproken grenzen blijven, kan een kleine schaduwproef met nieuwe foto's worden overwogen. Daarbij draait de AI mee zonder de echte vrijgave te sturen.",
        "Voor een technisch mkb-bedrijf in Twente, de Achterhoek of elders in Nederland is dat een bruikbare eerste stap: één lasnaadtype, een vaste referentie, zichtbare foutkosten en een vakmens die eigenaar blijft. De regionale focus helpt de proef concreet te maken, maar vormt geen grens aan de dienstverlening.",
      ],
      table: {
        caption: "Besluit na de offline fotoproef",
        headers: ["Waarneming", "Passend besluit"],
        rows: [
          ["Veel onbruikbare of niet vergelijkbare foto's", "Eerst het opnameprotocol en de beeldset verbeteren"],
          ["Onduidelijke of wisselende vaklabels", "Criteria aanscherpen en opnieuw onafhankelijk labelen"],
          ["Gemiste afwijkingen buiten de vooraf gekozen grens", "Stoppen of methode herontwerpen; niet naar productie koppelen"],
          ["Stabiele uitkomst met beheersbaar controlewerk", "Een beperkte schaduwproef met nieuwe foto's overwegen"],
          ["Geen voordeel boven een eenvoudige beeldregel", "De eenvoudigere, beter uitlegbare werkwijze behouden"],
        ],
      },
    },
  ],
};
