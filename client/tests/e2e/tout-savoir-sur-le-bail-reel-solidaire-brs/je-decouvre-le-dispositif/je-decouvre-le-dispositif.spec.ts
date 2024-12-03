import { expect, test, chromium } from '@playwright/test';
import type { Page } from '@playwright/test';

let page: Page;

test.beforeAll(async () => {
  const browser = await chromium.launch();
  page = await browser.newPage();

  await page.goto(
    '/tout-savoir-sur-le-bail-reel-solidaire-brs/je-decouvre-le-dispositif',
  );
});

test('je-decouvre-le-dispositif page has expected h1', async () => {
  await expect(page.locator('h1')).toBeVisible();
});