import { test, expect } from '../../fixtures/api-fixtures';
import { STORE_DATA } from '../../test-data/store.data';

test.describe('Store – /store', () => {
  // TC-STORE-01: Get inventory
  test('TC-STORE-01 | GET /store/inventory should return 200 with a status map', async ({
    authClient,
  }) => {
    const response = await authClient.get('/store/inventory');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body).toBe('object');
    expect(body).not.toBeNull();
  });

  // TC-STORE-02: Inventory keys are status strings with numeric values
  test('TC-STORE-02 | GET /store/inventory values should all be numbers', async ({
    authClient,
  }) => {
    const response = await authClient.get('/store/inventory');
    const body = await response.json();

    for (const value of Object.values(body)) {
      expect(typeof value).toBe('number');
    }
  });

  // TC-STORE-03: Place an order
  test('TC-STORE-03 | POST /store/order should create an order and return 200', async ({
    apiClient,
  }) => {
    const response = await apiClient.post('/store/order', STORE_DATA.newOrder);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(STORE_DATA.newOrder.id);
    expect(body.petId).toBe(STORE_DATA.newOrder.petId);
    expect(body.quantity).toBe(STORE_DATA.newOrder.quantity);
    expect(body.status).toBe('placed');
  });

  // TC-STORE-04: Get the order by ID
  test('TC-STORE-04 | GET /store/order/{orderId} should return the placed order', async ({
    apiClient,
  }) => {
    const response = await apiClient.get(`/store/order/${STORE_DATA.newOrder.id}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(STORE_DATA.newOrder.id);
    expect(body).toHaveProperty('petId');
    expect(body).toHaveProperty('status');
  });

  // TC-STORE-05: Response Content-Type
  test('TC-STORE-05 | GET /store/order/{orderId} response Content-Type should be application/json', async ({
    apiClient,
  }) => {
    const response = await apiClient.get(`/store/order/${STORE_DATA.newOrder.id}`);

    expect(response.headers()['content-type']).toContain('application/json');
  });

  // TC-STORE-06: Delete the order
  test('TC-STORE-06 | DELETE /store/order/{orderId} should delete the order and return 200', async ({
    apiClient,
  }) => {
    const response = await apiClient.delete(`/store/order/${STORE_DATA.newOrder.id}`);

    expect(response.status()).toBe(200);
  });

  // TC-STORE-07: Get deleted order returns 404
  test('TC-STORE-07 | GET /store/order/{orderId} after deletion should return 404', async ({
    apiClient,
  }) => {
    const response = await apiClient.get(`/store/order/${STORE_DATA.newOrder.id}`);

    expect(response.status()).toBe(404);
  });

  // TC-STORE-08: Non-existent order ID
  test('TC-STORE-08 | GET /store/order/{orderId} for unknown ID should return 404', async ({
    apiClient,
  }) => {
    const response = await apiClient.get(`/store/order/${STORE_DATA.invalidOrderId}`);

    expect(response.status()).toBe(404);
  });

  // TC-STORE-09: Invalid order ID format – Petstore returns 404 with a NumberFormatException message
  test('TC-STORE-09 | GET /store/order/{orderId} with invalid ID format should return 404', async ({
    apiClient,
  }) => {
    const response = await apiClient.get('/store/order/not-a-number');

    expect(response.status()).toBe(404);
  });

  // TC-STORE-10: Petstore accepts an empty order body and defaults all fields to zero values
  test('TC-STORE-10 | POST /store/order with empty body should return 200 with default values', async ({
    apiClient,
  }) => {
    const response = await apiClient.post('/store/order', {});

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.quantity).toBe(0);
  });
});
