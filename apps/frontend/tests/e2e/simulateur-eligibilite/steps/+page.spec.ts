import { steps } from '$routes/simulateur-eligibilite/steps/steps';
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

    /**
     * -------------
     * Phase "Composition de mon foyer"
     * -------------
     */
    const stepTitle = simulatorWrapper.getByRole('heading', { level: 2 });
    expect(stepTitle).toHaveText(
      `1. ${steps[0].title} Étape 1 sur ${steps.length}`,
    );

    const phaseTitle = simulatorWrapper.getByRole('heading', { level: 3 });
    expect(phaseTitle).toHaveText(`${steps[0].phases[0].title}`);

    expect(submitButton).toHaveText(
      `Étape suivante ${steps[0].phases[1].title}`,
    );

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

    /**
     * -------------
     * Phase "Revenus fiscaux"
     * -------------
     */
    expect(stepTitle).toHaveText(
      `1. ${steps[0].title} Étape 1 sur ${steps.length}`,
    );
    expect(phaseTitle).toHaveText(`${steps[0].phases[1].title}`);
    expect(submitButton).toHaveText(
      `Étape suivante ${steps[0].phases[2].title}`,
    );
    await submitButton.click();

    // Submit without providing a formatted taxable income
    const formattedTaxableErrorMessage = simulatorWrapper.getByTestId(
      'formatted-taxable-income-error-message',
    );
    expect(formattedTaxableErrorMessage).toBeVisible();

    // Providing invalid value for formatted taxable income
    const formattedTaxableIncomeInput = simulatorWrapper.getByRole('textbox', {
      name: /revenu fiscal de référence/i,
    });
    await formattedTaxableIncomeInput.fill('sss');
    await submitButton.click();
    expect(formattedTaxableErrorMessage).toBeVisible();

    // Providing valid value for formatted taxable income
    await formattedTaxableIncomeInput.fill('25000');
    await submitButton.click();

    /**
     * -------------
     * Phase "Situation immobilière"
     * -------------
     */
    expect(stepTitle).toHaveText(
      `1. ${steps[0].title} Étape 1 sur ${steps.length}`,
    );
    expect(phaseTitle).toHaveText(`${steps[0].phases[2].title}`);
    expect(submitButton).toHaveText(`Étape suivante ${steps[1].title}`);

    const selectPropertySituation = simulatorWrapper.getByRole('combobox', {
      name: 'Quelle est votre situation immobilière ?',
    });
    expect(selectPropertySituation).toBeVisible();

    // Submit without selecting a property situation
    await submitButton.click();
    const propertySituationErrorMessage = simulatorWrapper.getByTestId(
      'select-property-situation-error-message',
    );
    expect(propertySituationErrorMessage).toBeVisible();

    // Selecting a property situation
    await selectPropertySituation.selectOption('LOCATAIRE_SOCIAL');
    await submitButton.click();

    /**
     * -------------
     * Phase "Détail du resultat"
     */
    expect(stepTitle).toHaveText(
      `2. ${steps[1].title} Étape 2 sur ${steps.length}`,
    );
    expect(phaseTitle).toHaveText(`${steps[1].phases[0].title}`);
    expect(submitButton).toHaveText(
      `Étape suivante ${steps[1].phases[1].title}`,
    );
  });
});
