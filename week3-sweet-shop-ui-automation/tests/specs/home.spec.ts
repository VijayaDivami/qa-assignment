import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Home Page', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  // HP-01
  test('HP-01 page loads and displays correct heading', async () => {
    await expect(homePage.heading).toBeVisible();
  });

  // HP-03
  test('HP-03 Most Popular section has 4 product cards', async () => {
    await expect(homePage.mostPopularSection).toBeVisible();
    await expect(homePage.productCards).toHaveCount(4);
  });

  // HP-05
  test('HP-05 Browse Sweets CTA navigates to /sweets', async ({ page }) => {
    await homePage.clickBrowseSweets();
    await expect(page).toHaveURL(/\/sweets/);
    await expect(page.getByRole('heading', { name: 'Browse sweets' })).toBeVisible();
  });

  // HP-06
  test('HP-06 Add to Basket from home increments basket counter', async () => {
    const before = await homePage.getBasketCount();
    await homePage.addFirstProductToBasket();
    const after = await homePage.getBasketCount();
    expect(after).toBe(before + 1);
  });

  // HP-07
  test('HP-07 sale promotional banner is visible', async () => {
    await expect(homePage.saleBanner).toBeVisible();
  });

  // HP-08
  test('HP-08 page document title contains Sweet Shop', async ({ page }) => {
    await expect(page).toHaveTitle(/sweet shop/i);
  });

  // HP-09
  test('HP-09 each featured product card has an Add to Basket button', async () => {
    const count = await homePage.productCards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(homePage.productCards.nth(i).locator('.addItem')).toBeVisible();
    }
  });

  // HP-10
  test('HP-10 About link is present in the navigation bar', async ({ page }) => {
    await expect(page.getByRole('navigation').getByRole('link', { name: /about/i })).toBeVisible();
  });

  // HP-12
  test('HP-12 featured product images have a non-empty src', async () => {
    const count = await homePage.productCards.count();
    for (let i = 0; i < count; i++) {
      const src = await homePage.productCards.nth(i).locator('img').getAttribute('src');
      expect(src).toBeTruthy();
    }
  });
});
