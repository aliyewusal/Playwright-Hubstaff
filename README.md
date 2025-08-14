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
├── tests/
│   ├── accessibility/    # Accessibility test suite
│   ├── e2e/              # End-to-end test suite
│   ├── snapshotTests/    # ARIA snapshot tests
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

## Playwright CTRF JSON Reporter for GitHub Actions

To view test results directly in GitHub Actions, this project uses the [playwright-ctrf-json-reporter](https://github.com/ctrf-io/playwright-ctrf-json-reporter). This reporter generates a test summary in the [CTRf format](https://github.com/ctrf-io/ctrf), which can be published as part of your CI workflow.

- The reporter outputs a `ctrf/ctrf-report.json` file after test execution.
- In the GitHub Actions workflow, the following step publishes the test summary:
  ```yaml
  - name: Publish Test Summary Results
    run: npx github-actions-ctrf ctrf/ctrf-report.json
  ```
- This allows you to see a summary of test results directly in the GitHub Actions UI.

**Setup:**
1. Install the reporter:
   ```sh
   npm install --save-dev playwright-ctrf-json-reporter
   ```
2. Add the reporter to your `playwright.config.ts`:
   ```ts
   reporter: [
     ['playwright-ctrf-json-reporter', { outputFile: 'ctrf/ctrf-report.json' }],
     // ...other reporters
   ]
   ```
3. Ensure the GitHub Actions workflow includes the publish step as shown above.

> For more details, see the [playwright-ctrf-json-reporter documentation](https://github.com/ctrf-io/playwright-ctrf-json-reporter).

## Code Quality and Git Hooks

This project maintains high code quality through automated linting, formatting, and pre-commit hooks using ESLint, Prettier, and Husky.

### ESLint Configuration

ESLint is configured to catch potential errors and enforce coding standards across JavaScript and TypeScript files. The project uses a flat configuration format with the following features:

- **Base Configuration**: Uses recommended JavaScript and TypeScript ESLint rules
- **Playwright Plugin**: Includes [eslint-plugin-playwright](https://github.com/playwright-community/eslint-plugin-playwright) for Playwright-specific linting rules
- **TypeScript Support**: Full TypeScript linting with recommended and stylistic rules
- **Ignored Files**: Excludes build artifacts, reports, and configuration files from linting

Key files:
- `eslint.config.mjs` - Main ESLint configuration using the flat config format

Run ESLint:
```sh
npx eslint .
```

Fix auto-fixable issues:
```sh
npx eslint . --fix
```

**Documentation**: [ESLint Getting Started](https://eslint.org/docs/latest/use/getting-started) | [eslint-plugin-playwright](https://github.com/playwright-community/eslint-plugin-playwright)

### Prettier Configuration

Prettier automatically formats code to ensure consistent style across the project. The configuration includes:

- **Semicolons**: Always include semicolons (`"semi": true`)
- **Quotes**: Use double quotes for strings (`"singleQuote": false`)
- **Trailing Commas**: ES5-compatible trailing commas (`"trailingComma": "es5"`)
- **Print Width**: 120 characters per line (`"printWidth": 120`)
- **Ignored Files**: Excludes build artifacts, reports, and certain configuration files

Key files:
- `.prettierrc` - Prettier formatting rules
- `.prettierignore` - Files and directories to exclude from formatting

Run Prettier:
```sh
npx prettier --write .
```

Check formatting without making changes:
```sh
npx prettier --check .
```

**Integration**: ESLint and Prettier are configured to work together using `eslint-config-prettier` to disable conflicting ESLint rules.

**Documentation**: [Prettier Installation](https://prettier.io/docs/install) | [Integrating with Linters](https://prettier.io/docs/integrating-with-linters)

### Husky Git Hooks

Husky manages Git hooks to ensure code quality before commits. The project includes:

- **Pre-commit Hook**: Automatically runs ESLint and Prettier before each commit
- **Automated Setup**: Hooks are installed automatically when dependencies are installed

Key files:
- `.husky/pre-commit` - Runs linting and formatting checks before commits
- `.husky/_/` - Husky internal files for hook management

The pre-commit hook ensures that:
1. All code passes ESLint checks
2. All code is properly formatted with Prettier
3. Only quality code reaches the repository

**Documentation**: [Husky Getting Started](https://typicode.github.io/husky/get-started.html)

### Development Workflow

1. **During Development**: ESLint and Prettier extensions in your IDE provide real-time feedback
2. **Before Commit**: Husky automatically runs linting and formatting checks
3. **CI/CD**: Pipeline can run these checks to ensure code quality in pull requests

**Package Scripts**: The following npm scripts are available for code quality tasks:
```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

> **Tip**: Install the ESLint and Prettier extensions in VS Code for the best development experience with automatic formatting and error highlighting.

## Useful Commands
- `npm test` — Run all tests
- `npx playwright show-report` — Open the HTML report
- `npx playwright codegen` — Launch Playwright code generator

## Folder Details
- `pages/` — Page Object Model files for different Hubstaff pages
- `tests/` — Test specs and setup scripts
- `playwright-report/` — Generated HTML reports (gitignored)
- `test-results/` — Test artifacts (gitignored)
