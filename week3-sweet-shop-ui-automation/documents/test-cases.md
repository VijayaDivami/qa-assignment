# Test Cases — Sweet Shop UI Automation

| Field | Details |
|---|---|
| **Document ID** | TC-SWEETSHOP-001 |
| **Version** | 1.0 |
| **Date** | 25 April 2026 |
| **Application** | Sweet Shop — https://sweetshop.netlify.app |
| **Related Documents** | Test Strategy v2.1 · Test Plan TP-SWEETSHOP-001 |

---

## Priority Legend

| Priority | Meaning |
|---|---|
| P1 | Critical — core user journey; must pass before release |
| P2 | High — significant feature; failure blocks a key workflow |
| P3 | Medium — important but workaround exists |
| P4 | Low — cosmetic or edge case |

---

## Test Case ID Convention

`[AREA]-[NUMBER]`  
Examples: `HP-01` (Home Page), `SW-03` (Sweets), `BK-07` (Basket), `LG-02` (Login), `NAV-04` (Navigation), `CB-01` (Cross-Browser), `E2E-01` (End-to-End)

---

## 1. Home Page

### HP-01 — Page loads successfully

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Browser is open; no prior navigation |
| **Test Steps** | 1. Navigate to `https://sweetshop.netlify.app/` |
| **Expected Result** | Page loads with HTTP 200; heading "Welcome to the sweet shop!" is visible |

---

### HP-02 — Subheading and description are displayed

| Field | Details |
|---|---|
| **Priority** | P3 |
| **Preconditions** | Navigate to `/` |
| **Test Steps** | 1. Observe the content below the main heading |
| **Expected Result** | Description text "The sweetest online shop out there." is visible |

---

### HP-03 — Most Popular section is displayed with 4 product cards

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Preconditions** | Navigate to `/` |
| **Test Steps** | 1. Scroll to the "Most popular" section |
| **Expected Result** | 4 product cards are visible, each showing a name, price, image, and "Add to Basket" button |

---

### HP-04 — Most Popular products show correct items

| Field | Details |
|---|---|
| **Priority** | P3 |
| **Preconditions** | Navigate to `/` |
| **Test Steps** | 1. Read the names of the 4 products in the Most Popular section |
| **Expected Result** | Products shown are: Sherbert Straws (£0.75), Chocolate Cups (£1.00), Sherbert Discs (£0.95), Bon Bons (£1.00) |

---

### HP-05 — "Browse Sweets" CTA navigates to the sweets catalogue

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Navigate to `/` |
| **Test Steps** | 1. Click the "Browse Sweets" button |
| **Expected Result** | Browser navigates to `/sweets`; "Browse sweets" heading is visible |

---

### HP-06 — Add to Basket from Most Popular updates basket counter

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Navigate to `/`; basket is empty (count = 0) |
| **Test Steps** | 1. Note the current basket counter in the nav bar. 2. Click "Add to Basket" on any Most Popular product |
| **Expected Result** | Basket counter in the navigation bar increments by 1 |

---

### HP-07 — Sale promotional banner is visible

| Field | Details |
|---|---|
| **Priority** | P4 |
| **Preconditions** | Navigate to `/` |
| **Test Steps** | 1. Observe the page for a promotional banner or image |
| **Expected Result** | Sale GIF banner is rendered and visible on the page |

---

## 2. Sweets Catalogue Page

### SW-01 — Page loads and heading is correct

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Browser is open |
| **Test Steps** | 1. Navigate to `https://sweetshop.netlify.app/sweets` |
| **Expected Result** | Page loads with HTTP 200; heading "Browse sweets" is visible |

---

### SW-02 — Subheading is displayed

| Field | Details |
|---|---|
| **Priority** | P3 |
| **Preconditions** | Navigate to `/sweets` |
| **Test Steps** | 1. Observe content below the main heading |
| **Expected Result** | Text "Browse our delicious choice of retro sweets." is visible |

---

### SW-03 — All 16 products are displayed

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Navigate to `/sweets` |
| **Test Steps** | 1. Count all product cards on the page |
| **Expected Result** | Exactly 16 product cards are present |

---

