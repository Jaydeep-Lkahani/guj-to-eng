import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Phone size (pending.md 7.1): 360 x 800.
    ...devices['Desktop Chrome'],
    viewport: { width: 360, height: 800 },
    hasTouch: true,
    locale: 'gu-IN',
  },
  projects: [{ name: 'chromium' }],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
