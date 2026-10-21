import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e', testMatch: '**/*.spec.js', workers: 1, retries: 0,
  timeout: 60000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://localhost:4000', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile-390', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: 'mobile-320', use: { viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true } },
  ],
  webServer: { command: 'node e2e/start.mjs', url: 'http://localhost:4000/api/health', timeout: 120000 },
});
