import type { Insight } from "@/data/insights";
import type { ArticleVisual } from "@/data/article-visuals";
import { articleSources } from "@/data/article-sources";

const marketSelectionVisual: ArticleVisual = {
  width: 1200,
  height: 760,
  mobileWidth: 760,
  mobileHeight: 1100,
  src: "/article-visuals/marktanalyse-maakindustrie-nl.svg",
  mobileSrc: "/article-visuals/marktanalyse-maakindustrie-nl-mobile.svg",
  alt: "Besliskader waarin een sectorindicator via technische fit, afnemersactiviteit, concurrentiedruk en bronzekerheid wordt vertaald naar een onderbouwde shortlist van marktsegmenten.",
  title: "Van sectorsignaal naar een onderbouwde marktshortlist",
  caption: "Een industriecijfer geeft context. De marktkeuze ontstaat pas nadat het signaal is getoetst aan technische fit, zichtbare afnemersactiviteit, concurrentiedruk en de kwaliteit van het bewijs.",
  explanationLabel: "Uitleg van het marktselectiekader in tekst",
  details: [
    { label: "Context", text: "Een gedateerde sectorindicator helpt bepalen waar een vervolgvraag relevant kan zijn, maar voorspelt geen omzet bij één afnemer." },
    { label: "Selectie", text: "Technische fit, afnemersactiviteit en concurrentiedruk bepalen samen welke segmenten een plaats op de shortlist verdienen." },
    { label: "Verificatie", text: "Bron, datum, zekerheid en eerstvolgende controle blijven zichtbaar voordat een commerciële keuze wordt gemaakt." },
  ],
  afterSectionIndex: 2,
};

