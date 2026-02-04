import { steps } from '$routes/simulateur-eligibilite/steps/steps';
import { test, expect, type Locator } from '@playwright/test';

test.describe('navigation', () => {
  let simulatorWrapper: Locator;
  let submitButton: Locator;
  let householdSizeSelect: Locator;
  let householdSizeErrorMessage: Locator;
  let hasDisabilitySelect: Locator;
  let hasDisabilityErrorMessage: Locator;
  let dependantsAmountSelect: Locator;
  let dependantsAmountErrorMessage: Locator;
  let birthdayInput: Locator;
  let birthdayErrorMessage: Locator;
  let coBuyerBirthdayInput: Locator;
  let coBuyerBirthdayErrorMessage: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto('/simulateur-eligibilite/steps');

    simulatorWrapper = page.getByTestId('simulator-wrapper');
    submitButton = simulatorWrapper.getByRole('button', {
      name: /Étape suivante/i,
    });

    householdSizeSelect = simulatorWrapper.getByRole('combobox', {
      name: 'Combien de personnes composent votre foyer ?',
    });
    householdSizeErrorMessage = simulatorWrapper.getByTestId(
      'select-household-size-error-message',
    );

    hasDisabilitySelect = simulatorWrapper.getByRole('combobox', {
      name: /situation de handicap/i,
    });
    hasDisabilityErrorMessage = simulatorWrapper.getByTestId(
      'select-has-disability-error-message',
    );

    dependantsAmountSelect = simulatorWrapper.getByRole('combobox', {
      name: 'Combien avez-vous de personnes à charge (enfants compris) ?',
    });
    dependantsAmountErrorMessage = simulatorWrapper.getByTestId(
      'select-dependants-amount-error-message',
    );

    birthdayInput = simulatorWrapper.getByRole('textbox', {
      name: 'Quelle est votre date de naissance ?',
    });
    birthdayErrorMessage = simulatorWrapper.getByTestId(
      'input-birthday-error-message',
    );

    coBuyerBirthdayInput = simulatorWrapper.getByRole('textbox', {
      name: 'Quelle est la date de naissance de votre co-acquéreur·euse ?',
    });
    coBuyerBirthdayErrorMessage = simulatorWrapper.getByTestId(
      'input-co-buyer-birthday-error-message',
    );
  });

  test.describe('Définir mon éligibilité', () => {
    test.describe('Composition de mon foyer', () => {
      test.describe('Form validation', () => {
        test('Submit without householdSize', async () => {
          await submitButton.click();
          expect(householdSizeErrorMessage).toBeVisible();
        });

        test('1 person in household, submit without hasDisability', async () => {
          await householdSizeSelect.selectOption('1');
          expect(hasDisabilitySelect).toBeVisible();
          await submitButton.click();
          expect(hasDisabilityErrorMessage).toBeVisible();
        });

        test('2 persons in household, submit without dependantsAmount & hasDisability', async () => {
          await householdSizeSelect.selectOption('2');
          expect(dependantsAmountSelect).toBeVisible();
          expect(hasDisabilitySelect).toBeVisible();
          await submitButton.click();
          expect(dependantsAmountErrorMessage).toBeVisible();
          expect(hasDisabilityErrorMessage).toBeVisible();
        });

        test('2 persons in household, submit without hasDisability & birthday & coBuyerBirthday', async () => {
          await householdSizeSelect.selectOption('2');
          expect(dependantsAmountSelect).toBeVisible();
          await dependantsAmountSelect.selectOption('0');
          expect(birthdayInput).toBeVisible();
          expect(coBuyerBirthdayInput).toBeVisible();
          expect(hasDisabilitySelect).toBeVisible();
          await submitButton.click();
          expect(hasDisabilityErrorMessage).toBeVisible();
          expect(birthdayErrorMessage).toBeVisible();
          expect(coBuyerBirthdayErrorMessage).toBeVisible();
        });

        test('4 persons in household, submit without dependantsAmount & hasDisability', async () => {
          await householdSizeSelect.selectOption('2');
          expect(dependantsAmountSelect).toBeVisible();
          expect(hasDisabilitySelect).toBeVisible();
          await submitButton.click();
          expect(dependantsAmountErrorMessage).toBeVisible();
          expect(hasDisabilityErrorMessage).toBeVisible();
        });
      });
    });
  });

  // test('Flow with 1 person in household', async ({ page }) => {
  //   const simulatorWrapper = page.getByTestId('simulator-wrapper');
  //   const submitButton = simulatorWrapper.getByRole('button', {
  //     name: /Étape suivante/i,
  //   });

  //   /**
  //    * -------------
  //    * Phase "Composition de mon foyer"
  //    * -------------
  //    */
  //   const stepTitle = simulatorWrapper.getByRole('heading', { level: 2 });
  //   expect(stepTitle).toHaveText(
  //     `1. ${steps[0].title} Étape 1 sur ${steps.length}`,
  //   );

  //   const phaseTitle = simulatorWrapper.getByRole('heading', { level: 3 });
  //   expect(phaseTitle).toHaveText(`${steps[0].phases[0].title}`);

  //   expect(submitButton).toHaveText(
  //     `Étape suivante ${steps[0].phases[1].title}`,
  //   );

  //   const selectHouseholdSize = simulatorWrapper.getByRole('combobox', {
  //     name: 'Combien de personnes composent votre foyer ?',
  //   });
  //   expect(selectHouseholdSize).toBeVisible();

  //   // Submit without selecting a household size
  //   await submitButton.click();
  //   const householdSizeErrorMessage = simulatorWrapper.getByTestId(
  //     'select-household-size-error-message',
  //   );
  //   expect(householdSizeErrorMessage).toBeVisible();

  //   // Selecting a household size
  //   await selectHouseholdSize.selectOption('1');
  //   const selectHasDisability = simulatorWrapper.getByRole('combobox', {
  //     name: 'Êtes-vous en situation de handicap ?',
  //   });
  //   expect(selectHasDisability).toBeVisible();

  //   // Submit without selecting hasDisability
  //   await submitButton.click();
  //   const hasDisabilityErrorMessage = simulatorWrapper.getByTestId(
  //     'select-has-disability-error-message',
  //   );
  //   expect(hasDisabilityErrorMessage).toBeVisible();

  //   // Selecting hasDisability
  //   await selectHasDisability.selectOption('true');
  //   await submitButton.click();

  //   /**
  //    * -------------
  //    * Phase "Revenus fiscaux"
  //    * -------------
  //    */
  //   expect(stepTitle).toHaveText(
  //     `1. ${steps[0].title} Étape 1 sur ${steps.length}`,
  //   );
  //   expect(phaseTitle).toHaveText(`${steps[0].phases[1].title}`);
  //   expect(submitButton).toHaveText(
  //     `Étape suivante ${steps[0].phases[2].title}`,
  //   );
  //   await submitButton.click();

  //   // Submit without providing a formatted taxable income
  //   const formattedTaxableErrorMessage = simulatorWrapper.getByTestId(
  //     'formatted-taxable-income-error-message',
  //   );
  //   expect(formattedTaxableErrorMessage).toBeVisible();

  //   // Providing invalid value for formatted taxable income
  //   const formattedTaxableIncomeInput = simulatorWrapper.getByRole('textbox', {
  //     name: /revenu fiscal de référence/i,
  //   });
  //   await formattedTaxableIncomeInput.fill('sss');
  //   await submitButton.click();
  //   expect(formattedTaxableErrorMessage).toBeVisible();

  //   // Providing valid value for formatted taxable income
  //   await formattedTaxableIncomeInput.fill('25000');
  //   await submitButton.click();

  //   /**
  //    * -------------
  //    * Phase "Situation immobilière"
  //    * -------------
  //    */
  //   expect(stepTitle).toHaveText(
  //     `1. ${steps[0].title} Étape 1 sur ${steps.length}`,
  //   );
  //   expect(phaseTitle).toHaveText(`${steps[0].phases[2].title}`);
  //   expect(submitButton).toHaveText(`Étape suivante ${steps[1].title}`);

  //   const selectPropertySituation = simulatorWrapper.getByRole('combobox', {
  //     name: 'Quelle est votre situation immobilière ?',
  //   });
  //   expect(selectPropertySituation).toBeVisible();

  //   // Submit without selecting a property situation
  //   await submitButton.click();
  //   const propertySituationErrorMessage = simulatorWrapper.getByTestId(
  //     'select-property-situation-error-message',
  //   );
  //   expect(propertySituationErrorMessage).toBeVisible();

  //   // Selecting a property situation
  //   await selectPropertySituation.selectOption('LOCATAIRE_SOCIAL');
  //   await submitButton.click();

  //   /**
  //    * -------------
  //    * Phase "Détail du resultat"
  //    */
  //   expect(stepTitle).toHaveText(
  //     `2. ${steps[1].title} Étape 2 sur ${steps.length}`,
  //   );
  //   expect(phaseTitle).toHaveText(`${steps[1].phases[0].title}`);
  //   expect(submitButton).toHaveText(
  //     `Étape suivante ${steps[1].phases[1].title}`,
  //   );
  // });

  // test('Flow with between 2 and 6 persons in household', async ({ page }) => {
  //   const simulatorWrapper = page.getByTestId('simulator-wrapper');
  //   const submitButton = simulatorWrapper.getByRole('button', {
  //     name: /Étape suivante/i,
  //   });

  //   /**
  //    * -------------
  //    * Phase "Composition de mon foyer"
  //    * -------------
  //    */
  //   const stepTitle = simulatorWrapper.getByRole('heading', { level: 2 });
  //   expect(stepTitle).toHaveText(
  //     `1. ${steps[0].title} Étape 1 sur ${steps.length}`,
  //   );

  //   const phaseTitle = simulatorWrapper.getByRole('heading', { level: 3 });
  //   expect(phaseTitle).toHaveText(`${steps[0].phases[0].title}`);

  //   expect(submitButton).toHaveText(
  //     `Étape suivante ${steps[0].phases[1].title}`,
  //   );

  //   const selectHouseholdSize = simulatorWrapper.getByRole('combobox', {
  //     name: 'Combien de personnes composent votre foyer ?',
  //   });
  //   expect(selectHouseholdSize).toBeVisible();

  //   // Submit without selecting a household size
  //   await submitButton.click();
  //   const householdSizeErrorMessage = simulatorWrapper.getByTestId(
  //     'select-household-size-error-message',
  //   );
  //   expect(householdSizeErrorMessage).toBeVisible();

  //   // Selecting a household size
  //   await selectHouseholdSize.selectOption('2');

  //   const selectDependantsAmount = simulatorWrapper.getByRole('combobox', {
  //     name: 'Combien avez-vous de personnes à charge (enfants compris) ?',
  //   });
  //   expect(selectDependantsAmount).toBeVisible();

  //   const selectHasDisability = simulatorWrapper.getByRole('combobox', {
  //     name: "Dans votre foyer (vous y compris), est-ce qu'une ou plusieurs personnes sont en situation de handicap ?",
  //   });
  //   expect(selectDependantsAmount).toBeVisible();

  //   await submitButton.click();

  //   // Submit without selecting a dependants amount and hasDisability
  //   const dependantsAmountErrorMessage = simulatorWrapper.getByTestId(
  //     'select-dependants-amount-error-message',
  //   );
  //   expect(dependantsAmountErrorMessage).toBeVisible();
  //   const hasDisabilityErrorMessage = simulatorWrapper.getByTestId(
  //     'select-has-disability-error-message',
  //   );
  //   expect(hasDisabilityErrorMessage).toBeVisible();

  //   // Selecting a dependants amount
  //   await selectDependantsAmount.selectOption('0');

  //   // Selecting hasDisability
  //   await selectHasDisability.selectOption('false');

  //   await submitButton.click();

  //   /**
  //    * -------------
  //    * Phase "Revenus fiscaux"
  //    * -------------
  //    */
  //   expect(stepTitle).toHaveText(
  //     `1. ${steps[0].title} Étape 1 sur ${steps.length}`,
  //   );
  //   expect(phaseTitle).toHaveText(`${steps[0].phases[1].title}`);
  //   expect(submitButton).toHaveText(
  //     `Étape suivante ${steps[0].phases[2].title}`,
  //   );

  //   // await submitButton.click();
  // });
});

// test errors messages
// test flow screen by screen
