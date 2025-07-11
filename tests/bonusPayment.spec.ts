import { test, expect } from "@playwright/test";
import { PageObjects } from "../pages";

test.describe("Bonus Payment Creation", () => {
  let paymentLink: string;
  const organizationId = "678373";
  const bonusAmount = "100.00";
  const noteText = "This is a bonus payment test: " + Date.now();

  // Use the owner authentication state for this test to bypass the login step
  test.use({ storageState: "playwright/.auth/owner.json" });

  test("Create a one-time bonus payment for a team member", async ({ page }) => {
    const paymentsPage = new PageObjects.TeamPaymentsPage(page);

    // Navigate to the team payments page for the specified organization
    await paymentsPage.navigateToTeamPaymentsByOrg(organizationId);

    // Create a one-time bonus payment
    await paymentsPage.openOneTimeAmountTab();
    await paymentsPage.selectMemberByName("Vusal Test User");
    await paymentsPage.enterAmountPerMember(bonusAmount);
    await paymentsPage.enterNote(noteText);
    await paymentsPage.clickCreatePaymentButton();

    // Verify the payment summary details
    await paymentsPage.verifyPaymentSummary();

    // Click the "Create payment" button in the modal
    await paymentsPage.clickCreatePaymentModalButton();

    // Verify the second modal body is visible
    await paymentsPage.verifyModalBody("second");

    // Click the "Not now" button to close the modal
    await paymentsPage.clickNotNowButton();

    // Verify the payment summary is displayed correctly
    await expect(paymentsPage.selectors.cellByText("Vusal Test User")).toBeVisible();

    // Save the link for later use
    paymentLink = page.url();
  });

  test.afterEach(async ({ page }) => {
    const paymentsPage = new PageObjects.TeamPaymentsPage(page);

    // Ensure the dialog is accepted to avoid any interruptions
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    // Delete the created payment by note
    await page.goto(paymentLink);
    await paymentsPage.deleteCreatedPaymentByNote(noteText);
  });
});
