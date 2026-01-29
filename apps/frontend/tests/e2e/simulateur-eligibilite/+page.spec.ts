import { test, expect } from '@playwright/test';

test.describe('navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulateur-eligibilite');
  });

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(
      /Suis-je éligible au Bail Réel Solidaire - BRS - BoRiS/,
    );
  });

  test('has link to simulator steps page', async ({ page }) => {
    const cta = page.getByRole('link', { name: 'Je lance ma simulation' });

    await expect(cta).toHaveAttribute('href', '/simulateur-eligibilite/steps');
    await expect(cta).toBeVisible();
  });
});
