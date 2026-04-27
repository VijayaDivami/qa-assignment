import { test, expect } from '../../fixtures/api-fixtures';
import { CART_DATA } from '../../test-data/cart.data';
import { registerAndLogin } from '../../helpers/auth-helper';
import { ApiClient } from '../../helpers/api-client';

test.describe('GET /cart', () => {
  test.beforeEach(({}, testInfo) => {
    testInfo.annotations.push({ type: 'endpoint', description: 'GET /cart' });
  });

  // ── Happy path ───────────────────────────────────────────────────────────

  test('TC-CART-V01 | should return 200 with cart structure for authenticated user', async ({
    request,
    baseURL,
  }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    const response = await client.get('/cart');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('items');
    expect(body).toHaveProperty('subtotal');
    expect(body).toHaveProperty('itemCount');
    expect(Array.isArray(body.items)).toBe(true);
  });

  test('TC-CART-V02 | empty cart should have subtotal 0 and itemCount 0', async ({
    request,
    baseURL,
  }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    const response = await client.get('/cart');
    const body = await response.json();
    expect(body.itemCount).toBe(0);
    expect(body.subtotal).toBe(0);
  });

  test('TC-CART-V03 | cart should reflect added items', async ({ request, baseURL }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    // Add an item first
    await client.post('/cart/items', CART_DATA.validItem);

    const response = await client.get('/cart');
    const body = await response.json();
    expect(body.itemCount).toBeGreaterThan(0);
    expect(body.subtotal).toBeGreaterThan(0);
  });

  test('TC-CART-V04 | subtotal should be numeric and non-negative', async ({
    request,
    baseURL,
  }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    const response = await client.get('/cart');
    const body = await response.json();
    expect(typeof body.subtotal).toBe('number');
    expect(body.subtotal).toBeGreaterThanOrEqual(0);
  });

  // ── Negative ─────────────────────────────────────────────────────────────

  test('TC-CART-V05 | should return 401 without Authorization header', async ({ apiClient }) => {
    const response = await apiClient.get('/cart');
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});
