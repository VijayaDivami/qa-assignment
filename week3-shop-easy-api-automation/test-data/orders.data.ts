export const ORDERS_DATA = {
  /** A placeholder – real IDs are obtained at runtime from POST /orders */
  placeholderOrderId: 'ORD-0000',

  /** An order ID that should never exist */
  nonExistentOrderId: 'ORD-999999',

  /** Expected fields on an Order object */
  expectedFields: ['orderId', 'status', 'total', 'items', 'createdAt'],

  /** Valid statuses per the OpenAPI spec */
  validStatuses: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
} as const;
