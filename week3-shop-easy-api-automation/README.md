# ShopEasy API Automation

Playwright-based API automation suite for the **ShopEasy Order Management API**.

## Project Structure

```
api-automation/
├── .env                         # Environment variables (not committed)
├── playwright.config.ts         # Playwright configuration
├── fixtures/
│   └── api-fixtures.ts          # Reusable Playwright test fixtures
├── helpers/
│   ├── api-client.ts            # HTTP client wrapper (auth-aware)
│   ├── auth-helper.ts           # Token management
│   └── test-utils.ts            # Test utilities (user generation, etc.)
├── reporters/
│   └── custom-reporter.ts       # Endpoint-coverage reporter
├── reports/                     # Auto-generated on test run
│   ├── html-report/             # Playwright HTML report
│   ├── json-report/             # Raw JSON results
│   └── coverage-report/         # Endpoint coverage (HTML + JSON)
├── scripts/
│   └── coverage-report.ts       # Standalone coverage analysis script
├── test-artifacts/              # Traces, screenshots from failed tests
├── test-data/
│   ├── auth.data.ts
│   ├── cart.data.ts
│   ├── orders.data.ts
│   ├── payments.data.ts
│   └── products.data.ts
└── tests/
    ├── auth/                    # POST /auth/login, POST /auth/register
    ├── products/                # GET /products, GET /products/{id}
    ├── cart/                    # POST|GET|DELETE /cart
    ├── orders/                  # POST|GET|DELETE /orders
    ├── payments/                # POST|GET /payments
    └── e2e/                     # Full order lifecycle flow
```

## Prerequisites

- Node.js ≥ 18
- ShopEasy backend running (`http://localhost:3000`)
  - Swagger UI is served at `http://localhost:8080`

## Setup

```bash
npm install
```

## Running Tests

```bash
# Run all tests
npm test

# Run by module
npm run test:auth
npm run test:products
npm run test:cart
npm run test:orders
npm run test:payments
npm run test:e2e

# CI mode (retries enabled, strict)
npm run test:ci
```

## Reports

After a test run three reports are generated automatically:

| Report | Location | Description |
|---|---|---|
| HTML (Playwright) | `reports/html-report/index.html` | Interactive test results with request/response details |
| JSON | `reports/json-report/results.json` | Machine-readable raw results |
| Coverage | `reports/coverage-report/coverage.html` | Endpoint coverage summary |

Open the Playwright HTML report:
```bash
npm run report:html
```

Generate a standalone coverage report:
```bash
npm run report:coverage
```

## API Coverage

| Module | Endpoints | Tests |
|---|---|---|
| Auth | `POST /auth/login`, `POST /auth/register` | 12 |
| Products | `GET /products`, `GET /products/{id}` | 10 |
| Cart | `POST /cart/items`, `GET /cart`, `DELETE /cart/items/{itemId}` | 12 |
| Orders | `POST /orders`, `GET /orders/{orderId}`, `DELETE /orders/{orderId}/cancel` | 12 |
| Payments | `POST /payments`, `GET /payments/{paymentId}` | 10 |
| E2E | Full lifecycle | 1 |
| **Total** | **12 endpoints** | **~57 tests** |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `API_BASE_URL` | `http://localhost:3000` | Backend API base URL |
| `ADMIN_EMAIL` | `admin@shopeasy.com` | Pre-seeded admin email |
| `ADMIN_PASSWORD` | `password123` | Pre-seeded admin password |
