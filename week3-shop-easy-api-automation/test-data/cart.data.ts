export const CART_DATA = {
  /** Valid item to add */
  validItem: {
    productId: 1,
    quantity: 2,
  },

  /** A second distinct product for multi-item cart tests */
  secondItem: {
    productId: 2,
    quantity: 1,
  },

  /** Minimum valid quantity */
  minQuantityItem: {
    productId: 1,
    quantity: 1,
  },

  /** Product ID that does not exist in the catalogue */
  nonExistentProductItem: {
    productId: 999999,
    quantity: 1,
  },

  /** Quantity below the minimum (1) */
  zeroQuantityItem: {
    productId: 1,
    quantity: 0,
  },

  /** Missing productId field */
  missingProductId: {
    quantity: 2,
  },

  /** Missing quantity field */
  missingQuantity: {
    productId: 1,
  },
} as const;
