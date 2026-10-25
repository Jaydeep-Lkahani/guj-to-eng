import { test as base, expect } from '@playwright/test';

/**
 * Every test fails if the browser console shows an error or warning,
 * a page throws, or a request fails (pending.md 7.12).
 */
export const test = base.extend<{ problems: string[] }>({
  problems: [
    async ({ page }, use) => {
      const problems: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error' || message.type() === 'warning') {
          problems.push(`console ${message.type()}: ${message.text()}`);
        }
      });
      page.on('pageerror', (error) =>
        problems.push(`page error: ${error.message}`),
      );
      page.on('requestfailed', (request) =>
        problems.push(`request failed: ${request.url()}`),
      );
      page.on('response', (response) => {
        if (response.status() >= 400) {
          problems.push(`HTTP ${response.status()}: ${response.url()}`);
        }
      });
      await use(problems);
      expect(problems).toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
