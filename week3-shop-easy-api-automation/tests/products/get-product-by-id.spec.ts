import { test, expect } from '../../fixtures/api-fixtures';
import { PRODUCTS_DATA } from '../../test-data/products.data';

test.describe('GET /products/{id}', () => {
  test.beforeEach(({}, testInfo) => {
    testInfo.annotations.push({ type: 'endpoint', description: 'GET /products/{id}' });
  });

  // ── Happy path ───────────────────────────────────────────────────────────

  test('TC-PROD-G01 | should return 200 with full product object for valid ID', async ({
    apiClient,
  }) => {
    const response = await apiClient.get(`/products/${PRODUCTS_DATA.validId}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    for (const field of PRODUCTS_DATA.expectedFields) {
      expect(body).toHaveProperty(field);
    }
  });

  test('TC-PROD-G02 | product id in response should match the requested id', async ({
    apiClient,
  }) => {
    const response = await apiClient.get(`/products/${PRODUCTS_DATA.validId}`);
    const body = await response.json();
    expect(body.id).toBe(PRODUCTS_DATA.validId);
  });

  test('TC-PROD-G03 | product price should be a positive number', async ({ apiClient }) => {
    const response = await apiClient.get(`/products/${PRODUCTS_DATA.validId}`);
    const body = await response.json();
    expect(typeof body.price).toBe('number');
    expect(body.price).toBeGreaterThan(0);
  });

  test('TC-PROD-G04 | product stock should be a non-negative integer', async ({ apiClient }) => {
    const response = await apiClient.get(`/products/${PRODUCTS_DATA.validId}`);
    const body = await response.json();
    expect(typeof body.stock).toBe('number');
    expect(body.stock).toBeGreaterThanOrEqual(0);
  });

  test('TC-PROD-G05 | should be accessible without authentication', async ({ apiClient }) => {
    const response = await apiClient.get(`/products/${PRODUCTS_DATA.validId}`);
    expect(response.status()).toBe(200);
  });

  // ── Negative ─────────────────────────────────────────────────────────────

  test('TC-PROD-G06 | should return 404 for a non-existent product ID', async ({ apiClient }) => {
    const response = await apiClient.get(`/products/${PRODUCTS_DATA.nonExistentId}`);
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});
