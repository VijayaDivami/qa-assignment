# Requirements Traceability Matrix (RTM) — Sweet Shop UI Automation

| Field | Details |
|---|---|
| **Document ID** | RTM-SWEETSHOP-001 |
| **Version** | 1.0 |
| **Date** | 25 April 2026 |
| **Application** | Sweet Shop — https://sweetshop.netlify.app |
| **Related Documents** | Test Cases TC-SWEETSHOP-001 · Test Plan TP-SWEETSHOP-001 |

---

## Purpose

The RTM maps each functional requirement to the test cases that verify it, ensuring complete test coverage and enabling impact analysis when requirements change.

---

## Status Legend

| Status | Meaning |
|---|---|
| Covered | At least one test case exists for this requirement |
| Partial | Some scenarios are covered; gaps exist |
| Not Covered | No test case exists for this requirement |

## Test Result Legend

| Result | Meaning |
|---|---|
| Pass | Test case executed and passed |
| Fail | Test case executed and failed |
| Blocked | Could not execute due to a blocker |
| Not Run | Not yet executed |

---

## RTM

| Req ID | Requirement Description | Page | Test Case IDs | Coverage Status | Test Result |
|---|---|---|---|---|---|
| REQ-01 | Home page loads successfully and displays the main heading | Home | HP-01 | Covered | Not Run |
| REQ-02 | Home page displays a "Most Popular" section with 4 product cards | Home | HP-03, HP-04 | Covered | Not Run |
| REQ-03 | "Browse Sweets" CTA on the Home page navigates to the Sweets catalogue | Home | HP-05 | Covered | Not Run |
| REQ-04 | User can add a product to the basket from the Home page | Home | HP-06 | Covered | Not Run |
| REQ-05 | Sweets catalogue page loads and displays the correct heading | Sweets | SW-01, SW-02 | Covered | Not Run |
| REQ-06 | All 16 products are displayed on the Sweets catalogue page | Sweets | SW-03 | Covered | Not Run |
| REQ-07 | Each product card displays name, description, price, image, and Add to Basket button | Sweets | SW-04 | Covered | Not Run |
| REQ-08 | Product prices are displayed in £ GBP format | Sweets | SW-05, SW-06 | Covered | Not Run |
| REQ-09 | All product images load without broken links | Sweets | SW-07 | Covered | Not Run |
| REQ-10 | Clicking "Add to Basket" increments the basket counter by 1 | Sweets | SW-08 | Covered | Not Run |
| REQ-11 | Multiple different items can be added to the basket | Sweets | SW-09 | Covered | Not Run |
| REQ-12 | The same item can be added multiple times | Sweets | SW-10 | Covered | Not Run |
| REQ-13 | Basket page loads successfully and displays the correct heading | Basket | BK-01 | Covered | Not Run |
| REQ-14 | Empty basket shows 0 items and £0.00 total | Basket | BK-02 | Covered | Not Run |
| REQ-15 | Basket accurately reflects items added from the catalogue | Basket | BK-03 | Covered | Not Run |
| REQ-16 | Basket total is the correct sum of all added item prices | Basket | BK-04 | Covered | Not Run |
| REQ-17 | "Collect (FREE)" is the default delivery option | Basket | BK-05 | Covered | Not Run |
| REQ-18 | Selecting Standard Shipping adds £1.99 to the basket total | Basket | BK-06 | Covered | Not Run |
| REQ-19 | Switching delivery options correctly recalculates the total | Basket | BK-07 | Covered | Not Run |
| REQ-20 | "Empty Basket" button resets the basket to 0 items and £0.00 | Basket | BK-08 | Covered | Not Run |
| REQ-21 | Billing address form contains all required fields | Basket | BK-09 | Covered | Not Run |
| REQ-22 | Payment form contains all required fields | Basket | BK-10 | Covered | Not Run |
| REQ-23 | "Continue to Checkout" button is present and clickable | Basket | BK-11 | Covered | Not Run |
| REQ-24 | Submitting an empty checkout form triggers validation | Basket | BK-12 | Covered | Not Run |
| REQ-25 | Invalid email in the billing form triggers a validation error | Basket | BK-13 | Covered | Not Run |
| REQ-26 | Address 2 is optional and does not block form submission | Basket | BK-14 | Covered | Not Run |
| REQ-27 | Login page loads with the correct heading | Login | LG-01, LG-02 | Covered | Not Run |
| REQ-28 | Login form contains labelled email and password fields | Login | LG-03 | Covered | Not Run |
| REQ-29 | Password field masks user input | Login | LG-04 | Covered | Not Run |
| REQ-30 | Login button is present and clickable | Login | LG-05 | Covered | Not Run |
| REQ-31 | Submitting an empty login form triggers validation | Login | LG-06 | Covered | Not Run |
| REQ-32 | Invalid email format in login form triggers a validation error | Login | LG-07 | Covered | Not Run |
| REQ-33 | Invalid credentials display an error message | Login | LG-08 | Covered | Not Run |
| REQ-34 | Valid credentials authenticate the user | Login | LG-09 | Covered | Not Run |
| REQ-35 | Navigation bar is present on all application pages | Navigation | NAV-01 | Covered | Not Run |
| REQ-36 | Brand/logo link navigates back to the Home page | Navigation | NAV-02 | Covered | Not Run |
| REQ-37 | All navigation links route to the correct pages | Navigation | NAV-03, NAV-04, NAV-05 | Covered | Not Run |
| REQ-38 | Basket count in the nav bar persists across page navigations | Navigation | NAV-06 | Covered | Not Run |
| REQ-39 | Footer is present on all pages | Navigation | NAV-07 | Covered | Not Run |
| REQ-40 | Application renders correctly in Firefox | Cross-Browser | CB-01, CB-02, CB-03 | Covered | Not Run |
| REQ-41 | Application renders correctly in WebKit (Safari) | Cross-Browser | CB-04, CB-05, CB-06 | Covered | Not Run |
| REQ-42 | Full guest purchase journey completes without errors | E2E | E2E-01 | Covered | Not Run |
| REQ-43 | Basket state is retained after user logs in | E2E | E2E-02 | Covered | Not Run |
| REQ-44 | Basket can be emptied and re-populated in the same session | E2E | E2E-03 | Covered | Not Run |
| REQ-45 | User can navigate through all pages using nav links in sequence | E2E | E2E-04 | Covered | Not Run |

