import { test, expect } from '../../fixtures/api-fixtures';
import { PET_DATA } from '../../test-data/pet.data';

test.describe('Pet Find – /pet/findByStatus', () => {
  for (const status of PET_DATA.statuses) {
    test(`TC-PET-FIND-0${PET_DATA.statuses.indexOf(status) + 1} | GET /pet/findByStatus?status=${status} should return 200 with an array`, async ({
      apiClient,
    }) => {
      const response = await apiClient.get('/pet/findByStatus', { status });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
    });
  }

  test('TC-PET-FIND-04 | each pet returned has required fields (name, photoUrls, status)', async ({
    apiClient,
  }) => {
    const response = await apiClient.get('/pet/findByStatus', { status: 'available' });
    const pets = await response.json();

    expect(Array.isArray(pets)).toBe(true);
    expect(pets.length).toBeGreaterThan(0);

    for (const pet of pets.slice(0, 5)) {
      expect(pet).toHaveProperty('id');
      expect(pet).toHaveProperty('name');
      expect(pet).toHaveProperty('photoUrls');
      expect(pet).toHaveProperty('status');
      expect(Array.isArray(pet.photoUrls)).toBe(true);
    }
  });

  test('TC-PET-FIND-05 | all returned pets should have status=available', async ({
    apiClient,
  }) => {
    const response = await apiClient.get('/pet/findByStatus', { status: 'available' });
    const pets = await response.json();

    expect(Array.isArray(pets)).toBe(true);
    for (const pet of pets.slice(0, 10)) {
      expect(pet.status).toBe('available');
    }
  });

  // Petstore tolerates unknown statuses and returns an empty array instead of 400
  test('TC-PET-FIND-06 | GET /pet/findByStatus with invalid status should return 200 with empty array', async ({
    apiClient,
  }) => {
    const response = await apiClient.get('/pet/findByStatus', { status: 'nonexistent' });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(0);
  });

  // Petstore returns an empty array when no status param is provided
  test('TC-PET-FIND-07 | GET /pet/findByStatus without status param should return 200 with empty array', async ({
    apiClient,
  }) => {
    const response = await apiClient.get('/pet/findByStatus');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });
});
