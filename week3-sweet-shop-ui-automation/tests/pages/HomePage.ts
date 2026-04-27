import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly browseSweeetsBtn: Locator;
  readonly mostPopularSection: Locator;
  readonly productCards: Locator;
  readonly navBasketCount: Locator;
  readonly saleBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Welcome to the sweet shop!' });
    this.browseSweeetsBtn = page.getByRole('link', { name: 'Browse Sweets' });
    this.mostPopularSection = page.getByRole('heading', { name: 'Most popular' });
    this.productCards = page.locator('.card');
    this.navBasketCount = page.locator('nav .badge');
    this.saleBanner = page.locator('img[src*="sale"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickBrowseSweets() {
    await this.browseSweeetsBtn.click();
  }

  async addFirstProductToBasket() {
    await this.productCards.first().locator('.addItem').click();
  }

  async getBasketCount(): Promise<number> {
    const text = await this.navBasketCount.innerText();
    return parseInt(text.trim(), 10);
  }
}
