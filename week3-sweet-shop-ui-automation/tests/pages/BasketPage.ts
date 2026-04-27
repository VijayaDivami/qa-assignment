import { Page, Locator } from '@playwright/test';

export class BasketPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly basketCount: Locator;
  readonly basketTotal: Locator;
  readonly collectOption: Locator;
  readonly standardShippingOption: Locator;
  readonly emptyBasketBtn: Locator;
  // Billing fields
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly emailField: Locator;
  readonly addressField: Locator;
  readonly countryField: Locator;
  readonly cityField: Locator;
  readonly zipField: Locator;
  // Payment fields
  readonly nameOnCardField: Locator;
  readonly cardNumberField: Locator;
  readonly expirationField: Locator;
  readonly cvvField: Locator;
  readonly checkoutBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Your Basket', exact: true });
    this.basketCount = page.locator('#basketCount');
    this.basketTotal = page.locator('#basketItems strong');
    this.collectOption = page.locator('#exampleRadios1');
    this.standardShippingOption = page.locator('#exampleRadios2');
    this.emptyBasketBtn = page.getByRole('link', { name: 'Empty Basket' });
    // Billing — labels are broken by design (for="firstName" but id="name")
    this.firstNameField = page.locator('#name').first();
    this.lastNameField = page.locator('#name').nth(1);
    this.emailField = page.locator('#email');
    this.addressField = page.locator('#address');
    this.countryField = page.locator('#country');
    this.cityField = page.locator('#city');
    this.zipField = page.locator('#zip');
    // Payment
    this.nameOnCardField = page.locator('#cc-name');
    this.cardNumberField = page.locator('#cc-number');
    this.expirationField = page.locator('#cc-expiration');
    this.cvvField = page.locator('#cc-cvv');
    this.checkoutBtn = page.getByRole('button', { name: 'Continue to checkout' });
  }

  async goto() {
    await this.page.goto('/basket');
  }

  async getBasketCount(): Promise<number> {
    const text = await this.basketCount.innerText();
    console.log('Basket count text:', text);
    return parseInt(text.trim(), 10);
  }

  async getTotalText(): Promise<string> {
    const text = await this.basketTotal.innerText();
    console.log('Basket total text:', text);
    return text.trim();
  }

  async selectStandardShipping() {
    await this.standardShippingOption.check({ force: true });
  }

  async selectCollect() {
    await this.collectOption.check({ force: true });
  }

  async clickEmptyBasket() {
    await this.emptyBasketBtn.click();
  }

  async fillBillingForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    country: string;
    city: string;
    zip: string;
  }) {
    await this.firstNameField.fill(data.firstName);
    await this.lastNameField.fill(data.lastName);
    await this.emailField.fill(data.email);
    await this.addressField.fill(data.address);
    await this.countryField.selectOption(data.country);
    await this.cityField.selectOption(data.city);
    await this.zipField.fill(data.zip);
  }

  async fillPaymentForm(data: {
    nameOnCard: string;
    cardNumber: string;
    expiration: string;
    cvv: string;
  }) {
    await this.nameOnCardField.fill(data.nameOnCard);
    await this.cardNumberField.fill(data.cardNumber);
    await this.expirationField.fill(data.expiration);
    await this.cvvField.fill(data.cvv);
  }

  async clickCheckout() {
    await this.checkoutBtn.click();
  }

  async getItemQuantityText(productName: string): Promise<string> {
    return this.page
      .locator('#basketItems li')
      .filter({ hasText: productName })
      .locator('small.text-muted')
      .innerText();
  }

  async deleteItem(productName: string) {
    this.page.once('dialog', dialog => dialog.accept());
    await this.page
      .locator('#basketItems li')
      .filter({ hasText: productName })
      .getByRole('link', { name: 'Delete Item' })
      .click();
  }

  async isItemInBasket(productName: string): Promise<boolean> {
    return this.page
      .locator('#basketItems li')
      .filter({ hasText: productName })
      .isVisible()
      .catch(() => false);
  }
}
