import { test, expect } from '../../fixtures/api-fixtures';
import { CART_DATA } from '../../test-data/cart.data';
import { ORDERS_DATA } from '../../test-data/orders.data';
import { registerAndLogin } from '../../helpers/auth-helper';
import { ApiClient } from '../../helpers/api-client';

/** Helper – create user, add cart item, place order, return client + orderId */
async function createOrder(
  request: Parameters<typeof registerAndLogin>[0],
  baseURL: string,
): Promise<{ client: ApiClient; orderId: string }> {
  const { token } = await registerAndLogin(request, baseURL);
  const client = new ApiClient(request, baseURL);
  client.setToken(token);

  await client.post('/cart/items', CART_DATA.validItem);
  const orderRes = await client.post('/orders');
  const orderBody = await orderRes.json();

  return { client, orderId: orderBody.orderId as string };
}

test.describe('GET /orders/{orderId}', () => {
  test.beforeEach(({}, testInfo) => {
    testInfo.annotations.push({ type: 'endpoint', description: 'GET /orders/{orderId}' });
  });

  // ── Happy path ───────────────────────────────────────────────────────────

  test('TC-ORD-G01 | should return 200 with full order object', async ({
    request,
    baseURL,
  }) => {
    const { client, orderId } = await createOrder(request, baseURL);

    const response = await client.get(`/orders/${orderId}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    for (const field of ORDERS_DATA.expectedFields) {
      expect(body).toHaveProperty(field);
    }
  });

  test('TC-ORD-G02 | orderId in response should match requested orderId', async ({
    request,
    baseURL,
  }) => {
    const { client, orderId } = await createOrder(request, baseURL);
    const response = await client.get(`/orders/${orderId}`);
    const body = await response.json();
    expect(body.orderId).toBe(orderId);
  });

  test('TC-ORD-G03 | order status should be one of the valid enum values', async ({
    request,
    baseURL,
  }) => {
    const { client, orderId } = await createOrder(request, baseURL);
    const response = await client.get(`/orders/${orderId}`);
    const body = await response.json();
    expect(ORDERS_DATA.validStatuses).toContain(body.status);
  });

  test('TC-ORD-G04 | order items array should be non-empty', async ({
    request,
    baseURL,
  }) => {
    const { client, orderId } = await createOrder(request, baseURL);
    const response = await client.get(`/orders/${orderId}`);
    const body = await response.json();
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBeGreaterThan(0);
  });

  // ── Negative ─────────────────────────────────────────────────────────────

  test('TC-ORD-G05 | should return 404 for a non-existent orderId', async ({
    request,
    baseURL,
  }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    const response = await client.get(`/orders/${ORDERS_DATA.nonExistentOrderId}`);
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-ORD-G06 | should return 401 without Authorization header', async ({ apiClient }) => {
    const response = await apiClient.get('/orders/ORD-1001');
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-ORD-G07 | should return 403 or 404 when accessing another users order', async ({
    request,
    baseURL,
  }) => {
    // Create order as user A
    const { orderId } = await createOrder(request, baseURL);

    // Log in as user B (fresh user)
    const { token: tokenB } = await registerAndLogin(request, baseURL);
    const clientB = new ApiClient(request, baseURL);
    clientB.setToken(tokenB);

    const response = await clientB.get(`/orders/${orderId}`);
    expect([403, 404]).toContain(response.status());
  });
});
