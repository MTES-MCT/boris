import { expect, test, chromium } from '@playwright/test';
import type { Page } from '@playwright/test';

let page: Page;

test.beforeAll(async () => {
  const browser = await chromium.launch();
  page = await browser.newPage();

  await page.goto('/accessibilite');
});

test('accessibilite page has correct title', async () => {
  expect(await page.title()).toBe('Boris - Accessibilité');
});

test('accessibilite page has expected h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
});
