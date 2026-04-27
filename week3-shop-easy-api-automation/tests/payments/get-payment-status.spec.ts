import { test, expect } from '../../fixtures/api-fixtures';
import { CART_DATA } from '../../test-data/cart.data';
import { PAYMENTS_DATA } from '../../test-data/payments.data';
import { registerAndLogin } from '../../helpers/auth-helper';
import { ApiClient } from '../../helpers/api-client';

/** Helper – create user, place order, and pay → return client + paymentId */
async function createPayment(
  request: Parameters<typeof registerAndLogin>[0],
  baseURL: string,
): Promise<{ client: ApiClient; paymentId: string; orderId: string }> {
  const { token } = await registerAndLogin(request, baseURL);
  const client = new ApiClient(request, baseURL);
  client.setToken(token);

  await client.post('/cart/items', CART_DATA.validItem);
  const orderRes = await client.post('/orders');
  const { orderId } = await orderRes.json();

  const payRes = await client.post('/payments', {
    orderId,
    method: PAYMENTS_DATA.defaultMethod,
  });
  const { paymentId } = await payRes.json();

  return { client, paymentId, orderId };
}

test.describe('GET /payments/{paymentId}', () => {
  test.beforeEach(({}, testInfo) => {
    testInfo.annotations.push({
      type: 'endpoint',
      description: 'GET /payments/{paymentId}',
    });
  });

  // ── Happy path ───────────────────────────────────────────────────────────

  test('TC-PAY-G01 | should return 200 with full payment status object', async ({
    request,
    baseURL,
  }) => {
    const { client, paymentId } = await createPayment(request, baseURL);

    const response = await client.get(`/payments/${paymentId}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    for (const field of PAYMENTS_DATA.expectedStatusFields) {
      expect(body).toHaveProperty(field);
    }
  });

  test('TC-PAY-G02 | paymentId in response should match the requested paymentId', async ({
    request,
    baseURL,
  }) => {
    const { client, paymentId } = await createPayment(request, baseURL);
    const response = await client.get(`/payments/${paymentId}`);
    const body = await response.json();
    expect(body.paymentId).toBe(paymentId);
  });

  test('TC-PAY-G03 | orderId in payment response should match the original order', async ({
    request,
    baseURL,
  }) => {
    const { client, paymentId, orderId } = await createPayment(request, baseURL);
    const response = await client.get(`/payments/${paymentId}`);
    const body = await response.json();
    expect(body.orderId).toBe(orderId);
  });

  test('TC-PAY-G04 | payment method should be one of the valid enum values', async ({
    request,
    baseURL,
  }) => {
    const { client, paymentId } = await createPayment(request, baseURL);
    const response = await client.get(`/payments/${paymentId}`);
    const body = await response.json();
    expect(PAYMENTS_DATA.methods as readonly string[]).toContain(body.method);
  });

  test('TC-PAY-G05 | payment amount should be a positive number', async ({
    request,
    baseURL,
  }) => {
    const { client, paymentId } = await createPayment(request, baseURL);
    const response = await client.get(`/payments/${paymentId}`);
    const body = await response.json();
    expect(typeof body.amount).toBe('number');
    expect(body.amount).toBeGreaterThan(0);
  });

  // ── Negative ─────────────────────────────────────────────────────────────

  test('TC-PAY-G06 | should return 404 for a non-existent paymentId', async ({
    request,
    baseURL,
  }) => {
    const { token } = await registerAndLogin(request, baseURL);
    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    const response = await client.get(
      `/payments/${PAYMENTS_DATA.nonExistentPaymentId}`,
    );
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-PAY-G07 | should return 401 without Authorization header', async ({ apiClient }) => {
    const response = await apiClient.get('/payments/PAY-5001');
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});
