import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Products Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('should display 6 products on inventory page', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await expect(productsPage.title).toHaveText('Products');
    await expect(productsPage.productItems).toHaveCount(6);
  });

  test('should sort products by name A to Z', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.sortBy('az');
    const names = await page.locator('.inventory_item_name').allTextContents();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  test('should sort products by name Z to A', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.sortBy('za');
    const names = await page.locator('.inventory_item_name').allTextContents();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test('should sort products by price low to high', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.sortBy('lohi');
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
    const sorted = [...numericPrices].sort((a, b) => a - b);
    expect(numericPrices).toEqual(sorted);
  });

  test('should sort products by price high to low', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.sortBy('hilo');
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
    const sorted = [...numericPrices].sort((a, b) => b - a);
    expect(numericPrices).toEqual(sorted);
  });

  test('should add a product to cart and update badge count', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.addToCartByName('Sauce Labs Backpack');
    await expect(productsPage.cartBadge).toHaveText('1');
  });

  test('should add multiple products to cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.addToCartByName('Sauce Labs Backpack');
    await productsPage.addToCartByName('Sauce Labs Bike Light');
    await expect(productsPage.cartBadge).toHaveText('2');
  });

  test('should remove product from cart via inventory page', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.addToCartByName('Sauce Labs Backpack');
    await expect(productsPage.cartBadge).toHaveText('1');
    await productsPage.removeFromCartByName('Sauce Labs Backpack');
    await expect(productsPage.cartBadge).not.toBeVisible();
  });

  test('should navigate to cart page', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goToCart();
    await expect(page).toHaveURL('/cart.html');
  });

  test('should logout successfully', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.logout();
    await expect(page).toHaveURL('/');
  });
});
