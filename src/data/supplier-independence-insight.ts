import type { ArticleVisual } from "@/data/article-visuals";
import { articleSources } from "@/data/article-sources";
import type { Insight } from "@/data/insights";

const supplierIndependenceVisual: ArticleVisual = {
  width: 1200,
  height: 760,
  mobileWidth: 760,
  mobileHeight: 1100,
  src: "/article-visuals/supplier-independence-check-en.svg",
  mobileSrc: "/article-visuals/supplier-independence-check-en-mobile.svg",
  alt: "Decision framework that separates the brand on a laser-cutting quotation from the contracting company, ownership group, service provider and parts route before judging supplier independence.",
  title: "A second brand is not automatically a second supply route",
  caption: "Map each offer from brand to legal counterparty, ownership, service and parts. Then identify the unresolved question that could change the shortlist.",
  explanationLabel: "Supplier-independence framework explained in text",
  details: [
    { label: "Identity", text: "Record the quoted brand, contracting legal entity and dated ownership evidence as separate fields." },
    { label: "Operations", text: "Verify who provides local service, warranty decisions and critical parts instead of inferring them from the logo." },
    { label: "Decision", text: "Keep one open question visible when its answer could remove an option, change ranking or require a contingency." },
  ],
  afterSectionIndex: 3,
};

