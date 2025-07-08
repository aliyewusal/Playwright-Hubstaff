import { Page, Locator, expect } from '@playwright/test';

export default class TempMailPage {
    readonly page: Page;
    selectors: { [key: string]: Locator | any };
    constructor(page: Page) {
        this.page = page;
        this.selectors = {
            mailInput: page.locator('#mail'),
            refreshButton: page.locator('button[aria-label="Refresh"]'),
            confirmationEmail: page.getByText('Confirm your Hubstaff account'),
            mailContent: page.getByText('Your more productive future'),
            hubstaffWelcomeHeading: page.getByRole('heading', { name: 'Welcome to Hubstaff!' }),
        };
    }

    async navigateToMailPage() {
        await this.page.goto('https://tempmailo.co/');
        await this.page.waitForSelector('#mail');
    }

    async verifyEmailInputValid() {
        await expect(this.selectors.mailInput).toHaveValue(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/);
    }

    async getEmailAddress(): Promise<string> {
        const email = await this.selectors.mailInput.inputValue();
        return email;
    }

    async refreshInbox() {
        await this.selectors.refreshButton.click();
    }

    async waitForVerificationEmail() {
        const maxAttempts = 20;
        const delayMs = 3000;
        let found = false;
        for (let i = 0; i < maxAttempts; i++) {
            await this.page.reload();
            try {
                await this.selectors.confirmationEmail.waitFor({ state: 'visible', timeout: 2000 });
                found = true;
                break;
            } catch {
                // Not found, wait and try again
                await this.page.waitForTimeout(delayMs);
            }
        }
        if (!found) throw new Error("Verification email did not arrive in time");
    }

    async getConfirmationLink(): Promise<string> {
        const mailContent = await this.selectors.mailContent.textContent();
        if (!mailContent) throw new Error('Mail content not found');
        const confirmationLinkMatch = mailContent.match(/Confirm account:\s*(https?:\/\/\S+)/);
        if (!confirmationLinkMatch) throw new Error('Confirmation link not found in mail content');
        return confirmationLinkMatch[1];
    }
}

