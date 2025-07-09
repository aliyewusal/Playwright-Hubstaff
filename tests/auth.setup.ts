import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { PageObjects } from '../pages';
require('dotenv').config();

const authFile = path.join(__dirname, '../playwright/.auth/owner.json');

setup('authenticate', async ({ page }) => {
    const signInPage = new PageObjects.SignInPage(page);

    // Perform authentication steps. 
    await signInPage.navigateToLoginPage();
    await signInPage.signIn(process.env.EMAIL, process.env.PASSWORD);

    // Wait for the final URL.
    await page.waitForURL('https://account.hubstaff.com/');
    // Verify that the user is on the correct account page.
    await expect(page.getByRole('heading', { name: 'Manage your Hubstaff account' })).toBeVisible();

    // Save the authentication state to a file.
    await page.context().storageState({ path: authFile });
});