# Test Plan — Sweet Shop UI Automation

| Field | Details |
|---|---|
| **Document ID** | TP-SWEETSHOP-001 |
| **Version** | 1.0 |
| **Date** | 25 April 2026 |
| **Application** | Sweet Shop |
| **Application URL** | https://sweetshop.netlify.app |
| **Testing Type** | UI Automation |
| **Related Document** | Test Strategy v2.0 |

---

## 1. Introduction

This Test Plan describes the planning, resources, schedule, and approach for UI automation testing of the Sweet Shop web application. Sweet Shop is a retro sweets e-commerce site that allows users to browse products, manage a basket, and complete checkout. It is an intentionally demo-quality application containing known bugs, making it a valuable target for practicing realistic test automation.

This plan covers all five pages of the application and three end-to-end user journeys. It is guided by and should be read alongside the **UI Automation Test Strategy** document.

---

## 2. Test Objectives

- Verify that all core user journeys (browse → add to basket → checkout, login) execute without blocking defects
- Ensure product catalogue data (names, prices, images) is correctly rendered
- Validate all form inputs perform client-side validation as expected
- Confirm basket state is maintained accurately across page navigations
- Establish a regression test suite that runs on every code change in CI
- Achieve coverage across Chromium, Firefox, and WebKit browsers

---

## 3. Features to be Tested

### 3.1 Home Page
- Page load and heading visibility
- Most Popular product cards (name, price, image, button)
- "Browse Sweets" CTA navigation
- Add to Basket from home page updates basket counter
- Sale promotional banner display

### 3.2 Sweets Catalogue Page (`/sweets`)
- All 16 products rendered with correct name, description, price, and image
- "Add to Basket" button present on every product card
- Adding single and multiple items updates basket counter correctly
- Adding the same item multiple times increments counter accordingly
- Product prices formatted in £ GBP
- No broken product images

### 3.3 Basket Page (`/basket`)
- Empty basket state (zero items, £0.00 total)
- Basket reflects items added from the catalogue
- Correct subtotal calculation based on items added
- Delivery option: Collect (FREE) selected by default
- Standard Shipping (£1.99) selection adds to total
- Switching delivery options correctly recalculates total
- "Empty Basket" button resets basket to zero
- Billing address form: all required fields visible and interactive
- Payment form: all required fields visible and interactive
- Client-side validation on empty form submission
- Email format validation on billing address field
- "Continue to Checkout" button present and clickable

### 3.4 Login Page (`/login`)
- Page load and heading visibility
- Email and password fields present
- Password field masks input
- Empty form submission triggers validation feedback
- Invalid email format triggers validation error
- Invalid credentials show error message
- Valid credentials authenticate user
- Social links (Twitter, Facebook, LinkedIn) visible

### 3.5 Navigation
- Navigation bar present on all pages
- Brand/logo link returns to home
- All nav links (Sweets, Basket, Login) navigate to correct pages
- Basket count persists across page navigations
- Footer present and correct on all pages

### 3.6 Cross-Browser Compatibility
- All critical pages render correctly in Chromium, Firefox, and WebKit

### 3.7 End-to-End Journeys
- Full guest purchase flow: browse → add items → basket → delivery → billing → checkout
- Browse then login: add items, log in, basket state retained
- Empty basket and re-shop: clear basket, return to catalogue, re-add items

---

## 4. Features NOT to be Tested

| Feature | Reason Excluded |
|---|---|
| REST API / backend endpoints | Out of scope — UI automation only |
| Database state verification | Not accessible via UI layer |
| Server-side business logic | Not visible to browser automation |
| Payment gateway processing | No real payment integration in demo app |
| Email delivery (order confirmation) | No real email service in demo app |
| Performance / load testing | Separate concern; not in scope |
| Security / penetration testing | Separate concern; not in scope |
| Accessibility (WCAG) | Separate concern; not in scope |
| Admin / back-office features | Not present in the application |

---

## 5. Test Environment

| Attribute | Details |
|---|---|
| **Operating Systems** | Windows 10 / Windows 11, macOS 13 (Ventura) and above |
| **Browsers** | Chromium 124+, Firefox 125+, WebKit (Safari 17+) |
| **Node.js Version** | 20.x LTS |
| **Playwright Version** | 1.44.x |
| **Test Runner** | Playwright Test |
| **Base URL** | `https://sweetshop.netlify.app` |
| **CI Environment** | GitHub Actions (ubuntu-latest) |

### 5.1 Environment Setup Steps

1. Install Node.js 20.x LTS
2. Clone the test repository
3. Run `npm install` to install dependencies
4. Run `npx playwright install` to download browser binaries
5. Copy `.env.example` to `.env` and set `BASE_URL`
6. Run `npx playwright test` to execute the full suite

---

## 6. Resource Requirements

### 6.1 Team

| Role | Responsibility |
|---|---|
| QA Automation Engineer | Framework setup, test authoring, maintenance, CI configuration |
| QA Lead / Reviewer | Test plan sign-off, defect triage, exit criteria approval |

### 6.2 Tools & Infrastructure

| Tool | Purpose |
|---|---|
| Playwright 1.44.x | Browser automation framework |
| TypeScript | Test authoring language |
| GitHub Actions | CI/CD pipeline for automated test execution |
| Playwright HTML Reporter | Interactive test results report |
| JUnit XML Reporter | CI-parseable results for dashboards |
| Git / GitHub | Source control for test code |

