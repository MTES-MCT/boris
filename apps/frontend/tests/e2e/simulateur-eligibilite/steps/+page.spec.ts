import { questions } from '$lib/utils/eligibility-simulator';
import { steps } from '$lib/utils/eligibility-simulator';
import { test, expect, type Locator } from '@playwright/test';

test.describe('navigation', () => {
  let simulatorWrapper: Locator;
  let stepTitle: Locator;
  let phaseTitle: Locator;
  let submitButton: Locator;
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

  test.beforeEach(async ({ page }) => {
    await page.goto('/simulateur-eligibilite/steps');

    simulatorWrapper = page.getByTestId('simulator-wrapper');
    stepTitle = simulatorWrapper.getByRole('heading', { level: 2 });
    phaseTitle = simulatorWrapper.getByRole('heading', { level: 3 });
    submitButton = simulatorWrapper.getByRole('button', {
      name: /Étape suivante/i,
    });
    householdSizeSelect = simulatorWrapper.getByRole('combobox', {
      name: questions.selectedHouseholdSize.label,
    });
    householdSizeErrorMessage = simulatorWrapper.getByTestId(
      questions.selectedHouseholdSize.dataTestId,
    );
    singlePersonInHouseholdHasDisabilitySelect = simulatorWrapper.getByRole(
      'combobox',
      {
        name: questions.singlePersonInHouseholdHasDisability.label,
      },
    );
    singlePersonInHouseholdHasDisabilityErrorMessage =
      simulatorWrapper.getByTestId(
        questions.singlePersonInHouseholdHasDisability.dataTestId,
      );
    twoToSixPersonsInHouseholdHasDisabilitySelect = simulatorWrapper.getByRole(
      'combobox',
      {
        name: questions.twoToSixPersonsInHouseholdHasDisability.label,
      },
    );
    twoToSixPersonsInHouseholdHasDisabilityErrorMessage =
      simulatorWrapper.getByTestId(
        questions.twoToSixPersonsInHouseholdHasDisability.dataTestId,
      );
    dependantsAmountSelect = simulatorWrapper.getByRole('combobox', {
      name: questions.dependantsAmount.label,
    });
    dependantsAmountErrorMessage = simulatorWrapper.getByTestId(
      questions.dependantsAmount.dataTestId,
    );
    birthdayInput = simulatorWrapper.getByRole('textbox', {
      name: questions.birthday.label,
    });
    birthdayErrorMessage = simulatorWrapper.getByTestId(
      questions.birthday.dataTestId,
    );
    coBuyerBirthdayInput = simulatorWrapper.getByRole('textbox', {
      name: questions.coBuyerBirthday.label,
    });
    coBuyerBirthdayErrorMessage = simulatorWrapper.getByTestId(
      questions.coBuyerBirthday.dataTestId,
    );
    inputHouseholdSizeInput = simulatorWrapper.getByRole('spinbutton', {
      name: questions.inputHouseholdSize.label,
    });
    inputHouseholdSizeErrorMessage = simulatorWrapper.getByTestId(
      questions.inputHouseholdSize.dataTestId,
    );
  });

  const scenarii = {
    singlePersonInHousehold: {
      performHouseholdComposition: async () => {
        await householdSizeSelect.selectOption('1');
        await singlePersonInHouseholdHasDisabilitySelect.selectOption('false');
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
  });
});
