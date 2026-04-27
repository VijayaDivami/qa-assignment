# Test Summary Report — Sweet Shop UI Automation

| Field | Details |
|---|---|
| **Document ID** | TSR-SWEETSHOP-001 |
| **Version** | 1.0 |
| **Date** | 25 April 2026 |
| **Application** | Sweet Shop — https://sweetshop.netlify.app |
| **Test Cycle** | Round 1 |
| **Related Documents** | Test Plan TP-SWEETSHOP-001 · Test Cases TC-SWEETSHOP-001 · Bug Report BR-SWEETSHOP-001 |

---

## 1. Executive Summary

> *Complete this section after test execution.*

This document summarises the results of the first round of UI automation test execution for the Sweet Shop application. Testing covered all five application pages and three end-to-end user journeys across three browser engines (Chromium, Firefox, WebKit) and three viewports (Desktop, Tablet, Mobile).

---

## 2. Test Execution Summary

| Metric | Value |
|---|---|
| **Total Test Cases** | 57 |
| **Executed** | — |
| **Passed** | — |
| **Failed** | — |
| **Blocked** | — |
| **Skipped / Not Run** | — |
| **Pass Rate (%)** | — |
| **Execution Date** | — |
| **Execution Duration** | — |
| **Executed By** | — |

---

## 3. Results by Test Area

| Area | Total | Pass | Fail | Blocked | Pass Rate |
|---|---|---|---|---|---|
| Home Page (HP) | 7 | — | — | — | — |
| Sweets Catalogue (SW) | 12 | — | — | — | — |
| Basket (BK) | 15 | — | — | — | — |
| Login (LG) | 10 | — | — | — | — |
| Navigation (NAV) | 7 | — | — | — | — |
| Cross-Browser (CB) | 6 | — | — | — | — |
| Responsive / Viewport (RES) | 6 | — | — | — | — |
| End-to-End (E2E) | 4 | — | — | — | — |
| **Total** | **57** | **—** | **—** | **—** | **—** |

---

## 4. Results by Browser

| Browser | Total | Pass | Fail | Pass Rate |
|---|---|---|---|---|
| Chromium 124+ | — | — | — | — |
| Firefox 125+ | — | — | — | — |
| WebKit (Safari 17+) | — | — | — | — |

---

## 5. Results by Priority

| Priority | Total | Pass | Fail | Blocked |
|---|---|---|---|---|
| P1 — Critical | — | — | — | — |
| P2 — High | — | — | — | — |
| P3 — Medium | — | — | — | — |
| P4 — Low | — | — | — | — |

---

## 6. Defect Summary

| Metric | Value |
|---|---|
| **Total Bugs Logged** | 5 |
| **P1 — Critical** | 1 |
| **P2 — High** | 2 |
| **P3 — Medium** | 2 |
| **P4 — Low** | 0 |
| **Fixed & Verified** | — |
| **Open** | 5 |
| **Won't Fix (Known Intentional)** | — |

### 6.1 Open Defect List

| Bug ID | Title | Severity | Status | Test Case |
|---|---|---|---|---|
| BUG-001 | Basket counter does not increment after Add to Basket | P1 | New | SW-08, SW-09 |
| BUG-002 | Delivery total not recalculated when shipping option changes | P2 | New | BK-06, BK-07 |
| BUG-003 | No error message for invalid login credentials | P2 | New | LG-08 |
| BUG-004 | Broken product image for Wham Bars | P3 | New | SW-07 |
| BUG-005 | Checkout form lacks custom inline validation messages | P3 | New | BK-12, BK-13 |

---

## 7. Test Coverage

| Coverage Type | Status |
|---|---|
| All 5 application pages executed | — |
| All 57 test cases executed at least once | — |
| All 3 browser engines covered | — |
| All 3 viewports covered | — |
| All 3 E2E user journeys executed | — |

---

## 8. Entry / Exit Criteria Status

### 8.1 Entry Criteria

| Criterion | Status |
|---|---|
| Application deployed and accessible | — |
| All 5 pages load without HTTP errors | — |
| Playwright framework and dependencies installed | — |
| CI pipeline configured and baseline run completed | — |
| All Page Object classes implemented and reviewed | — |
| Test data populated and reviewed | — |
| Test cases reviewed and approved | — |

### 8.2 Exit Criteria

| Criterion | Status |
|---|---|
| 100% of test cases executed at least once | — |
| All P1 (Critical) test cases pass | — |
| All P2 (High) test cases pass or deferred | — |
| Known intentional bugs documented as expected-failures | — |
| No unresolved P1 or P2 defects remain open | — |
| Test execution report generated and reviewed | — |
| QA Lead sign-off obtained | — |

---

## 9. Known Issues & Observations

> *Complete this section after test execution.*

1. Sweet Shop is an intentionally broken demo application. Some defects are expected and have been marked as `Won't Fix` or tagged as `known-bug` in the automation suite using `test.fail()`.
2. BUG-001 (basket counter not updating) is a P1 defect that blocks E2E test cases E2E-01, E2E-02, E2E-03. These are currently marked as `expected-failure`.
3. BUG-002 (delivery total) was observed consistently across all three browser engines.

---

## 10. Recommendations

> *Complete this section after test execution.*

| # | Recommendation |
|---|---|
| 1 | Fix BUG-001 (basket counter) as a priority — it blocks all E2E journeys |
| 2 | Fix BUG-002 (delivery total) before release — it directly impacts order value accuracy |
| 3 | Add custom inline validation to the checkout form (BUG-005) to improve UX |
| 4 | Correct the Wham Bars image filename to resolve BUG-004 |
| 5 | Re-run the full automation suite after each fix to verify no new regressions |

---

## 11. Test Artifacts

| Artifact | Location |
|---|---|
| Playwright HTML Report | `playwright-report/index.html` |
| JUnit XML Report | `test-results/results.xml` |
| Screenshots (failures) | `test-results/screenshots/` |
| Videos (failures) | `test-results/videos/` |
| Playwright Traces | `test-results/traces/` |
| Bug Report | `documents/bug-report.md` |

---

## 12. Sign-off

| Role | Name | Decision | Date |
|---|---|---|---|
| QA Automation Engineer | | Pass / Fail / Conditional | |
| QA Lead | | Approved / Rejected | |
| Project Owner | | Accepted / Deferred | |
