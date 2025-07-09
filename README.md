# Hubstaff Playwright Test Automation

This repository contains automated end-to-end tests for the Hubstaff web application using [Playwright](https://playwright.dev/).

## Features
- Automated browser testing with Playwright
- Visual regression testing with configurable `maxDiffPixelRatio`
- Page Object Model (POM) design for maintainable tests
- Playwright authentication setup for efficient login flows
- Environment variable support via `.env` file
- HTML test reports and trace collection on failures
- Parallel test execution and CI-friendly configuration

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)

### Installation
```sh
npm install
```

### Environment Variables
Create a `.env` file in the root directory with the following content:
```
EMAIL=your-email@example.com
PASSWORD=your-password
```

> **Note:** The `.env` file is excluded from version control.

### Running Tests
To run all tests:
```sh
npm test
```

### Test Reports
After running tests, view the HTML report:
```sh
npx playwright show-report
```

## Project Structure
```
├── pages/                # Page Object Models for Hubstaff app and Temp Email app
├── tests/                # Test specs and setup scripts
│   └── auth.setup.ts     # Authentication setup for Playwright tests
├── playwright.config.ts  # Playwright configuration
├── .env                  # Environment variables (not committed)
├── .gitignore            # Git ignore rules
├── package.json          # Project dependencies and scripts
```

## Page Object Model (POM)
The `pages/` directory contains Page Object Model classes for each major page of the Hubstaff application. POM helps to:
- Encapsulate page structure and actions
- Promote code reuse and maintainability
- Simplify test scripts by abstracting UI interactions

Example usage in a test:
```ts
import { SignInPage } from '../pages/signInPage';
// ...
const signInPage = new SignInPage(page);
await signInPage.login(email, password);
```

## Playwright Authentication (`auth.setup.ts`)
The `tests/auth.setup.ts` file is used to perform authentication once and reuse the login state across tests. This speeds up test execution and avoids repeated logins.
- Stores authentication state (cookies, local storage) for reuse
- Reduces flakiness and test time

Learn more: [Playwright Authentication](https://playwright.dev/docs/auth)

## Visual Comparison
Visual regression testing is enabled using Playwright's snapshot feature. The `maxDiffPixelRatio` option (set in `playwright.config.ts`) controls the allowed percentage of pixel differences between snapshots and actual screenshots.
- Use `expect(page).toHaveScreenshot()` or `expect(element).toHaveScreenshot()` in tests
- If the difference exceeds `maxDiffPixelRatio`, the test will fail
- Adjust the value in the config to make comparisons stricter or more lenient



### Visual Regression
The config sets `maxDiffPixelRatio` for snapshot comparisons. Adjust this in `playwright.config.ts` if needed.

## Pipeline (CI/CD)
This repository is designed to work seamlessly with Continuous Integration (CI) pipelines such as GitHub Actions, GitLab CI, or Azure Pipelines. Example pipeline features:
- Install dependencies using `npm install`
- Run Playwright tests with `npm test`
- Collect and upload Playwright HTML reports and traces as build artifacts
- Use environment variables for secure credentials (never commit secrets)
- Optionally, run tests in headless mode and on multiple browsers

### Example GitHub Actions Workflow
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run Playwright tests
        run: npm test
      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
```

> Adjust the workflow for your CI provider as needed. Store sensitive data like EMAIL and PASSWORD in CI secrets, not in the repository.

## Accessibility Scans
Accessibility testing is integrated using [axe-core](https://github.com/dequelabs/axe-core) with Playwright. This helps ensure the Hubstaff application meets accessibility standards and best practices.

- The `fixtures/axe-fixture.ts` file sets up the axe accessibility scan as a Playwright fixture.
- Accessibility tests are located in `tests/a11y/accessibility.spec.ts`.
- The tests automatically scan pages and key UI components for accessibility issues.
- Detected violations are reported in the test output for review and remediation.

### How Accessibility Scans Work
1. The axe fixture injects the axe-core library into the page during test execution.
2. The test runs `axe.run()` to analyze the current page or component.
3. Any accessibility violations are collected and cause the test to fail, with details printed in the report.

### Running Accessibility Tests
To run only the accessibility tests:
```sh
npx playwright test tests/a11y/accessibility.spec.ts
```

> Review and address any reported accessibility issues to improve the usability of the application for all users.

> Note: At the moment, there is only the Playwright reporter being used; for a more detailed view, you can implement [axe-html-reporter](https://www.npmjs.com/package/axe-html-reporter).

## Useful Commands
- `npm test` — Run all tests
- `npx playwright show-report` — Open the HTML report
- `npx playwright codegen` — Launch Playwright code generator

## Folder Details
- `pages/` — Page Object Model files for different Hubstaff pages
- `tests/` — Test specs and setup scripts
- `playwright-report/` — Generated HTML reports (gitignored)
- `test-results/` — Test artifacts (gitignored)
