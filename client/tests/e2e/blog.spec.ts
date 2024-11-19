import { expect, test } from '@playwright/test';

test('blog page has expected h1', async ({ page }) => {
  await page.goto('/blog');

  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('h1')).toHaveText('Blog');
});

test('blog page shows articles', async ({ page }) => {
  await page.goto('/blog');
  await page.locator('.fr-card').first().waitFor();

  expect(await page.locator('.fr-card').count()).toBeGreaterThan(0);
});
