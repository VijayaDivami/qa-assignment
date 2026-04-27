import { test, expect } from '../../fixtures/api-fixtures';
import { CART_DATA } from '../../test-data/cart.data';
import { registerAndLogin } from '../../helpers/auth-helper';
import { ApiClient } from '../../helpers/api-client';

/**
 * Each test creates an isolated fresh user so cart state never bleeds
 * between test cases.
 */
test.describe('POST /cart/items', () => {
  test.beforeEach(({}, testInfo) => {
    testInfo.annotations.push({ type: 'endpoint', description: 'POST /cart/items' });
  });

  // ── Happy path ───────────────────────────────────────────────────────────

  test('TC-CART-A01 | should return 201 when adding a valid item to cart', async ({
    request,
    baseURL,
  }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    const response = await client.post('/cart/items', CART_DATA.validItem);

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('cartTotal');
    expect(typeof body.cartTotal).toBe('number');
  });

  test('TC-CART-A02 | cartTotal in response should be numeric and positive', async ({
    request,
    baseURL,
  }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    const response = await client.post('/cart/items', CART_DATA.validItem);
    const body = await response.json();
    expect(body.cartTotal).toBeGreaterThan(0);
  });

  test('TC-CART-A03 | should allow adding the minimum quantity (1)', async ({
    request,
    baseURL,
  }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    const response = await client.post('/cart/items', CART_DATA.minQuantityItem);
    expect(response.status()).toBe(201);
  });

  // ── Negative – auth ───────────────────────────────────────────────────────

  test('TC-CART-A04 | should return 401 without Authorization header', async ({ apiClient }) => {
    const response = await apiClient.post('/cart/items', CART_DATA.validItem);
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-CART-A05 | should return 401 with an invalid / expired token', async ({
    apiClient,
  }) => {
    apiClient.setToken('invalid.token.value');
    const response = await apiClient.post('/cart/items', CART_DATA.validItem);
    expect(response.status()).toBe(401);
  });

  // ── Negative – bad payload ────────────────────────────────────────────────

  test('TC-CART-A06 | should return 404 for a non-existent productId', async ({
    request,
    baseURL,
  }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    const response = await client.post('/cart/items', CART_DATA.nonExistentProductItem);
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-CART-A07 | should return 400 when productId is missing', async ({
    request,
    baseURL,
  }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    const response = await client.post('/cart/items', CART_DATA.missingProductId);
    expect(response.status()).toBe(400);
  });

  test('TC-CART-A08 | should return 400 when quantity is missing', async ({
    request,
    baseURL,
  }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    const response = await client.post('/cart/items', CART_DATA.missingQuantity);
    expect(response.status()).toBe(400);
  });
});
