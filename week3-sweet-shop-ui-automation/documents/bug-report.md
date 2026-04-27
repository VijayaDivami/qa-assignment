# Bug Report Log — Sweet Shop UI Automation

| Field | Details |
|---|---|
| **Document ID** | BR-SWEETSHOP-001 |
| **Version** | 1.0 |
| **Date** | 25 April 2026 |
| **Application** | Sweet Shop — https://sweetshop.netlify.app |
| **Related Documents** | Test Cases TC-SWEETSHOP-001 · Test Plan TP-SWEETSHOP-001 |

---

## Bug Status Legend

| Status | Meaning |
|---|---|
| New | Logged; not yet assigned |
| Assigned | Allocated to a developer |
| In Progress | Fix is being worked on |
| Fixed | Developer has applied a fix |
| Retest | Ready for QA to verify the fix |
| Closed | Fix verified; bug resolved |
| Reopened | Fix verification failed; bug re-opened |
| Won't Fix | Accepted as known/intentional behaviour |

---

## Severity Legend

| Severity | Meaning |
|---|---|
| P1 — Critical | Blocks a core user journey |
| P2 — High | Significant feature broken; workaround may exist |
| P3 — Medium | Minor functional issue |
| P4 — Low | Cosmetic or non-functional |

---

## Bug Report Template

> Copy the block below for each new bug.

```
### BUG-[ID] — [Short Title]

| Field            | Details |
|---|---|
| **Bug ID**       | BUG-[ID] |
| **Title**        | |
| **Reported By**  | |
| **Reported Date**| |
| **Test Case ID** | |
| **Severity**     | P1 / P2 / P3 / P4 |
| **Priority**     | High / Medium / Low |
| **Status**       | New |
| **Environment**  | Browser · OS · Viewport |
| **URL**          | |

**Description:**
[What is wrong?]

**Steps to Reproduce:**
1.
2.
3.

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happens]

**Attachments:**
- Screenshot:
- Video:
- Playwright Trace:
```

---

## Logged Bugs

---

### BUG-001 — Basket count does not update after clicking "Add to Basket"

| Field | Details |
|---|---|
| **Bug ID** | BUG-001 |
| **Title** | Basket counter in nav bar does not increment when "Add to Basket" is clicked |
| **Reported By** | QA Automation |
| **Reported Date** | 25 April 2026 |
| **Test Case ID** | SW-08, SW-09 |
| **Severity** | P1 — Critical |
| **Priority** | High |
| **Status** | Closed |
| **Environment** | Chromium 124 · macOS 13 · Desktop 1280×720 |
| **URL** | https://sweetshop.netlify.app/sweets |

> **Update (27 April 2026):** Verified on the live site — the basket counter now updates correctly and persists across page navigations. The Playwright test NAV-06 passed all assertions (`getCount() === 2` after adding 2 items and navigating to `/` and `/login`). `test.fail()` has been removed from NAV-06. Bug marked **Closed**.

**Description:**
Clicking "Add to Basket" on any product on the Sweets page did not update the basket counter displayed in the navigation bar. The counter remained at 0 regardless of how many items were added.

**Steps to Reproduce:**
1. Navigate to `https://sweetshop.netlify.app/sweets`
2. Note the basket counter in the navigation bar (expected: 0)
3. Click "Add to Basket" on Chocolate Cups

**Expected Result:**
Basket counter in the navigation bar increments to 1.

**Actual Result:**
Basket counter remains at 0. No visual feedback is given to indicate the item was added.

**Attachments:**
- Screenshot: `screenshots/BUG-001-basket-counter.png`
- Playwright Trace: `traces/BUG-001.zip`

---

### BUG-002 — Delivery total does not recalculate when switching between delivery options

| Field | Details |
|---|---|
| **Bug ID** | BUG-002 |
| **Title** | Basket total not updated when Standard Shipping option is selected |
| **Reported By** | QA Automation |
| **Reported Date** | 25 April 2026 |
| **Test Case ID** | BK-06, BK-07 |
| **Severity** | P2 — High |
| **Priority** | High |
| **Status** | New |
| **Environment** | Chromium 124 · macOS 13 · Desktop 1280×720 |
| **URL** | https://sweetshop.netlify.app/basket |

