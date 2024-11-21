import { expect, test, chromium } from '@playwright/test';
import type { Page } from '@playwright/test';

let page: Page;

test.beforeAll(async () => {
  const browser = await chromium.launch();
  page = await browser.newPage();

  await page.goto('/mentions-legales');
});

test('mentions-legales page has correct title', async () => {
  expect(await page.title()).toBe('Boris - Mentions légales');
});

test('mentions-legales has expected h1', async () => {
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('h1')).toHaveText('Mentions légales');
});
