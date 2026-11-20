import type { ArticleVisual } from "@/data/article-visuals";
import { articleSources } from "@/data/article-sources";
import type { Insight } from "@/data/insights";

const metalAmBatchVisual: ArticleVisual = {
  width: 1200,
  height: 760,
  mobileWidth: 760,
  mobileHeight: 1100,
  src: "/article-visuals/metal-am-whole-batch-evidence-en.svg",
  mobileSrc: "/article-visuals/metal-am-whole-batch-evidence-en-mobile.svg",
  alt: "Decision chain for a fictional order of sixty accepted metal additive-manufacturing parts, showing printing, post-processing, inspection and replacement responsibility before delivery.",
  title: "The quoted batch ends at acceptance, not at the printer",
  caption: "Compare the same part definition, quantity and acceptance method across every offer. Then record who owns each downstream step and how shortfalls are replaced.",
  explanationLabel: "Whole-batch supplier comparison explained in text",
  details: [
    { label: "Comparable input", text: "Give every supplier the same drawing revision, alloy, quantity, inspection scope and required delivery point." },
    { label: "Complete route", text: "Map printing, support removal, thermal treatment, machining, finishing and inspection to a named responsible party." },
    { label: "Accepted output", text: "Ask what evidence supports delivery of the full accepted quantity and what happens when inspection leaves the batch short." },
  ],
  afterSectionIndex: 3,
};

