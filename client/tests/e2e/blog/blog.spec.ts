import { expect, test, chromium } from '@playwright/test';
import type { Page } from '@playwright/test';

let page: Page;

test.beforeAll(async () => {
  const browser = await chromium.launch();
  page = await browser.newPage();

  await page.goto('/blog');
});

test('blog page has expected h1', async () => {
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('h1')).toHaveText('Blog');
});

test('blog page shows articles', async () => {
  await page.locator('.fr-card').first().waitFor();

  expect(await page.locator('.fr-card').count()).toBeGreaterThan(0);
});
