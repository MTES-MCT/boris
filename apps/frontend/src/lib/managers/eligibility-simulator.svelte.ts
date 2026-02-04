import { browser } from '$app/environment';
import { steps, type Phase, type Step } from '$lib/utils/eligibility-simulator';

export type PropertySituation =
  | 'LOCATAIRE_SOCIAL'
  | 'LOCATAIRE_PRIVE'
  | 'PROPRIETAIRE'
  | 'HEBERGE'
  | 'AUTRE';

class EligibilitySimulator {
  public steps: Step[] = steps;

  public currentStep: Step = $state(this.steps[0]);
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

  public currentPhase: Phase = $state(this.steps[0].phases[0]);
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
  public householdSize: number | undefined = $state(undefined);
  public hasDisability: boolean | undefined = $state(undefined);
  public propertySituation: PropertySituation | undefined = $state(undefined);
  public dependantsAmount: number | undefined = $state(undefined);
  public formattedTaxableIncome: string | undefined = $state(undefined);
  public birthday: string | undefined = $state(undefined);
  public coBuyerBirthday: string | undefined = $state(undefined);

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
