import { expect, test, chromium } from '@playwright/test';
import type { Page } from '@playwright/test';

let page: Page;

test.beforeAll(async () => {
  const browser = await chromium.launch();
  page = await browser.newPage();

  await page.goto(
    '/blog/un-exemple-pour-vous-projeter-dans-votre-achat-en-brs',
  );
});

test('blog post page has correct title', async () => {
  expect(await page.title()).toBe(
    'Un exemple pour vous projeter dans votre achat en BRS',
  );
});

test('blog post page has expected h1', async () => {
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('h1')).toHaveText(
    'Un exemple pour vous projeter dans votre achat en BRS',
  );
});
