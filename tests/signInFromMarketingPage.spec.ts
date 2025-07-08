require('dotenv').config();
import { test, expect } from '@playwright/test';

test('Sign in from marketing page nagivation bar', async ({ page }) => {
    await page.goto('https://hubstaff.com/');
  
    // Click on the "Sign in" link in the navigation bar
    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/login/);
    // Click the "Work email" field and type a valid email address
    await page.getByRole('textbox', { name: 'Work email *' }).fill(`${process.env.EMAIL}`);
    // Click the "Password" field and type a valid password
    await page.getByRole('textbox', { name: 'Password *' }).fill(`${process.env.PASSWORD}`);
    // Click the "Sign in" button
    await page.getByRole('button', { name: 'Sign in' }).click();
    // Verify that the user is signed in successfully (atm it is navigating to the insights page, should be dashboard)
    // /insights/ is part of the URL after successful login
    await expect(page).toHaveURL(/insights/);
    // "Highlights" heading is visible on the dashboard page
    await expect(page.locator('#insights-sticky-header').getByText('Highlights')).toBeVisible();

    // Click on the "Dashboard" link in the Left hand side navigation menu
    await page.getByRole('menuitem', { name: 'dashboard Dashboard' }).click();

    // Verify that the URL changes to the dashboard page
    await expect(page).toHaveURL(/dashboard/);
    // Verify Dashboard heading is visible
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
