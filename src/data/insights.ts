import { industrialInsights } from "@/data/industrial-insights";
import { articleSources, type ArticleSource } from "@/data/article-sources";

export type InsightParagraph = string | {
  text: string;
  sourceIds: readonly string[];
};

export type InsightSection = {
  heading: string;
  paragraphs?: readonly InsightParagraph[];
  bullets?: readonly string[];
  markdown?: string;
};

export type Insight = {
  slug: string;
  title: string;
  description: string;
  date: string;
  displayDate: string;
  modifiedDate?: string;
  displayModifiedDate?: string;
  introMarkdown?: string;
  sections: readonly InsightSection[];
  sources?: readonly ArticleSource[];
};

const originalInsights: readonly Insight[] = [
  {
    slug: "what-is-industrial-competitive-intelligence",
    title: "What Is Industrial Competitive Intelligence?",
    description: "A practical guide to evidence-led competitor research for industrial decision-makers.",
    date: "2026-09-22",
    displayDate: "22 September 2026",
    modifiedDate: "2026-10-07",
    displayModifiedDate: "7 October 2026",
    sources: [articleSources.scipEthics, articleSources.espacenet, articleSources.ted, articleSources.phiaStandards],
    sections: [
      {
        heading: "A decision discipline, not a data collection exercise",
        paragraphs: [
          "Industrial competitive intelligence is the structured collection and interpretation of lawful information about companies, technologies, capabilities and markets. Its purpose is to improve a decision: whether to enter a market, respond to a competitor, qualify a partner, adjust a product roadmap or test a strategic assumption.",
          "The distinction matters. A large folder of documents is not intelligence. Intelligence connects evidence to a defined question, explains how reliable each source is and shows which conclusions are supported. It also makes uncertainty visible. In technical markets, where product claims are often incomplete and terminology varies between suppliers, that discipline is more valuable than sheer volume.",
        ],
      },
      {
        heading: "What the evidence can include",
        paragraphs: [
          { text: "Useful sources are often distributed across places that were published for different audiences. Company reports may explain strategy. Product literature describes intended capability. Patent publications can show claimed inventions and technical direction. Vacancies indicate skill requirements. Tender notices, permits and certifications can add timing, location or compliance context. Public photographs and video may help test whether a stated capability is physically plausible.", sourceIds: ["epo-espacenet", "eu-ted"] },
          { text: "No single source should automatically be treated as definitive. Corporate and supplier material is primary evidence of what its publisher claims, not independent proof that the claim is correct. Photographs can lack context and public databases can be incomplete. The analyst’s task is to assess provenance, recency, consistency and motive, then cross-reference the signal against independent material.", sourceIds: ["phia-standards"] },
        ],
        bullets: [
          "Primary company, regulatory and technical publications",
          "Patents, certifications, tenders and planning records",
          "Vacancies, supplier references and trade-fair material",
          "Publicly published facility, equipment and product imagery",
        ],
      },
      {
        heading: "How it differs from market research",
        paragraphs: [
          "Market research often starts with a category and asks how large it is, who buys, and how demand may develop. Industrial competitive intelligence usually starts with a narrower decision and a specific uncertainty. Can this competitor produce at the claimed scale? Which partners appear connected to a programme? Is a new product genuinely available, or still a development signal?",
          "The disciplines overlap, but the intelligence question is usually more evidential and more operational. It may require reading technical drawings, comparing facility changes over time, tracing corporate relationships or reconciling contradictory claims. The result should be usable by strategy, engineering, procurement and commercial teams—not only by a research specialist.",
        ],
      },
      {
        heading: "A credible output separates knowledge from judgement",
        paragraphs: [
          { text: "A professional report distinguishes direct observation from interpretation. A planning document may confirm that an extension was permitted. Public imagery may indicate that construction occurred. Job adverts may support an assessment that the company is preparing for greater throughput. None of those sources alone proves current production capacity.", sourceIds: ["phia-standards"] },
          { text: "Labelled confidence levels help readers understand this boundary. A confidence label should reflect the quality and completeness of the information base and the rigour of the analysis; it is not a substitute for explaining uncertainty. Moderate or indicative findings can remain useful, but should be treated as questions to test rather than facts to repeat.", sourceIds: ["phia-standards"] },
        ],
      },
      {
        heading: "When to commission focused intelligence",
        paragraphs: [
          { text: "The work is most valuable when a decision is important, public information is fragmented and the cost of a false assumption is meaningful. A clear brief should state the decision, target, timeframe and evidence standard. It should also state the legal and ethical boundaries: public sources only, no impersonation, no unauthorised access and no use of unlawfully acquired material.", sourceIds: ["scip-ethics"] },
          "A tightly scoped question generally produces a stronger result than a request to find everything about a company. Start with the uncertainty that could change the decision. The research can then identify what is known, what is likely, what remains unknown and which next question would reduce uncertainty most effectively.",
        ],
      },
    ],
  },
  {
    slug: "what-public-images-can-reveal-about-industrial-capabilities",
    title: "What Public Images Can Reveal About Industrial Capabilities",
    description: "How to use public photographs and video as technical evidence without overstating what they prove.",
    date: "2026-09-22",
    displayDate: "22 September 2026",
    modifiedDate: "2026-10-07",
    displayModifiedDate: "7 October 2026",
    sources: [articleSources.berkeleyProtocol, articleSources.iptcMetadata, articleSources.npsaCommunications],
    sections: [
      {
        heading: "Images are evidence, but rarely the whole answer",
        paragraphs: [
          { text: "A public photograph can preserve details that written material omits: the arrangement of a production line, the scale of a clean area, the type of handling equipment, the apparent maturity of a prototype or the relationship between buildings on a site. Video adds sequence and movement. It may show process flow, staffing patterns or how equipment is operated.", sourceIds: ["npsa-security-minded-communications"] },
          "These observations can support industrial capability analysis, but an image is not self-explanatory. Date, location, editing, camera angle and publication purpose all affect what can be concluded. A photograph may be current or years old. A machine may be present but not operational. A demonstration unit may not represent serial production.",
        ],
      },
      {
        heading: "Begin with provenance and context",
        paragraphs: [
          { text: "Before interpreting the scene, establish where the image came from, when it was published, whether the claimed location is credible and whether earlier versions exist. Corporate websites, trade-fair posts, supplier case studies, recruitment material and public planning records may all contain the same image with different captions. Those differences can be informative.", sourceIds: ["ohchr-berkeley-protocol"] },
          { text: "The surrounding page matters. A supplier may state an installed model and delivery date; that remains a supplier claim until corroborated. A company caption may identify the line or customer programme. A planning document may confirm the building. Preserve the original URL, capture date and relevant context so the evidence trail remains auditable instead of relying on a detached screenshot.", sourceIds: ["ohchr-berkeley-protocol"] },
        ],
      },
      {
        heading: "Observable features versus inferred capability",
        paragraphs: [
          { text: "Good analysis states what is directly visible before explaining what it may mean. An image can show the presence of equipment, repeated workstations, marked production zones, ventilation infrastructure, material storage or protective controls. Those are observations. An assessment that the facility can perform a particular process requires additional technical and contextual support.", sourceIds: ["ohchr-berkeley-protocol"] },
          { text: "Hidden specifications should remain hidden. Pixel dimensions do not prove material composition. An external housing does not reveal internal tolerances. A clean appearance does not establish a certified cleanliness class. Image metadata can provide dates, locations or administrative context when present, but it is another item to verify—not proof of authenticity. Visual evidence may narrow possibilities or contradict a claim, but it does not make inaccessible details knowable.", sourceIds: ["iptc-photo-metadata"] },
        ],
        bullets: [
          "Describe visible objects, labels and spatial relationships",
          "Record image date, source and likely publication purpose",
          "Cross-reference equipment with manuals or supplier literature",
          "State alternative explanations and unresolved limitations",
        ],
      },
      {
        heading: "Useful analytical comparisons",
        paragraphs: [
          "The strongest visual findings often come from comparison. Images from different dates can indicate construction progress, layout changes or the appearance of new equipment. Several viewpoints can test whether an apparent feature is real or caused by perspective. Supplier material can help identify equipment families, while product and recruitment information may show whether the necessary skills and processes are also present.",
          "Comparison should remain proportionate. Similar-looking machines may have different specifications. A newly fitted production area may still be in commissioning. Absence from an image is not proof of absence from the facility. Each conclusion should reflect the actual evidential strength.",
        ],
      },
      {
        heading: "How to report visual findings responsibly",
        paragraphs: [
          { text: "A useful report pairs each significant image observation with its source, assessment, confidence and limitation. Annotated crops can help readers inspect relevant details, provided annotations do not obscure the original evidence. Where the image is insufficient, the report should say so plainly and identify the next public source that could test the point.", sourceIds: ["ohchr-berkeley-protocol"] },
          "Visual analysis is valuable because it adds another evidence stream, not because it bypasses uncertainty. Used alongside technical documents, public records and commercial context, it can reveal inconsistencies, strengthen a capability assessment and help decision-makers ask more precise questions.",
        ],
      },
    ],
  },
  {
    slug: "separate-evidence-assessment-inference-osint",
    title: "How to Separate Evidence, Assessment and Inference in OSINT",
    description: "A clear framework for keeping public-source conclusions traceable and proportionate.",
    date: "2026-09-22",
    displayDate: "22 September 2026",
    modifiedDate: "2026-10-07",
    displayModifiedDate: "7 October 2026",
    sources: [articleSources.odniStandards, articleSources.phiaStandards, articleSources.phiaUncertainty],
    sections: [
      {
        heading: "Why the distinction matters",
        paragraphs: [
          "Public-source research is full of fragments. A company announces an investment, publishes a vacancy and appears in a supplier case study. The fragments may point in the same direction, but the conclusion still requires judgement. If a report presents judgement as fact, readers cannot test it and may carry an unsupported claim into a high-value decision.",
          { text: "Separating evidence, assessment and inference makes the reasoning visible. It does not weaken the report. It shows precisely where confidence comes from and where additional verification would be useful. This is especially important when technical evidence is incomplete or sources have a commercial incentive to exaggerate.", sourceIds: ["odni-icd-203", "phia-standards"] },
        ],
      },
      {
        heading: "Evidence: what the source directly supports",
        paragraphs: [
          "Evidence is the recorded material available for inspection: a dated annual report, a patent filing, a photograph, a planning record, a vacancy or a product datasheet. The report should describe the relevant content accurately and preserve provenance. A direct quotation may be useful, but paraphrase and source reference are often clearer.",
          { text: "Evidence quality varies. A regulator’s record may be authoritative for a filing date, but not for present operational status. A company or supplier brochure is primary evidence of what its publisher claims, not independent proof that the claim is correct. The right description should be no broader than the source allows.", sourceIds: ["odni-icd-203"] },
        ],
      },
      {
        heading: "Assessment: the analyst’s supported judgement",
        paragraphs: [
          "An assessment explains what several pieces of evidence mean when considered together. For example, an approved facility extension, new production roles and supplier commissioning references may support a high-confidence assessment that capacity expansion is under way. The evidence remains separate; the assessment is the reasoned conclusion.",
          { text: "Assessments should state confidence and identify the main basis. Confidence concerns the soundness and stability of the analytical foundation; it is different from the likelihood that a judgement is true. Assessments should also address contradiction. If the company later delays a launch or vacancies remain unfilled, the report should explain how that affects the judgement rather than silently selecting the most convenient sources.", sourceIds: ["phia-uncertainty", "phia-standards"] },
        ],
        bullets: [
          "State the specific conclusion being assessed",
          "Cite the strongest supporting and contradicting evidence",
          "Explain why sources are considered reliable or limited",
          "Assign confidence in proportion to the remaining uncertainty",
        ],
      },
      {
        heading: "Inference: a plausible step beyond direct support",
        paragraphs: [
          "An inference is a reasonable possibility derived from evidence but not directly established by it. A cluster of hires may indicate a new programme. A supplier relationship may suggest a technical route. A facility change may be consistent with a particular process. These signals can guide strategy and further collection, but should not be repeated as settled facts.",
          { text: "The most useful inference often includes alternatives. If the observed expansion could support either higher volume or a new product line, both explanations should remain visible until another source discriminates between them. This prevents narrative momentum from turning a possibility into certainty.", sourceIds: ["odni-icd-203", "phia-standards"] },
        ],
      },
      {
        heading: "Unknowns are part of the answer",
        paragraphs: [
          "Some questions cannot be answered responsibly from public evidence. Production yield, internal cost, customer-specific terms and hidden process parameters may remain unknown. A credible report identifies these gaps and avoids filling them with generic assumptions.",
          "Unknown does not mean useless. It helps a decision-maker understand where risk remains, which claim should not be relied upon and what additional public evidence could improve the picture. The objective is not certainty at any cost; it is a better-calibrated decision.",
        ],
      },
      {
        heading: "Begin with a decision and a testable claim",
        paragraphs: [
          "Before collecting sources, write down the decision that the research must support. 'Understand a competitor' is too broad to test. 'Should we treat its announced plant as additional supply for the product we buy next year?' identifies a time period, a product and a practical consequence. It also exposes the assumptions that require checking: whether the facility is intended for that product, whether its process is qualified and whether deliveries have begun. A good research question narrows the evidence search without presuming the answer.",
          "Then define what would count as direct support, what would weaken the claim and what may remain inaccessible. A planning permit can establish permission for a specified development. A company update may establish that management says equipment is being installed. Neither necessarily establishes qualified output. A later product-specific statement, supported by other dated material, may change the assessment. Recording these thresholds at the outset reduces the temptation to move the goalposts after finding an attractive source.",
        ],
      },
      {
        heading: "Build a source record that preserves context",
        paragraphs: [
          { text: "A conclusion should be traceable to the material a reader could inspect. For each important item, record the publisher, original location, publication date, date of the event described and the exact statement or visible feature used. Those dates can differ. A report published in September about a planned opening in the following year is not evidence of production in September. Keep the publication's stated scope: a site-wide capacity claim does not automatically answer a question about one component or product line.", sourceIds: ["phia-standards"] },
          "Source independence also needs attention. Several articles may repeat the same press release, creating the appearance of corroboration without adding independent observation. A supplier quotation, a company announcement and a news rewrite may all trace back to one interested party. Conversely, a public register may corroborate a location or permit while remaining silent on output. The source record should make those relationships visible, rather than treating every URL as a separate vote for the conclusion.",
        ],
      },
      {
        heading: "Test the strongest alternative explanation",
        paragraphs: [
          { text: "A useful assessment asks what else could explain the same evidence. Hiring engineers may support a new production programme, but it might also replace departing staff or support an existing line. A new building may add floor space while production simply moves from another site. Published images may show demonstration equipment rather than machines operating at commercial scale. These alternatives are not reasons to ignore the signals; they are reasons to calibrate the conclusion.", sourceIds: ["odni-icd-203", "phia-standards"] },
          "Rank alternatives by the evidence available, and state what new observation would distinguish them. A dated commissioning announcement might support progress beyond construction; a product qualification notice may narrow the remaining question; a shipment claim may indicate commercial activity but still need its scope checked. If no public source can discriminate between plausible explanations, keep the result as an inference or an unknown. The honest answer can still tell a decision-maker which assumption carries the greatest risk.",
        ],
      },
      {
        heading: "Turn the assessment into a decision-ready record",
        paragraphs: [
          "An executive reader needs a short answer tied to the original decision, not a chronology of every search. State the finding, its confidence, the best supporting evidence, the material contradiction and the consequence if the assessment is wrong. Follow with the source trail so a technical colleague can challenge the reasoning. If evidence supports several outcomes, present the conditions under which each would matter rather than compressing them into a single prediction.",
          "Finally, specify what would trigger a review. A revised company timetable, new regulatory record, product-specific customer statement or verified operating milestone may change confidence. The report need not promise continuous monitoring; it can simply identify the signals worth checking when the decision is revisited. This gives uncertainty a practical role: it determines what to verify next, what not to assume in the meantime and how strongly the current evidence should influence action.",
        ],
      },
    ],
  },
  {
    slug: "how-industrial-companies-expose-competitive-information",
    title: "How Industrial Companies Unintentionally Expose Competitive Information",
    description: "Common public information exposures—and how to review them without resorting to invasive monitoring.",
    date: "2026-09-22",
    displayDate: "22 September 2026",
    modifiedDate: "2026-10-07",
    displayModifiedDate: "7 October 2026",
    sources: [articleSources.npsaCommunications, articleSources.ncscSharing, articleSources.ncscPublishing, articleSources.gdprArticle5],
    sections: [
      {
        heading: "The exposure is usually cumulative",
        paragraphs: [
          "Industrial organisations publish information for valid reasons: winning customers, recruiting specialists, satisfying regulators, supporting suppliers and communicating with investors. A single item may reveal little. The competitive picture emerges when many small disclosures are combined across time and source types.",
          { text: "A vacancy can describe equipment and processes. A supplier case study can state a facility and installation; that is a supplier claim until independently corroborated. A trade-fair video can show the layout around a prototype. A planning document can indicate building use. Together, those sources may allow an external observer to estimate direction, readiness or capacity more confidently than the organisation intended.", sourceIds: ["npsa-security-minded-communications"] },
        ],
      },
      {
        heading: "Where useful signals appear",
        paragraphs: [
          { text: "The most visible sources are not always the most revealing. Corporate presentations may receive formal review, while local recruitment pages, employee conference slides, procurement notices, certification directories and contractor portfolios can follow different publishing workflows. Old files or links can also remain visible after the main website has changed.", sourceIds: ["ncsc-sharing-online", "ncsc-social-publishing"] },
          { text: "Public social-media posts deserve particular care because they are frequent and visual. An innocuous factory photograph may show badges, labels, whiteboards, workstation counts or equipment models. The concern is not the image alone, but how it aligns with public hiring, customer and investment signals.", sourceIds: ["npsa-security-minded-communications"] },
        ],
        bullets: [
          "Recruitment material naming tools, processes or programme timing",
          "Supplier and contractor portfolios with customer or site detail",
          "Photographs containing labels, screens, drawings or access badges",
          "Archived documents with outdated but still sensitive context",
          "Overlapping announcements that reveal more in combination",
        ],
      },
      {
        heading: "Exposure review should remain lawful and proportionate",
        paragraphs: [
          "A public-information exposure review examines material that an ordinary user can access lawfully. It should not involve bypassing controls, impersonating staff, accessing leaked data or interacting deceptively with employees. The objective is to understand the organisation’s public footprint, not to test technical defences without authorisation.",
          { text: "Where a review processes personal data, collection should be adequate, relevant and limited to what is necessary for the stated purpose. Names and individual profiles are often unnecessary unless they are directly relevant to the authorised business question. Findings should focus on organisational patterns and the practical competitive significance of the information.", sourceIds: ["gdpr-article-5"] },
        ],
      },
      {
        heading: "Prioritise combinations, not isolated curiosities",
        paragraphs: [
          "A useful audit ranks findings by how easily they can be discovered, how credible they are, what other sources strengthen them and what business decision they might inform. A technical term in one vacancy may be low risk. The same term repeated across a facility announcement, supplier reference and conference presentation may reveal a strategic programme.",
          { text: "Remediation should also be proportionate. Removing every technical detail can damage recruitment and sales. Better controls include clear publishing ownership, pre-publication review for sensitive programmes, periodic searches for stale documents, and guidance for staff who share workplace imagery.", sourceIds: ["ncsc-social-publishing", "ncsc-sharing-online", "npsa-security-minded-communications"] },
        ],
      },
      {
        heading: "Build a repeatable review process",
        paragraphs: [
          "Start by defining what must be protected: launch timing, production constraints, supplier relationships, process choices or customer programmes. Map the public channels most likely to mention them. Review current and archived material, then test how separate disclosures combine. Record the source, exposure, likely audience and recommended action.",
          "The goal is not secrecy for its own sake. It is deliberate disclosure. Industrial companies can communicate credibly while reducing avoidable competitive signals, provided they understand the cumulative picture visible from outside.",
        ],
      },
    ],
  },
] as const;

export const insights: readonly Insight[] = [
  ...industrialInsights.filter((insight) => insight.locale === "en"),
  ...originalInsights,
];

export function getInsight(slug: string) {
  return insights.find((insight) => insight.slug === slug);
}

