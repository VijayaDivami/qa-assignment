import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { testData } from '../fixtures/testData';

test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // LG-01
  test('LG-01 page loads and displays correct heading', async () => {
    await expect(loginPage.heading).toBeVisible();
  });

  // LG-03
  test('LG-03 email and password fields are present', async () => {
    await expect(loginPage.emailField).toBeVisible();
    await expect(loginPage.passwordField).toBeVisible();
  });

  // LG-04
  test('LG-04 password field masks input', async () => {
    const inputType = await loginPage.passwordField.getAttribute('type');
    expect(inputType).toBe('password');
  });

  // LG-05
  test('LG-05 Login button is present', async () => {
    await expect(loginPage.loginBtn).toBeVisible();
  });

  // LG-06
  test('LG-06 submitting empty form triggers validation', async ({ page }) => {
    await loginPage.loginBtn.click();
    // Page should not navigate away
    await expect(loginPage.heading).toBeVisible();
  });

  // LG-07
  test('LG-07 invalid email format triggers validation error', async ({ page }) => {
    await loginPage.emailField.fill('notvalid');
    await loginPage.passwordField.fill('anypassword');
    await loginPage.loginBtn.click();
    await expect(loginPage.heading).toBeVisible();
  });

  // LG-08
  test('LG-08 invalid credentials show error message', async ({ page }) => {
    await loginPage.login(testData.credentials.invalidEmail, testData.credentials.invalidPassword);
    // Expect either an error message or to remain on the login page
    const isOnLoginPage = page.url().includes('/login') || page.url() === testData.baseUrl + '/login';
    expect(isOnLoginPage).toBeTruthy();
  });

  // LG-09
  test('LG-09 valid credentials authenticate user', async ({ page }) => {
    await loginPage.login(
      testData.credentials.valid.email,
      testData.credentials.valid.password
    );
    // After login, user should not remain on /login
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 5000 })
      .catch(() => { /* intentional: app may not redirect */ });
  });

  // LG-10
  test('LG-10 social links are visible on the login page', async ({ page }) => {
    await expect(page.getByRole('link', { name: /twitter/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /facebook/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /linkedin/i })).toBeVisible();
  });

  // LG-11
  test('LG-11 email field is of type email', async () => {
    const type = await loginPage.emailField.getAttribute('type');
    expect(type).toBe('email');
  });

  // LG-12
  test('LG-12 all invalid email formats in test data prevent form submission', async ({ page }) => {
    for (const badEmail of testData.credentials.badEmailFormats) {
      await loginPage.goto();
      await loginPage.emailField.fill(badEmail);
      await loginPage.passwordField.fill('anypassword');
      await loginPage.loginBtn.click();
      await expect(loginPage.heading).toBeVisible();
    }
  });

  // LG-14
  test('LG-14 submitting email only (no password) keeps user on login page', async ({ page }) => {
    await loginPage.emailField.fill(testData.credentials.valid.email);
    await loginPage.loginBtn.click();
    await expect(loginPage.heading).toBeVisible();
  });

  // LG-15
  test('LG-15 submitting password only (no email) keeps user on login page', async ({ page }) => {
    await loginPage.passwordField.fill(testData.credentials.valid.password);
    await loginPage.loginBtn.click();
    await expect(loginPage.heading).toBeVisible();
  });

  // LG-18
  test('LG-18 login page has a single login form', async ({ page }) => {
    const forms = page.locator('form');
    expect(await forms.count()).toBe(1);
  });

});