export const marketAnalysisInsightNl: Insight = {
  slug: "marktanalyse-maakindustrie-meerdere-indicatoren",
  title: "Marktanalyse maakindustrie: waarom één industriecijfer niet genoeg is",
  description: "Een praktisch kader om actuele sectorsignalen te vertalen naar een onderbouwde selectie van industriële marktsegmenten en afnemers.",
  date: "2026-11-05",
  displayDate: "5 november 2026",
  visual: marketSelectionVisual,
  sources: [articleSources.cbsProducerConfidence2026],
  sections: [
    {
      heading: "Begin bij de beslissing, niet bij het gemiddelde",
      paragraphs: [
        "Een marktanalyse voor de maakindustrie begint vaak met een aantrekkelijk cijfer: vertrouwen stijgt, investeringen nemen toe of een branche groeit. Zo'n cijfer kan een goede aanleiding zijn om verder te kijken. Het is alleen geen verkoopprognose en evenmin bewijs dat een specifiek bedrijf nu wil inkopen.",
        { text: "De CBS-tabel over producentenvertrouwen laat dit verschil zien. Voor de totale industrie staat de voorlopige, seizoengecorrigeerde indicator op 4,2 in september 2026 en 2,3 in oktober. Dat is een daling van 1,9 indicatorpunt. Het is niet 1,9 procent minder omzet of productie. Het producentenvertrouwen is een stemmingsindicator die is samengesteld uit verwachtingen over bedrijvigheid, het oordeel over de orderpositie en het oordeel over voorraden.", sourceIds: ["cbs-producer-confidence-2026-10"] },
        "De bruikbare vraag is daarom niet: is 2,3 goed of slecht? Vraag welke beslissing u met het cijfer wilt ondersteunen. Wilt u een nieuw klantsegment kiezen, een verkooplijst prioriteren of bepalen waar verdiepend concurrentieonderzoek zinvol is? Pas daarna kunt u beoordelen welke aanvullende informatie nodig is.",
      ],
    },
    {
      heading: "Brancheverschillen veranderen de marktvraag",
      paragraphs: [
        { text: "In dezelfde CBS-publicatie staat voor oktober 2026 een producentenvertrouwen van 8,0 voor de elektrotechnische en machine-industrie en 1,2 voor de basismetaal- en metaalproductenindustrie. Beide waarden zijn voorlopig en seizoengecorrigeerd. Het verschil maakt duidelijk waarom één landelijk gemiddelde uiteenlopende marktomstandigheden kan verbergen.", sourceIds: ["cbs-producer-confidence-2026-10"] },
        "Ook deze branchecijfers zijn geen ranglijst van aantrekkelijke klanten. Een hogere indicator bewijst niet dat iedere machinebouwer budget heeft, dat orderboeken overal groeien of dat uw aanbod technisch past. Een lagere indicator kan juist een relevante vraag blootleggen, bijvoorbeeld naar kostenbeheersing, alternatieve leveranciers of een andere marktpositie. De betekenis hangt af van het probleem dat u kunt oplossen en van het bewijs bij de beoogde afnemers.",
      ],
      table: {
        caption: "Dezelfde openbare indicator kan verschillende vervolgvragen oproepen",
        headers: ["Openbaar signaal", "Wat het wel ondersteunt", "Wat nog moet worden onderzocht"],
        rows: [
          ["Industrie totaal: 2,3", "Context voor de stemming in oktober 2026", "Welke branches en bedrijven passen bij uw aanbod?"],
          ["Elektrotechniek en machine-industrie: 8,0", "Relatief positiever branchesignaal in dezelfde maand", "Welke afnemers tonen concrete investerings- of inkoopactiviteit?"],
          ["Basismetaal en metaalproducten: 1,2", "Ander branchesignaal binnen dezelfde industrie", "Welke problemen, projecten en concurrenten bepalen de werkelijke kans?"],
        ],
      },
    },
    {
      heading: "Gebruik vijf selectievragen voor een marktshortlist",
      paragraphs: [
        "Een bruikbare shortlist combineert sectorcontext met controleerbare informatie op segment- en bedrijfsniveau. Onderstaand kader is kwalitatief: het voorkomt schijnprecisie wanneer betrouwbare omzet- of vraaggegevens ontbreken. U kunt per segment vastleggen wat bekend is, hoe actueel het bewijs is en welke controle de onzekerheid het snelst verkleint.",
      ],
      table: {
        caption: "Kwalitatief kader voor industriële marktselectie",
        headers: ["Selectievraag", "Mogelijk openbaar bewijs", "Beslisregel"],
        rows: [
          ["1. Technische fit", "Productspecificaties, processen, materialen en bestaande technologie", "Alleen selecteren als de behoefte technisch aansluit of gericht te toetsen is"],
          ["2. Afnemersactiviteit", "Investeringen, aanbestedingen, vacatures, projecten en productintroducties", "Onderscheid een actueel signaal van een oud of algemeen voornemen"],
          ["3. Concurrentiedruk", "Zichtbare aanbieders, partnerschappen, claims en leveranciersrelaties", "Bepaal welk alternatief de afnemer al heeft en wat onbewezen blijft"],
          ["4. Bronzekerheid", "Herkomst, datum, reikwijdte en onafhankelijke bevestiging", "Verlaag de prioriteit als de kernclaim alleen uit één belanghebbende bron komt"],
          ["5. Volgende verificatie", "Eén concrete vraag, bron of gesprek dat de keuze kan veranderen", "Neem geen definitieve commerciële stap zolang een doorslaggevende aanname ongetoetst is"],
        ],
      },
    },
    {
      heading: "Scheid sectorsentiment van bedrijfsspecifiek bewijs",
      paragraphs: [
        { text: "CBS licht toe dat het producentenvertrouwen de richting aangeeft waarin industriële productie zich naar verwachting kan ontwikkelen. De deelindicatoren gaan over verwachte bedrijvigheid, het oordeel over de orderpositie en voorraden gereed product. De uitkomsten zijn saldi uit een conjunctuuronderzoek en worden voor seizoensinvloeden gecorrigeerd. Tijdens het verslagjaar hebben ze een voorlopig karakter.", sourceIds: ["cbs-producer-confidence-2026-10"] },
        "Dat maakt de indicator geschikt als gedateerde context, maar niet als bewijs voor het orderboek, de capaciteit of de koopintentie van één onderneming. Voor een bedrijfsselectie zijn andere bronnen nodig: recente projectaankondigingen, technische documentatie, vacatures, openbare aanbestedingen, leveranciersverwijzingen en controleerbare bedrijfsmededelingen. Iedere bron heeft een eigen publicatiedoel en bewijsgrens.",
        "Let ook op bronafhankelijkheid. Drie nieuwsberichten kunnen hetzelfde persbericht herhalen en vormen dan geen drie onafhankelijke bevestigingen. Een investeringsplan laat een voornemen zien, geen gerealiseerde productie. Een vacature kan op uitbreiding wijzen, maar ook op vervanging. Het is beter die alternatieven zichtbaar te houden dan een vroege aanwijzing als zekerheid te presenteren.",
      ],
    },
    {
      heading: "Maak de uitkomst commercieel bruikbaar",
      paragraphs: [
        "Een marktanalyse hoeft niet te eindigen met een lange lijst bedrijven. Een betere uitkomst is een korte, beargumenteerde selectie met per segment: de beslisvraag, het sterkste actuele signaal, de technische fit, de belangrijkste onzekerheid en de eerstvolgende verificatiestap. Zo kan directie beoordelen waarom een segment aandacht verdient en kan een commercieel team gericht voorbereiden wat nog moet worden vastgesteld.",
        "Stel bijvoorbeeld niet dat machinebouw aantrekkelijk is omdat één indicator op 8,0 staat. Leg vast welke subsegmenten technisch passen, welke bedrijven recente activiteit tonen, welke concurrenten al zichtbaar zijn en welke bron de mogelijke behoefte ondersteunt. Als het bewijs onvoldoende is, is de juiste uitkomst geen voorspelling maar een onderzoeksprioriteit.",
        "Daarmee krijgt een openbaar industriecijfer de juiste rol: startpunt voor een betere vraag. De uiteindelijke marktkeuze rust op meerdere, gedateerde bronnen en op expliciete grenzen tussen wat bekend, aannemelijk en nog onbekend is.",
      ],
    },
  ],
};
