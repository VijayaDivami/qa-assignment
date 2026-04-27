import { test, expect } from '../../fixtures/api-fixtures';
import { CART_DATA } from '../../test-data/cart.data';
import { registerAndLogin } from '../../helpers/auth-helper';
import { ApiClient } from '../../helpers/api-client';

test.describe('DELETE /cart/items/{itemId}', () => {
  test.beforeEach(({}, testInfo) => {
    testInfo.annotations.push({
      type: 'endpoint',
      description: 'DELETE /cart/items/{itemId}',
    });
  });

  // ── Happy path ───────────────────────────────────────────────────────────

  test('TC-CART-R01 | should return 200 after removing an existing cart item', async ({
    request,
    baseURL,
  }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    // Add the item first
    await client.post('/cart/items', CART_DATA.validItem);

    const response = await client.delete(
      `/cart/items/${CART_DATA.validItem.productId}`,
    );

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('cartTotal');
  });

  test('TC-CART-R02 | cart should be empty after removing the only item', async ({
    request,
    baseURL,
  }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    await client.post('/cart/items', CART_DATA.validItem);
    await client.delete(`/cart/items/${CART_DATA.validItem.productId}`);

    const cartRes = await client.get('/cart');
    const body = await cartRes.json();
    expect(body.itemCount).toBe(0);
  });

  test('TC-CART-R03 | cartTotal in remove response should be numeric', async ({
    request,
    baseURL,
  }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    await client.post('/cart/items', CART_DATA.validItem);
    const response = await client.delete(
      `/cart/items/${CART_DATA.validItem.productId}`,
    );
    const body = await response.json();
    expect(typeof body.cartTotal).toBe('number');
  });

  // ── Negative ─────────────────────────────────────────────────────────────

  test('TC-CART-R04 | should return 404 when removing an item not in the cart', async ({
    request,
    baseURL,
  }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    const response = await client.delete('/cart/items/999999');
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-CART-R05 | should return 401 without Authorization header', async ({ apiClient }) => {
    const response = await apiClient.delete('/cart/items/1');
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});
