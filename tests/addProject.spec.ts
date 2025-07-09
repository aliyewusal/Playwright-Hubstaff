require('dotenv').config();
import { test, expect } from '@playwright/test';
import { PageObjects } from '../pages';

const projectName = `Test Project ${Date.now()}`;

// Use the owner authentication state for this test to bypass the login step
test.use({ storageState: 'playwright/.auth/owner.json' });

test('Add/create project', async ({ page }) => {
    const projectsPage = new PageObjects.ProjectsPage(page);

    // Navigate to the projects page
    await projectsPage.navigateToProjectsPage();

    // Verify that the user is on the projects page
    await expect(projectsPage.selectors.addProjectButton).toBeVisible();

    // Add a new project
    await projectsPage.addProject(projectName);

    // Verify that the project was created successfully
    await expect(projectsPage.selectors.projectCreatedMessage).toBeVisible();
    await projectsPage.searchProject(projectName);
    await projectsPage.verifyProjectVisible(projectName);
});

test.afterEach(async ({ page }) => {
    const projectsPage = new PageObjects.ProjectsPage(page);

    await projectsPage.navigateToProjectsPage();

    // Delete the created project
    await projectsPage.deleteProject(projectName);
    await projectsPage.searchProject(projectName);
    await expect(projectsPage.selectors.noProjectsMessage).toBeVisible();
});