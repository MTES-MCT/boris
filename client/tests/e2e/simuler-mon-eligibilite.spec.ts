import { expect, test, chromium } from '@playwright/test';
import type { Page } from '@playwright/test';

let page: Page;

test.beforeAll(async () => {
  const browser = await chromium.launch();
  page = await browser.newPage();

  await page.goto('/simuler-mon-eligibilite');
});

test('simuler-mon-eligibilite page has correct title', async () => {
  expect(await page.title()).toBe('Boris - Simuler mon éligibilité');
});

test('simuler-mon-eligibilite page has expected h1', async ({ page }) => {
  await expect(page.locator('h1')).toBeVisible();
});
