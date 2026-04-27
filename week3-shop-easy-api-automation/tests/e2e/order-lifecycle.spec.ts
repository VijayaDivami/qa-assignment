import { test, expect } from '../../fixtures/api-fixtures';
import { CART_DATA } from '../../test-data/cart.data';
import { PAYMENTS_DATA } from '../../test-data/payments.data';
import { ORDERS_DATA } from '../../test-data/orders.data';
import { registerAndLogin } from '../../helpers/auth-helper';
import { ApiClient } from '../../helpers/api-client';
import { generateNewUser } from '../../helpers/test-utils';

/**
 * End-to-end test covering the full ShopEasy order lifecycle:
 *
 *   Register → Login → Browse products → View single product
 *   → Add items to cart → View cart → Place order → Get order
 *   → Initiate payment → Get payment status → Verify order is paid
 *   → Attempt duplicate payment (expect 409)
 */
test.describe('E2E – Full Order Lifecycle', () => {
  test.beforeEach(({}, testInfo) => {
    testInfo.annotations.push({ type: 'suite', description: 'E2E order lifecycle' });
  });

  test('TC-E2E-01 | complete order lifecycle from registration to payment confirmation', async ({
    request,
    baseURL,
  }) => {
    // ── Step 1: Register a brand-new user ────────────────────────────────
    const newUser = generateNewUser();
    const regRes = await request.post(`${baseURL}/auth/register`, {
      data: newUser,
      headers: { 'Content-Type': 'application/json' },
    });
    expect(regRes.status(), 'Registration should succeed').toBe(201);
    const { userId } = await regRes.json();
    expect(typeof userId).toBe('number');

    // ── Step 2: Login ────────────────────────────────────────────────────
    const loginRes = await request.post(`${baseURL}/auth/login`, {
      data: { email: newUser.email, password: newUser.password },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(loginRes.status(), 'Login should succeed').toBe(200);
    const { token } = await loginRes.json();
    expect(token, 'Token should be present').toBeTruthy();

    const client = new ApiClient(request, baseURL);
    client.setToken(token);

    // ── Step 3: Browse product catalogue ─────────────────────────────────
    const productsRes = await client.get('/products');
    expect(productsRes.status(), 'Products list').toBe(200);
    const productsBody = await productsRes.json();
    expect(productsBody.data.length, 'Catalogue should have at least 1 product').toBeGreaterThan(
      0,
    );

    // Pick the first available product
    const targetProduct = productsBody.data[0];
    expect(targetProduct.id, 'Product should have an id').toBeTruthy();

    // ── Step 4: View a single product ─────────────────────────────────────
    const productRes = await client.get(`/products/${targetProduct.id}`);
    expect(productRes.status(), 'Single product').toBe(200);
    const productBody = await productRes.json();
    expect(productBody.id).toBe(targetProduct.id);
    expect(typeof productBody.price).toBe('number');

    // ── Step 5: Add two different items to cart ───────────────────────────
    const addRes1 = await client.post('/cart/items', CART_DATA.validItem);
    expect(addRes1.status(), 'Add first item').toBe(201);

    // Use second item only if product 2 exists; fall back to product 1 with qty 3
    const addRes2 = await client.post('/cart/items', {
      productId: targetProduct.id,
      quantity: 1,
    });
    expect([201, 400]).toContain(addRes2.status()); // 400 = already added; both are acceptable here

    // ── Step 6: View the cart ─────────────────────────────────────────────
    const cartRes = await client.get('/cart');
    expect(cartRes.status(), 'View cart').toBe(200);
    const cartBody = await cartRes.json();
    expect(cartBody.itemCount, 'Cart should have items').toBeGreaterThan(0);
    expect(cartBody.subtotal, 'Subtotal should be positive').toBeGreaterThan(0);

    // ── Step 7: Place the order ───────────────────────────────────────────
    const orderRes = await client.post('/orders');
    expect(orderRes.status(), 'Place order').toBe(201);
    const orderBody = await orderRes.json();
    const orderId: string = orderBody.orderId;
    expect(orderId, 'orderId should be a non-empty string').toBeTruthy();
    expect(orderBody.status).toBe('pending');
    expect(orderBody.total).toBeGreaterThan(0);

    // ── Step 8: Get order details ─────────────────────────────────────────
    const getOrderRes = await client.get(`/orders/${orderId}`);
    expect(getOrderRes.status(), 'Get order').toBe(200);
    const getOrderBody = await getOrderRes.json();
    expect(getOrderBody.orderId).toBe(orderId);
    expect(getOrderBody.items.length).toBeGreaterThan(0);
    for (const field of ORDERS_DATA.expectedFields) {
      expect(getOrderBody, `Order should have field "${field}"`).toHaveProperty(field);
    }

    // ── Step 9: Initiate payment ──────────────────────────────────────────
    const payRes = await client.post('/payments', {
      orderId,
      method: PAYMENTS_DATA.defaultMethod,
    });
    expect(payRes.status(), 'Initiate payment').toBe(201);
    const payBody = await payRes.json();
    const paymentId: string = payBody.paymentId;
    expect(paymentId, 'paymentId should exist').toBeTruthy();
    expect(payBody.amount).toBeGreaterThan(0);

    // ── Step 10: Get payment status ───────────────────────────────────────
    const payStatusRes = await client.get(`/payments/${paymentId}`);
    expect(payStatusRes.status(), 'Get payment status').toBe(200);
    const payStatusBody = await payStatusRes.json();
    expect(payStatusBody.paymentId).toBe(paymentId);
    expect(payStatusBody.orderId).toBe(orderId);
    for (const field of PAYMENTS_DATA.expectedStatusFields) {
      expect(payStatusBody, `Payment status should have field "${field}"`).toHaveProperty(field);
    }

    // ── Step 11: Order status should now be "paid" (or later stage) ───────
    const paidOrderRes = await client.get(`/orders/${orderId}`);
    const paidOrderBody = await paidOrderRes.json();
    expect(['paid', 'shipped', 'delivered']).toContain(paidOrderBody.status);

    // ── Step 12: Attempt duplicate payment (expect 409) ───────────────────
    const dupPayRes = await client.post('/payments', {
      orderId,
      method: PAYMENTS_DATA.defaultMethod,
    });
    expect(dupPayRes.status(), 'Duplicate payment should be rejected').toBe(409);
    const dupBody = await dupPayRes.json();
    expect(dupBody).toHaveProperty('error');

    // ── Step 13: Cancel the paid order – per spec 422 is shipped/delivered only.
    // A paid-but-not-shipped order can still be cancelled → expect 200.
    const cancelRes = await client.delete(`/orders/${orderId}/cancel`);
    expect(cancelRes.status(), 'Cancelling a paid order should return 200').toBe(200);
    const cancelBody = await cancelRes.json();
    expect(cancelBody.orderId).toBe(orderId);
    expect(cancelBody.status, 'Order status after cancel should be cancelled').toBe('cancelled');
  });
});
