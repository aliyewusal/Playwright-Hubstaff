require('dotenv').config();
import { test, expect } from '@playwright/test';

test('Add/create project', async ({ page }) => {
    await page.goto('https://app.hubstaff.com/projects');

    // Sign in
    await page.getByRole('textbox', { name: 'Work email *' }).fill(`${process.env.EMAIL}`);
    await page.getByRole('textbox', { name: 'Password *' }).fill(`${process.env.PASSWORD}`);
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Ceate a new project
    await page.locator('[data-original-title="Add new project to the organization"]').click();
    await expect(page.getByRole('heading', { name: 'New project' })).toBeVisible();
    const projectName = `Test Project ${Date.now()}`;
    await page.getByRole('textbox', { name: 'Add project names separated' }).fill(projectName);
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify that the Project is created
    await expect(page.getByText('Project created')).toBeVisible();
    await expect(page.getByText(projectName)).toBeVisible();
});