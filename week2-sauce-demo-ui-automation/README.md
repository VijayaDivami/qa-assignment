# Playwright Test Automation – SauceDemo

End-to-end test automation suite for [SauceDemo](https://www.saucedemo.com) built with [Playwright](https://playwright.dev/) and TypeScript, following the **Page Object Model (POM)** design pattern.

---

## Tech Stack

| Tool | Version |
|---|---|
| [Playwright](https://playwright.dev/) | ^1.59.1 |
| TypeScript / Node.js | Latest |
| Browser | Chromium (Desktop Chrome) |

---

## Project Structure

```
├── pages/                  # Page Object classes
│   ├── LoginPage.ts
│   ├── ProductsPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/                  # Test specs
│   ├── login.spec.ts
│   ├── products.spec.ts
│   ├── cart.spec.ts
│   └── checkout.spec.ts
├── playwright-report/      # HTML test report (auto-generated)
├── test-results/           # Videos & traces (auto-generated)
├── playwright.config.ts    # Playwright configuration
└── package.json
```

---

## Page Objects

| Class | Responsibility |
|---|---|
| `LoginPage` | Navigate to the app, fill credentials, submit login form |
| `ProductsPage` | Browse products, sort, add/remove from cart, navigate, logout |
| `CartPage` | View cart items, remove items, proceed to checkout |
| `CheckoutPage` | Fill shipping info, continue, finish, and confirm order |

---

## Test Coverage

### Login (`login.spec.ts`)

**All users (parameterized loop)** — one test generated per user via `Login as <username>`:

| User | Expected behaviour |
|---|---|
| `standard_user` | Redirects to `/inventory` |
| `locked_out_user` | Shows "locked out" error message |
| `problem_user` | Redirects to `/inventory` (broken UI checks can be extended) |
| `performance_glitch_user` | Redirects to `/inventory` (load time checks can be extended) |
| `error_user` | Redirects to `/inventory` |
| `visual_user` | Redirects to `/inventory` |

**Invalid credentials (separate group)**:
- Error for invalid username and password
- Error when username is empty
- Error when password is empty

### Products (`products.spec.ts`)
- Displays 6 products on inventory page
- Sort by name A→Z and Z→A
- Sort by price low→high and high→low
- Add single and multiple products to cart (badge count validation)
- Remove product from cart via inventory page
- Navigate to cart page
- Logout successfully

### Cart (`cart.spec.ts`)
- Display added product in cart
- Display multiple items in cart
- Remove item from cart
- Empty cart when no items added
- Navigate back to products page
- Navigate to checkout

### Checkout (`checkout.spec.ts`)
- Complete full checkout flow (confirmation: "Thank you for your order!")
- Error when first name is empty
- Error when last name is empty
- Error when postal code is empty
- Cancel checkout returns to cart
- Correct item total displayed on order summary

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Install Dependencies

```bash
npm install
npx playwright install
```

### Run All Tests

```bash
npx playwright test
```

### Run a Specific Test File

```bash
npx playwright test tests/login.spec.ts
```

### Run Tests in Headed Mode

```bash
npx playwright test --headed
```

---

## Configuration

Key settings in `playwright.config.ts`:

| Setting | Value |
|---|---|
| Base URL | `https://www.saucedemo.com` |
| Browser | Chromium |
| Reporter | HTML |
| Video | Recorded for every test |
| Trace | Collected on first retry |
| Retries (CI) | 2 |
| Parallel | Enabled (disabled on CI) |

---

## Viewing the Test Report

After running tests, open the HTML report:

```bash
npx playwright show-report
```

---

## Test Credentials

| Username | Password | Status |
|---|---|---|
| `standard_user` | `secret_sauce` | Active |
| `locked_out_user` | `secret_sauce` | Locked out (login blocked) |
| `problem_user` | `secret_sauce` | Active (broken images/UI) |
| `performance_glitch_user` | `secret_sauce` | Active (slow load) |
| `error_user` | `secret_sauce` | Active (API errors) |
| `visual_user` | `secret_sauce` | Active (visual bugs) |
