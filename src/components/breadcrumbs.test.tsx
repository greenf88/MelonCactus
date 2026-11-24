import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Breadcrumbs } from "./breadcrumbs";

describe("Breadcrumbs structured data", () => {
  it("marks an English top-level breadcrumb as a complete BreadcrumbList", () => {
    const html = renderToStaticMarkup(<Breadcrumbs items={[{ label: "Services" }]} />).toLowerCase();

    expect(html).toContain('itemtype="https://schema.org/breadcrumblist"');
    expect(html.match(/itemtype="https:\/\/schema.org\/listitem"/g)).toHaveLength(2);
    expect(html).toContain('itemprop="item"');
    expect(html).toContain('href="/"');
    expect(html).toContain('<span itemprop="name">home</span>');
    expect(html).toContain('itemprop="position" content="1"');
    expect(html).toContain('itemprop="position" content="2"');
    expect(html).toContain('aria-current="page" itemprop="name">services</span>');
  });

  it("marks a Dutch nested breadcrumb with linked hierarchy and ordered positions", () => {
    const html = renderToStaticMarkup(<Breadcrumbs locale="nl" items={[
      { label: "Diensten", href: "/nl/diensten" },
      { label: "Openbare-informatiescan" },
    ]} />).toLowerCase();

    expect(html.match(/itemtype="https:\/\/schema.org\/listitem"/g)).toHaveLength(3);
    expect(html).toContain('href="/nl"');
    expect(html).toContain('href="/nl/diensten"');
    expect(html).toContain('itemprop="position" content="3"');
    expect(html).toContain('aria-current="page" itemprop="name">openbare-informatiescan</span>');
  });
});
