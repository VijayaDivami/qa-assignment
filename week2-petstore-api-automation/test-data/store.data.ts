/** Unique suffix to isolate test data across runs */
const RUN_ID = Date.now();

export const STORE_DATA = {
  newOrder: {
    id: RUN_ID % 100_000, // Order IDs must fit int64; keep it manageable
    petId: 1,
    quantity: 2,
    shipDate: new Date(Date.now() + 86_400_000).toISOString(), // tomorrow
    status: 'placed',
    complete: false,
  },

  invalidOrderId: 9_999_999_999,
};
