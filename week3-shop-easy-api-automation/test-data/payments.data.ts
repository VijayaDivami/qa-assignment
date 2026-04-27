export const PAYMENTS_DATA = {
  /** Valid payment methods per OpenAPI enum */
  methods: ['credit_card', 'debit_card', 'upi', 'net_banking'] as const,

  /** Default method used in most tests */
  defaultMethod: 'credit_card' as const,

  /** A payment ID that should never exist */
  nonExistentPaymentId: 'PAY-999999',

  /** Missing orderId payload */
  missingOrderId: {
    method: 'credit_card',
  },

  /** Missing method payload */
  missingMethod: {
    orderId: 'ORD-0000',
  },

  /** Expected fields on a payment status response */
  expectedStatusFields: ['paymentId', 'orderId', 'method', 'amount', 'status', 'processedAt'],
} as const;
