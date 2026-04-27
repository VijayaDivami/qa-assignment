import { test as base } from '@playwright/test';
import { ApiClient } from '../helpers/api-client';
import { loginAsAdmin } from '../helpers/auth-helper';
import * as dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

type ApiFixtures = {
  /** Base URL of the API under test */
  baseURL: string;

  /** Unauthenticated client – for public endpoints and negative auth tests */
  apiClient: ApiClient;

  /**
   * Authenticated client pre-loaded with the admin bearer token.
   * Use for tests that require authentication but do NOT mutate user-owned
   * state (cart, orders).  For isolated-state tests create a fresh user
   * inside the test using `registerAndLogin`.
   */
  authenticatedClient: ApiClient;

  /** Raw admin bearer token (useful when building manual Authorization headers) */
  adminToken: string;
};

export const test = base.extend<ApiFixtures>({
  baseURL: async ({}, use) => {
    await use(BASE_URL);
  },

  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request, BASE_URL));
  },

  adminToken: async ({ request }, use) => {
    const { token } = await loginAsAdmin(request, BASE_URL);
    await use(token);
  },

  authenticatedClient: async ({ request, adminToken }, use) => {
    const client = new ApiClient(request, BASE_URL);
    client.setToken(adminToken);
    await use(client);
  },
});

export { expect } from '@playwright/test';
