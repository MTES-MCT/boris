import { test, expect } from '@playwright/test';

test.describe('navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulateur-eligibilite/steps');
  });

  test('should have title', async ({ page }) => {
    await expect(page).toHaveTitle(
      /Simulateur d'éligibilité au Bail Réel Solidaire - BoRiS/,
    );
  });

  test('should have a valid h1', async ({ page }) => {
    const h1 = page.getByRole('heading', { level: 1 });

    expect(h1).toHaveText("Simulateur d'éligibilité");
  });

  test('simulator completion', async ({ page }) => {
    const simulatorWrapper = page.getByTestId('simulator-wrapper');

    // Step 1
    let stepTitle = simulatorWrapper.getByRole('heading', { level: 2 });
    expect(stepTitle).toHaveText('1. Définir mon éligibilité Étape 1 sur 3');
    let nextStepButton = simulatorWrapper.getByRole('button', {
      name: /Étape suivante/i,
    });
    await nextStepButton.click();

    stepTitle = simulatorWrapper.getByRole('heading', { level: 2 });
    expect(stepTitle).toHaveText("2. Mon résultat d'éligibilité Étape 2 sur 3");
    nextStepButton = simulatorWrapper.getByRole('button', {
      name: /Étape suivante/i,
    });
    await nextStepButton.click();

    stepTitle = simulatorWrapper.getByRole('heading', { level: 2 });
    expect(stepTitle).toHaveText('3. Ma recherche Étape 3 sur 3');
  });
});
