import type { AutocompleteSuggestion } from '$lib/utils/definitions';
import type { Zone } from '$lib/utils/lissage-ptz';

type Step = {
  title: string;
  step: number;
};

class AcquisitionSimulator {
  public steps: Step[] = [
    {
      title: 'Votre futur logement',
      step: 1,
    },
    {
      title: 'Votre apport personnel',
      step: 2,
    },
    {
      title: "Frais annexes à l'acquisition",
      step: 3,
    },
    {
      title: "Synthèse de l'apport et des frais",
      step: 4,
    },
    {
      title: 'Prêt immobilier & prêt à taux zéro',
      step: 5,
    },
    {
      title: 'Redevance BRS & charges mensuelles',
      step: 6,
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
  public housingPrice: number | undefined = $state();
  public selectedLocation: AutocompleteSuggestion | undefined = $state();
  public autocompleteValue = $derived(this.selectedLocation?.fulltext || '');
  public brsZone: Zone | undefined = $state();
  public surface: number | undefined = $state();
  public housingType: 'new' | 'old' | undefined = $state();

  public goToPreviousStep = () => {
    if (this.previousStep) {
      this.currentStep = this.previousStep;
    }
  };

  public goToNextStep = () => {
    if (this.nextStep) {
      this.currentStep = this.nextStep;
    }
  };
}

const acquisitionSimulatorManger = new AcquisitionSimulator();
export default acquisitionSimulatorManger;
