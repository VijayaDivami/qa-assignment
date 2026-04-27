# Test Data — Sweet Shop UI Automation

| Field | Details |
|---|---|
| **Document ID** | TD-SWEETSHOP-001 |
| **Version** | 1.0 |
| **Date** | 25 April 2026 |
| **Application** | Sweet Shop — https://sweetshop.netlify.app |
| **Related Documents** | Test Cases TC-SWEETSHOP-001 · Test Strategy v2.1 |

---

## 1. Login Credentials

### 1.1 Valid Credentials

| Field | Value | Used In |
|---|---|---|
| Email | `testuser@sweetshop.com` | LG-09, E2E-02 |
| Password | `Password123!` | LG-09, E2E-02 |

### 1.2 Invalid Credentials

| Scenario | Email | Password | Expected Behaviour |
|---|---|---|---|
| Wrong email and password | `wrong@example.com` | `wrongpassword` | Error message displayed |
| Correct email, wrong password | `testuser@sweetshop.com` | `badpass` | Error message displayed |
| Non-existent account | `nobody@nowhere.com` | `Password123!` | Error message displayed |

### 1.3 Invalid Email Formats (Validation Testing)

| Input | Reason Invalid | Used In |
|---|---|---|
| `notanemail` | No @ symbol | LG-07, BK-13 |
| `@domain.com` | Missing local part | LG-07 |
| `user@` | Missing domain | LG-07 |
| `user @example.com` | Contains space | LG-07 |
| ` ` (empty) | Required field | LG-06 |

---

## 2. Product Catalogue Data

### 2.1 Full Product List

| # | Product Name | Price (£) | Image File | Used In |
|---|---|---|---|---|
| 1 | Chocolate Cups | £1.00 | cups.jpg | SW-06, BK-03, E2E-01 |
| 2 | Sherbert Straws | £0.75 | straw.JPG | SW-06 |
| 3 | Sherbert Discs | £0.95 | discs.jpeg | SW-06 |
| 4 | Bon Bons | £1.00 | bonbon.jpg | SW-06, SW-09, E2E-02 |
| 5 | Jellies | £0.75 | jellies.jpg | SW-06, SW-09, BK-03 |
| 6 | Fruit Salads | £0.50 | salads.jpg | SW-06 |
| 7 | Bubble Gums | £0.25 | tat.jpg | SW-06 |
| 8 | Wham Bars | £0.15 | whan.jpg | SW-06 |
| 9 | Whistles | £0.25 | whistles.jpg | SW-06 |
| 10 | Sherbert Fountains | £0.35 | sherbert.jpg | SW-06 |
| 11 | Swansea Mixture | £1.50 | mix.jpg | SW-06, SW-11 |
| 12 | Chocolate Beans | £0.80 | beans.jpg | SW-06 |
| 13 | Nerds | £0.60 | nerds.jpg | SW-06, SW-09, BK-04, E2E-03 |
| 14 | Drumsticks | £0.20 | drum.jpg | SW-06, SW-10, BK-04, E2E-03 |
| 15 | Bubbly | £0.10 | bubbly.jpg | SW-06, SW-12 |
| 16 | Dolly Mixture | £0.90 | dolly.jpg | SW-06, E2E-03 |

### 2.2 Basket Total Calculations (Test Reference)

| Items Added | Individual Prices | Expected Total (Collect) | Expected Total (Standard Shipping) |
|---|---|---|---|
| Chocolate Cups | £1.00 | £1.00 | £2.99 |
| Chocolate Cups + Jellies | £1.00 + £0.75 | £1.75 | £3.74 |
| Bon Bons + Nerds + Drumsticks | £1.00 + £0.60 + £0.20 | £1.80 | £3.79 |
| Nerds + Drumsticks | £0.60 + £0.20 | £0.80 | £2.79 |
| Dolly Mixture (single) | £0.90 | £0.90 | £2.89 |

---

## 3. Checkout / Billing Form Data

### 3.1 Valid Billing Address

| Field | Value |
|---|---|
| First name | `Test` |
| Last name | `User` |
| Email Address | `testuser@sweetshop.com` |
| Address | `123 Test Street` |
| Address 2 (Optional) | *(leave blank)* |
| Country | `United Kingdom` |
| City | `Cardiff` |
| Zip | `CF10 1AA` |

### 3.2 Invalid Billing Address Inputs

| Field | Invalid Value | Expected Validation |
|---|---|---|
| First name | *(empty)* | Required field error |
| Last name | *(empty)* | Required field error |
| Email Address | `notanemail` | Invalid email format error |
| Email Address | *(empty)* | Required field error |
| Country | *(empty / unselected)* | Required field error |
| City | *(empty)* | Required field error |
| Zip | *(empty)* | Required field error |

---

## 4. Payment Form Data

### 4.1 Valid Payment Details

| Field | Value | Notes |
|---|---|---|
| Name on card | `Test User` | As displayed on card |
| Credit card number | `4111111111111111` | Visa test number (standard) |
| Expiration | `12/28` | Future date |
| CVV | `123` | 3-digit code |

### 4.2 Additional Test Card Numbers

| Card Type | Number | Notes |
|---|---|---|
| Visa | `4111111111111111` | Standard Visa test number |
| Mastercard | `5500005555555559` | Standard Mastercard test number |
| Invalid (too short) | `1234` | Should fail validation |
| Invalid (non-numeric) | `abcdefghijklmnop` | Should fail validation |

### 4.3 Invalid Payment Inputs

| Field | Invalid Value | Expected Validation |
|---|---|---|
| Name on card | *(empty)* | Required field error |
| Credit card number | *(empty)* | Required field error |
| Credit card number | `1234` | Invalid card number error |
| Expiration | *(empty)* | Required field error |
| CVV | *(empty)* | Required field error |
| CVV | `12` | Invalid CVV (too short) |

---

## 5. Delivery Options Data

| Option | Label | Cost | Effect on Total |
|---|---|---|---|
| Collect | `Collect (FREE)` | £0.00 | No change to item total |
| Standard Shipping | `Standard Shipping (£1.99)` | £1.99 | Adds £1.99 to item total |

---

## 6. Browser Matrix

| Browser Engine | Version | Playwright Project Name |
|---|---|---|
| Chromium | 124+ | `chromium` |
| Firefox | 125+ | `firefox` |
| WebKit | 17+ | `webkit` |

---

## 8. Data Storage

All test data used by the Playwright automation suite is centralised in:

```
tests/fixtures/testData.ts
```

Data is exposed via Playwright fixtures to avoid duplication and hardcoded values in test specs. Sensitive values (credentials) must not be committed to source control — they are injected via environment variables at runtime:

```
LOGIN_EMAIL=testuser@sweetshop.com
LOGIN_PASSWORD=Password123!
BASE_URL=https://sweetshop.netlify.app
```

These variables are defined in a `.env` file locally and configured as CI secrets in GitHub Actions.
