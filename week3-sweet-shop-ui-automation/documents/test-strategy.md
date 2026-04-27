# UI Automation Test Strategy — Sweet Shop

**Application URL:** https://sweetshop.netlify.app/sweets  
**Document Version:** 2.1  
**Date:** 25 April 2026  
**Scope:** UI Automation Testing Only  
**Related Document:** Test Plan — Sweet Shop UI Automation (TP-SWEETSHOP-001)

---

## 1. Introduction

This document defines the UI automation test strategy for the Sweet Shop web application — a retro sweets e-commerce site. The goal is to validate end-to-end user journeys, page functionality, and UI behaviour using automated browser tests. API testing is explicitly out of scope.

For test environment details, entry/exit criteria, defect severity classification, risks, and project schedule, refer to the **Test Plan (TP-SWEETSHOP-001)**.

---

## 2. Application Overview

| Page | URL | Purpose |
|---|---|---|
| Home | `/` | Landing page; showcases most popular sweets and a CTA to browse |
| Sweets | `/sweets` | Full product catalogue with Add to Basket functionality |
| Basket | `/basket` | Shopping basket, delivery options, billing/payment form, checkout |
| Login | `/login` | User login via email and password |
| About | `/about` | Project description page |

**Key user journeys:**
1. Browse sweets and add items to the basket
2. Review basket, select delivery method, enter billing and payment details
3. Log in to an account

---

## 3. Objectives

- Validate all critical user flows through the UI using automated tests
- Detect regressions introduced by future code changes
- Ensure all interactive elements (buttons, forms, navigation) behave correctly
- Verify correct UI state after user actions (basket count updates, form validation messages, etc.)
---

## 4. Scope

### 4.1 In Scope

- All pages reachable from the main navigation
- All interactive UI components: buttons, links, forms, dropdowns
- Client-side form validation feedback
- Navigation flows between pages
- Basket state management (add items, view totals, clear basket)
- Delivery option selection behaviour
- Login form behaviour (valid/invalid inputs)
### 4.2 Out of Scope

- API / backend testing
- Database verification
- Server-side logic
- Performance / load testing
- Security / penetration testing
- Accessibility testing (WCAG compliance)

---

## 5. Test Approach

### 5.1 Automation Framework

| Attribute | Decision |
|---|---|
| **Framework** | Playwright (TypeScript) |
| **Test runner** | Playwright Test |
| **Browsers** | Chromium, Firefox, WebKit (Safari) |
| **Reporting** | Playwright HTML report + JUnit XML for CI |
| **CI Integration** | GitHub Actions (or equivalent pipeline) |

Playwright is chosen because it supports all major browsers natively, has a built-in test runner, supports parallel execution, and provides reliable auto-waiting that reduces flaky tests.

### 5.2 Page Object Model (POM)

All tests will follow the Page Object Model pattern to ensure maintainability:

```
tests/
  pages/
    HomePage.ts
    SweetsPage.ts
    BasketPage.ts
    LoginPage.ts
  specs/
    home.spec.ts
    sweets.spec.ts
    basket.spec.ts
    login.spec.ts
    navigation.spec.ts
    e2e.spec.ts
  fixtures/
    testData.ts
```

Each page class encapsulates:
- Locators for all interactive elements on that page
- Action methods (e.g., `addItemToBasket(name)`, `fillBillingForm(data)`)
- Assertion helpers (e.g., `expectBasketCount(n)`)

### 5.3 Locator Strategy

Stable, semantics-based locators are mandatory. This ensures test resilience against UI refactoring and DOM structure changes.

**Preferred locators (in priority order):**

| Priority | Locator | Example |
|---|---|---|
| 1 | `getByRole` | `page.getByRole('button', { name: 'Add to Basket' })` |
| 2 | `getByLabel` | `page.getByLabel('Email address')` |
| 3 | `getByText` | `page.getByText('Chocolate Cups')` |
| 4 | `getByTestId` | `page.getByTestId('checkout-btn')` |
| 5 | Stable CSS class | `page.locator('.product-title')` |

**Prohibited locators:**

| Avoid | Reason |
|---|---|
| XPath | Brittle — tightly coupled to DOM structure |
| Index-based selectors (`nth(0)`) | Break when element order changes |
| Absolute CSS paths | Highly coupled to HTML hierarchy |
| Auto-generated or dynamic IDs | Unstable between builds |

### 5.4 Retry Strategy & Flaky Test Handling

| Setting | Value |
|---|---|
| **Retries on CI** | 2 — tests are retried up to 2 times before being marked as failed |
| **Retries locally** | 0 — fail fast during development |
| **Screenshot on failure** | Enabled — captured automatically on first failure |
| **Video on failure** | Enabled — retained only on failure to save storage |
| **Trace on failure** | Enabled — Playwright trace viewer for step-by-step debugging |

**Flakiness prevention practices:**
- Rely on Playwright's built-in auto-waiting; never use `page.waitForTimeout()`
- Use `expect` with explicit assertions rather than checking DOM presence manually
- Isolate test state — each test starts from a clean browser context
- Tag known-flaky tests with `@flaky` and track them in a dedicated issue log

---

## 6. Test Coverage Areas

Detailed test cases are maintained in the separate **Test Cases document**. This section lists the high-level coverage areas addressed by the automation suite.

| Area | Coverage Summary |
|---|---|
| **Home Page** | Page load, most popular products display, CTA navigation, add-to-basket from home |
| **Sweets Catalogue** | Full product listing, product card elements, add single/multiple items, price formatting, image rendering |
| **Basket** | Empty/populated basket state, delivery option selection, billing form validation, payment form validation, totals calculation, empty basket action |
| **Login** | Field presence, empty/invalid form submission, credential validation, password masking, social links |
| **Navigation** | All nav links, logo link, basket count persistence across pages, footer presence |
| **Cross-Browser** | Chromium, Firefox, WebKit rendering parity |
| **End-to-End Journeys** | Full guest purchase flow, browse-then-login, basket reset and re-shop |

> Detailed test cases (IDs, steps, expected results) are maintained in the **Test Cases** document.

---

## 7. Test Data

| Data Type | Values |
|---|---|
| Valid email | `testuser@example.com` |
| Invalid email | `notanemail`, `@domain.com`, `user@` |
| Valid password | `Password123!` |
| Invalid password | `abc` (too short), empty string |
| Credit card number | `4111111111111111` (Visa test number) |
| Expiration date | `12/28` |
| CVV | `123` |
| Name on card | `Test User` |
| First name / Last name | `Test` / `User` |
| Address | `123 Test Street` |
| City | `Cardiff` |
| Country | `United Kingdom` |
| Zip | `CF10 1AA` |

Test data is stored in `tests/fixtures/testData.ts` and injected via Playwright fixtures to avoid hardcoded values in test specs.

---

## 8. CI/CD Integration

```
Trigger:        On every pull request and merge to main
Parallelism:    3 workers (one per browser)
Schedule:       Full suite nightly at 02:00 UTC
Artifacts:      Playwright HTML report, JUnit XML, screenshots on failure, video on failure
Notifications:  Slack alert on test failure
```

---

## 9. Assumptions

- The application is a demo/practice app; some features may be intentionally broken
- No real payment processing occurs; test card numbers are safe to use
- User account credentials for login tests will be established separately with the development team
- The navigation structure (pages listed in Section 2) is stable and will not change without notice
