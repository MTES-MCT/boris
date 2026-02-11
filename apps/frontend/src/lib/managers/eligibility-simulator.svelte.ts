import { browser } from '$app/environment';

import {
  defineEligibleZone,
  steps,
  type DeclarationType,
  type EligibilityCategory,
  type Phase,
  type PropertySituation,
  type Step,
} from '$lib/utils/eligibility-simulator';
import { formattedThousandsToNumber } from '$lib/utils/formatters';

class EligibilitySimulator {
  public steps: Step[] = steps;

  public currentStep: Step = $state(this.steps[1]);
  public previousStep: Step | null = $derived.by(() => {
    if (this.currentStep.step < 2) {
      return null;
    } else {
      return this.steps[this.currentStep.step - 2];
    }
  });
  public nextStep: Step | null = $derived.by(() => {
    if (this.currentStep.step >= this.steps.length) {
      return null;
    } else {
      return this.steps[this.currentStep.step];
    }
  });

  public currentPhase: Phase = $state(this.steps[1].phases[1]);
  public previousPhase: Phase | null = $derived.by(() => {
    if (this.currentPhase.phase > 1) {
      return this.currentStep.phases[this.currentPhase.phase - 2];
    } else if (this.previousStep) {
      return this.previousStep.phases[this.previousStep.phases.length - 1];
    } else {
      return null;
    }
  });
  public nextPhase: Phase | null = $derived.by(() => {
    if (this.currentPhase.phase < this.currentStep.phases.length) {
      return this.currentStep.phases[this.currentPhase.phase];
    } else if (this.nextStep) {
      return this.nextStep?.phases[0];
    } else {
      return null;
    }
  });

  public loading: boolean = $state(false);

  // Household Composition
  public householdSize: number | undefined = $state(undefined);
  public selectedHouseholdSize: number | undefined = $derived.by(() => {
    if (!this.householdSize) {
      return undefined;
    } else if (this.householdSize < 7) {
      return this.householdSize;
    } else {
      return -1;
    }
  });
  public singlePersonInHousehold: boolean = $derived(
    this.selectedHouseholdSize === 1,
  );
  public twoToSixPersonsInHousehold: boolean = $derived(
    this.selectedHouseholdSize !== undefined &&
      this.selectedHouseholdSize >= 2 &&
      this.selectedHouseholdSize <= 6,
  );
  public moreThanSixPersonsInHousehold: boolean = $derived(
    this.selectedHouseholdSize === -1,
  );
  public hasDisability: boolean | undefined = $state(undefined);
  public propertySituation: PropertySituation | undefined = $state(undefined);
  public dependantsAmount: number | undefined = $state(undefined);
  public birthday: string | undefined = $state(undefined);
  public coBuyerBirthday: string | undefined = $state(undefined);

  // Fiscal Revenues
  public formattedTaxableIncome: string | undefined = $state(undefined);
  public declarationType: DeclarationType | undefined = $state(undefined);
  public firstCoBuyerFormattedTaxableIncome: string | undefined =
    $state(undefined);
  public secondCoBuyerFormattedTaxableIncome: string | undefined =
    $state(undefined);
  public taxableIncome: number | undefined = $derived.by(() => {
    if (
      this.firstCoBuyerFormattedTaxableIncome &&
      this.secondCoBuyerFormattedTaxableIncome
    ) {
      return (
        formattedThousandsToNumber(this.firstCoBuyerFormattedTaxableIncome) +
        formattedThousandsToNumber(this.secondCoBuyerFormattedTaxableIncome)
      );
    } else if (this.formattedTaxableIncome) {
      return formattedThousandsToNumber(this.formattedTaxableIncome);
    }

    return undefined;
  });

  // Eligibility
  public eligibility: EligibilityCategory | undefined = $derived.by(() => {
    if (
      typeof this.taxableIncome === 'number' &&
      typeof this.householdSize === 'number'
    ) {
      return defineEligibleZone(
        this.taxableIncome,
        this.householdSize,
        this.hasDisability || false,
        this.dependantsAmount,
        this.birthday,
        this.coBuyerBirthday,
      );
    }

    return undefined;
  });

  // User details
  public firstName: string | undefined = $state(undefined);
  public lastName: string | undefined = $state(undefined);
  public email: string | undefined = $state(undefined);

  public goToPreviousPhase = () => {
    if (this.previousPhase) {
      const shouldGoToPreviousStep = this.currentPhase.phase === 1;

      this.currentPhase = this.previousPhase;

      if (shouldGoToPreviousStep && this.previousStep) {
        this.currentStep = this.previousStep;
      }

      this.resetScroll();
    }
  };

  public goToNextPhase = () => {
    if (this.nextPhase) {
      const shouldGoToNextStep =
        this.currentPhase.phase === this.currentStep.phases.length;

      this.currentPhase = this.nextPhase;

      if (shouldGoToNextStep && this.nextStep) {
        this.currentStep = this.nextStep;
      }

      this.resetScroll();
    }
  };

  private resetScroll = () => {
    if (browser) {
      document.getElementById('simulateur')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };
}

const eligibilitySimulatorManager = new EligibilitySimulator();
export default eligibilitySimulatorManager;