### SW-04 — Each product card contains required elements

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Preconditions** | Navigate to `/sweets` |
| **Test Steps** | 1. Inspect any product card (e.g., Chocolate Cups) |
| **Expected Result** | Card contains: product image, product name, description text, price in £ format, and an "Add to Basket" button |

---

### SW-05 — Product prices are formatted correctly

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Preconditions** | Navigate to `/sweets` |
| **Test Steps** | 1. Check the price displayed on each of the 16 product cards |
| **Expected Result** | All prices are in the format `£X.XX` (e.g., £1.00, £0.75) |

---

### SW-06 — Correct prices for specific products

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Preconditions** | Navigate to `/sweets` |
| **Test Steps** | 1. Locate each product and note its displayed price |
| **Expected Result** | Prices match: Sherbert Straws £0.75 · Chocolate Cups £1.00 · Sherbert Discs £0.95 · Bon Bons £1.00 · Jellies £0.75 · Fruit Salads £0.50 · Bubble Gums £0.25 · Wham Bars £0.15 · Whistles £0.25 · Sherbert Fountains £0.35 · Swansea Mixture £1.50 · Chocolate Beans £0.80 · Nerds £0.60 · Drumsticks £0.20 · Bubbly £0.10 · Dolly Mixture £0.90 |

---

### SW-07 — All product images render without broken links

| Field | Details |
|---|---|
| **Priority** | P3 |
| **Preconditions** | Navigate to `/sweets` |
| **Test Steps** | 1. Observe all 16 product images on the page |
| **Expected Result** | No broken image icons; all 16 images are displayed |

---

### SW-08 — Adding a single item increments basket counter by 1

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Navigate to `/sweets`; basket count is 0 |
| **Test Steps** | 1. Note the basket counter. 2. Click "Add to Basket" on Chocolate Cups |
| **Expected Result** | Basket counter changes from 0 to 1 |

---

### SW-09 — Adding multiple different items increments basket counter correctly

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Navigate to `/sweets`; basket count is 0 |
| **Test Steps** | 1. Click "Add to Basket" on Bon Bons. 2. Click "Add to Basket" on Jellies. 3. Click "Add to Basket" on Nerds |
| **Expected Result** | Basket counter shows 3 |

---

### SW-10 — Adding the same item twice increments basket counter by 2

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Preconditions** | Navigate to `/sweets`; basket count is 0 |
| **Test Steps** | 1. Click "Add to Basket" on Drumsticks. 2. Click "Add to Basket" on Drumsticks again |
| **Expected Result** | Basket counter shows 2 |

---

### SW-11 — Swansea Mixture is the highest-priced item

| Field | Details |
|---|---|
| **Priority** | P3 |
| **Preconditions** | Navigate to `/sweets` |
| **Test Steps** | 1. Review all 16 product prices |
| **Expected Result** | Swansea Mixture at £1.50 is the highest price displayed |

---

### SW-12 — Bubbly is the lowest-priced item

| Field | Details |
|---|---|
| **Priority** | P4 |
| **Preconditions** | Navigate to `/sweets` |
| **Test Steps** | 1. Review all 16 product prices |
| **Expected Result** | Bubbly at £0.10 is the lowest price displayed |

---

## 3. Basket Page

### BK-01 — Basket page loads successfully

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Browser is open |
| **Test Steps** | 1. Navigate to `https://sweetshop.netlify.app/basket` |
| **Expected Result** | Page loads with HTTP 200; heading "Your Basket" is visible |

---

### BK-02 — Empty basket shows zero count and £0.00 total

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Navigate to `/basket` without adding any items |
| **Test Steps** | 1. Observe the basket summary section |
| **Expected Result** | "Your Basket 0" is displayed; total shows "£0.00" |

---

### BK-03 — Basket reflects items added from the catalogue

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Navigate to `/sweets` |
| **Test Steps** | 1. Click "Add to Basket" on Chocolate Cups (£1.00). 2. Click "Add to Basket" on Jellies (£0.75). 3. Navigate to `/basket` |
| **Expected Result** | Basket shows 2 items; total displays £1.75 |

---

### BK-04 — Basket total is the correct sum of added item prices

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Navigate to `/sweets` |
| **Test Steps** | 1. Add Bon Bons (£1.00), Nerds (£0.60), and Drumsticks (£0.20). 2. Navigate to `/basket` |
| **Expected Result** | Total displayed is £1.80 |

