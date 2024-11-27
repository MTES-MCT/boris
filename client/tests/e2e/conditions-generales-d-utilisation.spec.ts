import { expect, test, chromium } from '@playwright/test';
import type { Page } from '@playwright/test';

let page: Page;

test.beforeAll(async () => {
  const browser = await chromium.launch();
  page = await browser.newPage();

  await page.goto('/conditions-generales-d-utilisation');
});

test('conditions-generales-d-utilisation page has correct title', async () => {
  expect(await page.title()).toBe("Boris - Conditions générales d'utilisation");
});

test('conditions-generales-d-utilisation has expected h1', async () => {
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('h1')).toHaveText(
    "Conditions générales d'utilisation",
  );
});
