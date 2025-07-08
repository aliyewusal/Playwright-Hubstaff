import { Page, Locator, expect } from '@playwright/test';

export default class ProjectsPage {
    readonly page: Page;
    selectors: { [key: string]: Locator | any };
    projectsPageUrl: string;

    constructor(page: Page) {
        this.page = page;
        this.projectsPageUrl = 'https://app.hubstaff.com/projects';
        this.selectors = {
            addProjectButton: page.locator('[data-original-title="Add new project to the organization"]'),
            newProjectHeader: page.getByRole('heading', { name: 'New project' }),
            projectNameInput: page.getByRole('textbox', { name: 'Add project names separated' }),
            saveButton: page.getByRole('button', { name: 'Save' }),
            projectCreatedMessage: page.getByText('Project created'),
            projectDeletedMessage: page.getByText('Deleted project'),
            actionButtonByProjectName: (projectName: string) => page.getByRole('row', { name: `${projectName}` }).getByRole('button'),
            listItemByProjectName: (projectName: string) => page.getByRole('cell', { name: projectName }),
            deleteButton: page.getByRole('link', { name: 'Delete project' }),
            searchBox: page.getByRole('searchbox', { name: 'Search projects' }),
            confirmDeleteCheckbox: page.locator('#delete-project-modal').getByText('I understand and wish to delete this project'),
            deleteButtonInModal: page.locator('#delete-button'),
            noProjectsMessage: page.getByRole('heading', { name: 'No projects' }),
        };
    }

    async navigateToProjectsPage() {
        await this.page.goto(this.projectsPageUrl);
        // await expect(this.selectors.addProjectButton).toBeVisible();
    }

    async searchProject(projectName: string) {
        await this.selectors.searchBox.fill(projectName);
        await this.selectors.searchBox.press('Enter');
    }

    async addProject(projectName: string) {
        await this.selectors.addProjectButton.click();
        await expect(this.selectors.newProjectHeader).toBeVisible();
        await this.selectors.projectNameInput.fill(projectName);
        await this.selectors.saveButton.click();
        await expect(this.selectors.projectCreatedMessage).toBeVisible();
    }

    async verifyProjectVisible(projectName: string) {
        const projectLocator = this.selectors.listItemByProjectName(projectName);
        await expect(projectLocator).toBeVisible();
    }

    async deleteProject(projectName: string) {
        const actionButton = this.selectors.actionButtonByProjectName(projectName);
        await actionButton.click();
        await this.selectors.deleteButton.click();
        await expect(this.selectors.confirmDeleteCheckbox).toBeVisible();
        await this.selectors.confirmDeleteCheckbox.click();
        await this.selectors.deleteButtonInModal.click();

        await expect(this.selectors.projectDeletedMessage).toBeVisible();
    }
}