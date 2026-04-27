import { Page, Locator } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly title: Locator;
  readonly productItems: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.productItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async addToCartByName(productName: string) {
    const product = this.page.locator('.inventory_item').filter({ hasText: productName });
    await product.locator('button').click();
  }

  async removeFromCartByName(productName: string) {
    const product = this.page.locator('.inventory_item').filter({ hasText: productName });
    await product.locator('button').click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
