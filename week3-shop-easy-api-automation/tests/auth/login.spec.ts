import { test, expect } from '../../fixtures/api-fixtures';
import { AUTH_DATA } from '../../test-data/auth.data';

test.describe('POST /auth/login', () => {
  test.beforeEach(({}, testInfo) => {
    testInfo.annotations.push({ type: 'endpoint', description: 'POST /auth/login' });
  });

  // ── Happy path ───────────────────────────────────────────────────────────

  test('TC-AUTH-L01 | should return 200 with token and userId for valid credentials', async ({
    apiClient,
  }) => {
    const response = await apiClient.post('/auth/login', AUTH_DATA.validAdmin);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('userId');
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
    expect(typeof body.userId).toBe('number');
  });

  test('TC-AUTH-L02 | token returned should be a non-empty string', async ({ apiClient }) => {
    const response = await apiClient.post('/auth/login', AUTH_DATA.validAdmin);
    const { token } = await response.json();
    expect(typeof token).toBe('string');
    expect(token.trim().length).toBeGreaterThan(0);
  });

  test('TC-AUTH-L03 | response Content-Type should be application/json', async ({ apiClient }) => {
    const response = await apiClient.post('/auth/login', AUTH_DATA.validAdmin);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  // ── Negative – wrong credentials ─────────────────────────────────────────

  test('TC-AUTH-L04 | should return 401 for incorrect password', async ({ apiClient }) => {
    const response = await apiClient.post('/auth/login', AUTH_DATA.invalidCredentials);
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-AUTH-L05 | should return 401 for non-existent email', async ({ apiClient }) => {
    const response = await apiClient.post('/auth/login', AUTH_DATA.nonExistentUser);
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  // ── Negative – missing fields ─────────────────────────────────────────────

  test('TC-AUTH-L06 | should return 400 when email is missing', async ({ apiClient }) => {
    const response = await apiClient.post('/auth/login', { password: 'password123' });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-AUTH-L07 | should return 400 when password is missing', async ({ apiClient }) => {
    const response = await apiClient.post('/auth/login', {
      email: 'admin@shopeasy.com',
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-AUTH-L08 | should return 400 for empty request body', async ({ apiClient }) => {
    const response = await apiClient.post('/auth/login', {});
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  // ── Security ──────────────────────────────────────────────────────────────

  test('TC-AUTH-L09 | error response should not expose stack trace or passwords', async ({
    apiClient,
  }) => {
    const response = await apiClient.post('/auth/login', AUTH_DATA.invalidCredentials);
    const text = await response.text();
    expect(text).not.toContain('stack');
    expect(text).not.toContain('password');
  });
});