---

## 7. Test Deliverables

| # | Deliverable | Document ID | File |
|---|---|---|---|
| 1 | Test Strategy | — | `documents/test-strategy.md` |
| 2 | Test Plan (this document) | TP-SWEETSHOP-001 | `documents/test-plan.md` |
| 3 | Test Cases | TC-SWEETSHOP-001 | `documents/test-cases.md` |
| 4 | Test Data | TD-SWEETSHOP-001 | `documents/test-data.md` |
| 5 | Automation Scripts | — | `tests/` (Playwright TypeScript framework) |
| 6 | Bug Report | BR-SWEETSHOP-001 | `documents/bug-report.md` |
| 7 | Test Summary | TSR-SWEETSHOP-001 | `documents/test-summary.md` |
| 8 | Requirements Traceability Matrix (RTM) | RTM-SWEETSHOP-001 | `documents/rtm.md` |

---

## 8. Test Schedule

| Phase | Activity | Duration |
|---|---|---|
| **Phase 1 — Setup** | Framework setup, POM skeleton, CI pipeline configuration | 2 days |
| **Phase 2 — Authoring** | Write and review all automated test cases | 5 days |
| **Phase 3 — Execution (Round 1)** | First full test run; log all defects | 1 day |
| **Phase 4 — Defect Retest** | Retest fixed defects; update test cases if needed | 2 days |
| **Phase 5 — Execution (Round 2)** | Final regression run; confirm exit criteria | 1 day |
| **Phase 6 — Sign-off** | Review results, prepare final report, obtain sign-off | 1 day |
| **Total** | | **~12 days** |

> Note: Schedule assumes a single QA automation engineer. Parallel work by multiple engineers would reduce total duration.

---

## 9. Entry Criteria

The following conditions must be met before test execution begins:

- [ ] Application is deployed and accessible at `https://sweetshop.netlify.app`
- [ ] All five pages (Home, Sweets, Basket, Login, About) load without HTTP errors
- [ ] Playwright framework and dependencies are installed and verified
- [ ] CI pipeline is configured and a baseline run completes
- [ ] All Page Object classes are implemented and peer-reviewed
- [ ] Test data file (`testData.ts`) is populated and reviewed
- [ ] Test cases document is reviewed and approved

---

## 10. Exit Criteria

Test execution is considered complete when all of the following are satisfied:

- [ ] 100% of test cases have been executed at least once
- [ ] All P1 (Critical) test cases pass
- [ ] All P2 (High) test cases pass or have approved deferrals
- [ ] Known intentional application bugs are documented and marked as expected-failures
- [ ] No unresolved P1 or P2 defects remain open
- [ ] Test execution report has been generated and reviewed
- [ ] QA Lead sign-off obtained

---

## 11. Suspension and Resumption Criteria

### 11.1 Suspension Criteria

Testing will be suspended if any of the following occur:

- The application is inaccessible (Netlify outage) for more than 4 hours
- More than 30% of test cases fail due to a single blocking regression
- A P1 defect prevents execution of an entire test area (e.g., basket page is completely broken)
- The CI environment becomes unavailable

### 11.2 Resumption Criteria

Testing resumes when:

- The blocking issue is resolved and confirmed by the QA Lead
- A hotfix is deployed and the affected page(s) are verified accessible
- An updated test run confirms the blocker is cleared

---

## 12. Defect Management

### 12.1 Defect Severity

| Severity | Description |
|---|---|
| **P1 — Critical** | Blocks a core user journey; must be fixed before release |
| **P2 — High** | Significant feature broken; workaround may exist |
| **P3 — Medium** | Minor functional issue or unexpected UI behaviour |
| **P4 — Low** | Cosmetic or non-functional issue |

### 12.2 Defect Lifecycle

```
New → Assigned → In Progress → Fixed → Retest → Closed
                                           ↓
                                       Reopened (if retest fails)
```

### 12.3 Known Intentional Defects

Sweet Shop is an intentionally broken demo application. Defects that are confirmed intentional will be:
- Logged with the label `known-bug`
- Marked as `expected-failure` in the automation suite using `test.fail()`
- Excluded from exit criteria pass/fail calculations

---

## 13. Risks and Mitigations

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R-01 | Application downtime (Netlify free tier) | Low | High | Health-check step at start of each CI run; suspend if unreachable |
| R-02 | Intentional bugs cause false test failures | High | Medium | Tag known broken behaviours as `expected-failure`; document in defect log |
| R-03 | Selector fragility due to DOM changes | Medium | High | Enforce semantic locator strategy (`getByRole`, `getByLabel`); prohibit XPath |
| R-04 | Flaky tests reducing confidence in suite | Medium | Medium | Retry failed tests up to 2 times in CI; capture screenshot/video/trace on failure |
| R-05 | Cross-browser rendering differences | Low | Medium | Run full suite against all three browser engines on every CI run |
| R-06 | Single engineer dependency | Medium | Medium | Document all setup steps; keep test code in version control |
| R-07 | Test data hardcoded in specs | Low | Medium | Centralise all test data in `tests/fixtures/testData.ts` |

---

## 14. Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| QA Automation Engineer | | | |
| QA Lead | | | |
| Project Owner | | | |
