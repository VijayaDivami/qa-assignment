# Sweet Shop UI Automation

Playwright end-to-end test suite for [sweetshop.netlify.app](https://sweetshop.netlify.app) — a retro sweet shop demo application. Tests run against Chromium, Firefox, and WebKit in parallel.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [Playwright](https://playwright.dev) | ^1.44.0 | Browser automation & test runner |
| TypeScript | ^5.4.0 | Type-safe test authoring |
| dotenv | ^16.0.0 | Environment variable management |
| Node.js | ≥18 | Runtime |

---

## Prerequisites

- Node.js 18 or later
- npm

---

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

---

## Configuration

Copy `.env.example` to `.env` and fill in values if you need to override defaults:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `BASE_URL` | `https://sweetshop.netlify.app` | Application under test |
| `LOGIN_EMAIL` | `testuser@sweetshop.com` | Email used in login tests |
| `LOGIN_PASSWORD` | `Password123!` | Password used in login tests |

The `playwright.config.ts` reads `BASE_URL` automatically via `use.baseURL`.

---

## Running Tests

```bash
# Run all tests across all browsers (parallel)
npm test

# Run in headed mode (browser windows visible)
npm run test:headed

# Run a single browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run only end-to-end journeys
npm run test:e2e

# Open the HTML report after a run
npm run report
```

### Useful one-off commands

```bash
# Run a specific spec file
npx playwright test tests/specs/sweets.spec.ts

# Run tests matching a name pattern
npx playwright test --grep "SW-08"

# Run with trace viewer enabled
npx playwright test --trace on

# Show a saved trace
npx playwright show-trace test-results/<folder>/trace.zip
```

---

## Project Structure

```
qa-assignment/
├── tests/
│   ├── fixtures/
│   │   └── testData.ts          # Centralised test data (products, credentials, billing)
│   ├── pages/                   # Page Object Model classes
│   │   ├── BasketPage.ts
│   │   ├── HomePage.ts
│   │   ├── LoginPage.ts
│   │   └── SweetsPage.ts
│   └── specs/                   # Test specifications
│       ├── about.spec.ts
│       ├── basket.spec.ts
│       ├── e2e.spec.ts
│       ├── home.spec.ts
│       ├── login.spec.ts
│       ├── navigation.spec.ts
│       └── sweets.spec.ts
├── documents/                   # QA artefacts
│   ├── bug-report.md
│   ├── rtm.md
│   ├── test-cases.md
│   ├── test-data.md
│   ├── test-plan.md
│   ├── test-strategy.md
│   └── test-summary.md
├── playwright-report/           # Generated HTML report (git-ignored)
├── test-results/                # Screenshots, videos, traces on failure
├── .env.example
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

---

## Page Objects

All page interaction logic lives in `tests/pages/`. Tests import these classes and never use raw locators directly.

| Class | File | Covers |
|---|---|---|
| `SweetsPage` | `SweetsPage.ts` | `/sweets` — catalogue, add-to-basket, nav badge |
| `BasketPage` | `BasketPage.ts` | `/basket` — items, quantities, delete, delivery, checkout form |
| `HomePage` | `HomePage.ts` | `/` — hero, most-popular section, navigation CTAs |
| `LoginPage` | `LoginPage.ts` | `/login` — email/password form, validation |

---

## Test Coverage

### `sweets.spec.ts` — Sweets Catalogue Page

| Test ID | Description |
|---|---|
| SW-01 | Page loads and displays correct heading |
| SW-03 | All 16 products are displayed |
| SW-06 | Product prices match expected values |
| SW-08 | Adding a single item increments basket counter by 1 |
| SW-09 | Adding 3 different items increments basket counter to 3 |
| SW-10 | Adding the same item twice increments basket counter by 2 |
| SW-13 | All product images have a non-empty `src` attribute |
| SW-14 | All product cards have a non-empty description |
| SW-15 | All product prices are displayed with the £ currency symbol |
| SW-16 | Add to Basket button is present on every product card |
| SW-18 | Product card heading is visible for every product |
| SW-20 | Adding all 16 products accumulates the total correctly in the basket |
| SW-21 | Item quantity increases each time Add to Basket is clicked; no decrement control exists |
| SW-22 | Delete Item removes the entire product entry from the basket |

### `basket.spec.ts` — Basket Page

| Test ID | Description |
|---|---|
| BK-01 | Page loads and displays correct heading |
| BK-02 | Empty basket shows 0 items and £0.00 total |
| BK-03 | Basket reflects items added from the catalogue |
| BK-05 | Collect FREE is the default delivery option |
| BK-06 | Selecting Standard Shipping adds £1.99 to total *(marked `test.fail` — BUG-002)* |

### `home.spec.ts` — Home Page

| Test ID | Description |
|---|---|
| HP-01 | Page loads and displays correct heading |
| HP-03 | Most Popular section has 4 product cards |
| HP-05 | Browse Sweets CTA navigates to `/sweets` |
| HP-06 | Add to Basket from home increments basket counter |
| HP-07 | Sale promotional banner is visible |

### `login.spec.ts` — Login Page

| Test ID | Description |
|---|---|
| LG-01 | Page loads and displays login form |
| LG-08 | Invalid credentials show an error *(marked `test.fail` — BUG-003)* |

### `navigation.spec.ts` — Site Navigation

Cross-page navigation links and routing checks.

### `about.spec.ts` — About Page

Page load and content checks for the About page.

### `e2e.spec.ts` — End-to-End Journeys

| Test ID | Description |
|---|---|
| E2E-01 | Full guest purchase journey *(marked `test.fail` — BUG-001, BUG-002)* |
| E2E-02 | Basket state retained after navigating to login |

---

## Test Data

All test data is centralised in `tests/fixtures/testData.ts`. It exports a single `testData` object with:

- **`products`** — all 16 catalogue products with `name` and `price`
- **`credentials`** — valid login email/password, and invalid variants
- **`billing`** — checkout form data (name, address, country, city, zip)
- **`payment`** — test card details
- **`delivery`** — collect and standard-shipping options with costs
- **`totalProducts`** — `16` (used to assert full catalogue count)

Product names and prices in `testData` match what the application displays. Tests use these constants rather than hard-coded strings to keep assertions maintainable.

---

## Known Application Bugs

Bugs discovered during automation are logged in `documents/bug-report.md`. Tests covering broken functionality are marked with `test.fail()` so the suite continues to report them without blocking the rest of the run.

| Bug ID | Severity | Summary |
|---|---|---|
| BUG-001 | P1 Critical | Basket counter does not update after clicking Add to Basket (Chromium) |
| BUG-002 | P2 High | Basket total does not recalculate when Standard Shipping is selected |
| BUG-003 | P2 High | No error message shown for invalid login credentials |
| BUG-004 | P3 Medium | Wham Bars product image returns HTTP 404 |
| BUG-005 | P3 Medium | Checkout form shows only browser-native validation, no inline error messages |

---

## Reports & Artefacts

On any test failure Playwright automatically captures:

- **Screenshot** — saved to `test-results/`
- **Video** — saved to `test-results/`
- **Trace** — saved to `test-results/`, open with `npx playwright show-trace <path>`

After every run an HTML report is written to `playwright-report/`. Open it with:

```bash
npm run report
```

---

## Playwright Configuration

Key settings in `playwright.config.ts`:

| Setting | Value |
|---|---|
| `testDir` | `./tests/specs` |
| `fullyParallel` | `true` |
| `retries` | `2` on CI, `0` locally |
| `workers` | `3` on CI, auto locally |
| `browsers` | Chromium, Firefox, WebKit |
| `screenshot` | On failure only |
| `video` | Retained on failure |
| `trace` | Retained on failure |
