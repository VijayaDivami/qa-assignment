import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';

test.describe('Cart Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('should display added product in cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.addToCartByName('Sauce Labs Backpack');
    await productsPage.goToCart();

    const cartPage = new CartPage(page);
    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
  });

  test('should display multiple items in cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.addToCartByName('Sauce Labs Backpack');
    await productsPage.addToCartByName('Sauce Labs Bike Light');
    await productsPage.addToCartByName('Sauce Labs Bolt T-Shirt');
    await productsPage.goToCart();

    const cartPage = new CartPage(page);
    await expect(cartPage.cartItems).toHaveCount(3);
  });

  test('should remove item from cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.addToCartByName('Sauce Labs Backpack');
    await productsPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.removeItemByName('Sauce Labs Backpack');
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('should show empty cart when no items added', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goToCart();

    const cartPage = new CartPage(page);
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('should navigate back to products page from cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.continueShopping();
    await expect(page).toHaveURL('/inventory.html');
  });

  test('should navigate to checkout from cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.addToCartByName('Sauce Labs Backpack');
    await productsPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.checkout();
    await expect(page).toHaveURL('/checkout-step-one.html');
  });
});
