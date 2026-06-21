const { test, expect } = require('@playwright/test');

const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = 'TestPassword123';

test.describe('Admin panel', () => {
  test('login page renders correctly', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByRole('heading', { name: /acceso/i })).toBeVisible({ timeout: 8000 });
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'wrong@email.com');
    await page.fill('input[type="password"]', 'WrongPass123');
    await page.getByRole('button', { name: /ingresar|entrar|login|acceder/i }).click();
    await expect(page.getByText(/inv/i)).toBeVisible({ timeout: 8000 });
  });

  test('logs in with valid credentials and reaches dashboard', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.getByRole('button', { name: /ingresar|entrar|login|acceder/i }).click();

    await expect(page).toHaveURL(/admin(?!\/login)/, { timeout: 10000 });
    await expect(page.getByText(/dashboard|bienvenido|pedidos/i)).toBeVisible({ timeout: 8000 });
  });

  test('protected route redirects unauthenticated users to login', async ({ page }) => {
    // Clear any stored token
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('bei_token'));
    await page.goto('/admin/pedidos');
    await expect(page).toHaveURL(/login/, { timeout: 8000 });
  });

  test('admin can view orders list after login', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.getByRole('button', { name: /ingresar|entrar|login|acceder/i }).click();
    await page.waitForURL(/admin(?!\/login)/, { timeout: 10000 });

    // Navigate to orders
    await page.getByRole('link', { name: /pedidos/i }).first().click();
    await expect(page).toHaveURL(/pedidos/);
  });

  test('admin can view products list', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.getByRole('button', { name: /ingresar|entrar|login|acceder/i }).click();
    await page.waitForURL(/admin(?!\/login)/, { timeout: 10000 });

    await page.getByRole('link', { name: /productos/i }).first().click();
    await expect(page).toHaveURL(/productos/);
    // Products table or list should appear
    await expect(page.locator('table, [role="table"], ul').first()).toBeVisible({ timeout: 8000 });
  });
});
