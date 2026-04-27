import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  // AB-01
  test('AB-01 about page loads at /about', async ({ page }) => {
    await expect(page).toHaveURL(/\/about/);
  });

  // AB-02
  test('AB-02 navigation bar is present on the about page', async ({ page }) => {
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  // AB-03
  test('AB-03 footer is present on the about page', async ({ page }) => {
    await expect(page.getByText(/Sweet Shop Project 2018/i)).toBeVisible();
  });

  // AB-04
  test('AB-04 about page has visible body content', async ({ page }) => {
    const body = page.locator('body');
    const text = await body.innerText();
    expect(text.trim().length).toBeGreaterThan(50);
  });

  // AB-05
  test('AB-05 basket nav link on about page navigates to /basket', async ({ page }) => {
    await page.getByRole('navigation').getByRole('link', { name: /basket/i }).click();
    await expect(page).toHaveURL(/\/basket/);
  });

  // AB-06
  test('AB-06 Sweet Shop brand logo on about page navigates to home', async ({ page }) => {
    await page.getByRole('link', { name: /Sweet Shop/i }).first().click();
    await expect(page).toHaveURL('/');
  });

  // AB-07
  test('AB-07 nav basket badge is visible on the about page', async ({ page }) => {
    await expect(page.locator('nav .badge')).toBeVisible();
  });
});
