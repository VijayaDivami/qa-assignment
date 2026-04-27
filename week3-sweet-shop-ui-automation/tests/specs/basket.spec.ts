import { test, expect } from '@playwright/test';
import { BasketPage } from '../pages/BasketPage';
import { SweetsPage } from '../pages/SweetsPage';
import { testData } from '../fixtures/testData';

test.describe('Basket Page', () => {
  let basketPage: BasketPage;

  test.beforeEach(async ({ page }) => {
    basketPage = new BasketPage(page);
  });

  // BK-01
  test('BK-01 page loads and displays correct heading', async () => {
    await basketPage.goto();
    await expect(basketPage.heading).toBeVisible();
  });

  // BK-02
  test('BK-02 empty basket shows 0 items and £0.00 total', async () => {
    await basketPage.goto();
    const count = await basketPage.getBasketCount();
    const total = await basketPage.getTotalText();
    expect(count).toBe(0);
    expect(total).toContain('£0.00');
  });

  // BK-03
  test('BK-03 basket reflects items added from catalogue', async ({ page }) => {
    const sweetsPage = new SweetsPage(page);
    await sweetsPage.goto();
    await sweetsPage.addToBasket(testData.products.chocolateCups.name);
    await sweetsPage.addToBasket(testData.products.jellies.name);
    await basketPage.goto();
    const count = await basketPage.getBasketCount();
    expect(count).toBe(2);
    const total = await basketPage.getTotalText();
    expect(total).toContain('£1.75');
  });

  // BK-05
  test('BK-05 Collect FREE is the default delivery option', async () => {
    await basketPage.goto();
    await expect(basketPage.collectOption).toBeChecked();
    await expect(basketPage.standardShippingOption).not.toBeChecked();
  });

  // BK-06
  test('BK-06 selecting Standard Shipping adds £1.99 to total', async ({ page }) => {
    test.fail(); // BUG-002: shipping total does not recalculate correctly
    const sweetsPage = new SweetsPage(page);
    await sweetsPage.goto();
    await sweetsPage.addToBasket(testData.products.chocolateCups.name);
    await expect(sweetsPage.navBasketCount).toHaveText('1');
    await basketPage.goto();
    await basketPage.selectStandardShipping();
    await expect(basketPage.basketTotal).toHaveText('£2.99');
  });

  // BK-07
  test('BK-07 switching back to Collect removes shipping cost', async ({ page }) => {
    const sweetsPage = new SweetsPage(page);
    await sweetsPage.goto();
    await sweetsPage.addToBasket(testData.products.chocolateCups.name);
    await basketPage.goto();
    await basketPage.selectStandardShipping();
    await basketPage.selectCollect();
    const total = await basketPage.getTotalText();
    expect(total).toContain('£1.00');
  });

  // BK-08
  test('BK-08 Empty Basket resets basket to 0 items and £0.00', async ({ page }) => {
    test.fail(); // BUG-001: Empty Basket link navigates to basket# without clearing localStorage
    const sweetsPage = new SweetsPage(page);
    await sweetsPage.goto();
    await sweetsPage.addToBasket(testData.products.bonBons.name);
    await sweetsPage.addToBasket(testData.products.nerds.name);
    await expect(sweetsPage.navBasketCount).toHaveText('2');
    await basketPage.goto();
    await basketPage.clickEmptyBasket();
    const count = await basketPage.getBasketCount();
    const total = await basketPage.getTotalText();
    expect(count).toBe(0);
    expect(total).toContain('£0.00');
  });

  // BK-09
  test('BK-09 billing address form contains all required fields', async () => {
    await basketPage.goto();
    await expect(basketPage.firstNameField).toBeVisible();
    await expect(basketPage.lastNameField).toBeVisible();
    await expect(basketPage.emailField).toBeVisible();
    await expect(basketPage.addressField.first()).toBeVisible();
    await expect(basketPage.countryField).toBeVisible();
    await expect(basketPage.cityField).toBeVisible();
    await expect(basketPage.zipField).toBeVisible();
  });

  // BK-10
  test('BK-10 payment form contains all required fields', async () => {
    await basketPage.goto();
    await expect(basketPage.nameOnCardField).toBeVisible();
    await expect(basketPage.cardNumberField).toBeVisible();
    await expect(basketPage.expirationField).toBeVisible();
    await expect(basketPage.cvvField).toBeVisible();
  });

  // BK-11
  test('BK-11 Continue to Checkout button is present', async () => {
    await basketPage.goto();
    await expect(basketPage.checkoutBtn).toBeVisible();
  });

  // BK-12
  test('BK-12 submitting empty form triggers browser validation', async ({ page }) => {
    await basketPage.goto();
    await basketPage.clickCheckout();
    // Page should not navigate away — form is still present
    await expect(basketPage.heading).toBeVisible();
  });

  // BK-17
  test('BK-17 country dropdown has selectable options', async () => {
    await basketPage.goto();
    // Country select has 2 options: placeholder "Choose..." + "United Kingdom"
    await expect(basketPage.countryField.locator('option')).toHaveCount(2);
  });

  // BK-18
  test('BK-18 city dropdown has selectable options', async () => {
    await basketPage.goto();
    // City select has 4 options: placeholder + Bristol, Cardiff, Swansea
    await expect(basketPage.cityField.locator('option')).toHaveCount(4);
  });

  // BK-19
  test('BK-19 first name and last name are independent fields', async () => {
    await basketPage.goto();
    await basketPage.firstNameField.fill('Alice');
    await basketPage.lastNameField.fill('Smith');
    expect(await basketPage.firstNameField.inputValue()).toBe('Alice');
    expect(await basketPage.lastNameField.inputValue()).toBe('Smith');
  });

  // BK-26
  test('BK-26 adding two different items sums their individual prices', async ({ page }) => {
    const sweetsPage = new SweetsPage(page);
    await sweetsPage.goto();
    // Wham Bars £0.15 + Bubbly £0.10 = £0.25
    await sweetsPage.addToBasket(testData.products.whamBars.name);
    await sweetsPage.addToBasket(testData.products.bubbly.name);
    // Wait for both items to register in localStorage before navigating
    await expect(sweetsPage.navBasketCount).toHaveText('2');
    await basketPage.goto();
    const total = await basketPage.getTotalText();
    expect(total).toContain('£0.25');
  });
});
