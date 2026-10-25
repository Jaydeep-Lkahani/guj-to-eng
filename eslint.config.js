import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'playwright-report', 'test-results']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-console': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      // Rule 6: never clear the learner's saved progress.
      'no-restricted-properties': [
        'error',
        {
          object: 'localStorage',
          property: 'clear',
          message: 'Never clear storage (pending.md 7.5).',
        },
      ],
    },
  },
  {
    // Rule 1: no UI text typed directly in components. Every string comes from src/i18n/gu.ts.
    files: ['src/components/**/*.tsx', 'src/pages/**/*.tsx', 'src/App.tsx'],
    ignores: ['**/*.test.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXText[value=/\\S/]',
          message:
            'No text typed in components. Use a string from src/i18n/gu.ts.',
        },
        {
          selector:
            'JSXAttribute[name.name=/^(aria-label|aria-description|title|alt|placeholder)$/] > Literal',
          message:
            'No text typed in components. Use a string from src/i18n/gu.ts.',
        },
      ],
    },
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
]);