---

### BK-05 — Delivery option: Collect (FREE) is selected by default

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Preconditions** | Navigate to `/basket` |
| **Test Steps** | 1. Observe the Delivery section |
| **Expected Result** | "Collect (FREE)" radio button is selected; Standard Shipping radio is unselected |

---

### BK-06 — Selecting Standard Shipping adds £1.99 to total

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Preconditions** | Add Chocolate Cups (£1.00) to basket; navigate to `/basket`; note current total (£1.00) |
| **Test Steps** | 1. Select "Standard Shipping (£1.99)" radio button |
| **Expected Result** | Total updates to £2.99 |

---

### BK-07 — Switching back to Collect removes shipping cost

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Preconditions** | Add Chocolate Cups (£1.00); navigate to `/basket`; select Standard Shipping (total = £2.99) |
| **Test Steps** | 1. Select "Collect (FREE)" radio button |
| **Expected Result** | Total returns to £1.00; shipping charge is removed |

---

### BK-08 — "Empty Basket" button resets basket to zero

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Preconditions** | Add 2 items from `/sweets`; navigate to `/basket` |
| **Test Steps** | 1. Click the "Empty Basket" button |
| **Expected Result** | Basket count resets to 0; total shows £0.00; items are removed from the basket summary |

---

### BK-09 — Billing address form contains all required fields

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Preconditions** | Navigate to `/basket` |
| **Test Steps** | 1. Scroll to the "Billing address" section |
| **Expected Result** | The following fields are visible and interactive: First name, Last name, Email Address, Address, Address 2 (Optional), Country, City, Zip |

---

### BK-10 — Payment form contains all required fields

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Preconditions** | Navigate to `/basket` |
| **Test Steps** | 1. Scroll to the "Payment" section |
| **Expected Result** | The following fields are visible and interactive: Name on card, Credit card number, Expiration, CVV |

---

### BK-11 — "Continue to Checkout" button is present

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Navigate to `/basket` |
| **Test Steps** | 1. Scroll to the bottom of the basket page |
| **Expected Result** | "Continue to checkout" button is visible and clickable |

---

### BK-12 — Submitting empty form triggers validation

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Navigate to `/basket`; leave all form fields empty |
| **Test Steps** | 1. Click "Continue to checkout" without filling in any fields |
| **Expected Result** | Browser or inline validation highlights required fields; form is not submitted |

---

### BK-13 — Invalid email format in billing form shows error

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Preconditions** | Navigate to `/basket` |
| **Test Steps** | 1. Enter "notanemail" in the Email Address field. 2. Fill all other required fields with valid data. 3. Click "Continue to checkout" |
| **Expected Result** | Email format validation error is shown; checkout does not proceed |

---

### BK-14 — Address 2 field is optional and does not block submission

| Field | Details |
|---|---|
| **Priority** | P3 |
| **Preconditions** | Navigate to `/basket` |
| **Test Steps** | 1. Fill all required billing and payment fields with valid data. 2. Leave Address 2 empty. 3. Click "Continue to checkout" |
| **Expected Result** | Form submits successfully without requiring Address 2 |

---

### BK-15 — "Redeem" voucher field is present

| Field | Details |
|---|---|
| **Priority** | P4 |
| **Preconditions** | Navigate to `/basket` |
| **Test Steps** | 1. Observe the Delivery section |
| **Expected Result** | A "Redeem" input or button is visible in the delivery section |

---

## 4. Login Page

### LG-01 — Login page loads successfully

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Browser is open |
| **Test Steps** | 1. Navigate to `https://sweetshop.netlify.app/login` |
| **Expected Result** | Page loads with HTTP 200; heading "Login" is visible |

---

### LG-02 — Page description text is displayed

| Field | Details |
|---|---|
| **Priority** | P3 |
| **Preconditions** | Navigate to `/login` |
| **Test Steps** | 1. Read the text below the heading |
| **Expected Result** | Text reads "Please enter your email address and password in order to login to your account." |

---

### LG-03 — Email and password fields are present and interactive

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Navigate to `/login` |
| **Test Steps** | 1. Observe the form fields |
| **Expected Result** | "Email address" and "Password" input fields are visible, labelled, and can receive focus |

---

