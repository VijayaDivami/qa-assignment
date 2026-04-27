import { test, expect } from '../../fixtures/api-fixtures';
import { PRODUCTS_DATA } from '../../test-data/products.data';

test.describe('GET /products', () => {
  test.beforeEach(({}, testInfo) => {
    testInfo.annotations.push({ type: 'endpoint', description: 'GET /products' });
  });

  // ── Happy path ───────────────────────────────────────────────────────────

  test('TC-PROD-L01 | should return 200 with paginated product list', async ({
    apiClient,
  }) => {
    const response = await apiClient.get('/products');

    expect(response.status()).toBe(200);
    const body = await response.json();

    // Verify envelope structure
    for (const field of PRODUCTS_DATA.listEnvelopeFields) {
      expect(body).toHaveProperty(field);
    }
    expect(Array.isArray(body.data)).toBe(true);
    expect(typeof body.total).toBe('number');
    expect(typeof body.page).toBe('number');
    expect(typeof body.limit).toBe('number');
  });

  test('TC-PROD-L02 | each product in list should have required fields', async ({
    apiClient,
  }) => {
    const response = await apiClient.get('/products');
    const { data } = await response.json();

    expect(data.length).toBeGreaterThan(0);

    for (const product of data) {
      for (const field of PRODUCTS_DATA.expectedFields) {
        expect(product).toHaveProperty(field);
      }
    }
  });

  test('TC-PROD-L03 | should filter products by category', async ({ apiClient }) => {
    const response = await apiClient.get('/products', PRODUCTS_DATA.filters.byCategory);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);

    // Every returned product must match the requested category
    for (const product of body.data) {
      expect(product.category.toLowerCase()).toBe(
        PRODUCTS_DATA.filters.byCategory.category.toLowerCase(),
      );
    }
  });

  test('TC-PROD-L04 | should respect the limit query parameter', async ({ apiClient }) => {
    const limit = PRODUCTS_DATA.filters.withPagination.limit;
    const response = await apiClient.get('/products', PRODUCTS_DATA.filters.withPagination);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.length).toBeLessThanOrEqual(limit);
    expect(body.limit).toBe(limit);
  });

  test('TC-PROD-L05 | should respect the page query parameter', async ({ apiClient }) => {
    const response = await apiClient.get(
      '/products',
      PRODUCTS_DATA.filters.withPagination,
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.page).toBe(PRODUCTS_DATA.filters.withPagination.page);
  });

  test('TC-PROD-L06 | combined category + pagination filter should work', async ({
    apiClient,
  }) => {
    const response = await apiClient.get('/products', PRODUCTS_DATA.filters.combined);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeLessThanOrEqual(PRODUCTS_DATA.filters.combined.limit);
  });

  test('TC-PROD-L07 | should be accessible without authentication', async ({
    apiClient,
  }) => {
    // Products are public – no token required
    const response = await apiClient.get('/products');
    expect(response.status()).toBe(200);
  });
});
