/**
 * Shared test utilities used across all test suites.
 */

/**
 * Generate a unique email address for test user registration.
 * Combines a timestamp and random suffix to guarantee uniqueness across parallel runs.
 */
export function uniqueEmail(): string {
  const suffix = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  return `testuser_${suffix}@example.com`;
}

/**
 * Returns a complete new-user registration payload with a unique email.
 */
export function generateNewUser(): { email: string; password: string; name: string } {
  return {
    email: uniqueEmail(),
    password: 'TestPass123!',
    name: `Test User ${Date.now()}`,
  };
}

/**
 * Parse and return the JSON body from an APIResponse, with a typed return.
 * Re-exported here so tests don't need to call `await response.json()` everywhere.
 */
export async function jsonBody<T = Record<string, unknown>>(
  response: { json(): Promise<unknown> },
): Promise<T> {
  return (await response.json()) as T;
}

/**
 * Build a valid payment request body for a given orderId.
 */
export function buildPaymentPayload(
  orderId: string,
  method: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' = 'credit_card',
): { orderId: string; method: string } {
  return { orderId, method };
}
