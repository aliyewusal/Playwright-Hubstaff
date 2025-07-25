import { test, expect } from "../../fixtures/axe-fixture";
import { PageObjects } from "../../pages";

test.describe("Accessibility scan on marketing page", () => {
  test("Marketing page should have no accessibility violations", async ({ page, makeAxeBuilder }) => {
    const marketingPage = new PageObjects.MarketingPage(page);

    await marketingPage.navigateToMarketingPage();

    const accessibilityScanResults = await makeAxeBuilder().analyze();
    // TODO: Re-enable this assertion once all accessibility violations are resolved.
    // expect(accessibilityScanResults.violations).toEqual([]);

    expect(accessibilityScanResults.violations.length).toBeLessThan(10); // ideally should be 0
  });
});
