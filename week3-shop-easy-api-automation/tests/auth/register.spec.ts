import { test, expect } from '../../fixtures/api-fixtures';
import { AUTH_DATA } from '../../test-data/auth.data';
import { generateNewUser } from '../../helpers/test-utils';

test.describe('POST /auth/register', () => {
  test.beforeEach(({}, testInfo) => {
    testInfo.annotations.push({ type: 'endpoint', description: 'POST /auth/register' });
  });

  // ── Happy path ───────────────────────────────────────────────────────────

  test('TC-AUTH-R01 | should return 201 with userId for a valid new user', async ({
    apiClient,
  }) => {
    const newUser = generateNewUser();
    const response = await apiClient.post('/auth/register', newUser);

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('userId');
    expect(body).toHaveProperty('message');
    expect(typeof body.userId).toBe('number');
  });

  test('TC-AUTH-R02 | registered user should be able to login immediately', async ({
    apiClient,
  }) => {
    const newUser = generateNewUser();

    const regRes = await apiClient.post('/auth/register', newUser);
    expect(regRes.status()).toBe(201);

    const loginRes = await apiClient.post('/auth/login', {
      email: newUser.email,
      password: newUser.password,
    });
    expect(loginRes.status()).toBe(200);
    const loginBody = await loginRes.json();
    expect(loginBody).toHaveProperty('token');
  });

  test('TC-AUTH-R03 | response Content-Type should be application/json', async ({ apiClient }) => {
    const response = await apiClient.post('/auth/register', generateNewUser());
    expect(response.headers()['content-type']).toContain('application/json');
  });

  // ── Negative – duplicate email ────────────────────────────────────────────

  test('TC-AUTH-R04 | should return 409 for an already-registered email', async ({ apiClient }) => {
    const response = await apiClient.post('/auth/register', AUTH_DATA.existingUser);
    expect(response.status()).toBe(409);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  // ── Negative – missing required fields ────────────────────────────────────

  test('TC-AUTH-R05 | should return 400 when email is missing', async ({ apiClient }) => {
    const response = await apiClient.post('/auth/register', {
      password: 'TestPass123!',
      name: 'No Email',
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-AUTH-R06 | should return 400 when password is missing', async ({ apiClient }) => {
    const response = await apiClient.post('/auth/register', {
      email: 'nopwd@example.com',
      name: 'No Password',
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-AUTH-R07 | should return 400 when name is missing', async ({ apiClient }) => {
    const response = await apiClient.post('/auth/register', {
      email: 'noname@example.com',
      password: 'TestPass123!',
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-AUTH-R08 | should return 400 for empty request body', async ({ apiClient }) => {
    const response = await apiClient.post('/auth/register', {});
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});
