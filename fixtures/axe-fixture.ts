import { test as base } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

interface AxeFixture {
  makeAxeBuilder: () => AxeBuilder;
}

export const scopeOfValidation = [
  "wcag2a",
  "wcag21a",
  // 'wcag2aa',
  // 'wcag21aa',
  // 'wcag22a',
  // 'wcag22aa',
  // 'wcag2aaa',
  // You can uncomment the above lines to include more tags as needed or add more specific tags.
];

export const test = base.extend<AxeFixture>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () => new AxeBuilder({ page }).withTags(scopeOfValidation);

    await use(makeAxeBuilder);
  },
});
export { expect } from "@playwright/test";
