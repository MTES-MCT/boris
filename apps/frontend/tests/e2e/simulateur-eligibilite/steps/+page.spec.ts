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

  test('Flow with 1 person in household', async ({ page }) => {
    const simulatorWrapper = page.getByTestId('simulator-wrapper');
    const submitButton = simulatorWrapper.getByRole('button', {
      name: /Étape suivante/i,
    });
    expect(submitButton).toBeVisible();

    const stepTitle = simulatorWrapper.getByRole('heading', { level: 2 });
    expect(stepTitle).toHaveText('1. Définir mon éligibilité Étape 1 sur 3');

    const selectHouseholdSize = simulatorWrapper.getByRole('combobox', {
      name: 'Combien de personnes composent votre foyer ?',
    });
    expect(selectHouseholdSize).toBeVisible();

    // Submit without selecting a household size
    await submitButton.click();
    const householdSizeErrorMessage = simulatorWrapper.getByTestId(
      'select-household-size-error-message',
    );
    expect(householdSizeErrorMessage).toBeVisible();

    // Selecting a household size
    await selectHouseholdSize.selectOption('1');
    const selectHasDisability = simulatorWrapper.getByRole('combobox', {
      name: 'Êtes-vous en situation de handicap ?',
    });
    expect(selectHasDisability).toBeVisible();

    // Submit without selecting hasDisability
    await submitButton.click();
    const hasDisabilityErrorMessage = simulatorWrapper.getByTestId(
      'select-has-disability-error-message',
    );
    expect(hasDisabilityErrorMessage).toBeVisible();

    // Selecting hasDisability
    await selectHasDisability.selectOption('true');
    await submitButton.click();
  });
});
