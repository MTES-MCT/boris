import { expect, test, chromium } from '@playwright/test';
import type { Page } from '@playwright/test';

let page: Page;

test.beforeAll(async () => {
  const browser = await chromium.launch();
  page = await browser.newPage();

  await page.goto('/blog/le-brs-kesako-3');
});

test('blog post page has correct title', async () => {
  expect(await page.title()).toBe('Le BRS, kesako #3 ?');
});

test('blog post page has expected h1', async () => {
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('h1')).toHaveText('Le BRS, kesako #3 ?');
});
