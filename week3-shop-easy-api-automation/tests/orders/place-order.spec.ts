import { test, expect } from '../../fixtures/api-fixtures';
import { CART_DATA } from '../../test-data/cart.data';
import { ORDERS_DATA } from '../../test-data/orders.data';
import { registerAndLogin } from '../../helpers/auth-helper';
import { ApiClient } from '../../helpers/api-client';

/** Helper – register a fresh user, add an item to their cart, return client */
async function freshUserWithCart(
  request: Parameters<typeof registerAndLogin>[0],
  baseURL: string,
): Promise<{ client: ApiClient }> {
  const { token } = await registerAndLogin(request, baseURL);
  const client = new ApiClient(request, baseURL);
  client.setToken(token);
  await client.post('/cart/items', CART_DATA.validItem);
  return { client };
}

test.describe('POST /orders', () => {
  test.beforeEach(({}, testInfo) => {
    testInfo.annotations.push({ type: 'endpoint', description: 'POST /orders' });
  });

  // ── Happy path ───────────────────────────────────────────────────────────

  test('TC-ORD-P01 | should return 201 with orderId when cart has items', async ({
    request,
    baseURL,
  }) => {
    const { client } = await freshUserWithCart(request, baseURL);

    const response = await client.post('/orders');

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('orderId');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('message');
  });

  test('TC-ORD-P02 | orderId in response should be a non-empty string', async ({
    request,
    baseURL,
  }) => {
    const { client } = await freshUserWithCart(request, baseURL);
    const response = await client.post('/orders');
    const body = await response.json();
    expect(typeof body.orderId).toBe('string');
    expect(body.orderId.trim().length).toBeGreaterThan(0);
  });

  test('TC-ORD-P03 | order total should be a positive number', async ({
    request,
    baseURL,
  }) => {
    const { client } = await freshUserWithCart(request, baseURL);
    const response = await client.post('/orders');
    const body = await response.json();
    expect(typeof body.total).toBe('number');
    expect(body.total).toBeGreaterThan(0);
  });

  test('TC-ORD-P04 | order status should be "pending" immediately after placement', async ({
    request,
    baseURL,
  }) => {
    const { client } = await freshUserWithCart(request, baseURL);
    const response = await client.post('/orders');
    const body = await response.json();
    expect(body.status).toBe('pending');
  });

  // ── Negative ─────────────────────────────────────────────────────────────

  test('TC-ORD-P05 | should return 400 when cart is empty', async ({ request, baseURL }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    // Cart is empty – do not add any items
    const response = await client.post('/orders');
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-ORD-P06 | should return 401 without Authorization header', async ({ apiClient }) => {
    const response = await apiClient.post('/orders');
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});