---

## Coverage Summary

| Status | Count | Percentage |
|---|---|---|
| Covered | 45 | 100% |
| Partial | 0 | 0% |
| Not Covered | 0 | 0% |
| **Total Requirements** | **45** | |

---

## Traceability — Test Cases Back to Requirements

| Test Case ID | Requirement IDs |
|---|---|
| HP-01 | REQ-01 |
| HP-02 | REQ-01 |
| HP-03 | REQ-02 |
| HP-04 | REQ-02 |
| HP-05 | REQ-03 |
| HP-06 | REQ-04 |
| HP-07 | REQ-01 |
| SW-01 | REQ-05 |
| SW-02 | REQ-05 |
| SW-03 | REQ-06 |
| SW-04 | REQ-07 |
| SW-05 | REQ-08 |
| SW-06 | REQ-08 |
| SW-07 | REQ-09 |
| SW-08 | REQ-10 |
| SW-09 | REQ-11 |
| SW-10 | REQ-12 |
| SW-11 | REQ-08 |
| SW-12 | REQ-08 |
| BK-01 | REQ-13 |
| BK-02 | REQ-14 |
| BK-03 | REQ-15 |
| BK-04 | REQ-16 |
| BK-05 | REQ-17 |
| BK-06 | REQ-18 |
| BK-07 | REQ-19 |
| BK-08 | REQ-20 |
| BK-09 | REQ-21 |
| BK-10 | REQ-22 |
| BK-11 | REQ-23 |
| BK-12 | REQ-24 |
| BK-13 | REQ-25 |
| BK-14 | REQ-26 |
| BK-15 | REQ-21 |
| LG-01 | REQ-27 |
| LG-02 | REQ-27 |
| LG-03 | REQ-28 |
| LG-04 | REQ-29 |
| LG-05 | REQ-30 |
| LG-06 | REQ-31 |
| LG-07 | REQ-32 |
| LG-08 | REQ-33 |
| LG-09 | REQ-34 |
| LG-10 | REQ-27 |
| NAV-01 | REQ-35 |
| NAV-02 | REQ-36 |
| NAV-03 | REQ-37 |
| NAV-04 | REQ-37 |
| NAV-05 | REQ-37 |
| NAV-06 | REQ-38 |
| NAV-07 | REQ-39 |
| CB-01 | REQ-40 |
| CB-02 | REQ-40 |
| CB-03 | REQ-40 |
| CB-04 | REQ-41 |
| CB-05 | REQ-41 |
| CB-06 | REQ-41 |
| E2E-01 | REQ-42 |
| E2E-02 | REQ-43 |
| E2E-03 | REQ-44 |
| E2E-04 | REQ-45 |