export const metalAmBatchSupplierInsightEn: Insight = {
  slug: "metal-am-supplier-whole-batch-evidence",
  title: "What proves a metal AM supplier can deliver the whole batch?",
  description: "A practical supplier-comparison framework for testing accepted quantity, post-processing responsibility, inspection evidence and replacement lead time in a metal AM quotation.",
  date: "2026-11-20",
  displayDate: "20 November 2026",
  visual: metalAmBatchVisual,
  sources: [
    articleSources.formnext2026ProcessChain,
    articleSources.iso52901PurchasedAmParts,
    articleSources.iso52920AmProductionSites,
  ],
  sections: [
    {
      heading: "Define the batch at the delivery point",
      paragraphs: [
        "A supplier may be able to start sixty metal parts without being able to deliver sixty accepted parts on the required date. Supports still need to be removed. Thermal treatment, machining and finishing may change dimensions or surface condition. Inspection can reject parts, and a replacement build can move the delivery date. The useful procurement question is therefore not how many parts fit on a build plate. It is how many conforming parts reach the agreed delivery point after the entire route.",
        { text: "Formnext's 2026 programme illustrates why the downstream route belongs in the comparison. Its official material describes an additive value chain that includes post-processing and quality assurance, and its dedicated showcase presents raw AM parts becoming functional end products through machining, finishing, quality-assurance and measurement steps. This establishes process-chain context; it does not verify the capability, yield or lead time of any exhibitor or supplier.", sourceIds: ["formnext-2026-process-chain"] },
        "Write the required output in one sentence before requesting quotations: quantity accepted, part definition, delivery location and acceptance method. If an offer quotes printed quantity, shipped quantity or expected yield instead, mark the difference rather than treating the numbers as equivalent.",
      ],
    },
    {
      heading: "Give every supplier the same purchasing baseline",
      paragraphs: [
        { text: "ISO/ASTM 52901:2017 provides a useful public checklist for the information exchanged when purchasing AM parts. Its abstract names customer order information, part-definition data, feedstock requirements, final part characteristics and properties, inspection requirements and acceptance methods. The standard can structure a request, but its existence does not show that a particular supplier follows it or can meet a particular order.", sourceIds: ["iso-astm-52901-purchased-am-parts"] },
        "A quotation comparison becomes unreliable when suppliers price different jobs. Send the same geometry and drawing revision, the same alloy or feedstock requirement, the same total accepted quantity, the same surface and dimensional requirements, and the same inspection scope. State whether test coupons, certificates, inspection reports, packaging and transport belong inside the quotation. Record every proposed deviation as a separate line.",
      ],
      table: {
        caption: "Minimum baseline for comparable metal AM quotations",
        headers: ["Field", "Hold constant across offers", "Why it matters"],
        rows: [
          ["Part definition", "Same model, drawing revision and critical characteristics", "Prevents a simplified geometry from appearing cheaper or faster"],
          ["Material", "Same alloy, feedstock condition and required traceability", "Avoids comparing different material routes"],
          ["Quantity", "Same number of accepted parts", "Separates build starts from deliverable output"],
          ["Downstream work", "Same thermal, machining, finishing and cleaning scope", "Makes the complete route visible"],
          ["Acceptance", "Same inspection, records and decision authority", "Makes quoted completion testable"],
          ["Delivery", "Same place, packaging and required date", "Prevents logistics from hiding in later assumptions"],
        ],
      },
    },
    {
      heading: "Map responsibility across the complete route",
      paragraphs: [
        "For every step, name the legal entity or subcontractor that performs the work, the point at which responsibility transfers and the lead time included in the offer. A supplier can manage subcontractors effectively, but the buyer still needs to know whether the quoted schedule includes their capacity, transport and rework loops. A statement such as post-processing included is not enough when several operations and acceptance decisions sit behind it.",
        { text: "ISO/ASTM 52920:2023 specifies criteria, quality-relevant characteristics and activities along industrial AM production-site operations. Its public abstract frames quality assurance across the manufacturing process and adds AM-specific requirements to a quality-management system. That is a basis for asking how a site controls the route; it is not evidence that an unnamed site is qualified, audited or suitable for the fictional order below.", sourceIds: ["iso-astm-52920-production-sites"] },
      ],
      table: {
        caption: "Responsibility map to request with each quotation",
        headers: ["Step", "Evidence to request", "Commercial question"],
        rows: [
          ["Data review and build preparation", "Approved revision and recorded build release", "Who can stop a build when data are incomplete?"],
          ["Printing", "Machine route, material traceability and build record", "Is capacity reserved or only estimated?"],
          ["Support removal and thermal treatment", "Named processor, route and completion record", "Are subcontractor queues inside the lead time?"],
          ["Machining and finishing", "Defined surfaces, allowances and inspection hand-off", "Who replaces a part damaged downstream?"],
          ["Final inspection", "Method, sampling or full coverage, report and acceptance authority", "What exactly releases the batch for shipment?"],
          ["Shortfall and replacement", "Written trigger, cost owner and replacement schedule", "When does the delivery clock change?"],
        ],
      },
    },
    {
      heading: "Ask for evidence of a repeated series, not a generic capability claim",
      paragraphs: [
        "A machine list shows available equipment. A successful prototype shows that one part was made under particular conditions. Neither alone establishes that a supplier can repeat the complete route for the requested batch. Ask for evidence that resembles the decision: repeated production with comparable material, process family, geometry difficulty, downstream steps and inspection burden.",
        "The supplier may need to protect customer confidentiality. Useful evidence can still be provided without disclosing another customer's drawing: dated and anonymised batch sizes, accepted quantities, causes of shortfall, rework or replacement route, inspection coverage and whether the same machine, material lot strategy and downstream partners were used. Record whether each item is a documented result, a supplier statement, a forecast or still unknown.",
      ],
      bullets: [
        "Separate prototype evidence from repeated-series evidence",
        "Ask for accepted quantity after all agreed processing and inspection",
        "Record the date, process family and limits of every example",
        "Do not treat certificates as proof of available capacity or future yield",
        "Keep confidential customer details outside the request unless lawfully authorised",
      ],
    },
    {
      heading: "Compare three fictional quotations on one basis",
      paragraphs: [
        "The following example is entirely fictional. It does not describe a MelonCactus client, a real tender, a supplier's performance or a measured result. A manufacturer requests sixty accepted 316L stainless-steel sensor brackets to one drawing revision. The same dimensional checks, surface requirement, material records and delivery point apply to every offer.",
        "The comparison does not select a winner. It exposes which offer is decision-ready and which questions can change price, schedule or continuity. Names, quantities, lead times and evidence descriptions are invented solely to demonstrate the method.",
      ],
      table: {
        caption: "Fictional quotation comparison for sixty accepted brackets",
        headers: ["Field", "Alder AM", "ForgeLayer", "Vector Powder"],
        rows: [
          ["Quoted output", "60 printed parts", "60 accepted parts", "60 shipped parts"],
          ["Post-processing", "External; providers not named", "Named thermal and machining partners", "Included; responsibility split not stated"],
          ["Inspection", "Dimensional report optional", "Agreed inspection and report included", "Final inspection included; method incomplete"],
          ["Quoted lead time", "6 weeks to printed parts", "9 weeks to accepted batch", "7 weeks to shipment"],
          ["Repeated-series evidence", "One prototype example", "Three anonymised comparable batches, supplier-reported", "Machine-capacity statement only"],
          ["Shortfall route", "New quote required", "Replacement within stated contingency window", "Not stated"],
          ["Decision status", "Not comparable yet", "Commercial terms still require verification", "Acceptance and replacement questions open"],
        ],
      },
    },
    {
      heading: "Test the accepted-quantity arithmetic",
      paragraphs: [
        "Expected yield is planning information, not a delivery commitment. Suppose the fictional supplier plans to start sixty-six parts to deliver sixty accepted parts. If five fail the agreed inspection, sixty-one remain and the quantity can still be met. If seven fail, only fifty-nine remain and the batch is short. A statement that expected yield is about ninety per cent does not say who funds the extra starts, whether machine capacity is reserved for replacements or when the missing part will arrive.",
        "Ask the supplier to connect quantity, contingency and time. The quotation should state whether the price covers the agreed accepted quantity, what evidence releases each part, how nonconforming parts are handled, and whether the replacement route is included in the promised date. Do not convert a planning assumption into a guarantee that the supplier has not made.",
      ],
      table: {
        caption: "Fictional quantity check: sixty accepted parts required",
        headers: ["Planned starts", "Rejected after full route", "Accepted output", "Result"],
        rows: [
          ["66", "5", "61", "Quantity met, subject to the agreed acceptance record"],
          ["66", "6", "60", "Quantity met with no remaining contingency"],
          ["66", "7", "59", "Batch short; replacement responsibility and time become decisive"],
        ],
      },
    },
    {
      heading: "Use a decision gate before award",
      paragraphs: [
        "A supplier does not need to disclose every internal process parameter to make an offer decision-ready. The buyer does need a coherent commitment: the same part baseline, a named route, the accepted quantity, an inspection and acceptance method, the evidence supplied at delivery, and a treatment for shortfalls. Unknowns can remain, but they must be visible and assigned to a verification step before award.",
        "Keep public-source research in its proper role. It can test company identity, visible facilities, published capabilities, partnerships and dated claims. It cannot establish reserved capacity, confidential yield, contractual responsibility or future acceptance. Those points require direct supplier evidence and written commercial terms.",
      ],
      table: {
        caption: "Whole-batch evidence gate",
        headers: ["Gate", "Proceed when", "Hold when"],
        rows: [
          ["Comparable requirement", "All offers use the same accepted-part baseline", "Quantity or acceptance basis differs"],
          ["Complete route", "Each downstream step and owner is named", "Post-processing is a single undefined line"],
          ["Repeated evidence", "A comparable series is documented with limits", "Only a prototype or machine claim is shown"],
          ["Shortfall control", "Cost, responsibility and replacement time are written", "A failed part reopens price or schedule"],
          ["Acceptance", "Method, records and authority are agreed", "Shipment is treated as acceptance"],
        ],
      },
    },
    {
      heading: "Send one focused clarification request",
      paragraphs: [
        "Do not ask each supplier a different sequence of informal questions. Send one clarification sheet tied to the quotation number and revision. Request the accepted quantity, complete process route, responsible entities, included inspection, repeated-series evidence, contingency quantity and replacement rule. Give suppliers room to state a justified alternative rather than forcing unsupported yes-or-no answers.",
        "The resulting record should help procurement decide whether offers are comparable, which uncertainty is material and what must enter the contract or qualification plan. It is not an engineering approval, site audit or certification. The objective is narrower: prevent a plausible printing claim from being mistaken for evidence that the whole accepted batch will arrive.",
      ],
      bullets: [
        "Which quantity is guaranteed: printed, shipped or accepted?",
        "Which company performs each post-processing and inspection step?",
        "What comparable repeated-series evidence can be shared and with what limits?",
        "Which records accompany the delivered batch?",
        "Who bears cost and schedule when the accepted quantity is short?",
        "What must be verified directly before award?",
      ],
    },
  ],
};
