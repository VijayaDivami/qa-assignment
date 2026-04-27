import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Checkout Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    const productsPage = new ProductsPage(page);
    await productsPage.addToCartByName('Sauce Labs Backpack');
    await productsPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.checkout();
  });

  test('should complete full checkout flow successfully', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillShippingInfo('John', 'Doe', '12345');
    await checkoutPage.continue();

    await expect(page).toHaveURL('/checkout-step-two.html');
    await expect(page.locator('.summary_info')).toBeVisible();
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');

    await checkoutPage.finish();

    await expect(page).toHaveURL('/checkout-complete.html');
    await expect(checkoutPage.confirmationHeader).toHaveText('Thank you for your order!');
  });

  test('should show error when first name is empty', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillShippingInfo('', 'Doe', '12345');
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('should show error when last name is empty', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillShippingInfo('John', '', '12345');
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
  });

  test('should show error when postal code is empty', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillShippingInfo('John', 'Doe', '');
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
  });

  test('should cancel checkout and return to cart', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.cancelButton.click();
    await expect(page).toHaveURL('/cart.html');
  });

  test('should display correct item total on order summary page', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillShippingInfo('John', 'Doe', '12345');
    await checkoutPage.continue();

    const itemTotal = await page.locator('.summary_subtotal_label').textContent();
    expect(itemTotal).toContain('29.99');
  });
});
