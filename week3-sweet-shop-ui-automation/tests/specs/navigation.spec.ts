import { test, expect } from '@playwright/test';

const pages = ['/', '/sweets', '/basket', '/login'];

test.describe('Navigation', () => {
  // NAV-01
  test('NAV-01 navigation bar is present on all pages', async ({ page }) => {
    for (const path of pages) {
      await page.goto(path);
      await expect(page.getByRole('navigation')).toBeVisible();
    }
  });

  // NAV-02
  test('NAV-02 brand logo navigates to home page', async ({ page }) => {
    await page.goto('/sweets');
    await page.getByRole('link', { name: /Sweet Shop/i }).first().click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Welcome to the sweet shop!' })).toBeVisible();
  });

  // NAV-03
  test('NAV-03 Sweets nav link navigates to /sweets', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('link', { name: /sweets/i }).click();
    await expect(page).toHaveURL(/\/sweets/);
    await expect(page.getByRole('heading', { name: 'Browse sweets' })).toBeVisible();
  });

  // NAV-04
  test('NAV-04 Basket nav link navigates to /basket', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('link', { name: /basket/i }).click();
    await expect(page).toHaveURL(/\/basket/);
    await expect(page.getByRole('heading', { name: 'Your Basket', exact: true })).toBeVisible();
  });

  // NAV-05
  test('NAV-05 Login nav link navigates to /login', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('link', { name: /login/i }).click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  // NAV-06
  test('NAV-06 basket count persists across page navigations', async ({ page }) => {
    await page.goto('/sweets');
    await page.locator('.card').first().locator('.addItem').click();
    await page.locator('.card').nth(1).locator('.addItem').click();

    const getCount = () => page.locator('nav .badge').innerText().then((t) => parseInt(t.trim(), 10));

    await page.goto('/');
    expect(await getCount()).toBe(2);

    await page.goto('/login');
    expect(await getCount()).toBe(2);
  });

  // NAV-07
  test('NAV-07 footer is present on all pages', async ({ page }) => {
    for (const path of pages) {
      await page.goto(path);
      await expect(page.getByText(/Sweet Shop Project 2018/i)).toBeVisible();
    }
  });

  // NAV-08
  test('NAV-08 About page is accessible at /about', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveURL(/\/about/);
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  // NAV-09
  test('NAV-09 browser back button returns to the previous page', async ({ page }) => {
    await page.goto('/');
    await page.goto('/sweets');
    await page.goBack();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Welcome to the sweet shop!' })).toBeVisible();
  });

  // NAV-10
  test('NAV-10 document title is set on key pages', async ({ page }) => {
    const checks: Array<[string, RegExp]> = [
      ['/', /sweet shop/i],
      ['/sweets', /sweet/i],
      ['/login', /sweet|login/i],
    ];
    for (const [path, pattern] of checks) {
      await page.goto(path);
      await expect(page).toHaveTitle(pattern);
    }
  });

  // NAV-11
  test('NAV-11 nav basket badge shows initial count of 0 on all pages', async ({ page }) => {
    for (const path of pages) {
      await page.goto(path);
      await expect(page.locator('nav .badge')).toHaveText('0');
    }
  });

  // NAV-12
  test('NAV-12 all nav links have a valid href attribute', async ({ page }) => {
    await page.goto('/');
    const navLinks = page.getByRole('navigation').getByRole('link');
    const count = await navLinks.count();
    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

});
