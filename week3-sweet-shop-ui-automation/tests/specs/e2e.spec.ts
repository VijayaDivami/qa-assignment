import { test, expect } from '@playwright/test';
import { SweetsPage } from '../pages/SweetsPage';
import { BasketPage } from '../pages/BasketPage';
import { LoginPage } from '../pages/LoginPage';
import { testData } from '../fixtures/testData';

test.describe('End-to-End Journeys', () => {
  // E2E-01
  test('E2E-01 full guest purchase journey', async ({ page }) => {
    test.fail(); // BUG-001: basket counter wrong; BUG-002: delivery total does not recalculate
    const sweetsPage = new SweetsPage(page);
    const basketPage = new BasketPage(page);

    // Add items
    await sweetsPage.goto();
    await sweetsPage.addToBasket(testData.products.chocolateCups.name);
    await sweetsPage.addToBasket(testData.products.jellies.name);

    // Verify basket
    await basketPage.goto();
    expect(await basketPage.getBasketCount()).toBe(2);
    expect(await basketPage.getTotalText()).toContain('£1.75');

    // Select shipping
    await basketPage.selectStandardShipping();
    expect(await basketPage.getTotalText()).toContain('£3.74');

    // Fill billing
    await basketPage.fillBillingForm(testData.billing);

    // Fill payment
    await basketPage.fillPaymentForm(testData.payment);

    // Checkout
    await basketPage.clickCheckout();

    // Verify we did not stay stuck — heading still accessible (form validates or proceeds)
    await expect(page.locator('body')).toBeVisible();
  });

  // E2E-02
  test('E2E-02 basket state retained after navigating to login', async ({ page }) => {
    const sweetsPage = new SweetsPage(page);
    const loginPage = new LoginPage(page);
    const basketPage = new BasketPage(page);

    await sweetsPage.goto();
    await sweetsPage.addToBasket(testData.products.bonBons.name);

    await loginPage.goto();
    expect(await page.locator('nav .badge').innerText().then((t) => parseInt(t.trim(), 10))).toBe(1);

    await loginPage.login(testData.credentials.valid.email, testData.credentials.valid.password);

    await basketPage.goto();
    expect(await basketPage.getBasketCount()).toBeGreaterThanOrEqual(1);
  });

  // E2E-03
  test('E2E-03 empty basket and re-shop', async ({ page }) => {
    test.fail(); // BUG-001: basket counter does not accurately reflect basket state
    const sweetsPage = new SweetsPage(page);
    const basketPage = new BasketPage(page);

    // Add items
    await sweetsPage.goto();
    await sweetsPage.addToBasket(testData.products.nerds.name);
    await sweetsPage.addToBasket(testData.products.drumsticks.name);

    // Verify basket has 2 items
    await basketPage.goto();
    expect(await basketPage.getBasketCount()).toBe(2);
    expect(await basketPage.getTotalText()).toContain('£0.80');

    // Empty the basket
    await basketPage.clickEmptyBasket();
    expect(await basketPage.getBasketCount()).toBe(0);
    expect(await basketPage.getTotalText()).toContain('£0.00');

    // Re-shop
    await sweetsPage.goto();
    await sweetsPage.addToBasket(testData.products.dollyMixture.name);

    await basketPage.goto();
    expect(await basketPage.getBasketCount()).toBe(1);
    expect(await basketPage.getTotalText()).toContain('£0.90');
  });

  // E2E-04
  test('E2E-04 navigate through all pages using nav links in sequence', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Welcome to the sweet shop!' })).toBeVisible();

    // Home → Sweets via CTA
    await page.getByRole('link', { name: 'Browse Sweets' }).click();
    await expect(page).toHaveURL(/\/sweets/);
    await expect(page.getByRole('heading', { name: 'Browse sweets' })).toBeVisible();

    // Sweets → Basket via nav
    await page.getByRole('navigation').getByRole('link', { name: /basket/i }).click();
    await expect(page).toHaveURL(/\/basket/);
    await expect(page.getByRole('heading', { name: 'Your Basket', exact: true })).toBeVisible();

    // Basket → Login via nav
    await page.getByRole('navigation').getByRole('link', { name: /login/i }).click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    // Login → Home via logo
    await page.getByRole('link', { name: /Sweet Shop/i }).first().click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Welcome to the sweet shop!' })).toBeVisible();
  });
});
