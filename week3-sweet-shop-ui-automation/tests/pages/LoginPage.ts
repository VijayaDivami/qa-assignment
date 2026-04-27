import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly loginBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Login' });
    this.emailField = page.getByLabel('Email address');
    this.passwordField = page.getByLabel('Password');
    this.loginBtn = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.loginBtn.click();
  }
}