### LG-04 — Password field masks input

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Preconditions** | Navigate to `/login` |
| **Test Steps** | 1. Click the Password field. 2. Type any characters |
| **Expected Result** | Characters are masked (displayed as dots/asterisks); field has `type="password"` |

---

### LG-05 — Login button is present

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Navigate to `/login` |
| **Test Steps** | 1. Observe the form |
| **Expected Result** | A "Login" button is visible and clickable |

---

### LG-06 — Submitting empty form triggers validation

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Navigate to `/login`; leave all fields empty |
| **Test Steps** | 1. Click the "Login" button without entering any credentials |
| **Expected Result** | Validation feedback is shown indicating required fields; login does not proceed |

---

### LG-07 — Submitting invalid email format shows validation error

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Preconditions** | Navigate to `/login` |
| **Test Steps** | 1. Enter "notvalid" in the Email address field. 2. Enter any text in the Password field. 3. Click "Login" |
| **Expected Result** | Email format validation error is displayed; login does not proceed |

---

### LG-08 — Login with invalid credentials shows error message

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Navigate to `/login` |
| **Test Steps** | 1. Enter "wrong@example.com" in the Email field. 2. Enter "wrongpassword" in the Password field. 3. Click "Login" |
| **Expected Result** | An error message is displayed indicating invalid credentials; user is not authenticated |

---

### LG-09 — Login with valid credentials authenticates user

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Valid account credentials are available; navigate to `/login` |
| **Test Steps** | 1. Enter a valid email address. 2. Enter the correct password. 3. Click "Login" |
| **Expected Result** | User is authenticated and redirected to a logged-in state (e.g., account page or home page) |

---

### LG-10 — Social links (Twitter, Facebook, LinkedIn) are visible

| Field | Details |
|---|---|
| **Priority** | P4 |
| **Preconditions** | Navigate to `/login` |
| **Test Steps** | 1. Observe the page for social media links |
| **Expected Result** | Twitter, Facebook, and LinkedIn links are visible on the login page |

---

## 5. Navigation

### NAV-01 — Navigation bar is present on all pages

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | None |
| **Test Steps** | 1. Visit `/`. 2. Visit `/sweets`. 3. Visit `/basket`. 4. Visit `/login` |
| **Expected Result** | A navigation bar containing the "Sweet Shop" brand and navigation links is visible on every page |

---

### NAV-02 — "Sweet Shop" logo navigates to the home page

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Preconditions** | Navigate to `/sweets` |
| **Test Steps** | 1. Click the "Sweet Shop" brand/logo link in the navigation bar |
| **Expected Result** | Browser navigates to `/`; "Welcome to the sweet shop!" heading is visible |

---

### NAV-03 — Sweets nav link navigates to the sweets catalogue

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Navigate to `/` |
| **Test Steps** | 1. Click the "Sweets" link in the navigation bar |
| **Expected Result** | Browser navigates to `/sweets`; "Browse sweets" heading is visible |

---

### NAV-04 — Basket nav link navigates to the basket page

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Navigate to `/` |
| **Test Steps** | 1. Click the "Basket" link in the navigation bar |
| **Expected Result** | Browser navigates to `/basket`; "Your Basket" heading is visible |

---

### NAV-05 — Login nav link navigates to the login page

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Navigate to `/` |
| **Test Steps** | 1. Click the "Login" link in the navigation bar |
| **Expected Result** | Browser navigates to `/login`; "Login" heading is visible |

---

### NAV-06 — Basket count in nav bar persists when navigating between pages

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Navigate to `/sweets` |
| **Test Steps** | 1. Add 2 items to the basket. 2. Navigate to `/`. 3. Note the basket count in the nav. 4. Navigate to `/login`. 5. Note the basket count |
| **Expected Result** | Basket counter shows 2 on every page visited after adding the items |

---

### NAV-07 — Footer is present and correct on all pages

| Field | Details |
|---|---|
| **Priority** | P3 |
| **Preconditions** | None |
| **Test Steps** | 1. Visit `/`, `/sweets`, `/basket`, `/login`. 2. Scroll to the bottom of each page |
| **Expected Result** | Footer containing "Sweet Shop Project 2018" is visible on all pages |

---

## 6. Cross-Browser Compatibility

> The following tests are executed once per browser engine. All tests assume navigation to the stated URL with a fresh browser context.