**Description:**
Selecting "Standard Shipping (£1.99)" on the basket page does not add £1.99 to the displayed total. Switching back to "Collect (FREE)" also produces no change in the total.

**Steps to Reproduce:**
1. Navigate to `/sweets` and add Chocolate Cups (£1.00) to the basket
2. Navigate to `/basket`
3. Note the total displayed (expected: £1.00)
4. Select the "Standard Shipping (£1.99)" radio button

**Expected Result:**
Total updates to £2.99.

**Actual Result:**
Total remains at £1.00. Delivery cost is not added to the total.

**Attachments:**
- Screenshot: `screenshots/BUG-002-delivery-total.png`

---

### BUG-003 — Login form submits without showing error for invalid credentials

| Field | Details |
|---|---|
| **Bug ID** | BUG-003 |
| **Title** | No error message displayed when incorrect credentials are entered on login page |
| **Reported By** | QA Automation |
| **Reported Date** | 25 April 2026 |
| **Test Case ID** | LG-08 |
| **Severity** | P2 — High |
| **Priority** | High |
| **Status** | New |
| **Environment** | Chromium 124 · macOS 13 · Desktop 1280×720 |
| **URL** | https://sweetshop.netlify.app/login |

**Description:**
Entering incorrect login credentials and clicking "Login" does not display any error message to the user. The page appears to reload or do nothing without providing feedback.

**Steps to Reproduce:**
1. Navigate to `https://sweetshop.netlify.app/login`
2. Enter `wrong@example.com` in the Email address field
3. Enter `wrongpassword` in the Password field
4. Click "Login"

**Expected Result:**
An error message such as "Invalid email or password" is displayed.

**Actual Result:**
No error message is shown. The page reloads or remains static with no user feedback.

**Attachments:**
- Screenshot: `screenshots/BUG-003-login-no-error.png`

---

### BUG-004 — Broken product image on Sweets page

| Field | Details |
|---|---|
| **Bug ID** | BUG-004 |
| **Title** | One or more product images fail to load on the Sweets catalogue page |
| **Reported By** | QA Automation |
| **Reported Date** | 25 April 2026 |
| **Test Case ID** | SW-07 |
| **Severity** | P3 — Medium |
| **Priority** | Medium |
| **Status** | New |
| **Environment** | Chromium 124 · macOS 13 · Desktop 1280×720 |
| **URL** | https://sweetshop.netlify.app/sweets |

**Description:**
At least one product image on the Sweets page returns a 404 or renders as a broken image icon. This is caused by a mismatched file name (e.g., `whan.jpg` vs the expected `wham.jpg` for the Wham Bars product).

**Steps to Reproduce:**
1. Navigate to `https://sweetshop.netlify.app/sweets`
2. Observe the product image for "Wham Bars"

**Expected Result:**
A valid image of Wham Bars is displayed.

**Actual Result:**
A broken image icon is displayed; the image URL returns HTTP 404.

**Attachments:**
- Screenshot: `screenshots/BUG-004-broken-image.png`

---

### BUG-005 — Checkout form lacks server-side validation feedback

| Field | Details |
|---|---|
| **Bug ID** | BUG-005 |
| **Title** | "Continue to checkout" can be clicked with only browser-native validation; no inline error messages shown |
| **Reported By** | QA Automation |
| **Reported Date** | 25 April 2026 |
| **Test Case ID** | BK-12, BK-13 |
| **Severity** | P3 — Medium |
| **Priority** | Medium |
| **Status** | New |
| **Environment** | Chromium 124 · macOS 13 · Desktop 1280×720 |
| **URL** | https://sweetshop.netlify.app/basket |

**Description:**
The basket checkout form relies solely on HTML5 browser-native validation tooltips. No custom inline validation messages are rendered below the form fields, making it difficult for users to understand which fields failed and why.

**Steps to Reproduce:**
1. Navigate to `https://sweetshop.netlify.app/basket`
2. Leave all form fields empty
3. Click "Continue to checkout"

**Expected Result:**
Custom inline validation messages appear below each required field.

**Actual Result:**
Only a native browser tooltip appears on the first invalid field. No inline messages are shown; subsequent invalid fields are not highlighted until the first is resolved.

**Attachments:**
- Screenshot: `screenshots/BUG-005-form-validation.png`

---

*Add new bugs below this line using the template above.*
