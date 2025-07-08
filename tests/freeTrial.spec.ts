import { test, expect } from '@playwright/test';

test.describe('Hubstaff Free Trial Signup', () => {
  const firstName = 'Test';
  const lastName = 'User';
  let userEmail: string;
  const userPassword = `Password!${Date.now()}`;

  test('Should allow a user to sign up for a 14-day free trial and confirm email', async ({ browser }) => {
    test.setTimeout(90000);//

    // Open both pages at the start
    const tempMailPage = await browser.newPage();
    const signupPage = await browser.newPage();

    await test.step('Go to temp-mail and get the email address', async () => {
      await tempMailPage.goto('https://tempmailo.co/');
      await tempMailPage.waitForSelector('#mail');
      await expect(tempMailPage.locator('#mail')).toHaveValue(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/);
      userEmail = await tempMailPage.locator('#mail').inputValue();
    });

    await test.step('Go to Hubstaff and start signup in parallel with temp-mail polling', async () => {
      await signupPage.goto('https://hubstaff.com/');
      await signupPage.getByRole('link', { name: 'Free 14-day trial' }).first().click();
      await expect(signupPage).toHaveURL(/.*signup/);
      await signupPage.getByTestId('first_name').pressSequentially(firstName);
      await signupPage.getByTestId('last_name').pressSequentially(lastName);
      await signupPage.getByTestId('email').pressSequentially(userEmail);
      await signupPage.getByTestId('password').pressSequentially(userPassword);
      await signupPage.getByRole('button', { name: 'OK' }).click();
      await signupPage.locator('label').filter({ hasText: 'I agree to the Terms, Privacy' }).locator('div').first().click();
      await signupPage.getByRole('button', { name: 'Create my account' }).click();
      await expect(signupPage.getByRole('heading', { name: 'Verify your email' })).toBeVisible();
      await expect(signupPage).toHaveURL(/confirmation_sent/);
    });

    await test.step('Wait for the verification email and confirm the account', async () => {
      // Reload the page until the verification email appears (max 60 seconds)
      const maxAttempts = 20;
      const delayMs = 3000;
      let found = false;
      for (let i = 0; i < maxAttempts; i++) {
        await tempMailPage.reload();
        try {
          await tempMailPage.getByText('Confirm your Hubstaff account').waitFor({ state: 'visible', timeout: 2000 });
          found = true;
          break;
        } catch {
          // Not found, wait and try again
          await tempMailPage.waitForTimeout(delayMs);
        }
      }
      if (!found) throw new Error("Verification email did not arrive in time");

      await tempMailPage.getByText('Confirm your Hubstaff account').click();
      const mailContent = await tempMailPage.getByText('Your more productive future').textContent();
      if (!mailContent) throw new Error('Mail content not found');
      const confirmationLinkMatch = mailContent.match(/Confirm account:\s*(https?:\/\/\S+)/);
      if (!confirmationLinkMatch) throw new Error('Confirmation link not found in mail content');
      const confirmationLink = confirmationLinkMatch[1];
      await tempMailPage.goto(confirmationLink);

      await expect(tempMailPage).toHaveURL(/welcome/);
      await expect(tempMailPage.getByRole('heading', { name: 'Welcome to Hubstaff!' })).toBeVisible();
    });

    await test.step('Verify the user account is created', async () => {
      await signupPage.getByRole('link', { name: 'Back to sign in' }).click();
      await expect(signupPage).toHaveURL(/login/);

      await signupPage.getByRole('textbox', { name: 'Work email *' }).pressSequentially(userEmail);

      await signupPage.getByRole('textbox', { name: 'Password *' }).pressSequentially(userPassword);

      await signupPage.getByRole('button', { name: 'Sign in' }).click();

      await expect(signupPage.getByText(`Welcome, ${firstName} ${lastName}`)).toBeVisible();
    });
  });
});
