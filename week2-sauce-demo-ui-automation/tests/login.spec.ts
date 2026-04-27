import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const users = [
  { username: 'standard_user',          password: 'secret_sauce' },
  { username: 'locked_out_user',         password: 'secret_sauce' },
  { username: 'problem_user',            password: 'secret_sauce' },
  { username: 'performance_glitch_user', password: 'secret_sauce' },
  { username: 'error_user',              password: 'secret_sauce' },
  { username: 'visual_user',             password: 'secret_sauce' },
];

async function loginAs(page: Page, username: string, password: string) {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(username, password);
}

test.describe('Login Tests', () => {

  test.describe('All users', () => {
    for (const user of users) {
      test(`Login as ${user.username}`, async ({ page }) => {
        const login = new LoginPage(page);
        await loginAs(page, user.username, user.password);

        if (user.username === 'locked_out_user') {
          await expect(login.errorMessage).toBeVisible();
          await expect(login.errorMessage).toContainText('locked out');
        } else if (user.username === 'problem_user') {
          await expect(page).toHaveURL(/inventory/);
          // Additional checks for broken images/UI can be added here
        } else if (user.username === 'performance_glitch_user') {
          await expect(page).toHaveURL(/inventory/);
        } else {
          await expect(page).toHaveURL(/inventory/);
        }
      });
    }
  });

  test.describe('Invalid credentials', () => {
    test('should show error for invalid username and password', async ({ page }) => {
      await loginAs(page, 'invalid_user', 'wrong_password');
      const login = new LoginPage(page);
      await expect(login.errorMessage).toBeVisible();
      await expect(login.errorMessage).toContainText('Username and password do not match');
    });

    test('should show error when username is empty', async ({ page }) => {
      await loginAs(page, '', 'secret_sauce');
      const login = new LoginPage(page);
      await expect(login.errorMessage).toBeVisible();
      await expect(login.errorMessage).toContainText('Username is required');
    });

    test('should show error when password is empty', async ({ page }) => {
      await loginAs(page, 'standard_user', '');
      const login = new LoginPage(page);
      await expect(login.errorMessage).toBeVisible();
      await expect(login.errorMessage).toContainText('Password is required');
    });
  });

});
