import { expect, test } from "@playwright/test";
import { PageObjects } from "../../pages";

test.describe("Verify main pages aria snapshots", () => {
  test("Marketing Page should have correct aria snapshot hierarchy", async ({ page }) => {
    const marketingPage = new PageObjects.MarketingPage(page);

    await marketingPage.navigateToMarketingPage();

    await expect(page.locator("body")).toMatchAriaSnapshot({ name: "marketing.aria.yml" });
  });

  test("Sign In Page should have correct aria snapshot hierarchy", async ({ page }) => {
    const loginPage = new PageObjects.SignInPage(page);

    await loginPage.navigateToLoginPage();

    await expect(page.locator("body")).toMatchAriaSnapshot({ name: "login.aria.yml" });
  });
});
