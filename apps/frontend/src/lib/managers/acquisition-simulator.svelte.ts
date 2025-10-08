import type { GeocodedResponse } from '$lib/utils/definitions';
import { getGeocodedResponseLabel } from '$lib/utils/helpers';
import type { Logement, PretLisse, Zone } from '$lib/utils/lissage-ptz';

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
      title: 'Lissage des prêts',
      step: 6,
    },
    {
      title: 'Redevance BRS & charges',
      step: 7,
    },
    {
      title: 'Récapitulatif de la simulation',
      step: 8,
    },
  ];
  public currentStep: Step = $state(this.steps[4]);
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

  public housingPrice: number | undefined = $state(200000);
  public selectedLocation: GeocodedResponse['properties'] | undefined =
    $state();
  public autocompleteValue = $derived(
    getGeocodedResponseLabel(this.selectedLocation) || '',
  );
  public brsZone: Zone | undefined = $state('Abis');
  public surface: number | undefined = $state(50);
  public housingType: 'new' | 'old' | undefined = $state('new');

  public ownContribution: number | undefined = $state(10000);

  public notaryFees: number | undefined = $state();
  public loanFees: number | undefined = $state();
  public realEstateFees: number | undefined = $state();
  public oneTimeExpenses: number | undefined = $state(2000);

  public interestRate: number | undefined = $state(3);
  public loanDuration: number | undefined = $state(25);
  public inHousePeopleAmount: number | undefined = $state(1);
  public fiscalIncome: number | undefined = $state(24000);
  public ptzType: Logement | undefined = $state('collectif');
  public pretLisse: PretLisse | undefined = $state();

  public brsFees: number | undefined = $state(3.5);
  public yearlyPropertyTax: number | undefined = $state(1240);
  public yearlyHouseingInsurance: number | undefined = $state(350);
  public condominiumFeesFrequency:
    | 'yearly'
    | 'monthly'
    | 'trimestrial'
    | undefined = $state('trimestrial');
  public condominiumFees: number | undefined = $state(600);
  public yearlyExpenses: number | undefined = $state(1500);

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

  public monthlyBrsFees = $derived(
    this.brsFees ? (this.brsFees as number) * (this.surface as number) : 0,
  );

  public yearlyBrsFees = $derived(
    this.brsFees ? (this.brsFees as number) * (this.surface as number) * 12 : 0,
  );

  public monthlyPropertyTax = $derived(
    this.yearlyPropertyTax ? (this.yearlyPropertyTax as number) / 12 : 0,
  );

  public monthlyHouseingInsurance = $derived(
    this.yearlyHouseingInsurance
      ? (this.yearlyHouseingInsurance as number) / 12
      : 0,
  );

  public monthlyCondominiumFees = $derived.by(() => {
    if (this.condominiumFees && this.condominiumFees > 0) {
      if (this.condominiumFeesFrequency === 'monthly') {
        return this.condominiumFees as number;
      } else if (this.condominiumFeesFrequency === 'trimestrial') {
        return (this.condominiumFees as number) / 3;
      } else if (this.condominiumFeesFrequency === 'yearly') {
        return (this.condominiumFees as number) / 12;
      }
    }

    return 0;
  });

  public yearlyCondominiumFees = $derived.by(() => {
    if (this.condominiumFees && this.condominiumFees > 0) {
      if (this.condominiumFeesFrequency === 'monthly') {
        return (this.condominiumFees as number) * 12;
      } else if (this.condominiumFeesFrequency === 'trimestrial') {
        return (this.condominiumFees as number) * 3;
      } else if (this.condominiumFeesFrequency === 'yearly') {
        return this.condominiumFees as number;
      }
    }

    return 0;
  });

  public monthlyExpenses = $derived(
    this.yearlyExpenses ? (this.yearlyExpenses as number) / 12 : 0,
  );

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

const acquisitionSimulatorManager = new AcquisitionSimulator();
export default acquisitionSimulatorManager;
