import { Page, Locator } from '@playwright/test';

export default class SignInPage {
    readonly page: Page;
    selectors: { [key: string]: Locator | any };

    constructor(page: Page) {
        this.page = page;
        this.selectors = {
            emailInput: page.getByRole('textbox', { name: 'Work email *' }),
            passwordInput: page.getByRole('textbox', { name: 'Password *' }),
            signInButton: page.getByRole('button', { name: 'Sign in' })
        };
    }

    async signIn(email, password) {
        await this.selectors.emailInput.fill(`${email}`);
        await this.selectors.passwordInput.fill(`${password}`);
        await this.selectors.signInButton.click();
    }
}