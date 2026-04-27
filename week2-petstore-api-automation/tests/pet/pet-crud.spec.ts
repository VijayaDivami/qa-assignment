import { test, expect } from '../../fixtures/api-fixtures';
import { PET_DATA } from '../../test-data/pet.data';

test.describe('Pet CRUD – /pet', () => {
  // TC-PET-01: Create a new pet
  test('TC-PET-01 | POST /pet should create a pet and return 200', async ({ authClient }) => {
    const response = await authClient.post('/pet', PET_DATA.newPet);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(PET_DATA.newPet.id);
    expect(body.name).toBe(PET_DATA.newPet.name);
    expect(body.status).toBe('available');
  });

  // TC-PET-02: Get the pet by ID
  test('TC-PET-02 | GET /pet/{petId} should return the created pet', async ({ authClient }) => {
    const response = await authClient.get(`/pet/${PET_DATA.newPet.id}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(PET_DATA.newPet.id);
    expect(body.name).toBe(PET_DATA.newPet.name);
    expect(body).toHaveProperty('photoUrls');
    expect(Array.isArray(body.photoUrls)).toBe(true);
  });

  // TC-PET-03: Response Content-Type is application/json
  test('TC-PET-03 | GET /pet/{petId} response Content-Type should be application/json', async ({
    authClient,
  }) => {
    const response = await authClient.get(`/pet/${PET_DATA.newPet.id}`);

    expect(response.headers()['content-type']).toContain('application/json');
  });

  // TC-PET-04: Update the pet
  test('TC-PET-04 | PUT /pet should update the pet and return 200', async ({ authClient }) => {
    const response = await authClient.put('/pet', PET_DATA.updatedPet);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe(PET_DATA.updatedPet.name);
    expect(body.status).toBe('sold');
  });

  // TC-PET-05: Verify the update persisted
  test('TC-PET-05 | GET /pet/{petId} should reflect updated values', async ({ authClient }) => {
    const response = await authClient.get(`/pet/${PET_DATA.newPet.id}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe(PET_DATA.updatedPet.name);
    expect(body.status).toBe('sold');
  });

  // TC-PET-06: Delete the pet
  test('TC-PET-06 | DELETE /pet/{petId} should delete the pet and return 200', async ({
    authClient,
  }) => {
    const response = await authClient.delete(`/pet/${PET_DATA.newPet.id}`);

    expect(response.status()).toBe(200);
  });

  // TC-PET-07: Get deleted pet returns 404
  test('TC-PET-07 | GET /pet/{petId} after deletion should return 404', async ({ authClient }) => {
    const response = await authClient.get(`/pet/${PET_DATA.newPet.id}`);

    expect(response.status()).toBe(404);
  });

  // TC-PET-08: Get pet with non-existent ID
  test('TC-PET-08 | GET /pet/{petId} for unknown ID should return 404', async ({ apiClient }) => {
    const response = await apiClient.get('/pet/99999999999');

    expect(response.status()).toBe(404);
  });

  // TC-PET-09: Invalid ID format – Petstore returns 404 with a NumberFormatException message
  test('TC-PET-09 | GET /pet/{petId} with invalid ID format should return 404', async ({
    apiClient,
  }) => {
    const response = await apiClient.get('/pet/not-a-number');

    expect(response.status()).toBe(404);
  });
});
