export const siteConfig = {
  name: "MelonCactus",
  descriptor: "Industrial Intelligence",
  description:
    "Discreet, evidence-based competitive and technical intelligence for industrial and technology companies.",
  coreStatement:
    "Evidence from public sources. Intelligence for technology leaders.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://meloncactus.com",
  businessEmail: "contact@meloncactus.com",
  legalName: "GFNI",
  operatorStatement: "MelonCactus is operated by GFNI.",
  postalAddress: null,
  registrationNumber: null,
  nav: [
    { href: "/services", label: "Services" },
    { href: "/methodology", label: "Methodology" },
    { href: "/sample-report", label: "Sample Report" },
    { href: "/insights", label: "Insights" },
    { href: "/about", label: "About" },
  ],
} as const;

export type ReportOption = {
  name: string;
  formValue?: string;
  price: string;
  summary: string;
  includes: readonly string[];
  featured?: boolean;
};

export const reportOptions: readonly ReportOption[] = [
  {
    name: "Rapid Intelligence Scan",
    price: "€495",
    summary: "A tightly scoped first answer to a defined question.",
    includes: [
      "Focused public-source scan",
      "Key findings and source list",
      "Identified information gaps",
    ],
  },
  {
    name: "Competitor Snapshot",
    price: "€995",
    summary: "A structured company, product or technology profile.",
    includes: [
      "Evidence-backed observations",
      "Capabilities and market signals",
      "Risks and strategic questions",
    ],
  },
  {
    name: "Technical Deep Dive",
    price: "€1,995",
    summary: "Detailed analysis across several technical evidence types.",
    includes: [
      "Facility, product, process or ecosystem analysis",
      "Multiple source types",
      "Evidence appendix and confidence assessment",
    ],
    featured: true,
  },
  {
    name: "Strategic Intelligence Report",
    price: "€3,995",
    summary: "A broad, decision-oriented investigation.",
    includes: [
      "Multiple companies, markets or evidence streams",
      "Executive conclusions and detailed findings",
      "Evidence trail and strategic implications",
    ],
  },
] as const;

export const confidenceLevels = [
  {
    level: "Confirmed",
    description:
      "Directly supported by a strong primary source or multiple independent sources.",
  },
  {
    level: "High confidence",
    description: "Supported by consistent evidence, with limited uncertainty.",
  },
  {
    level: "Moderate confidence",
    description: "Plausible and evidence-supported, but incomplete.",
  },
  {
    level: "Indicative",
    description: "A useful signal that requires further verification.",
  },
  {
    level: "Unknown",
    description: "Insufficient reliable evidence for an assessment.",
  },
] as const;
