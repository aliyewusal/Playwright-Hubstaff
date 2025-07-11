import { Page, Locator, expect } from "@playwright/test";

export default class InsightsPage {
  readonly page: Page;
  selectors: Record<string, Locator | any>;

  constructor(page: Page) {
    this.page = page;
    this.selectors = {
      highlightsHeader: page.locator("#insights-sticky-header").getByText("Highlights"),
    };
  }

  async verifyHighlightsHeaderVisible() {
    await expect(this.selectors.highlightsHeader).toBeVisible({ timeout: 7000 });
  }
}
