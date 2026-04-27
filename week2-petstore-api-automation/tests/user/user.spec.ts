import { test, expect } from '../../fixtures/api-fixtures';
import { USER_DATA } from '../../test-data/user.data';

test.describe('User – /user', () => {
  // TC-USER-01: Create a new user
  test('TC-USER-01 | POST /user should create a user and return 200', async ({ apiClient }) => {
    const response = await apiClient.post('/user', USER_DATA.newUser);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  // TC-USER-02: Get the user by username
  test('TC-USER-02 | GET /user/{username} should return the created user', async ({
    apiClient,
  }) => {
    const response = await apiClient.get(`/user/${USER_DATA.newUser.username}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.username).toBe(USER_DATA.newUser.username);
    expect(body.firstName).toBe(USER_DATA.newUser.firstName);
    expect(body.email).toBe(USER_DATA.newUser.email);
  });

  // TC-USER-03: Response Content-Type
  test('TC-USER-03 | GET /user/{username} response Content-Type should be application/json', async ({
    apiClient,
  }) => {
    const response = await apiClient.get(`/user/${USER_DATA.newUser.username}`);

    expect(response.headers()['content-type']).toContain('application/json');
  });

  // TC-USER-04: User login – Petstore returns {code, type, message} where message contains the session token
  test('TC-USER-04 | GET /user/login with valid credentials should return 200 with a session message', async ({
    apiClient,
  }) => {
    const response = await apiClient.get('/user/login', {
      username: USER_DATA.newUser.username,
      password: USER_DATA.newUser.password,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('message');
    expect(typeof body.message).toBe('string');
    expect(body.message.length).toBeGreaterThan(0);
  });

  // TC-USER-05: Login sets session rate-limit header
  test('TC-USER-05 | GET /user/login should return X-Rate-Limit and X-Expires-After headers', async ({
    apiClient,
  }) => {
    const response = await apiClient.get('/user/login', {
      username: USER_DATA.newUser.username,
      password: USER_DATA.newUser.password,
    });

    expect(response.headers()).toHaveProperty('x-rate-limit');
    expect(response.headers()).toHaveProperty('x-expires-after');
  });

  // TC-USER-06: Login without credentials – Petstore returns 200 with a session message (no validation enforced)
  test('TC-USER-06 | GET /user/login without credentials should return 200', async ({
    apiClient,
  }) => {
    const response = await apiClient.get('/user/login');

    expect(response.status()).toBe(200);
  });

  // TC-USER-07: Update user
  test('TC-USER-07 | PUT /user/{username} should update the user and return 200', async ({
    apiClient,
  }) => {
    const response = await apiClient.put(
      `/user/${USER_DATA.newUser.username}`,
      USER_DATA.updatedUser,
    );

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  // TC-USER-08: Verify update persisted
  test('TC-USER-08 | GET /user/{username} should reflect updated values', async ({ apiClient }) => {
    const response = await apiClient.get(`/user/${USER_DATA.newUser.username}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstName).toBe(USER_DATA.updatedUser.firstName);
    expect(body.email).toBe(USER_DATA.updatedUser.email);
  });

  // TC-USER-09: User logout
  test('TC-USER-09 | GET /user/logout should return 200', async ({ apiClient }) => {
    const response = await apiClient.get('/user/logout');

    expect(response.status()).toBe(200);
  });

  // TC-USER-10: Delete user
  test('TC-USER-10 | DELETE /user/{username} should delete the user and return 200', async ({
    apiClient,
  }) => {
    const response = await apiClient.delete(`/user/${USER_DATA.newUser.username}`);

    expect(response.status()).toBe(200);
  });

  // TC-USER-11: Get deleted user returns 404
  test('TC-USER-11 | GET /user/{username} after deletion should return 404', async ({
    apiClient,
  }) => {
    const response = await apiClient.get(`/user/${USER_DATA.newUser.username}`);

    expect(response.status()).toBe(404);
  });

  // TC-USER-12: Get non-existent user
  test('TC-USER-12 | GET /user/{username} for unknown username should return 404', async ({
    apiClient,
  }) => {
    const response = await apiClient.get('/user/thisuserdoesnotexist_xyz_999');

    expect(response.status()).toBe(404);
  });
});
