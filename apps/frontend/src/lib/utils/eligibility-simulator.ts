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

export const questions = {
  selectedHouseholdSize: {
    label: 'Combien de personnes composent votre foyer ?',
    dataTestId: 'select-household-size-error-message',
    options: [
      {
        value: undefined,
        label: 'Veuillez sélectionner une option',
      },
      {
        value: 1,
        label: '1 personne',
      },
      {
        value: 2,
        label: '2 personnes',
      },
      {
        value: 3,
        label: '3 personnes',
      },
      {
        value: 4,
        label: '4 personnes',
      },
      {
        value: 5,
        label: '5 personnes',
      },
      {
        value: 6,
        label: '6 personnes',
      },
      {
        value: -1,
        label: 'Plus de 6 personnes',
      },
    ],
  },
  singlePersonInHouseholdHasDisability: {
    label: 'Êtes-vous en situation de handicap ?',
    dataTestId: 'select-has-disability-error-message',
    options: [
      {
        value: undefined,
        label: 'Veuillez sélectionner une option',
      },
      {
        value: true,
        label: 'Oui',
      },
      {
        value: false,
        label: 'Non',
      },
    ],
  },
  dependantsAmount: {
    label: 'Combien avez-vous de personnes à charge (enfants compris) ?',
    dataTestId: 'select-dependants-amount-error-message',
    options: [
      {
        value: undefined,
        label: 'Veuillez sélectionner une option',
      },
      {
        value: 0,
        label: '0 personne',
      },
      {
        value: 1,
        label: '1 personne',
      },
      {
        value: 2,
        label: '2 personnes',
      },
      {
        value: 3,
        label: '3 personnes',
      },
      {
        value: 4,
        label: '4 personnes',
      },
      {
        value: 5,
        label: '5 personnes',
      },
      {
        value: 6,
        label: '6 personnes',
      },
      {
        value: -1,
        label: 'Plus de 6 personnes',
      },
    ],
  },
  twoToSixPersonsInHouseholdHasDisability: {
    label:
      "Dans votre foyer (vous y compris), est-ce qu'une ou plusieurs personnes sont en situation de handicap ?",
    dataTestId: 'select-has-disability-error-message',
    options: [
      {
        value: undefined,
        label: 'Veuillez sélectionner une option',
      },
      {
        value: true,
        label: 'Oui',
      },
      {
        value: false,
        label: 'Non',
      },
    ],
  },
  birthday: {
    label: 'Quelle est votre date de naissance ?',
    dataTestId: 'input-birthday-error-message',
  },
  coBuyerBirthday: {
    label: 'Quelle est la date de naissance de votre co-acquéreur·euse ?',
    dataTestId: 'input-co-buyer-birthday-error-message',
  },
  inputHouseholdSize: {
    label:
      'Pouvez vous indiquer précisément le nombre de personnes qui composent votre foyer ?',
    dataTestId: 'input-household-size-error-message',
  },
};