export const supplierIndependenceInsightEn: Insight = {
  slug: "laser-cutting-supplier-independence-check",
  title: "Two brands, one supplier group? How to verify laser-cutting supplier independence",
  description: "A practical supplier due-diligence guide for separating brand, legal entity, ownership, service and parts before choosing a laser-cutting system.",
  date: "2026-11-11",
  displayDate: "11 November 2026",
  visual: supplierIndependenceVisual,
  sources: [
    articleSources.trumpfCutliteClosing,
    articleSources.elenCutliteAgreement,
    articleSources.euBusinessRegisters,
  ],
  sections: [
    {
      heading: "Do not count logos; map supply routes",
      paragraphs: [
        "A shortlist with two machine brands can look diversified while still depending on the same corporate group, service organisation or critical-parts route. The opposite can also be true: two brands in one group may have different contracting companies, technicians and stocked parts. Supplier independence is therefore not a label that can be read from a logo. It is a decision question that must be defined.",
        "For a laser-cutting investment, begin with the consequence you are trying to avoid. Is the concern commercial leverage, continuity after a service interruption, access to different technology, or the ability to source critical parts from a genuinely separate route? Each objective requires different evidence. A group-ownership finding may change a negotiation strategy without automatically disqualifying either offer.",
        { text: "A current transaction illustrates why brand and group cannot be treated as the same field. On 6 November 2026, TRUMPF announced that it had completed the acquisition of the Cutlite business, that Cutlite had become part of the TRUMPF Group and that the Cutlite brand would remain. The same release states intentions for closer integration with TRUMPF lasers, the global supply chain and service offerings. These are dated company statements about the transaction and planned direction; they do not establish the contractual or service arrangements in a particular customer quotation.", sourceIds: ["trumpf-cutlite-closing-2026"] },
      ],
    },
    {
      heading: "Separate five meanings of independence",
      paragraphs: [
        "The word independent is too broad for a procurement record. Replace it with five explicit tests. Legal independence asks who signs the contract. Ownership independence asks who controls the entities on the evidence date. Commercial independence asks whether pricing and account decisions are made separately. Service independence asks whether different people, stock and escalation paths support the machines. Technical independence asks whether the systems rely on different architectures, software, laser sources or proprietary parts.",
        "These tests can produce different answers. A local distributor may be a separate legal entity but depend entirely on one manufacturer for warranty approval and spares. A brand owned by a larger group may retain a local service team and product architecture. Neither conclusion should be assumed from marketing language alone.",
      ],
      table: {
        caption: "Define the form of independence that matters to the decision",
        headers: ["Question", "Evidence to seek", "Decision it can affect"],
        rows: [
          ["Who signs and invoices?", "Full legal name, registration number and quotation terms", "Contract risk, jurisdiction and recourse"],
          ["Who ultimately controls the supplier?", "Dated register extract and transaction disclosures", "Group concentration and negotiation strategy"],
          ["Who sets price and approves exceptions?", "Written commercial response and account contacts", "Whether offers provide separate commercial tension"],
          ["Who services the installed machine?", "Named service entity, locations, response terms and escalation path", "Operational continuity and downtime exposure"],
          ["Who supplies critical parts and software?", "Parts list, stock location, licences and obsolescence route", "Recovery options and long-term dependency"],
        ],
      },
    },
    {
      heading: "Use dated ownership evidence, not an old organisation chart",
      paragraphs: [
        { text: "The August 2026 seller announcement shows why transaction stage and evidence date matter. El.En. described a binding agreement for TRUMPF to purchase an initial 80% interest in a newly incorporated company holding the Cutlite Penta business unit, while El.En. would retain 20% for three years. At that point, completion was still subject to conditions. The later TRUMPF closing announcement changes the status from agreed transaction to reported completion. A supplier record should preserve both dates rather than silently replacing the earlier stage.", sourceIds: ["elen-cutlite-agreement-2026"] },
        "For the current legal entity, use the register relevant to its jurisdiction and retain the registration number, extraction date and document type. Names alone can be ambiguous, translated differently or shared by related companies. The company named in a press release may also differ from the entity that issues the offer.",
        { text: "The European e-Justice Portal explains that European business registers make core company information available, including legal form, registered office, capital and legal representatives, although services and documents vary by country. Register data can confirm an entity and certain filed relationships; it does not by itself prove who will answer a service call or hold a particular spare part.", sourceIds: ["eu-ejustice-business-registers"] },
      ],
    },
    {
      heading: "Work through one fictional quotation comparison",
      paragraphs: [
        "The following example is fictional. It does not describe a MelonCactus client, an actual tender or a measured result. A sheet-metal company is comparing two large-format laser systems. Offer A carries the brand Northbeam. Offer B carries the brand Rivet Laser. The brochures look different and the prices come from different sales contacts.",
        "The procurement team does not record either option as independent yet. It creates a dated comparison sheet and copies exact names from the quotations. Public register and company material suggest that the two contracting entities are controlled by the same parent group. Offer A names a service company in Germany; Offer B refers only to 'local group service'. Neither offer identifies where the high-power laser source and control components would be stocked after warranty.",
      ],
      table: {
        caption: "Fictional comparison sheet: separate what is known from what must be asked",
        headers: ["Field", "Offer A · Northbeam", "Offer B · Rivet Laser", "Status on 11 Nov 2026"],
        rows: [
          ["Brand", "Northbeam", "Rivet Laser", "Directly shown on each offer"],
          ["Contracting party", "Northbeam Systems GmbH", "Rivet Laser Italia S.r.l.", "Fictional names copied from the offers"],
          ["Ultimate group", "Orion Industrial Group", "Orion Industrial Group", "Fictional public-source assessment; current control still needs a dated extract"],
          ["Service party", "Northbeam Service GmbH", "Described only as local group service", "Offer B is incomplete"],
          ["Critical parts route", "Not stated", "Not stated", "Open for both offers"],
          ["Evidence date", "11 Nov 2026", "11 Nov 2026", "Refresh before contract signature"],
        ],
      },
    },
    {
      heading: "Make the open question capable of changing the shortlist",
      paragraphs: [
        "A due-diligence sheet becomes useful when it states which unanswered question could change the decision. In the fictional example, the decisive question is not simply whether both brands share a parent. It is: if the shared group service network or central parts route is unavailable, what separately contracted service capacity and critical-parts stock remains for each machine at the buyer's location?",
        "If both offers depend on the same escalation desk, warehouse and software entitlement, the buyer may keep one offer for technical comparison but stop treating the pair as a continuity hedge. If the service contracts, technicians and parts stock are demonstrably separate, common ownership may matter more to commercial leverage than operational recovery. If the answer remains vague, the uncertainty belongs in the shortlist rather than in a footnote after selection.",
      ],
      table: {
        caption: "Translate the answer into a shortlist action",
        headers: ["Verified answer", "Possible shortlist action", "What not to conclude"],
        rows: [
          ["Same group, same service and parts route", "Treat continuity as concentrated and seek another route or a stronger contingency", "Do not assume either machine is technically unsuitable"],
          ["Same group, demonstrably separate local support", "Keep both options but assess commercial concentration separately", "Do not call the routes fully independent without defining the criterion"],
          ["Ownership clear, service or parts unknown", "Keep the question open and require written clarification before award", "Do not fill the gap with distributor or brand assumptions"],
          ["Different owners and different support routes", "Record greater diversification, then continue normal technical qualification", "Do not treat corporate separation as proof of performance or capacity"],
        ],
      },
    },
    {
      heading: "Verify service and parts at the level of the quotation",
      paragraphs: [
        "Public-source research can identify the entities and relationships that deserve attention. The offer and contract must answer the operational questions. Ask for the legal name of the service provider, technician location, response-time definition, escalation path, warranty decision-maker and the location and ownership of critical stock. Record whether the answer is contractual, written but non-binding, or only verbal.",
        "For parts, focus on the components that could stop production rather than requesting an indiscriminate inventory. The relevant list might include the laser source, control hardware, safety modules, motion components, optics and proprietary software licences. Ask what is held locally, what is shared across brands and what lead-time promise is binding. A group supply chain can be an advantage, a concentration risk, or both; the evidence should support the decision instead of forcing one narrative.",
      ],
      bullets: [
        "Copy the full legal entity and registration number from each quotation",
        "Date every ownership source and preserve the transaction stage it describes",
        "Name the service and warranty decision-makers for the buyer's territory",
        "Identify the critical parts route and the contractually supported fallback",
        "State the one unresolved question that could change ranking or selection",
      ],
    },
    {
      heading: "Keep the evidence boundary visible",
      paragraphs: [
        "Company announcements are primary evidence of what the companies report about a transaction. Registers can support legal identity and filed relationships. Quotations and contracts define the proposed commercial arrangement. None of these sources independently proves machine performance, service quality, parts availability during a future incident or the supplier's financial resilience.",
        "The final record should therefore distinguish four things: verified identity, assessed group relationship, written operational commitment and remaining unknowns. That structure prevents a familiar brand from being mistaken for a contracting party and prevents common ownership from being mistaken for identical operations.",
        "Supplier due diligence does not need to produce a universal verdict on independence. It needs to show whether the available options reduce the specific dependency that matters to the investment decision—and which dated evidence supports that conclusion.",
      ],
    },
  ],
};
