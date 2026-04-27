import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',

  /* Run tests serially to avoid shared-state conflicts on the public server */
  fullyParallel: false,
  workers: 1,

  /* Fail the build on CI if test.only is accidentally left */
  forbidOnly: !!process.env.CI,

  /* Retry once on CI – the public Petstore can be flaky */
  retries: process.env.CI ? 2 : 1,

  /* Global timeout per test */
  timeout: 30_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['json', { outputFile: 'reports/json-report/results.json' }],
  ],

  use: {
    baseURL: process.env.API_BASE_URL || 'https://petstore.swagger.io/v2',
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    ignoreHTTPSErrors: true,
  },

  outputDir: 'test-artifacts/playwright-output',
});