### CB-01 — Home page renders correctly in Firefox

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Browser** | Firefox 125+ |
| **Test Steps** | 1. Open `/` in Firefox |
| **Expected Result** | Heading, Most Popular section, and "Browse Sweets" CTA are all visible with correct layout |

---

### CB-02 — Sweets page renders correctly in Firefox

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Browser** | Firefox 125+ |
| **Test Steps** | 1. Open `/sweets` in Firefox |
| **Expected Result** | All 16 product cards are visible with correct layout; no missing images or broken formatting |

---

### CB-03 — Basket page renders correctly in Firefox

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Browser** | Firefox 125+ |
| **Test Steps** | 1. Open `/basket` in Firefox |
| **Expected Result** | Basket summary, delivery options, billing and payment forms are all visible |

---

### CB-04 — Home page renders correctly in WebKit (Safari)

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Browser** | WebKit (Safari 17+) |
| **Test Steps** | 1. Open `/` in WebKit |
| **Expected Result** | Heading, Most Popular section, and "Browse Sweets" CTA are all visible with correct layout |

---

### CB-05 — Sweets page renders correctly in WebKit (Safari)

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Browser** | WebKit (Safari 17+) |
| **Test Steps** | 1. Open `/sweets` in WebKit |
| **Expected Result** | All 16 product cards are visible with correct layout; no missing images or broken formatting |

---

### CB-06 — Basket page renders correctly in WebKit (Safari)

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Browser** | WebKit (Safari 17+) |
| **Test Steps** | 1. Open `/basket` in WebKit |
| **Expected Result** | Basket summary, delivery options, billing and payment forms are all visible |

---

## 7. End-to-End Journeys

### E2E-01 — Full guest purchase journey

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Fresh browser session; basket is empty |
| **Test Steps** | 1. Navigate to `/sweets`. 2. Click "Add to Basket" on Chocolate Cups (£1.00). 3. Click "Add to Basket" on Jellies (£0.75). 4. Navigate to `/basket`. 5. Verify basket shows 2 items and total £1.75. 6. Select "Standard Shipping (£1.99)". 7. Verify total updates to £3.74. 8. Fill "Billing address" with valid test data. 9. Fill "Payment" with valid test card details. 10. Click "Continue to checkout" |
| **Expected Result** | All steps complete without errors; basket shows correct totals at each step; checkout form submits or proceeds to a confirmation state |

---

### E2E-02 — Browse, add to basket, then log in

| Field | Details |
|---|---|
| **Priority** | P1 |
| **Preconditions** | Fresh browser session; valid login credentials available |
| **Test Steps** | 1. Navigate to `/sweets`. 2. Add Bon Bons (£1.00) to the basket. 3. Note basket count = 1. 4. Navigate to `/login`. 5. Enter valid credentials and click "Login". 6. Return to `/basket` |
| **Expected Result** | Basket count is retained at 1 after login; basket still contains Bon Bons |

---

### E2E-03 — Empty basket and re-shop

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Preconditions** | Fresh browser session |
| **Test Steps** | 1. Navigate to `/sweets`. 2. Add Nerds (£0.60) and Drumsticks (£0.20) to the basket. 3. Navigate to `/basket`. 4. Verify basket count = 2 and total = £0.80. 5. Click "Empty Basket". 6. Verify basket count = 0 and total = £0.00. 7. Navigate back to `/sweets`. 8. Add Dolly Mixture (£0.90). 9. Navigate to `/basket` |
| **Expected Result** | After emptying, basket correctly shows 0 items and £0.00. After re-adding, basket shows 1 item (Dolly Mixture) and total of £0.90 |

---

### E2E-04 — Navigation flow through all pages in sequence

| Field | Details |
|---|---|
| **Priority** | P2 |
| **Preconditions** | Fresh browser session |
| **Test Steps** | 1. Navigate to `/`. 2. Click the "Browse Sweets" CTA → lands on `/sweets`. 3. Click the "Basket" nav link → lands on `/basket`. 4. Click the "Login" nav link → lands on `/login`. 5. Click the "Sweet Shop" logo → lands on `/` |
| **Expected Result** | Each navigation step lands on the correct page with the correct heading; the back button functions correctly throughout |

---

*End of Test Cases document*
