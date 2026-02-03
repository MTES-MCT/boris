export type Phase = {
  title: string;
  phase: number;
};

export type Step = {
  title: string;
  step: number;
  phases: Phase[];
};

export const steps: Step[] = [
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
