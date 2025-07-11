import { expect, Locator, Page } from "@playwright/test";

export default class MarketingPage {
  page: Page;
  selectors: { [key: string]: Locator | any };
  marketingPageUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.marketingPageUrl = "https://hubstaff.com/";
    this.selectors = {
      freeTrialButton: page.getByRole("link", { name: "Free 14-day trial" }).first(),
      signInLink: page.getByRole("link", { name: "Sign in" }),
      firstNameInput: page.getByTestId("first_name"),
      lastNameInput: page.getByTestId("last_name"),
      emailInput: page.getByTestId("email"),
      passwordInput: page.getByTestId("password"),
      okButton: page.getByRole("button", { name: "OK" }),
      termsCheckbox: page.locator("label").filter({ hasText: "I agree to the Terms, Privacy" }).locator("div").first(),
      createAccountButton: page.getByRole("button", { name: "Create my account" }),
      verifyEmailHeading: page.getByRole("heading", { name: "Verify your email" }),
      backToSignInLink: page.getByRole("link", { name: "Back to sign in" }),
      workEmailInput: page.getByRole("textbox", { name: "Work email *" }),
      passwordInputSignIn: page.getByRole("textbox", { name: "Password *" }),
      signInButton: page.getByRole("button", { name: "Sign in" }),
      welcomeMessage: (firstName: string, lastName: string) => page.getByText(`Welcome, ${firstName} ${lastName}`),
    };
  }

  async navigateToMarketingPage() {
    await this.page.goto(this.marketingPageUrl);
  }

  async fillSignupForm(firstName: string, lastName: string, email: string, password: string) {
    await this.selectors.firstNameInput.fill(firstName);
    await this.selectors.lastNameInput.fill(lastName);
    await this.selectors.emailInput.fill(email);
    await this.selectors.passwordInput.fill(password);
    await this.selectors.okButton.click();
  }

  async clickBackToSignIn() {
    await this.selectors.backToSignInLink.click();
  }

  async signInWithEmail(email: string, password: string) {
    await this.selectors.workEmailInput.fill(email);
    await this.selectors.passwordInputSignIn.fill(password);
    await this.selectors.signInButton.click();
  }

  async verifyWelcomeMessage(firstName: string, lastName: string) {
    await expect(this.selectors.welcomeMessage(firstName, lastName)).toBeVisible();
  }
}
