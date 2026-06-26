import { test, expect, Page } from '@playwright/test';

// Token único por ejecución para no mezclar datos entre runs
const TOKEN = `playwright-${Date.now()}`;
const LIST_URL = `/list/${TOKEN}`;

// ─── Helper ────────────────────────────────────────────────────────────────

async function addItem(page: Page, name: string) {
  await page.fill('input[placeholder="Add item..."]', name);
  await page.click('button:has-text("Add")');
}

// ─── Tests ─────────────────────────────────────────────────────────────────

test.describe('Shopping List', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(LIST_URL);
    // Espera a que la lista cargue (el input de añadir aparece cuando no hay error)
    await expect(page.locator('input[placeholder="Add item..."]')).toBeVisible();
  });

  test('muestra lista vacía al entrar con token nuevo', async ({ page }) => {
    await expect(page.locator('text=List is empty')).toBeVisible();
  });

  test('añadir un ítem lo muestra en la lista', async ({ page }) => {
    await addItem(page, 'Leche');
    await expect(page.locator('text=Leche')).toBeVisible();
  });

  test('añadir varios ítems los muestra todos', async ({ page }) => {
    await addItem(page, 'Pan');
    await addItem(page, 'Huevos');
    await addItem(page, 'Mantequilla');

    await expect(page.locator('text=Pan')).toBeVisible();
    await expect(page.locator('text=Huevos')).toBeVisible();
    await expect(page.locator('text=Mantequilla')).toBeVisible();
  });

  test('marcar ítem como comprado lo tacha', async ({ page }) => {
    await addItem(page, 'Yogur');

    // Marca el checkbox del ítem
    const item = page.locator('.item', { hasText: 'Yogur' });
    await item.locator('input[type="checkbox"]').check();

    // El ítem pasa a la sección "In the cart" con texto tachado
    await expect(page.locator('.checked-list')).toContainText('Yogur');
    await expect(item).toHaveClass(/item--checked/);
  });

  test('desmarcar ítem lo vuelve a la lista activa', async ({ page }) => {
    await addItem(page, 'Queso');

    const item = page.locator('.item', { hasText: 'Queso' });
    await item.locator('input[type="checkbox"]').check();
    await expect(item).toHaveClass(/item--checked/);

    await item.locator('input[type="checkbox"]').uncheck();
    await expect(item).not.toHaveClass(/item--checked/);
  });

  test('borrar ítem lo elimina de la lista', async ({ page }) => {
    await addItem(page, 'Aceite');
    await expect(page.locator('text=Aceite')).toBeVisible();

    const item = page.locator('.item', { hasText: 'Aceite' });
    await item.locator('button[aria-label^="Delete"]').click();

    await expect(page.locator('text=Aceite')).not.toBeVisible();
  });

  test('el botón Refresh recarga la lista', async ({ page }) => {
    await addItem(page, 'Café');
    await expect(page.locator('text=Café')).toBeVisible();

    await page.click('button:has-text("Refresh")');

    // Después del refresh el ítem sigue ahí (viene del backend)
    await expect(page.locator('text=Café')).toBeVisible();
  });

});

test.describe('Acceso sin token', () => {

  test('URL sin token muestra mensaje de ayuda', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=your-secret-token')).toBeVisible();
  });

});
