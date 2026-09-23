import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PrivacyPage from "@/app/(en)/privacy/page";
import DutchPrivacyPage from "@/app/(nl)/nl/privacy/page";

describe("Web Analytics privacy notices", () => {
  it("describes page-view measurement consistently in both languages", () => {
    const english = renderToStaticMarkup(createElement(PrivacyPage));
    const dutch = renderToStaticMarkup(createElement(DutchPrivacyPage));

    expect(english).toContain("Vercel Web Analytics");
    expect(english).toContain("English and Dutch pages");
    expect(english).toContain("does not use cookies");
    expect(english).toContain("We do not use advertising trackers or behavioural profiling");

    expect(dutch).toContain("Vercel Web Analytics");
    expect(dutch).toContain("Engelse en Nederlandse pagina’s");
    expect(dutch).toContain("gebruikt geen cookies");
    expect(dutch).toContain("geen advertentietrackers of gedragsprofilering");
  });
});
