export const siteConfig = {
  name: "MelonCactus",
  descriptor: "Industrial Intelligence",
  description:
    "Discreet, evidence-based competitive and technical intelligence for industrial and technology companies.",
  coreStatement:
    "Evidence from public sources. Intelligence for technology leaders.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://meloncactus.com",
  businessEmail: "contact@meloncactus.com",
  businessPhoneDisplay: "0622328034",
  businessPhoneHref: "tel:+31622328034",
  legalName: "GFNI",
  operatorStatement: "MelonCactus is operated by GFNI.",
  postalAddress: null,
  registrationNumber: "93879695",
  nav: [
    { href: "/services", label: "Services" },
    { href: "/#examples", label: "Examples" },
    { href: "/methodology", label: "Methodology" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/insights", label: "Insights" },
    { href: "/about", label: "About" },
  ],
} as const;

export type ReportOption = {
  name: string;
  formValue?: string;
  price: string;
  priceQualifier: string;
  summary: string;
  bestFor?: string;
  boundary?: string;
  includes: readonly string[];
  featured?: boolean;
};

export const publicProfileScan: ReportOption = {
  name: "Public Profile Exposure Scan",
  price: "€499",
  priceQualifier: "fixed fee",
  summary: "A compact defensive review of what an outside observer may infer from your company-owned public presence.",
  bestFor: "Your own company's public communications.",
  boundary: "No private accounts, penetration testing or external competitor assessment.",
  includes: [
    "One company website and up to two official public channels",
    "Direct observations, cautious inferences and unknowns",
    "Prioritised recommendations for future publications",
  ],
};

export const reportOptions: readonly ReportOption[] = [
  {
    name: "Focused Intelligence Assessment",
    price: "€995",
    priceQualifier: "from",
    summary: "A focused assessment of a defined decision and its most material uncertainties.",
    bestFor: "One defined external intelligence question.",
    boundary: "Not a review of your own public profile or a broad competitor landscape.",
    includes: [
      "Agreed question and evidence boundary",
      "Source-backed findings and limitations",
      "Concise decision-oriented deliverable",
    ],
  },
  {
    name: "Technical & Competitive Intelligence",
    price: "€1,995",
    priceQualifier: "typically from",
    summary: "A deeper investigation of a company, technology or competitive position.",
    bestFor: "A more detailed technical or competitive decision.",
    boundary: "Subjects, sources and depth are set in the written scope; no private-system access.",
    includes: [
      "Multiple relevant source types",
      "Technical and commercial assessment",
      "Traceable evidence and confidence levels",
    ],
    featured: true,
  },
  {
    name: "Strategic Intelligence Engagement",
    price: "€3,995",
    priceQualifier: "from",
    summary: "A broader, decision-led engagement across several evidence streams.",
    bestFor: "A strategic decision with several related questions.",
    boundary: "Workstreams and exclusions are agreed in writing; ongoing monitoring is separate unless scoped.",
    includes: [
      "Agreed research workstreams",
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
