import { expect, test, chromium } from '@playwright/test';
import type { Page } from '@playwright/test';

let page: Page;

test.beforeAll(async () => {
  const browser = await chromium.launch();
  page = await browser.newPage();

  await page.goto('/donnees-personnelles');
});

test('donnees-personnelles page has correct title', async () => {
  expect(await page.title()).toBe('Boris - Données personnelles');
});

test('donnees-personnelles has expected h1', async () => {
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('h1')).toHaveText('Données personnelles');
});
