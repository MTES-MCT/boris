import { expect, test, chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

let page: Page;

test.beforeAll(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  page = await context.newPage();

  await page.goto('/tout-savoir-sur-le-bail-reel-solidaire-brs');
});

test.describe('tout-savoir-sur-le-bail-reel-solidaire-brs', () => {
  test('should not have any a11y issue', async () => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); // 4

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
