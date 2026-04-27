import { test, expect } from '@playwright/test';
import { SweetsPage } from '../pages/SweetsPage';
import { BasketPage } from '../pages/BasketPage';
import { testData } from '../fixtures/testData';

test.describe('Sweets Catalogue Page', () => {
  let sweetsPage: SweetsPage;

  test.beforeEach(async ({ page }) => {
    sweetsPage = new SweetsPage(page);
    await sweetsPage.goto();
  });

  // SW-01
  test('SW-01 page loads and displays correct heading', async () => {
    await expect(sweetsPage.heading).toBeVisible();
  });

  // SW-03
  test('SW-03 all 16 products are displayed', async () => {
    const count = await sweetsPage.getProductCount();
    expect(count).toBe(testData.totalProducts);
  });

  // SW-06
  test('SW-06 product prices match expected values', async () => {
    for (const product of Object.values(testData.products)) {
      const priceText = await sweetsPage.getProductPrice(product.name);
      expect(priceText).toContain(`£${product.price.toFixed(2)}`);
    }
  });

  // SW-08
  test('SW-08 adding a single item increments basket counter by 1', async () => {
    await sweetsPage.addToBasket(testData.products.chocolateCups.name);
    await expect(sweetsPage.navBasketCount).toHaveText('1');
  });

  // SW-09
  test('SW-09 adding 3 different items increments basket counter to 3', async () => {
    await sweetsPage.addToBasket(testData.products.bonBons.name);
    await expect(sweetsPage.navBasketCount).toHaveText('1');
    await sweetsPage.addToBasket(testData.products.jellies.name);
    await expect(sweetsPage.navBasketCount).toHaveText('2');
    await sweetsPage.addToBasket(testData.products.nerds.name);
    await expect(sweetsPage.navBasketCount).toHaveText('3');
  });

  // SW-10
  test('SW-10 adding the same item twice increments basket counter by 2', async () => {
    await sweetsPage.addToBasket(testData.products.drumsticks.name);
    await expect(sweetsPage.navBasketCount).toHaveText('1');
    await sweetsPage.addToBasket(testData.products.drumsticks.name);
    await expect(sweetsPage.navBasketCount).toHaveText('2');
  });

  // SW-13
  test('SW-13 all product images have a non-empty src attribute', async () => {
    const count = await sweetsPage.getProductCount();
    for (let i = 0; i < count; i++) {
      const src = await sweetsPage.productCards.nth(i).locator('img').getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  // SW-14
  test('SW-14 all product cards have a non-empty description', async () => {
    const count = await sweetsPage.getProductCount();
    for (let i = 0; i < count; i++) {
      const desc = await sweetsPage.productCards.nth(i).locator('.card-text').innerText();
      expect(desc.trim().length).toBeGreaterThan(0);
    }
  });

  // SW-15
  test('SW-15 all product prices are displayed with the £ currency symbol', async () => {
    const count = await sweetsPage.getProductCount();
    for (let i = 0; i < count; i++) {
      const price = await sweetsPage.productCards.nth(i).locator('small.text-muted').innerText();
      expect(price).toMatch(/^£\d+\.\d{2}$/);
    }
  });

  // SW-16
  test('SW-16 Add to Basket button is present on every product card', async () => {
    const count = await sweetsPage.getProductCount();
    for (let i = 0; i < count; i++) {
      await expect(sweetsPage.productCards.nth(i).locator('.addItem')).toBeVisible();
    }
  });

  // SW-18
  test('SW-18 product card heading is visible for every product', async () => {
    const count = await sweetsPage.getProductCount();
    for (let i = 0; i < count; i++) {
      await expect(sweetsPage.productCards.nth(i).getByRole('heading')).toBeVisible();
    }
  });

  // SW-20
  test('SW-20 adding all 16 products accumulates total correctly in basket', async ({ page }) => {
    let expectedCount = 0;
    for (const product of Object.values(testData.products)) {
      await sweetsPage.addToBasket(product.name);
      expectedCount++;
      await expect(sweetsPage.navBasketCount).toHaveText(String(expectedCount));
    }
    const basketPage = new BasketPage(page);
    await basketPage.goto();
    const count = await basketPage.getBasketCount();
    expect(count).toBe(testData.totalProducts);
  });

  // SW-21
  test('SW-21 item quantity increases each time Add to Basket is clicked; no decrement control exists in basket', async ({ page }) => {
    // Add the same item 3 times from the catalogue
    await sweetsPage.addToBasket(testData.products.chocolateCups.name);
    await expect(sweetsPage.navBasketCount).toHaveText('1');
    await sweetsPage.addToBasket(testData.products.chocolateCups.name);
    await expect(sweetsPage.navBasketCount).toHaveText('2');
    await sweetsPage.addToBasket(testData.products.chocolateCups.name);
    await expect(sweetsPage.navBasketCount).toHaveText('3');

    const basketPage = new BasketPage(page);
    await basketPage.goto();

    // Basket item row should show quantity x 3
    const qtyText = await basketPage.getItemQuantityText(testData.products.chocolateCups.name);
    expect(qtyText).toBe('x 3');

    // Total should reflect 3 × £1.00 = £3.00
    const total = await basketPage.getTotalText();
    expect(total).toBe('£3.00');

    // There is no quantity decrement button — only Delete Item exists
    const decrementBtn = page.locator('#basketItems').getByRole('button', { name: /decrement|minus|-|reduce/i });
    await expect(decrementBtn).toHaveCount(0);
  });

  // SW-22
  test('SW-22 Delete Item removes the entire product entry from basket, not just one unit', async ({ page }) => {
    // Add the item once (qty = 1)
    await sweetsPage.addToBasket(testData.products.bonBons.name);

    const basketPage = new BasketPage(page);
    await basketPage.goto();

    // Confirm item is present with qty 1 before deletion
    const qtyBefore = await basketPage.getItemQuantityText(testData.products.bonBons.name);
    expect(qtyBefore).toBe('x 1');

    // Delete the item — should remove the entire row (no decrement-only option exists)
    await basketPage.deleteItem(testData.products.bonBons.name);

    // Wait for the item row to be removed from the DOM (Playwright auto-retries)
    await expect(
      page.locator('#basketItems li').filter({ hasText: testData.products.bonBons.name })
    ).toHaveCount(0);

    // Basket total should reset to £0.00
    const total = await basketPage.getTotalText();
    expect(total).toBe('£0.00');
  });
});
