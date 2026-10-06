import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { insights } from "@/data/insights";
import { insightsNl } from "@/data/insights-nl";
import { articleSummary } from "@/data/article-summaries";
import { breadcrumbSchema, entityGraph, entityIds, serviceSchema, socialImageUrl } from "./seo";

describe("SEO identity and content", () => {
  it("uses one operator-backed organization entity, not a fictitious second company", () => {
    const graph = entityGraph()["@graph"];
    expect(graph).toHaveLength(2);
    const organization = graph[0];
    expect(organization["@id"]).toBe(entityIds.organization);
    expect(organization.name).toBe("MelonCactus");
    expect(organization.legalName).toBe("GFNI");
    expect(organization.email).toBe(siteConfig.businessEmail);
    expect(organization.sameAs).toEqual([siteConfig.linkedInCompanyUrl]);
  });

  it("gives all articles a three-sentence summary in their own language", () => {
    for (const article of insights) expect(articleSummary("en", article.slug).match(/[.!?](?:\s|$)/g)).toHaveLength(3);
    for (const article of insightsNl) expect(articleSummary("nl", article.slug).match(/[.!?](?:\s|$)/g)).toHaveLength(3);
  });

  it("marks the fixed scan fee excluding VAT and omits a numeric price for variable-fee work", () => {
    const scan = serviceSchema({ path: "/services/public-profile-exposure-scan", name: "Scan", description: "Own profile", locale: "en", price: 499, priceNote: "Fixed fee excluding VAT" });
    expect(scan.offers.price).toBe(499);
    expect(scan.offers.priceSpecification?.valueAddedTaxIncluded).toBe(false);
    const assessment = serviceSchema({ path: "/services/focused-intelligence-assessment", name: "Assessment", description: "Defined question", locale: "en", priceNote: "From €995, scope dependent" });
    expect(assessment.offers).not.toHaveProperty("price");
  });

  it("uses canonical absolute URLs for breadcrumbs and social images", () => {
    const breadcrumb = breadcrumbSchema("nl", [{ name: "Dienst", path: "/nl/diensten" }]);
    expect(breadcrumb.itemListElement.map((item) => item.item)).toEqual(["https://meloncactus.com/nl", "https://meloncactus.com/nl/diensten"]);
    expect(socialImageUrl("en", "article", "example")).toBe("https://meloncactus.com/social/en/article/example");
  });
});
