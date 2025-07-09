import { Page, Locator } from '@playwright/test';

export default class SignInPage {
    readonly page: Page;
    selectors: { [key: string]: Locator | any };
    loginPageUrl: string;

    constructor(page: Page) {
        this.page = page;
        this.loginPageUrl = 'https://account.hubstaff.com/login';
        this.selectors = {
            emailInput: page.getByRole('textbox', { name: 'Work email *' }),
            passwordInput: page.getByRole('textbox', { name: 'Password *' }),
            signInButton: page.getByRole('button', { name: 'Sign in' })
        };
    }

    async navigateToLoginPage() {
        await this.page.goto(this.loginPageUrl);
    }

    async signIn(email, password) {
        await this.selectors.emailInput.fill(`${email}`);
        await this.selectors.passwordInput.fill(`${password}`);
        await this.selectors.signInButton.click();
    }
}