import { test, expect } from "@playwright/test";
import { PageObjects } from "../../pages";
import "dotenv/config";

test.slow();
test("Sign in from marketing page navigation bar", async ({ page }) => {
  const marketingPage = new PageObjects.MarketingPage(page);
  const signInPage = new PageObjects.SignInPage(page);
  const insightsPage = new PageObjects.InsightsPage(page);
  const dashboardPage = new PageObjects.DashboardPage(page);

  // Navigate to the marketing page and click the sign-in link
  await marketingPage.navigateToMarketingPage();
  await marketingPage.selectors.signInLink.click();
  await expect(page).toHaveURL(/login/);

  // Sign in using the credentials from environment variables
  await signInPage.signIn(process.env.EMAIL!, process.env.PASSWORD!);
  await expect(page).toHaveURL(/insights/);

  // Verify the login was successful by checking the landing page
  await insightsPage.verifyHighlightsHeaderVisible();
  // Note: After login, user should have been redirected to Dashboard page (as per requirements)
  await dashboardPage.selectors.dashboardLink.click();
  await expect(page).toHaveURL(/dashboard/);
  await dashboardPage.verifyDashboardHeaderVisible();
});
