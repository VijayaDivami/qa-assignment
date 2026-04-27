import { test, expect } from '../../fixtures/api-fixtures';
import { CART_DATA } from '../../test-data/cart.data';
import { PAYMENTS_DATA } from '../../test-data/payments.data';
import { registerAndLogin } from '../../helpers/auth-helper';
import { ApiClient } from '../../helpers/api-client';

/** Helper – register user, add cart item, place order → return client + orderId */
async function createReadyOrder(
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

test.describe('POST /payments', () => {
  test.beforeEach(({}, testInfo) => {
    testInfo.annotations.push({ type: 'endpoint', description: 'POST /payments' });
  });

  // ── Happy path – all payment methods ─────────────────────────────────────

  for (const method of PAYMENTS_DATA.methods) {
    test(`TC-PAY-I-${method.toUpperCase()} | should return 201 for method "${method}"`, async ({
      request,
      baseURL,
    }) => {
      const { client, orderId } = await createReadyOrder(request, baseURL);

      const response = await client.post('/payments', { orderId, method });

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty('paymentId');
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('amount');
      expect(body).toHaveProperty('message');
    });
  }

  // ── Happy path – field assertions ────────────────────────────────────────

  test('TC-PAY-I01 | paymentId in response should be a non-empty string', async ({
    request,
    baseURL,
  }) => {
    const { client, orderId } = await createReadyOrder(request, baseURL);
    const response = await client.post('/payments', {
      orderId,
      method: PAYMENTS_DATA.defaultMethod,
    });
    const body = await response.json();
    expect(typeof body.paymentId).toBe('string');
    expect(body.paymentId.trim().length).toBeGreaterThan(0);
  });

  test('TC-PAY-I02 | payment amount should be a positive number', async ({
    request,
    baseURL,
  }) => {
    const { client, orderId } = await createReadyOrder(request, baseURL);
    const response = await client.post('/payments', {
      orderId,
      method: PAYMENTS_DATA.defaultMethod,
    });
    const body = await response.json();
    expect(typeof body.amount).toBe('number');
    expect(body.amount).toBeGreaterThan(0);
  });

  // ── Negative ─────────────────────────────────────────────────────────────

  test('TC-PAY-I03 | should return 409 for a duplicate payment on the same order', async ({
    request,
    baseURL,
  }) => {
    const { client, orderId } = await createReadyOrder(request, baseURL);
    const payload = { orderId, method: PAYMENTS_DATA.defaultMethod };

    await client.post('/payments', payload); // first payment
    const response = await client.post('/payments', payload); // duplicate

    expect(response.status()).toBe(409);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-PAY-I04 | should return 404 for a non-existent orderId', async ({
    request,
    baseURL,
  }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    const response = await client.post('/payments', {
      orderId: 'ORD-999999',
      method: PAYMENTS_DATA.defaultMethod,
    });
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-PAY-I05 | should return 400 when orderId is missing', async ({
    request,
    baseURL,
  }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    const response = await client.post('/payments', PAYMENTS_DATA.missingOrderId);
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-PAY-I06 | should return 400 when method is missing', async ({
    request,
    baseURL,
  }) => {
    const { client, orderId } = await createReadyOrder(request, baseURL);
    const response = await client.post('/payments', { orderId });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-PAY-I07 | should return 401 without Authorization header', async ({ apiClient }) => {
    const response = await apiClient.post('/payments', {
      orderId: 'ORD-1001',
      method: PAYMENTS_DATA.defaultMethod,
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});
