import { formatYearMinusN } from './formatters';

export type Phase = {
  title: string;
  phase: number;
};

export type Step = {
  title: string;
  step: number;
  phases: Phase[];
};

export type PropertySituation =
  | 'LOCATAIRE_SOCIAL'
  | 'LOCATAIRE_PRIVE'
  | 'PROPRIETAIRE'
  | 'HEBERGE'
  | 'AUTRE';

export type DeclarationType =
  | 'SEUL_SOUHAIT_SEUL'
  | 'COMMUN'
  | 'SEUL_SOUHAIT_PARTENAIRE';

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
    errorDataTestId: 'select-household-size-error-message',
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
    errorDataTestId: 'select-has-disability-error-message',
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
    errorDataTestId: 'select-dependants-amount-error-message',
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
    errorDataTestId: 'select-has-disability-error-message',
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
    errorDataTestId: 'input-birthday-error-message',
  },
  coBuyerBirthday: {
    label: 'Quelle est la date de naissance de votre co-acquéreur·euse ?',
    errorDataTestId: 'input-co-buyer-birthday-error-message',
  },
  inputHouseholdSize: {
    label:
      'Pouvez vous indiquer précisément le nombre de personnes qui composent votre foyer ?',
    errorDataTestId: 'input-household-size-error-message',
  },
  formattedTaxableIncome: {
    label: `Quel est le revenu fiscal de référence présent sur votre avis d'imposition de l'année ${formatYearMinusN(1)}, concernant vos revenus de l'année ${formatYearMinusN(2)} ?`,
    labelInCommon: `Quel est le revenu fiscal de référence présent sur <span class="fr-text--bold">votre avis d'imposition commun</span> de l'année ${formatYearMinusN(1)}, concernant vos revenus de l'année ${formatYearMinusN(2)} ?`,
    inputDataTestId: 'input-formatted-taxable-income',
    errorDataTestId: 'input-formatted-taxable-income-error-message',
    errorMessage: 'Veuillez saisir un chiffre supérieur à 0.',
  },
  firstCoBuyerFormattedTaxableIncome: {
    label: `Quel est le revenu fiscal de référence présent sur votre avis d'imposition de l'année ${formatYearMinusN(1)}, concernant vos revenus de l'année ${formatYearMinusN(2)} ?`,
    inputDataTestId: 'input-first-co-buyer-formatted-taxable-income',
    errorDataTestId:
      'input-first-co-buyer-formatted-taxable-income-error-message',
    errorMessage: 'Veuillez saisir un chiffre supérieur à 0.',
  },
  secondCoBuyerFormattedTaxableIncome: {
    label: `Quel est le revenu fiscal de référence <span class="fr-text--bold">votre co-acquéreur·euse</span> présent sur votre avis d'imposition de l'année ${formatYearMinusN(1)}, concernant vos revenus de l'année ${formatYearMinusN(2)} ?`,
    inputDataTestId: 'input-second-co-buyer-formatted-taxable-income',
    errorDataTestId:
      'input-second-co-buyer-formatted-taxable-income-error-message',
    errorMessage: 'Veuillez saisir un chiffre supérieur à 0.',
  },
  declarationType: {
    label: `En ${formatYearMinusN(1)}, comment avez vous déclaré vos revenus fiscaux ${formatYearMinusN(2)} ?`,
    errorDataTestId: 'select-declaration-type-error-message',
    options: [
      {
        value: undefined,
        label: 'Veuillez sélectionner une option',
      },
      {
        value: 'SEUL_SOUHAIT_SEUL',
        label: 'Seul·e et vous souhaitez acheter seul·e',
      },
      {
        value: 'COMMUN',
        label: 'En commun',
      },
      {
        value: 'SEUL_SOUHAIT_PARTENAIRE',
        label: 'Seul·e mais vous souhaitez acheter avec un·e partenaire',
      },
    ],
    errorMessage: 'Veuillez sélectionner une option',
  },
  propertySituation: {
    label: 'Quelle est votre situation immobilière ?',
    errorDataTestId: 'select-property-situation-error-message',
    options: [
      {
        value: undefined,
        label: 'Veuillez sélectionner une option',
      },
      {
        value: 'LOCATAIRE_SOCIAL',
        label: "Locataire d'un logement social",
      },
      {
        value: 'LOCATAIRE_PRIVE',
        label: "Locataire d'un logement privé",
      },
      {
        value: 'PROPRIETAIRE',
        label: "Propriétaire d'un logement",
      },
      {
        value: 'HEBERGE',
        label: 'Hébergé-e',
      },
      {
        value: 'AUTRE',
        label: 'Dans une autre situation immobilière',
      },
    ],
  },
};
