import { Page, Locator } from '@playwright/test';

export class SweetsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly productCards: Locator;
  readonly navBasketCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Browse sweets' });
    this.productCards = page.locator('.card');
    this.navBasketCount = page.locator('nav .badge');
  }

  async goto() {
    await this.page.goto('/sweets');
    await this.page.waitForLoadState('networkidle');
    // Wait for all product cards to be in the DOM before assertions run
    await this.page.locator('.card').nth(15).waitFor({ timeout: 20000 });
  }

  async addToBasket(productName: string) {
    await this.page
      .locator('.card')
      .filter({ hasText: productName })
      .locator('.addItem')
      .click();
  }

  async getProductPrice(productName: string): Promise<string> {
    return this.page
      .locator('.card')
      .filter({ hasText: productName })
      .locator('small.text-muted')
      .innerText();
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  async getBasketCount(): Promise<number> {
    const text = await this.navBasketCount.innerText();
    return parseInt(text.trim(), 10);
  }

  async isProductImageLoaded(productName: string): Promise<boolean> {
    const img = this.page
      .locator('.card')
      .filter({ hasText: productName })
      .locator('img');
    const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
    return naturalWidth > 0;
  }
}
