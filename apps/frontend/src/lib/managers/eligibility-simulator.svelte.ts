import { browser } from '$app/environment';

type Phase = {
  title: string;
  phase: number;
};

type Step = {
  title: string;
  step: number;
  phases: Phase[];
};

class EligibilitySimulator {
  public steps: Step[] = [
    {
      title: 'Définir mon éligibilité',
      step: 1,
      phases: [
        {
          title: 'Composition de mon foyer',
          phase: 1,
        },
        {
          title: 'Revenus fiscaux',
          phase: 2,
        },
        {
          title: 'Situation immobilière',
          phase: 3,
        },
      ],
    },
    {
      title: "Mon résultat d'éligibilité",
      step: 2,
      phases: [
        {
          title: 'Détail du resultat',
          phase: 1,
        },
        {
          title: 'Informations personnelles',
          phase: 2,
        },
      ],
    },
    {
      title: 'Ma recherche',
      step: 3,
      phases: [
        {
          title: 'Informations sur le logement',
          phase: 1,
        },
        {
          title: 'Informations financières',
          phase: 2,
        },
        {
          title: 'Informations additionnelles',
          phase: 3,
        },
      ],
    },
    {
      title: 'Synthése',
      step: 4,
      phases: [
        {
          title: 'Synthèse',
          phase: 1,
        },
      ],
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
  public householdSize: number | undefined = $state(0);
  public hasDisability: boolean | undefined = $state(undefined);

  public goToPreviousPhase = () => {
    if (this.previousPhase) {
      const shouldGoToPreviousStep = this.currentPhase.phase === 1;

      this.currentPhase = this.previousPhase;

      if (shouldGoToPreviousStep && this.previousStep) {
        this.currentStep = this.previousStep;
      }
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
