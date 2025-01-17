import { expect, test, chromium } from '@playwright/test';
import type { Page } from '@playwright/test';

let page: Page;

test.beforeAll(async () => {
  const browser = await chromium.launch();
  page = await browser.newPage();

  await page.goto('/tout-savoir-sur-le-bail-reel-solidaire-brs');
});

test('tout-savoir-sur-le-bail-reel-solidaire-brs page has expected h1', async () => {
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('h1')).toHaveText(
    "Qu'est ce que le  Bail Réel Solidaire ?",
  );
});
