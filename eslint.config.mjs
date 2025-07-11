import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import playwright from 'eslint-plugin-playwright';
import prettierConfig from 'eslint-config-prettier';


export default defineConfig([
  {
    // Ignore files and directories that don't need linting
    ignores: [
      "**/node_modules/**",
      "**/playwright-report/**",
      "**/test-results/**", 
      "**/ctrf/**",
      "**/playwright/**",
      "*.config.*",
      "package.json",
      "README.md",
      "**/.git/**",
      "**/.*", // Ignore dotfiles
      "*/auth.setup.ts",
    ],
  },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  prettierConfig, // Prettier config to disable conflicting rules
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Customize Playwright rules
      // ...
    },
  },
]);
