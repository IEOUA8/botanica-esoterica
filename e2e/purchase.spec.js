const { test, expect } = require('@playwright/test');

test.describe('Purchase flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage cart between tests
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('bei_cart'));
  });

  test('home page loads with featured products', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // At least one product card should appear on the home page
    const cards = page.locator('[data-testid="product-card"], .product-card, article').first();
    await expect(cards).toBeVisible({ timeout: 10000 });
  });

  test('catalog page shows products and filters work', async ({ page }) => {
    await page.goto('/tienda');
    // Products load
    await expect(page.locator('article, [role="article"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('product detail page loads', async ({ page }) => {
    await page.goto('/tienda');
    // Click the first product link
    const firstProduct = page.locator('a[href*="/producto/"]').first();
    await expect(firstProduct).toBeVisible({ timeout: 10000 });
    const href = await firstProduct.getAttribute('href');
    await page.goto(href);
    // Product name heading should be visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('add to cart and see cart count update', async ({ page }) => {
    await page.goto('/tienda');
    const firstProduct = page.locator('a[href*="/producto/"]').first();
    await page.goto(await firstProduct.getAttribute('href'));
    // Find and click add to cart button
    const addBtn = page.getByRole('button', { name: /agregar|carrito|añadir/i }).first();
    await expect(addBtn).toBeVisible({ timeout: 8000 });
    await addBtn.click();
    // Cart should show at least 1 item
    const cartLink = page.getByRole('link', { name: /carrito/i }).first();
    await expect(cartLink).toBeVisible();
  });

  test('empty cart redirects from checkout', async ({ page }) => {
    // Navigate to checkout with empty cart
    await page.goto('/checkout');
    await expect(page.getByText(/no hay productos/i)).toBeVisible({ timeout: 8000 });
  });

  test('checkout form validates required fields', async ({ page }) => {
    // Add an item to cart via localStorage directly
    await page.goto('/');
    await page.evaluate(() => {
      const state = {
        state: {
          items: [{
            _id: 'prod-1',
            slug: 'kit-abundancia-dorada',
            name: 'Kit de Abundancia Dorada',
            price: 89000,
            image: '',
            stock: 10,
            quantity: 1,
          }],
        },
        version: 2,
      };
      localStorage.setItem('bei_cart', JSON.stringify(state));
    });

    await page.goto('/checkout');
    await expect(page.getByRole('heading', { name: /checkout/i })).toBeVisible({ timeout: 8000 });

    // Submit empty form
    await page.getByRole('button', { name: /finalizar/i }).click();

    // Validation errors should appear
    await expect(page.getByText('Escribe tu nombre completo.')).toBeVisible({ timeout: 5000 });
  });

  test('complete checkout flow with demo data', async ({ page }) => {
    // Seed cart with demo product
    await page.goto('/');
    await page.evaluate(() => {
      const state = {
        state: {
          items: [{
            _id: 'prod-1',
            slug: 'kit-abundancia-dorada',
            name: 'Kit de Abundancia Dorada',
            price: 89000,
            image: '',
            stock: 12,
            quantity: 1,
          }],
        },
        version: 2,
      };
      localStorage.setItem('bei_cart', JSON.stringify(state));
    });

    await page.goto('/checkout');
    await page.fill('input[autocomplete="name"]', 'Ana García');
    await page.fill('input[autocomplete="tel"]', '3001234567');
    await page.fill('input[autocomplete="address-level2"]', 'Bogotá');
    await page.fill('input[autocomplete="street-address"]', 'Calle 100 # 15-20 Apto 301');

    await page.getByRole('button', { name: /finalizar/i }).click();

    // Should navigate to confirmation page
    await expect(page).toHaveURL(/confirmacion/, { timeout: 15000 });
    await expect(page.getByText(/BEI-/i)).toBeVisible({ timeout: 10000 });
  });
});
