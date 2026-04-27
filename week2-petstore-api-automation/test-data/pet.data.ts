/** Unique suffix to isolate test data across runs */
const RUN_ID = Date.now();

export const PET_DATA = {
  newPet: {
    id: RUN_ID,
    category: { id: 1, name: 'Dogs' },
    name: `Buddy-${RUN_ID}`,
    photoUrls: ['https://example.com/buddy.jpg'],
    tags: [{ id: 1, name: 'friendly' }],
    status: 'available',
  },

  updatedPet: {
    id: RUN_ID,
    category: { id: 1, name: 'Dogs' },
    name: `Buddy-Updated-${RUN_ID}`,
    photoUrls: ['https://example.com/buddy-updated.jpg'],
    tags: [{ id: 1, name: 'friendly' }],
    status: 'sold',
  },

  missingRequiredFields: {
    id: RUN_ID + 1,
    // name and photoUrls intentionally omitted
    status: 'available',
  },

  statuses: ['available', 'pending', 'sold'] as const,
};
