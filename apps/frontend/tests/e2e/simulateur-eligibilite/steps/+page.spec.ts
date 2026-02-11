import {
  stepsContent,
  steps,
  type DeclarationType,
  type PropertySituation,
  type HousingType,
} from '../../../../src/lib/utils/eligibility-simulator';
import { test, expect, type Locator, type Page } from '@playwright/test';

test.describe('Eligibility simulator', () => {
  let simulatorWrapper: Locator;
  let stepTitle: Locator;
  let phaseTitle: Locator;
  let submitButton: Locator;
  let previousPhaseButton: Locator;

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

  // Résultat d'éligibilité
  let resultText: Locator;
  let refuseConnectionLink: Locator;

  // Informations personnelles
  let firstNameInput: Locator;
  let firstNameErrorMessage: Locator;
  let lastNameInput: Locator;
  let lastNameErrorMessage: Locator;
  let emailInput: Locator;
  let emailErrorMessage: Locator;
  let phoneInput: Locator;
  let phoneErrorMessage: Locator;

  // Informations sur le logement
  let locationInput: Locator;
  let locationErrorMessage: Locator;

  let housingTypeSelect: Locator;
  let housingTypeErrorMessage: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto('/simulateur-eligibilite/steps');

    simulatorWrapper = page.getByTestId('simulator-wrapper');
    stepTitle = simulatorWrapper.getByRole('heading', { level: 2 });
    phaseTitle = simulatorWrapper.getByRole('heading', { level: 3 });
    submitButton = simulatorWrapper.getByRole('button', {
      name: /Étape suivante/i,
    });
    previousPhaseButton = simulatorWrapper.getByRole('button', {
      name: /Étape précédente/i,
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

    // Résultat d'éligibilité
    resultText = simulatorWrapper.getByTestId('eligibility-result-text');
    refuseConnectionLink = simulatorWrapper.getByTestId(
      'refuse-connection-link',
    );

    // Informations personnelles
    firstNameInput = simulatorWrapper.getByRole('textbox', {
      name: stepsContent.firstName.label,
    });
    firstNameErrorMessage = simulatorWrapper.getByTestId(
      stepsContent.firstName.errorDataTestId,
    );
    lastNameInput = simulatorWrapper.getByRole('textbox', {
      name: stepsContent.lastName.label,
    });
    lastNameErrorMessage = simulatorWrapper.getByTestId(
      stepsContent.lastName.errorDataTestId,
    );
    emailInput = simulatorWrapper.getByRole('textbox', {
      name: stepsContent.email.label,
    });
    emailErrorMessage = simulatorWrapper.getByTestId(
      stepsContent.email.errorDataTestId,
    );
    phoneInput = simulatorWrapper.getByRole('textbox', {
      name: stepsContent.phone.label,
    });
    phoneErrorMessage = simulatorWrapper.getByTestId(
      stepsContent.phone.errorDataTestId,
    );

    // Informations sur le logement
    locationInput = simulatorWrapper.getByTestId(
      stepsContent.location.dataTestId,
    );
    locationErrorMessage = simulatorWrapper.getByTestId(
      stepsContent.location.errorDataTestId,
    );
    housingTypeSelect = simulatorWrapper.getByRole('combobox', {
      name: stepsContent.housingType.label,
    });
    housingTypeErrorMessage = simulatorWrapper.getByTestId(
      stepsContent.housingType.errorDataTestId,
    );
  });

  const performHouseholdComposition = async (
    householdSize?: number,
    hasDisability?: boolean,
    dependantsAmount?: number,
    birthday?: string,
    coBuyerBirthday?: string,
    inputHouseholdSize?: string,
  ) => {
    if (typeof householdSize === 'number') {
      await householdSizeSelect.selectOption(householdSize.toString());
    }

    if (
      typeof hasDisability === 'boolean' &&
      typeof householdSize === 'number' &&
      householdSize === 1
    ) {
      await singlePersonInHouseholdHasDisabilitySelect.selectOption(
        hasDisability.toString(),
      );
    }

    if (typeof dependantsAmount === 'number') {
      await dependantsAmountSelect.selectOption(dependantsAmount.toString());
    }

    if (
      typeof householdSize === 'number' &&
      householdSize > 1 &&
      typeof hasDisability === 'boolean'
    ) {
      await twoToSixPersonsInHouseholdHasDisabilitySelect.selectOption(
        hasDisability.toString(),
      );
    }

    if (typeof birthday === 'string') {
      await birthdayInput.fill(birthday);
    }

    if (typeof coBuyerBirthday === 'string') {
      await coBuyerBirthdayInput.fill(coBuyerBirthday);
    }

    if (typeof inputHouseholdSize === 'string') {
      await inputHouseholdSizeInput.fill(inputHouseholdSize);
    }

    await submitButton.click();
  };

  const performFiscalRevenues = async (
    taxableIncome?: string,
    declarationType?: DeclarationType,
    firstCoBuyerFormattedTaxableIncome?: string,
    secondCoBuyerFormattedTaxableIncome?: string,
  ) => {
    if (typeof declarationType === 'string') {
      await declarationTypeSelect.selectOption(declarationType);
    }

    if (typeof taxableIncome === 'string') {
      await taxableIncomeInput.fill(taxableIncome);
    }

    if (typeof firstCoBuyerFormattedTaxableIncome === 'string') {
      await firstCoBuyerFormattedTaxableIncomeInput.fill(
        firstCoBuyerFormattedTaxableIncome,
      );
    }

    if (typeof secondCoBuyerFormattedTaxableIncome === 'string') {
      await secondCoBuyerFormattedTaxableIncomeInput.fill(
        secondCoBuyerFormattedTaxableIncome,
      );
    }

    await submitButton.click();
  };

  const performPropertySituation = async (
    propertySituation: PropertySituation,
  ) => {
    await propertySituationSelect.selectOption(propertySituation);
    await submitButton.click();
  };

  const performResultDetails = async () => {
    await submitButton.click();
  };

  const performRefuseConnection = async () => {
    await refuseConnectionLink.click();
  };

  const performUserDetails = async (
    firstName?: string,
    lastName?: string,
    email?: string,
    phone?: string,
  ) => {
    if (typeof firstName === 'string') {
      await firstNameInput.fill(firstName);
    }

    if (typeof lastName === 'string') {
      await lastNameInput.fill(lastName);
    }

    if (typeof email === 'string') {
      await emailInput.fill(email);
    }

    if (typeof phone === 'string') {
      await phoneInput.fill(phone);
    }

    await submitButton.click();
  };

  const performHousingInformations = async (
    location?: string,
    housingType?: HousingType,
    selectedSuggestionDataTestId?: string,
    page?: Page,
  ) => {
    if (typeof location === 'string') {
      await locationInput.fill(location);
    }

    if (
      typeof page !== 'undefined' &&
      typeof selectedSuggestionDataTestId === 'string'
    ) {
      await page.waitForTimeout(2000);
      const suggestion = page.getByTestId(selectedSuggestionDataTestId);
      await suggestion.click();
      await page.waitForTimeout(1000);
    }

    if (typeof housingType === 'string') {
      await housingTypeSelect.selectOption(housingType);
    }

    await submitButton.click();
  };

  test.describe('Définir mon éligibilité', () => {
    test.describe('Composition de mon foyer', () => {
      test.describe("Cas d'erreur du formulaire", () => {
        test('Soumettre sans sélectionner la taille du foyer', async () => {
          await submitButton.click();
          expect(householdSizeErrorMessage).toBeVisible();
        });

        test('Personne seule dans le foyer, soumettre sans sélectionner la situation de handicap', async () => {
          await performHouseholdComposition(1);
          expect(
            singlePersonInHouseholdHasDisabilityErrorMessage,
          ).toBeVisible();
        });

        test('2 personnes dans le foyer, soumettre sans sélectionner le nombre de personnes à charge et la situation de handicap', async () => {
          await performHouseholdComposition(2);
          expect(dependantsAmountSelect).toBeVisible();
          expect(dependantsAmountErrorMessage).toBeVisible();
          expect(twoToSixPersonsInHouseholdHasDisabilitySelect).toBeVisible();
          expect(
            twoToSixPersonsInHouseholdHasDisabilityErrorMessage,
          ).toBeVisible();
        });

        test('2 personnes dans le foyer, soumettre sans sélectionner la situation de handicap et les dates de naissance', async () => {
          await performHouseholdComposition(2, undefined, 0);
          expect(dependantsAmountSelect).toBeVisible();
          expect(birthdayInput).toBeVisible();
          expect(birthdayErrorMessage).toBeVisible();
          expect(coBuyerBirthdayInput).toBeVisible();
          expect(coBuyerBirthdayErrorMessage).toBeVisible();
          expect(twoToSixPersonsInHouseholdHasDisabilitySelect).toBeVisible();
          expect(
            twoToSixPersonsInHouseholdHasDisabilityErrorMessage,
          ).toBeVisible();
        });

        test('4 personnes dans le foyer, soumettre sans sélectionner le nombre de personnes à charge et la situation de handicap', async () => {
          await performHouseholdComposition(4, undefined, undefined);
          expect(dependantsAmountSelect).toBeVisible();
          expect(dependantsAmountErrorMessage).toBeVisible();
          expect(twoToSixPersonsInHouseholdHasDisabilitySelect).toBeVisible();
          expect(
            twoToSixPersonsInHouseholdHasDisabilityErrorMessage,
          ).toBeVisible();
        });

        test('Plus de 6 personnes dans le foyer, soumettre sans donner la taille précise du foyer', async () => {
          await performHouseholdComposition(-1);
          expect(inputHouseholdSizeInput).toBeVisible();
          expect(inputHouseholdSizeErrorMessage).toBeVisible();
        });

        test('Plus de 6 personnes dans le foyer, soumettre avec une taille de foyer invalide', async () => {
          await performHouseholdComposition(-1);
          expect(inputHouseholdSizeInput).toBeVisible();
          await inputHouseholdSizeInput.fill('5');
          await submitButton.click();
          expect(inputHouseholdSizeErrorMessage).toBeVisible();
        });
      });

      test.describe('Scénarii valides', () => {
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

        test('Personne seule dans le foyer', async () => {
          await performHouseholdComposition(1, false);
        });

        test('2 personnes dans le foyer sans personnes à charge et sans situation de handicap', async () => {
          await performHouseholdComposition(
            2,
            false,
            0,
            '2000-01-01',
            '2000-01-01',
          );
        });

        test('4 personnes dans le foyer avec 2 personnes à charge et sans situation de handicap', async () => {
          await performHouseholdComposition(4, false, 2);
        });

        test('Plus de 6 personnes dans le foyer', async () => {
          await performHouseholdComposition(
            -1,
            undefined,
            undefined,
            undefined,
            undefined,
            '7',
          );
        });
      });
    });

    test.describe('Revenus fiscaux', () => {
      test.describe("Cas d'erreur du formulaire", () => {
        test('Personne seule dans le foyer, soumettre sans revenu fiscal de référence', async () => {
          await performHouseholdComposition(1, false);
          await submitButton.click();
          expect(taxableIncomeErrorMessage).toBeVisible();
          expect(taxableIncomeErrorMessage).toHaveText(
            stepsContent.formattedTaxableIncome.errorMessage,
          );
        });

        test('4 personnes dans le foyer, soumettre sans type de déclaration et sans revenu le fiscal de référence', async () => {
          await performHouseholdComposition(4, false, 2);
          await submitButton.click();
          expect(declarationTypeErrorMessage).toBeVisible();
          expect(declarationTypeErrorMessage).toHaveText(
            stepsContent.declarationType.errorMessage,
          );
        });

        test('4 personnes dans le foyer, soumettre avec le type de déclaration "Seul·e et vous souhaitez acheter seul·e" mais sans revenu fiscal de référence', async () => {
          await performHouseholdComposition(4, false, 2);
          await performFiscalRevenues(undefined, 'SEUL_SOUHAIT_SEUL');
          await submitButton.click();
          expect(taxableIncomeErrorMessage).toBeVisible();
          expect(taxableIncomeErrorMessage).toHaveText(
            stepsContent.formattedTaxableIncome.errorMessage,
          );
        });

        test('4 personnes dans le foyer, soumettre avec le type de déclaration "En commun" mais sans revenu fiscal de référence', async () => {
          await performHouseholdComposition(4, false, 2);
          await performFiscalRevenues(undefined, 'COMMUN');
          await submitButton.click();
          expect(taxableIncomeErrorMessage).toBeVisible();
          expect(taxableIncomeErrorMessage).toHaveText(
            stepsContent.formattedTaxableIncome.errorMessage,
          );
        });

        test('Plus de 6 personnes dans le foyer, soumettre sans type de déclaration', async () => {
          await performHouseholdComposition(
            -1,
            undefined,
            undefined,
            undefined,
            undefined,
            '7',
          );
          await submitButton.click();
          expect(declarationTypeErrorMessage).toBeVisible();
          expect(declarationTypeErrorMessage).toHaveText(
            stepsContent.declarationType.errorMessage,
          );
        });

        test('Plus de 6 personnes dans le foyer, soumettre avec le type de déclaration "Seul·e et vous souhaitez acheter seul·e" mais sans revenu fiscal de référence', async () => {
          await performHouseholdComposition(
            -1,
            undefined,
            undefined,
            undefined,
            undefined,
            '7',
          );
          await performFiscalRevenues(undefined, 'SEUL_SOUHAIT_SEUL');
          await submitButton.click();
          expect(taxableIncomeErrorMessage).toBeVisible();
          expect(taxableIncomeErrorMessage).toHaveText(
            stepsContent.formattedTaxableIncome.errorMessage,
          );
        });

        test('Plus de 6 personnes dans le foyer, soumettre avec le type de déclaration "Seul·e mais vous souhaitez acheter avec un·e partenaire" mais sans les revenu fiscaux de référence des co-acquéreurs', async () => {
          await performHouseholdComposition(
            -1,
            undefined,
            undefined,
            undefined,
            undefined,
            '7',
          );
          await performFiscalRevenues(undefined, 'SEUL_SOUHAIT_PARTENAIRE');
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

      test.describe('Scénarii valides', () => {
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

        test('Personne seule dans le foyer', async () => {
          await performHouseholdComposition(1, false);
          validateStepAndPhaseTitles();
          await performFiscalRevenues('25000');
        });

        test('4 personnes dans le foyer, soumettre avec le type de déclaration "Seul·e et vous souhaitez acheter seul·e"', async () => {
          await performHouseholdComposition(4, false, 2);
          validateStepAndPhaseTitles();
          await performFiscalRevenues('25000', 'SEUL_SOUHAIT_SEUL');
        });

        test('4 personnes dans le foyer, soumettre avec le type de déclaration "En commun"', async () => {
          await performHouseholdComposition(4, false, 2);
          validateStepAndPhaseTitles();
          await performFiscalRevenues('25000', 'COMMUN');
        });

        test('4 personnes dans le foyer, soumettre avec le type de déclaration "Seul·e mais vous souhaitez acheter avec un·e partenaire"', async () => {
          await performHouseholdComposition(4, false, 2);
          validateStepAndPhaseTitles();
          await performFiscalRevenues(
            undefined,
            'SEUL_SOUHAIT_PARTENAIRE',
            '25000',
            '25000',
          );
        });
      });
    });

    test.describe('Situation immobilière', () => {
      test.describe("Cas d'erreur du formulaire", () => {
        test('Soumettre sans situation immobilière', async () => {
          await performHouseholdComposition(1, false);
          await performFiscalRevenues('25000');
          await submitButton.click();
          expect(propertySituationErrorMessage).toBeVisible();
        });
      });

      test.describe('Scénarii valides', () => {
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

        test('Personne seule dans le foyer, soumettre avec la situation immobilière "Locataire privé"', async () => {
          await performHouseholdComposition(1, false);
          await performFiscalRevenues('25000');
          validateStepAndPhaseTitles();
          await performPropertySituation('LOCATAIRE_PRIVE');
        });
      });
    });
  });

  test.describe("Résultat d'éligibilité", () => {
    test.describe('Détails du résultat', () => {
      const validateStepAndPhaseTitles = () => {
        expect(stepTitle).toHaveText(
          `2. ${steps[1].title} Étape 2 sur ${steps.length}`,
        );
        expect(phaseTitle).toHaveText(`${steps[1].phases[0].title}`);
      };

      test.describe('Personne seule sans handicap', () => {
        test.beforeEach(async () => {
          await performHouseholdComposition(1, false);
        });

        test('Devrait être éligible dans toutes les zones', async () => {
          await performFiscalRevenues('25000');
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB2andC.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A, Abis et B1', async () => {
          await performFiscalRevenues('35000');
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB1.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être inéligible', async () => {
          await performFiscalRevenues('100000');
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.notEligible.title.replace(/<[^>]*>/g, ''),
          );
        });
      });

      test.describe('Personne seule en situation de handicap', () => {
        test.beforeEach(async () => {
          await performHouseholdComposition(1, true);
        });

        test('Devrait être éligible dans toutes les zones', async () => {
          await performFiscalRevenues('25000');
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB2andC.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A, Abis et B1', async () => {
          await performFiscalRevenues('50000');
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB1.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être inéligible', async () => {
          await performFiscalRevenues('100000');
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.notEligible.title.replace(/<[^>]*>/g, ''),
          );
        });
      });

      test.describe('2 personnes ne comportant aucune personne à charge hors jeunes ménages ayant déclaré en commun', () => {
        test.beforeEach(async () => {
          await performHouseholdComposition(
            2,
            false,
            0,
            '1950-01-01',
            '1950-01-01',
          );
        });

        test('Devrait être éligible dans toutes les zones', async () => {
          await performFiscalRevenues('25000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB2andC.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A, Abis et B1', async () => {
          await performFiscalRevenues('50000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB1.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être inéligible', async () => {
          await performFiscalRevenues('100000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.notEligible.title.replace(/<[^>]*>/g, ''),
          );
        });
      });

      test.describe('2 personnes ne comportant aucune personne à charge hors jeunes ménages ayant déclaré en "Seul·e et vous souhaitez et vous souhaitez acheter avec un·e partenaire"', () => {
        test.beforeEach(async () => {
          await performHouseholdComposition(
            2,
            false,
            0,
            '1950-01-01',
            '1950-01-01',
          );
        });

        test('Devrait être éligible dans toutes les zones', async () => {
          await performFiscalRevenues(
            undefined,
            'SEUL_SOUHAIT_PARTENAIRE',
            '20000',
            '20000',
          );
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB2andC.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A, Abis et B1', async () => {
          await performFiscalRevenues(
            undefined,
            'SEUL_SOUHAIT_PARTENAIRE',
            '30000',
            '20000',
          );
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB1.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être inéligible', async () => {
          await performFiscalRevenues(
            undefined,
            'SEUL_SOUHAIT_PARTENAIRE',
            '50000',
            '50000',
          );
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.notEligible.title.replace(/<[^>]*>/g, ''),
          );
        });
      });

      test.describe('3 personnes, les co-acquéreurs ayant déclaré en commun', () => {
        test.beforeEach(async () => {
          await performHouseholdComposition(3, false, 1);
        });

        test('Devrait être éligible dans toutes les zones', async () => {
          await performFiscalRevenues('50000', 'COMMUN');
          await performPropertySituation('AUTRE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB2andC.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A, Abis et B1', async () => {
          await performFiscalRevenues('68000', 'COMMUN');
          await performPropertySituation('HEBERGE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB1.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A et Abis', async () => {
          await performFiscalRevenues('75000', 'COMMUN');
          await performPropertySituation('HEBERGE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneAandAbis.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être inéligible', async () => {
          await performFiscalRevenues('100000', 'COMMUN');
          await performPropertySituation('HEBERGE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.notEligible.title.replace(/<[^>]*>/g, ''),
          );
        });
      });

      test.describe('Personne seule avec 1 personne à charge', () => {
        test.beforeEach(async () => {
          await performHouseholdComposition(2, false, 1);
        });

        test('Devrait être éligible dans toutes les zones', async () => {
          await performFiscalRevenues('50000', 'SEUL_SOUHAIT_SEUL');
          await performPropertySituation('AUTRE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB2andC.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A, Abis et B1', async () => {
          await performFiscalRevenues('68000', 'SEUL_SOUHAIT_SEUL');
          await performPropertySituation('HEBERGE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB1.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A et Abis', async () => {
          await performFiscalRevenues('75000', 'SEUL_SOUHAIT_SEUL');
          await performPropertySituation('HEBERGE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneAandAbis.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être inéligible', async () => {
          await performFiscalRevenues('100000', 'SEUL_SOUHAIT_SEUL');
          await performPropertySituation('HEBERGE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.notEligible.title.replace(/<[^>]*>/g, ''),
          );
        });
      });

      test.describe('Jeune ménage, où la somme des ages des co-acquéreurs ne dépasse pas 55 ans', () => {
        test.beforeEach(async () => {
          await performHouseholdComposition(
            2,
            false,
            0,
            '2000-01-01',
            '2000-01-01',
          );
        });

        test('Devrait être éligible dans toutes les zones', async () => {
          await performFiscalRevenues('50000', 'COMMUN');
          await performPropertySituation('AUTRE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB2andC.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A, Abis et B1', async () => {
          await performFiscalRevenues('68000', 'COMMUN');
          await performPropertySituation('HEBERGE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB1.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A et Abis', async () => {
          await performFiscalRevenues('75000', 'COMMUN');
          await performPropertySituation('HEBERGE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneAandAbis.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être inéligible', async () => {
          await performFiscalRevenues('100000', 'COMMUN');
          await performPropertySituation('HEBERGE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.notEligible.title.replace(/<[^>]*>/g, ''),
          );
        });
      });

      test.describe('2 personnes dont au moins 1 est en situation de handicap', () => {
        test.beforeEach(async () => {
          await performHouseholdComposition(
            2,
            true,
            0,
            '2000-01-01',
            '2000-01-01',
          );
        });

        test('Devrait être éligible dans toutes les zones', async () => {
          await performFiscalRevenues('50000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB2andC.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A, Abis et B1', async () => {
          await performFiscalRevenues('68000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB1.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A et Abis', async () => {
          await performFiscalRevenues('75000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneAandAbis.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être inéligible', async () => {
          await performFiscalRevenues('100000', 'COMMUN');
          await performPropertySituation('HEBERGE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.notEligible.title.replace(/<[^>]*>/g, ''),
          );
        });
      });

      test.describe('4 personnes', () => {
        test.beforeEach(async () => {
          await performHouseholdComposition(4, false, 2);
        });

        test('Devrait être éligible dans toutes les zones', async () => {
          await performFiscalRevenues(
            undefined,
            'SEUL_SOUHAIT_PARTENAIRE',
            '30000',
            '30000',
          );
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB2andC.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A, Abis et B1', async () => {
          await performFiscalRevenues(
            undefined,
            'SEUL_SOUHAIT_PARTENAIRE',
            '40000',
            '40000',
          );
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB1.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A et Abis', async () => {
          await performFiscalRevenues(
            undefined,
            'SEUL_SOUHAIT_PARTENAIRE',
            '44000',
            '44000',
          );
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneAandAbis.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être inéligible', async () => {
          await performFiscalRevenues(
            undefined,
            'SEUL_SOUHAIT_PARTENAIRE',
            '50000',
            '50000',
          );
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.notEligible.title.replace(/<[^>]*>/g, ''),
          );
        });
      });

      test.describe('Personne seule avec 2 personne à charge', () => {
        test.beforeEach(async () => {
          await performHouseholdComposition(3, false, 2);
        });

        test('Devrait être éligible dans toutes les zones', async () => {
          await performFiscalRevenues('60000', 'SEUL_SOUHAIT_SEUL');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB2andC.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A, Abis et B1', async () => {
          await performFiscalRevenues('68000', 'SEUL_SOUHAIT_SEUL');
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB1.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A et Abis', async () => {
          await performFiscalRevenues('90000', 'SEUL_SOUHAIT_SEUL');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneAandAbis.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être inéligible', async () => {
          await performFiscalRevenues('100000', 'SEUL_SOUHAIT_SEUL');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.notEligible.title.replace(/<[^>]*>/g, ''),
          );
        });
      });

      test.describe('3 personnes dont au moins 1 est en situation de handicap', () => {
        test.beforeEach(async () => {
          await performHouseholdComposition(3, true, 1);
        });

        test('Devrait être éligible dans toutes les zones', async () => {
          await performFiscalRevenues('60000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB2andC.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A, Abis et B1', async () => {
          await performFiscalRevenues('68000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB1.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A et Abis', async () => {
          await performFiscalRevenues('90000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneAandAbis.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être inéligible', async () => {
          await performFiscalRevenues('100000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.notEligible.title.replace(/<[^>]*>/g, ''),
          );
        });
      });

      test.describe('5 personnes', () => {
        test.beforeEach(async () => {
          await performHouseholdComposition(5, false, 2);
        });

        test('Devrait être éligible dans toutes les zones', async () => {
          await performFiscalRevenues('60000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB2andC.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A, Abis et B1', async () => {
          await performFiscalRevenues('90000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB1.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A et Abis', async () => {
          await performFiscalRevenues('100000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneAandAbis.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être inéligible', async () => {
          await performFiscalRevenues('110000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.notEligible.title.replace(/<[^>]*>/g, ''),
          );
        });
      });

      test.describe('Personne seule avec 3 personne à charge', () => {
        test.beforeEach(async () => {
          await performHouseholdComposition(4, false, 3);
        });

        test('Devrait être éligible dans toutes les zones', async () => {
          await performFiscalRevenues('60000', 'SEUL_SOUHAIT_SEUL');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB2andC.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A, Abis et B1', async () => {
          await performFiscalRevenues('90000', 'SEUL_SOUHAIT_SEUL');
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB1.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A et Abis', async () => {
          await performFiscalRevenues('100000', 'SEUL_SOUHAIT_SEUL');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneAandAbis.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être inéligible', async () => {
          await performFiscalRevenues('110000', 'SEUL_SOUHAIT_SEUL');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.notEligible.title.replace(/<[^>]*>/g, ''),
          );
        });
      });

      test.describe('4 personnes dont au moins 1 est en situation de handicap', () => {
        test.beforeEach(async () => {
          await performHouseholdComposition(4, true, 1);
        });

        test('Devrait être éligible dans toutes les zones', async () => {
          await performFiscalRevenues('60000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB2andC.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A, Abis et B1', async () => {
          await performFiscalRevenues('90000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB1.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A et Abis', async () => {
          await performFiscalRevenues('100000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneAandAbis.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être inéligible', async () => {
          await performFiscalRevenues('110000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.notEligible.title.replace(/<[^>]*>/g, ''),
          );
        });
      });

      test.describe('6 personnes', () => {
        test.beforeEach(async () => {
          await performHouseholdComposition(6, false, 2);
        });

        test('Devrait être éligible dans toutes les zones', async () => {
          await performFiscalRevenues('80000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB2andC.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A, Abis et B1', async () => {
          await performFiscalRevenues('110000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB1.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A et Abis', async () => {
          await performFiscalRevenues('121000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneAandAbis.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être inéligible', async () => {
          await performFiscalRevenues('130000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.notEligible.title.replace(/<[^>]*>/g, ''),
          );
        });
      });

      test.describe('Personne seule avec 4 personne à charge', () => {
        test.beforeEach(async () => {
          await performHouseholdComposition(5, false, 4);
        });

        test('Devrait être éligible dans toutes les zones', async () => {
          await performFiscalRevenues('80000', 'SEUL_SOUHAIT_SEUL');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB2andC.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A, Abis et B1', async () => {
          await performFiscalRevenues('110000', 'SEUL_SOUHAIT_SEUL');
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB1.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A et Abis', async () => {
          await performFiscalRevenues('121000', 'SEUL_SOUHAIT_SEUL');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneAandAbis.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être inéligible', async () => {
          await performFiscalRevenues('130000', 'SEUL_SOUHAIT_SEUL');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.notEligible.title.replace(/<[^>]*>/g, ''),
          );
        });
      });

      test.describe('5 personnes dont au moins 1 est en situation de handicap', () => {
        test.beforeEach(async () => {
          await performHouseholdComposition(5, true, 1);
        });

        test('Devrait être éligible dans toutes les zones', async () => {
          await performFiscalRevenues('80000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB2andC.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A, Abis et B1', async () => {
          await performFiscalRevenues('110000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB1.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A et Abis', async () => {
          await performFiscalRevenues('121000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneAandAbis.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être inéligible', async () => {
          await performFiscalRevenues('130000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.notEligible.title.replace(/<[^>]*>/g, ''),
          );
        });
      });

      test.describe('12 personnes', () => {
        test.beforeEach(async () => {
          await performHouseholdComposition(
            -1,
            undefined,
            undefined,
            undefined,
            undefined,
            '12',
          );
        });

        test('Devrait être éligible dans toutes les zones', async () => {
          await performFiscalRevenues('40000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneB2andC.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être éligible dans les zones A, Abis et B1', async () => {
          await performFiscalRevenues('170000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_PRIVE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
        });

        test('Devrait être éligible dans les zones A et Abis', async () => {
          await performFiscalRevenues('200000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.zoneAandAbis.title.replace(/<[^>]*>/g, ''),
          );
        });

        test('Devrait être inéligible', async () => {
          await performFiscalRevenues('210000', 'COMMUN');
          await performPropertySituation('LOCATAIRE_SOCIAL');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.notEligible.title.replace(/<[^>]*>/g, ''),
          );
        });
      });

      test.describe('Personne seule propriétaire', () => {
        test('Devrait être inéligible', async () => {
          await performHouseholdComposition(1, false);
          await performFiscalRevenues('25000');
          await performPropertySituation('PROPRIETAIRE');
          validateStepAndPhaseTitles();
          expect(resultText).toBeVisible();
          expect(resultText).toHaveText(
            stepsContent.eligibility.isOwner.title.replace(/<[^>]*>/g, ''),
          );
        });
      });
    });

    test.describe('Informations personnelles', () => {
      test.describe("Cas d'erreur du formulaire", () => {
        test('Soumettre sans prénom, sans nom de famille, sans adresse email ou sans numéro de téléphone', async () => {
          await performHouseholdComposition(1, false);
          await performFiscalRevenues('25000');
          await performPropertySituation('LOCATAIRE_PRIVE');
          await performResultDetails();
          await performUserDetails();
          expect(firstNameErrorMessage).toBeVisible();
          expect(firstNameErrorMessage).toHaveText(
            stepsContent.firstName.errorMessage,
          );
          expect(lastNameErrorMessage).toBeVisible();
          expect(lastNameErrorMessage).toHaveText(
            stepsContent.lastName.errorMessage,
          );
          expect(emailErrorMessage).toBeVisible();
          expect(emailErrorMessage).toHaveText(stepsContent.email.errorMessage);
          expect(phoneErrorMessage).toBeVisible();
          expect(phoneErrorMessage).toHaveText(stepsContent.phone.errorMessage);
        });
      });

      test.describe('Scenarii valides', () => {
        const validateStepAndPhaseTitles = () => {
          expect(stepTitle).toHaveText(
            `2. ${steps[1].title} Étape 2 sur ${steps.length}`,
          );
          expect(phaseTitle).toHaveText(`${steps[1].phases[1].title}`);
        };

        test.afterEach(async () => {
          expect(stepTitle).toHaveText(
            `3. ${steps[2].title} Étape 3 sur ${steps.length}`,
          );
          expect(phaseTitle).toHaveText(`${steps[2].phases[0].title}`);
        });

        test('Soumettre avec prénom, nom de famille, adresse email et numéro de téléphone', async () => {
          await performHouseholdComposition(1, false);
          await performFiscalRevenues('25000');
          await performPropertySituation('LOCATAIRE_PRIVE');
          await performResultDetails();
          validateStepAndPhaseTitles();
          await performUserDetails(
            'Gandalf',
            'Le Gris',
            'gandalf.legris@example.com',
            '+33122334455',
          );
        });
      });
    });
  });

  test.describe('Ma recherche', () => {
    test.describe('Informations sur le logement', () => {
      test.describe("Cas d'erreur du formulaire", () => {
        test('Soumettre sans lieu de recherche et sans type de logement', async () => {
          await performHouseholdComposition(1, false);
          await performFiscalRevenues('25000');
          await performPropertySituation('LOCATAIRE_PRIVE');
          await performResultDetails();
          await performUserDetails(
            'Gandalf',
            'Le Gris',
            'gandalf.legris@example.com',
            '+33122334455',
          );
          await performHousingInformations();
          expect(locationErrorMessage).toBeVisible();
          expect(locationErrorMessage).toHaveText(
            stepsContent.location.errorMessage,
          );
          expect(housingTypeErrorMessage).toBeVisible();
          expect(housingTypeErrorMessage).toHaveText(
            stepsContent.housingType.errorMessage,
          );
        });

        test('Soumettre avec un lieu de recherche invalide et un type de logement valide', async () => {
          await performHouseholdComposition(1, false);
          await performFiscalRevenues('25000');
          await performPropertySituation('LOCATAIRE_PRIVE');
          await performResultDetails();
          await performUserDetails(
            'Gandalf',
            'Le Gris',
            'gandalf.legris@example.com',
            '+33122334455',
          );
          await performHousingInformations('Invalid Location', 'T1');
          expect(locationErrorMessage).toBeVisible();
          expect(locationErrorMessage).toHaveText(
            stepsContent.location.errorMessage,
          );
        });
      });

      test.describe('Scénarii valides', () => {
        const validateStepAndPhaseTitles = () => {
          expect(stepTitle).toHaveText(
            `3. ${steps[2].title} Étape 3 sur ${steps.length}`,
          );
          expect(phaseTitle).toHaveText(`${steps[2].phases[0].title}`);
        };

        test.afterEach(async () => {
          expect(stepTitle).toHaveText(
            `3. ${steps[2].title} Étape 3 sur ${steps.length}`,
          );
          expect(phaseTitle).toHaveText(`${steps[2].phases[1].title}`);
        });

        test('Soumettre avec un lieu de recherche valide et un type de logement valide', async ({
          page,
        }) => {
          await performHouseholdComposition(1, false);
          await performFiscalRevenues('25000');
          await performPropertySituation('LOCATAIRE_PRIVE');
          await performResultDetails();
          await performUserDetails(
            'Gandalf',
            'Le Gris',
            'gandalf.legris@example.com',
            '+33122334455',
          );
          validateStepAndPhaseTitles();
          await performHousingInformations(
            'Paris',
            'T1',
            'suggestion-3-data-test-id',
            page,
          );
        });
      });
    });

    test.describe('Informations financières', () => {
      test.describe("Cas d'erreur du formulaire", () => {});

      test.describe('Scénarii valides', () => {});
    });
  });

  test.describe('Synthèse', () => {
    test("L'utilisateur obtient son résultat d'éligibilité et refuse la mise en relation", async () => {
      await performHouseholdComposition(1, false);
      await performFiscalRevenues('25000');
      await performPropertySituation('LOCATAIRE_PRIVE');
      await performRefuseConnection();
      expect(stepTitle).toHaveText(
        `4. ${steps[3].title} Étape 4 sur ${steps.length}`,
      );
      expect(phaseTitle).toHaveText(`${steps[3].phases[0].title}`);
      expect(previousPhaseButton).toContainText(`${steps[1].title}`);
    });
  });
});
