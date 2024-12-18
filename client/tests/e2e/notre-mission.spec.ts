import { expect, test, chromium } from '@playwright/test';
import type { Page } from '@playwright/test';

let page: Page;

test.beforeAll(async () => {
  const browser = await chromium.launch();
  page = await browser.newPage();

  await page.goto('/notre-mission');
});

test('notre-mission page has expected h1', async () => {
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('h1')).toHaveText(
    'Ensemble,  facilitons l’accès à la propriété  pour tous·tes.',
  );
});
