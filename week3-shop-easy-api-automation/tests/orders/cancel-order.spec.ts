import { test, expect } from '../../fixtures/api-fixtures';
import { CART_DATA } from '../../test-data/cart.data';
import { ORDERS_DATA } from '../../test-data/orders.data';
import { PAYMENTS_DATA } from '../../test-data/payments.data';
import { registerAndLogin } from '../../helpers/auth-helper';
import { ApiClient } from '../../helpers/api-client';

/** Helper – create user + order, return client and orderId */
async function createPendingOrder(
  request: Parameters<typeof registerAndLogin>[0],
  baseURL: string,
): Promise<{ client: ApiClient; orderId: string }> {
  const { token } = await registerAndLogin(request, baseURL);
  const client = new ApiClient(request, baseURL);
  client.setToken(token);

  await client.post('/cart/items', CART_DATA.validItem);
  const orderRes = await client.post('/orders');
  const { orderId } = await orderRes.json();
  return { client, orderId };
}

test.describe('DELETE /orders/{orderId}/cancel', () => {
  test.beforeEach(({}, testInfo) => {
    testInfo.annotations.push({
      type: 'endpoint',
      description: 'DELETE /orders/{orderId}/cancel',
    });
  });

  // ── Happy path ───────────────────────────────────────────────────────────

  test('TC-ORD-C01 | should return 200 when cancelling a pending order', async ({
    request,
    baseURL,
  }) => {
    const { client, orderId } = await createPendingOrder(request, baseURL);

    const response = await client.delete(`/orders/${orderId}/cancel`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('orderId');
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('message');
  });

  test('TC-ORD-C02 | cancelled order status should be "cancelled"', async ({
    request,
    baseURL,
  }) => {
    const { client, orderId } = await createPendingOrder(request, baseURL);
    await client.delete(`/orders/${orderId}/cancel`);

    const getRes = await client.get(`/orders/${orderId}`);
    const body = await getRes.json();
    expect(body.status).toBe('cancelled');
  });

  test('TC-ORD-C03 | cancellation response orderId should match requested orderId', async ({
    request,
    baseURL,
  }) => {
    const { client, orderId } = await createPendingOrder(request, baseURL);
    const response = await client.delete(`/orders/${orderId}/cancel`);
    const body = await response.json();
    expect(body.orderId).toBe(orderId);
  });

  test('TC-ORD-C04 | should allow cancellation of a paid order (returns 200)', async ({
    request,
    baseURL,
  }) => {
    const { client, orderId } = await createPendingOrder(request, baseURL);

    // Pay for the order first
    await client.post('/payments', {
      orderId,
      method: PAYMENTS_DATA.defaultMethod,
    });

    // Per the API spec 422 only applies to shipped/delivered orders.
    // A paid (but not yet shipped) order can still be cancelled → expect 200.
    const response = await client.delete(`/orders/${orderId}/cancel`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('orderId');
    expect(body).toHaveProperty('status');
    expect(body.status).toBe('cancelled');
  });

  // ── Negative ─────────────────────────────────────────────────────────────

  test('TC-ORD-C05 | should return 404 for a non-existent orderId', async ({
    request,
    baseURL,
  }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    const response = await client.delete(
      `/orders/${ORDERS_DATA.nonExistentOrderId}/cancel`,
    );
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-ORD-C06 | should return 401 without Authorization header', async ({ apiClient }) => {
    const response = await apiClient.delete('/orders/ORD-1001/cancel');
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});
