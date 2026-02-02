import { browser } from '$app/environment';

type Step = {
  title: string;
  step: number;
};

class EligibilitySimulator {
  public steps: Step[] = [
    {
      title: 'Définir mon éligibilité',
      step: 1,
    },
    {
      title: "Mon résultat d'éligibilité",
      step: 2,
    },
    {
      title: 'Ma recherche',
      step: 3,
    },
  ];
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
  public loading: boolean = $state(false);

  public householdSize: number | undefined = $state(0);
  public hasDisability: boolean | undefined = $state(undefined);

  public goToPreviousStep = () => {
    if (this.previousStep) {
      this.currentStep = this.previousStep;
      this.resetScroll();
    }
  };

  public goToNextStep = () => {
    if (this.nextStep) {
      this.currentStep = this.nextStep;
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
