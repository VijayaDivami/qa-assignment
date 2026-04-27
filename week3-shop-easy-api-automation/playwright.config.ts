import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',

  /* Run tests serially to avoid cart/order state conflicts */
  fullyParallel: false,
  workers: 1,

  /* Fail the build on CI if test.only is accidentally left */
  forbidOnly: !!process.env.CI,

  /* Retry once on CI */
  retries: process.env.CI ? 1 : 0,

  /* Global timeout per test */
  timeout: 30_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['json', { outputFile: 'reports/json-report/results.json' }],
    ['./reporters/custom-reporter.ts'],
  ],

  use: {
    /* API base URL – actual backend server (swagger UI is at :8080) */
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000',
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    ignoreHTTPSErrors: true,
  },

  /* Store traces, screenshots, and other artifacts here */
  outputDir: 'test-artifacts/playwright-output',
});
