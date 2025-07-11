import { Page, Locator, expect } from "@playwright/test";

export default class DashboardPage {
  readonly page: Page;
  selectors: { [key: string]: Locator | any };

  constructor(page: Page) {
    this.page = page;
    this.selectors = {
      dashboardHeader: page.getByRole("heading", { name: "Dashboard" }),
      dashboardLink: page.getByRole("menuitem", { name: "dashboard Dashboard" }),
    };
  }

  async verifyDashboardHeaderVisible() {
    await expect(this.selectors.dashboardHeader).toBeVisible();
  }
}
