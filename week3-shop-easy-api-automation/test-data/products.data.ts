export const PRODUCTS_DATA = {
  /** A product ID that should exist in the seeded catalogue */
  validId: 1,

  /** A product ID that should NOT exist */
  nonExistentId: 999999,

  /** Filters for list endpoint */
  filters: {
    byCategory: { category: 'electronics' },
    withPagination: { page: 1, limit: 5 },
    combined: { category: 'electronics', page: 1, limit: 3 },
  },

  /** Schema fields expected on every Product object */
  expectedFields: ['id', 'name', 'price', 'category', 'stock'],

  /** Schema fields expected on the list response envelope */
  listEnvelopeFields: ['total', 'page', 'limit', 'data'],
} as const;
