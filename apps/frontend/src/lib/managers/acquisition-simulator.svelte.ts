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
  public housingType: 'new' | 'old' | undefined = $state('new');

  public ownContribution: number | undefined = $state();

  public notaryFees: number | undefined = $state();
  public loanFees: number | undefined = $state();
  public realEstateFees: number | undefined = $state();
  public oneTimeExpenses: number | undefined = $state();

  public interestRate: number | undefined = $state();
  public loanDuration: number | undefined = $state();

  public estimatedNotaryFees: number = $derived.by(() => {
    if (this.housingPrice) {
      if (this.housingType === 'new') {
        return Math.round(this.housingPrice * 0.023);
      } else {
        return Math.round(this.housingPrice * 0.078);
      }
    }

    return 0;
  });

  public estimatedRealEstateFees: number = $derived.by(() => {
    if (!this.housingPrice) return 0;

    if (this.realEstateFees === 0) return 0;

    return Math.round(this.housingPrice * 0.055);
  });

  public totalFees: number = $derived(
    (this.notaryFees || this.estimatedNotaryFees) +
      (this.realEstateFees || this.estimatedRealEstateFees || 0) +
      (this.oneTimeExpenses || 0),
  );

  public totalCost: number = $derived(
    (this.housingPrice || 0) + (this.totalFees || 0),
  );

  public loanAmount: number = $derived(
    Math.max(
      (this.housingPrice || 0) +
        (this.totalFees || 0) -
        (this.ownContribution || 0),
      0,
    ),
  );

  public estimatedLoanFees: number = $derived.by(() => {
    if (!this.housingPrice) return 0;

    return Math.round(500 + this.loanAmount * 0.008);
  });

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
