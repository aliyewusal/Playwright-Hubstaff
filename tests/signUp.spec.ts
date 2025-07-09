import { test, expect } from '@playwright/test';
import { PageObjects } from '../pages';

test.describe('Hubstaff Free Trial Signup', () => {
  const firstName = 'Test';
  const lastName = 'User';
  let userEmail: string;
  const userPassword = `Password!${Date.now()}`;

  test('Should allow a user to sign up for a 14-day free trial and confirm email', async ({ browser }) => {
    test.setTimeout(90000);

    // Open both pages at the start
    const tempMailPage = await browser.newPage();
    const signupPage = await browser.newPage();

    const mailPage = new PageObjects.TempMailPage(tempMailPage);
    const marketingPage = new PageObjects.MarketingPage(signupPage);


    await test.step('Go to temp-mail and get the email address', async () => {
      await mailPage.navigateToMailPage();
      await mailPage.verifyEmailInputValid();
      userEmail = await mailPage.getEmailAddress();
    });

    await test.step('Go to Hubstaff and start signup in parallel with temp-mail polling', async () => {
      await marketingPage.navigateToMarketingPage();
      await marketingPage.selectors.freeTrialButton.click();
      await expect(signupPage).toHaveURL(/.*signup/);
      await marketingPage.fillSignupForm(firstName, lastName, userEmail, userPassword);
      await marketingPage.selectors.termsCheckbox.click();
      await marketingPage.selectors.createAccountButton.click();
      await expect(marketingPage.selectors.verifyEmailHeading).toBeVisible();
      await expect(signupPage).toHaveURL(/confirmation_sent/);
    });

    await test.step('Wait for the verification email and confirm the account', async () => {
      await mailPage.waitForVerificationEmail();
      await mailPage.selectors.confirmationEmail.click();
      const confirmationLink = await mailPage.getConfirmationLink();
      await tempMailPage.goto(confirmationLink);
      await expect(tempMailPage).toHaveURL(/welcome/);
      await expect(mailPage.selectors.hubstaffWelcomeHeading).toBeVisible();
    });

    await test.step('Verify the user account is created', async () => {
      await marketingPage.clickBackToSignIn();
      await expect(signupPage).toHaveURL(/login/);
      await marketingPage.signInWithEmail(userEmail, userPassword);
      await marketingPage.verifyWelcomeMessage(firstName, lastName);
    });
  });
});
