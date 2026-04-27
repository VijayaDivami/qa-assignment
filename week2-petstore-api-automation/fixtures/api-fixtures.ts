import { test as base } from '@playwright/test';
import { ApiClient } from '../helpers/api-client';
import * as dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL ?? 'https://petstore.swagger.io/v2';
const API_KEY = process.env.API_KEY ?? 'special-key';

type PetstoreFixtures = {
  /** Base URL of the Petstore API */
  baseURL: string;

  /** Unauthenticated client – for public endpoints */
  apiClient: ApiClient;

  /** Client with api_key header set – for endpoints requiring auth */
  authClient: ApiClient;
};

export const test = base.extend<PetstoreFixtures>({
  baseURL: async ({}, use) => {
    await use(BASE_URL);
  },

  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request, BASE_URL));
  },

  authClient: async ({ request }, use) => {
    await use(new ApiClient(request, BASE_URL, API_KEY));
  },
});

export { expect } from '@playwright/test';
