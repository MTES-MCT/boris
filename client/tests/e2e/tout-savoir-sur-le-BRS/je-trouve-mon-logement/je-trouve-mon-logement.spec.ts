import { expect, test, chromium } from '@playwright/test';
import type { Page } from '@playwright/test';

let page: Page;

test.beforeAll(async () => {
  const browser = await chromium.launch();
  page = await browser.newPage();

  await page.goto('/tout-savoir-sur-le-BRS/je-trouve-mon-logement');
});

test('je-trouve-mon-logement page has expected h1', async () => {
  await expect(page.locator('h1')).toBeVisible();
});