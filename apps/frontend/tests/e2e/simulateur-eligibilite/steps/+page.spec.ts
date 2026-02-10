import {
  stepsContent,
  type DeclarationType,
  type PropertySituation,
} from '../../../../src/lib/utils/eligibility-simulator';
import { steps } from '../../../../src/lib/utils/eligibility-simulator';
import { test, expect, type Locator } from '@playwright/test';

test.describe('Eligibility simulator', () => {
  let simulatorWrapper: Locator;
  let stepTitle: Locator;
  let phaseTitle: Locator;
  let submitButton: Locator;

  // EligibilityDefinition
  let householdSizeSelect: Locator;
  let householdSizeErrorMessage: Locator;
  let singlePersonInHouseholdHasDisabilitySelect: Locator;
  let singlePersonInHouseholdHasDisabilityErrorMessage: Locator;
  let twoToSixPersonsInHouseholdHasDisabilitySelect: Locator;
  let twoToSixPersonsInHouseholdHasDisabilityErrorMessage: Locator;
  let dependantsAmountSelect: Locator;
  let dependantsAmountErrorMessage: Locator;
  let birthdayInput: Locator;
  let birthdayErrorMessage: Locator;
  let coBuyerBirthdayInput: Locator;
  let coBuyerBirthdayErrorMessage: Locator;
  let inputHouseholdSizeInput: Locator;
  let inputHouseholdSizeErrorMessage: Locator;

  // FiscalRevenues
  let taxableIncomeInput: Locator;
  let taxableIncomeErrorMessage: Locator;
  let declarationTypeSelect: Locator;
  let declarationTypeErrorMessage: Locator;
  let firstCoBuyerFormattedTaxableIncomeInput: Locator;
  let firstCoBuyerFormattedTaxableIncomeErrorMessage: Locator;
  let secondCoBuyerFormattedTaxableIncomeInput: Locator;
  let secondCoBuyerFormattedTaxableIncomeErrorMessage: Locator;

  // PropertySituation
  let propertySituationSelect: Locator;
  let propertySituationErrorMessage: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto('/simulateur-eligibilite/steps');

    simulatorWrapper = page.getByTestId('simulator-wrapper');
    stepTitle = simulatorWrapper.getByRole('heading', { level: 2 });
    phaseTitle = simulatorWrapper.getByRole('heading', { level: 3 });
    submitButton = simulatorWrapper.getByRole('button', {
      name: /Étape suivante/i,
    });

    // EligibilityDefinition
    householdSizeSelect = simulatorWrapper.getByRole('combobox', {
      name: stepsContent.selectedHouseholdSize.label,
    });
    householdSizeErrorMessage = simulatorWrapper.getByTestId(
      stepsContent.selectedHouseholdSize.errorDataTestId,
    );
    singlePersonInHouseholdHasDisabilitySelect = simulatorWrapper.getByRole(
      'combobox',
      {
        name: stepsContent.singlePersonInHouseholdHasDisability.label,
      },
    );
    singlePersonInHouseholdHasDisabilityErrorMessage =
      simulatorWrapper.getByTestId(
        stepsContent.singlePersonInHouseholdHasDisability.errorDataTestId,
      );
    twoToSixPersonsInHouseholdHasDisabilitySelect = simulatorWrapper.getByRole(
      'combobox',
      {
        name: stepsContent.twoToSixPersonsInHouseholdHasDisability.label,
      },
    );
    twoToSixPersonsInHouseholdHasDisabilityErrorMessage =
      simulatorWrapper.getByTestId(
        stepsContent.twoToSixPersonsInHouseholdHasDisability.errorDataTestId,
      );
    dependantsAmountSelect = simulatorWrapper.getByRole('combobox', {
      name: stepsContent.dependantsAmount.label,
    });
    dependantsAmountErrorMessage = simulatorWrapper.getByTestId(
      stepsContent.dependantsAmount.errorDataTestId,
    );
    birthdayInput = simulatorWrapper.getByRole('textbox', {
      name: stepsContent.birthday.label,
    });
    birthdayErrorMessage = simulatorWrapper.getByTestId(
      stepsContent.birthday.errorDataTestId,
    );
    coBuyerBirthdayInput = simulatorWrapper.getByRole('textbox', {
      name: stepsContent.coBuyerBirthday.label,
    });
    coBuyerBirthdayErrorMessage = simulatorWrapper.getByTestId(
      stepsContent.coBuyerBirthday.errorDataTestId,
    );
    inputHouseholdSizeInput = simulatorWrapper.getByRole('spinbutton', {
      name: stepsContent.inputHouseholdSize.label,
    });
    inputHouseholdSizeErrorMessage = simulatorWrapper.getByTestId(
      stepsContent.inputHouseholdSize.errorDataTestId,
    );

    // FiscalRevenues
    taxableIncomeInput = simulatorWrapper.getByTestId(
      stepsContent.formattedTaxableIncome.inputDataTestId,
    );
    taxableIncomeErrorMessage = simulatorWrapper.getByTestId(
      stepsContent.formattedTaxableIncome.errorDataTestId,
    );
    declarationTypeSelect = simulatorWrapper.getByRole('combobox', {
      name: stepsContent.declarationType.label,
    });
    declarationTypeErrorMessage = simulatorWrapper.getByTestId(
      stepsContent.declarationType.errorDataTestId,
    );
    firstCoBuyerFormattedTaxableIncomeInput = simulatorWrapper.getByTestId(
      stepsContent.firstCoBuyerFormattedTaxableIncome.inputDataTestId,
    );
    firstCoBuyerFormattedTaxableIncomeErrorMessage =
      simulatorWrapper.getByTestId(
        stepsContent.firstCoBuyerFormattedTaxableIncome.errorDataTestId,
      );
    secondCoBuyerFormattedTaxableIncomeInput = simulatorWrapper.getByTestId(
      stepsContent.secondCoBuyerFormattedTaxableIncome.inputDataTestId,
    );
    secondCoBuyerFormattedTaxableIncomeErrorMessage =
      simulatorWrapper.getByTestId(
        stepsContent.secondCoBuyerFormattedTaxableIncome.errorDataTestId,
      );

    // PropertySituation
    propertySituationSelect = simulatorWrapper.getByRole('combobox', {
      name: stepsContent.propertySituation.label,
    });
    propertySituationErrorMessage = simulatorWrapper.getByTestId(
      stepsContent.propertySituation.errorDataTestId,
    );
  });

  const scenarii = {
    singlePersonInHousehold: {
      performHouseholdComposition: async () => {
        await householdSizeSelect.selectOption('1');
        await singlePersonInHouseholdHasDisabilitySelect.selectOption('false');
        await submitButton.click();
      },
      performFiscalRevenues: async () => {
        await taxableIncomeInput.fill('100000');
        expect(submitButton).toBeVisible();
        await submitButton.click();
      },
      performPropertySituation: async (
        propertySituation: PropertySituation,
      ) => {
        await propertySituationSelect.selectOption(propertySituation);
        await submitButton.click();
      },
    },
    twoPersonsInHouseholdWithoutDependants: {
      performHouseholdComposition: async () => {
        await householdSizeSelect.selectOption('2');
        await dependantsAmountSelect.selectOption('0');
        await twoToSixPersonsInHouseholdHasDisabilitySelect.selectOption(
          'false',
        );
        await birthdayInput.fill('2000-01-01');
        await coBuyerBirthdayInput.fill('2000-01-01');
        await submitButton.click();
      },
    },
    fourPersonsInHouseholdWithDependants: {
      performHouseholdComposition: async () => {
        await householdSizeSelect.selectOption('4');
        await dependantsAmountSelect.selectOption('2');
        await twoToSixPersonsInHouseholdHasDisabilitySelect.selectOption(
          'false',
        );
        await submitButton.click();
      },
      performFiscalRevenues: async (declarationType: DeclarationType) => {
        await declarationTypeSelect.selectOption(declarationType);

        if (declarationType !== 'SEUL_SOUHAIT_PARTENAIRE') {
          await taxableIncomeInput.fill('100000');
        } else {
          await firstCoBuyerFormattedTaxableIncomeInput.fill('100000');
          await secondCoBuyerFormattedTaxableIncomeInput.fill('100000');
        }
        await submitButton.click();
      },
    },
    moreThanSixPersonsInHousehold: {
      performHouseholdComposition: async () => {
        await householdSizeSelect.selectOption('-1');
        await inputHouseholdSizeInput.fill('7');
        await submitButton.click();
      },
    },
  };

  test.describe('Définir mon éligibilité', () => {
    test.describe('Composition de mon foyer', () => {
      test.describe('Form errors', () => {
        test('Submit without householdSize', async () => {
          await submitButton.click();
          expect(householdSizeErrorMessage).toBeVisible();
        });

        test('1 person in household, submit without hasDisability', async () => {
          await householdSizeSelect.selectOption('1');
          expect(singlePersonInHouseholdHasDisabilitySelect).toBeVisible();
          await submitButton.click();
          expect(
            singlePersonInHouseholdHasDisabilityErrorMessage,
          ).toBeVisible();
        });

        test('2 persons in household, submit without dependantsAmount & hasDisability', async () => {
          await householdSizeSelect.selectOption('2');
          expect(dependantsAmountSelect).toBeVisible();
          expect(twoToSixPersonsInHouseholdHasDisabilitySelect).toBeVisible();
          await submitButton.click();
          expect(dependantsAmountErrorMessage).toBeVisible();
          expect(
            twoToSixPersonsInHouseholdHasDisabilityErrorMessage,
          ).toBeVisible();
        });

        test('2 persons in household, submit without hasDisability & birthday & coBuyerBirthday', async () => {
          await householdSizeSelect.selectOption('2');
          expect(dependantsAmountSelect).toBeVisible();
          await dependantsAmountSelect.selectOption('0');
          expect(birthdayInput).toBeVisible();
          expect(coBuyerBirthdayInput).toBeVisible();
          expect(twoToSixPersonsInHouseholdHasDisabilitySelect).toBeVisible();
          await submitButton.click();
          expect(
            twoToSixPersonsInHouseholdHasDisabilityErrorMessage,
          ).toBeVisible();
          expect(birthdayErrorMessage).toBeVisible();
          expect(coBuyerBirthdayErrorMessage).toBeVisible();
        });

        test('4 persons in household, submit without dependantsAmount & hasDisability', async () => {
          await householdSizeSelect.selectOption('2');
          expect(dependantsAmountSelect).toBeVisible();
          expect(twoToSixPersonsInHouseholdHasDisabilitySelect).toBeVisible();
          await submitButton.click();
          expect(dependantsAmountErrorMessage).toBeVisible();
          expect(
            twoToSixPersonsInHouseholdHasDisabilityErrorMessage,
          ).toBeVisible();
        });

        test('More than 6 persons in selectedHousholdSize, submit without inputHouseholdSize', async () => {
          await householdSizeSelect.selectOption('-1');
          expect(inputHouseholdSizeInput).toBeVisible();
          await submitButton.click();
          expect(inputHouseholdSizeErrorMessage).toBeVisible();
        });

        test('More than 6 persons in selectedHousholdSize, submit with invalid inputHouseholdSize', async () => {
          await householdSizeSelect.selectOption('-1');
          expect(inputHouseholdSizeInput).toBeVisible();
          await inputHouseholdSizeInput.fill('5');
          await submitButton.click();
          expect(inputHouseholdSizeErrorMessage).toBeVisible();
        });
      });

      test.describe('Form success', () => {
        test.beforeEach(async () => {
          expect(stepTitle).toHaveText(
            `1. ${steps[0].title} Étape 1 sur ${steps.length}`,
          );
          expect(phaseTitle).toHaveText(`${steps[0].phases[0].title}`);
        });

        test.afterEach(async () => {
          expect(stepTitle).toHaveText(
            `1. ${steps[0].title} Étape 1 sur ${steps.length}`,
          );
          expect(phaseTitle).toHaveText(`${steps[0].phases[1].title}`);
        });

        test('1 person in household', async () => {
          await scenarii.singlePersonInHousehold.performHouseholdComposition();
        });

        test('2 persons in household without dependants', async () => {
          await scenarii.twoPersonsInHouseholdWithoutDependants.performHouseholdComposition();
        });

        test('4 persons in household with dependants', async () => {
          await scenarii.fourPersonsInHouseholdWithDependants.performHouseholdComposition();
        });

        test('More than 6 persons in household', async () => {
          await scenarii.moreThanSixPersonsInHousehold.performHouseholdComposition();
        });
      });
    });

    test.describe('Revenus fiscaux', () => {
      test.describe('Form errors', () => {
        test('1 person in household, submit without formattedTaxableIncome', async ({
          page,
        }) => {
          await scenarii.singlePersonInHousehold.performHouseholdComposition();
          await submitButton.click();
          expect(taxableIncomeErrorMessage).toBeVisible();
          expect(taxableIncomeErrorMessage).toHaveText(
            stepsContent.formattedTaxableIncome.errorMessage,
          );
        });

        test('4 persons in household, submit without declarationType', async () => {
          await scenarii.fourPersonsInHouseholdWithDependants.performHouseholdComposition();
          await submitButton.click();
          expect(declarationTypeErrorMessage).toBeVisible();
          expect(declarationTypeErrorMessage).toHaveText(
            stepsContent.declarationType.errorMessage,
          );
        });

        test('4 persons in household, seul declaration type, submit without formattedTaxableIncome', async () => {
          await scenarii.fourPersonsInHouseholdWithDependants.performHouseholdComposition();
          await declarationTypeSelect.selectOption('SEUL_SOUHAIT_SEUL');
          await submitButton.click();
          expect(taxableIncomeErrorMessage).toBeVisible();
          expect(taxableIncomeErrorMessage).toHaveText(
            stepsContent.formattedTaxableIncome.errorMessage,
          );
        });

        test('4 persons in household, common declaration type, submit without formattedTaxableIncome', async () => {
          await scenarii.fourPersonsInHouseholdWithDependants.performHouseholdComposition();
          await declarationTypeSelect.selectOption('COMMUN');
          await submitButton.click();
          expect(taxableIncomeErrorMessage).toBeVisible();
          expect(taxableIncomeErrorMessage).toHaveText(
            stepsContent.formattedTaxableIncome.errorMessage,
          );
        });

        test('More than 6 persons in selectedHousholdSize, submit without declarationType', async () => {
          await scenarii.moreThanSixPersonsInHousehold.performHouseholdComposition();
          await submitButton.click();
          expect(declarationTypeErrorMessage).toBeVisible();
          expect(declarationTypeErrorMessage).toHaveText(
            stepsContent.declarationType.errorMessage,
          );
        });

        test('More than 6 persons in selectedHousholdSize, seul declaration type, submit without formattedTaxableIncome', async () => {
          await scenarii.fourPersonsInHouseholdWithDependants.performHouseholdComposition();
          await declarationTypeSelect.selectOption('SEUL_SOUHAIT_SEUL');
          await submitButton.click();
          expect(taxableIncomeErrorMessage).toBeVisible();
          expect(taxableIncomeErrorMessage).toHaveText(
            stepsContent.formattedTaxableIncome.errorMessage,
          );
        });

        test('More than 6 persons in selectedHousholdSize, seul souhait partenaire declaration type, submit without firstCoBuyerFormattedTaxableIncome and secondCoBuyerFormattedTaxableIncome', async () => {
          await scenarii.fourPersonsInHouseholdWithDependants.performHouseholdComposition();
          await declarationTypeSelect.selectOption('SEUL_SOUHAIT_PARTENAIRE');
          await submitButton.click();
          expect(firstCoBuyerFormattedTaxableIncomeErrorMessage).toBeVisible();
          expect(firstCoBuyerFormattedTaxableIncomeErrorMessage).toHaveText(
            stepsContent.firstCoBuyerFormattedTaxableIncome.errorMessage,
          );
          expect(secondCoBuyerFormattedTaxableIncomeErrorMessage).toBeVisible();
          expect(secondCoBuyerFormattedTaxableIncomeErrorMessage).toHaveText(
            stepsContent.secondCoBuyerFormattedTaxableIncome.errorMessage,
          );
        });
      });

      test.describe('Form success', () => {
        const validateStepAndPhaseTitles = () => {
          expect(stepTitle).toHaveText(
            `1. ${steps[0].title} Étape 1 sur ${steps.length}`,
          );
          expect(phaseTitle).toHaveText(`${steps[0].phases[1].title}`);
        };

        test.afterEach(async () => {
          expect(stepTitle).toHaveText(
            `1. ${steps[0].title} Étape 1 sur ${steps.length}`,
          );
          expect(phaseTitle).toHaveText(`${steps[0].phases[2].title}`);
        });

        test('1 person in household', async () => {
          await scenarii.singlePersonInHousehold.performHouseholdComposition();
          validateStepAndPhaseTitles();
          await scenarii.singlePersonInHousehold.performFiscalRevenues();
        });

        test('4 persons in household, declaring seul', async () => {
          await scenarii.fourPersonsInHouseholdWithDependants.performHouseholdComposition();
          validateStepAndPhaseTitles();
          await scenarii.fourPersonsInHouseholdWithDependants.performFiscalRevenues(
            'SEUL_SOUHAIT_SEUL',
          );
        });

        test('4 persons in household, declaring in common', async () => {
          await scenarii.fourPersonsInHouseholdWithDependants.performHouseholdComposition();
          validateStepAndPhaseTitles();
          await scenarii.fourPersonsInHouseholdWithDependants.performFiscalRevenues(
            'COMMUN',
          );
        });

        test('4 persons in household, declaring seul souhait partenaire', async () => {
          await scenarii.fourPersonsInHouseholdWithDependants.performHouseholdComposition();
          validateStepAndPhaseTitles();
          await scenarii.fourPersonsInHouseholdWithDependants.performFiscalRevenues(
            'SEUL_SOUHAIT_PARTENAIRE',
          );
        });
      });
    });
  });

  test.describe('Situation immobilière', () => {
    test.describe('Form errors', () => {
      test('Submit without propertySituation', async () => {
        await scenarii.singlePersonInHousehold.performHouseholdComposition();
        await scenarii.singlePersonInHousehold.performFiscalRevenues();
        await submitButton.click();
        expect(propertySituationErrorMessage).toBeVisible();
      });
    });

    test.describe('Form success', () => {
      const validateStepAndPhaseTitles = () => {
        expect(stepTitle).toHaveText(
          `1. ${steps[0].title} Étape 1 sur ${steps.length}`,
        );
        expect(phaseTitle).toHaveText(`${steps[0].phases[2].title}`);
      };

      test.afterEach(async () => {
        expect(stepTitle).toHaveText(
          `2. ${steps[1].title} Étape 2 sur ${steps.length}`,
        );
        expect(phaseTitle).toHaveText(`${steps[1].phases[0].title}`);
      });

      test('Submit with propertySituation', async () => {
        await scenarii.singlePersonInHousehold.performHouseholdComposition();
        await scenarii.singlePersonInHousehold.performFiscalRevenues();
        validateStepAndPhaseTitles();
        await scenarii.singlePersonInHousehold.performPropertySituation(
          'LOCATAIRE_PRIVE',
        );
      });
    });
  });
});
