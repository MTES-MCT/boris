import type { EligibilityData } from './definitions';
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

export type EligibilityCategory = {
  category: number;
  eligibleZoneAandAbis: boolean;
  eligibleZoneB1: boolean;
  eligibleZoneB2andC: boolean;
};

export type HousingType = 'T1' | 'T2' | 'T3' | 'T4' | 'T5';

export const eligibilityData: EligibilityData[] = [
  {
    category: 'Catégorie 1',
    value: 1,
    options: ['1 seule personne'],
    zoneAandAbis: 38844,
    zoneB1: 38844,
    zoneB2andC: 33771,
  },
  {
    category: 'Catégorie 2',
    value: 2,
    options: [
      '2 personnes ne comportant aucune personne à charge hors jeunes ménages',
      '1 personne seule en situation de handicap',
    ],
    zoneAandAbis: 58057,
    zoneB1: 58057,
    zoneB2andC: 45100,
  },
  {
    category: 'Catégorie 3',
    value: 3,
    options: [
      '3 personnes',
      '1 personne seule avec 1 personne à charge',
      'Jeune ménage: 2 personnes dont la somme des âges ne dépasse pas 55 ans',
      '2 personnes dont au moins 1 est en situation de handicap',
    ],
    zoneAandAbis: 76105,
    zoneB1: 69786,
    zoneB2andC: 54235,
  },
  {
    category: 'Catégorie 4',
    value: 4,
    options: [
      '4 personnes',
      '1 personne seule avec 2 personnes à charge',
      '3 personnes dont au moins 1 est en situation de handicap',
    ],
    zoneAandAbis: 90863,
    zoneB1: 83594,
    zoneB2andC: 65476,
  },
  {
    category: 'Catégorie 5',
    value: 5,
    options: [
      '5 personnes',
      '1 personne avec 3 personnes à charge',
      '4 personnes dont au moins 1 est en situation de handicap',
    ],
    zoneAandAbis: 108107,
    zoneB1: 98956,
    zoneB2andC: 77023,
  },
  {
    category: 'Catégorie 6',
    value: 6,
    options: [
      '6 personnes',
      '1 personne seule avec 4 personnes à charge',
      '5 personnes dont au moins 1 est en situation de handicap',
    ],
    zoneAandAbis: 121650,
    zoneB1: 111359,
    zoneB2andC: 86805,
  },
  {
    category: 'Personne supplémentaire',
    value: 7,
    options: [],
    zoneAandAbis: 13557,
    zoneB1: 12408,
    zoneB2andC: 9683,
  },
];

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

export const stepsContent = {
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
  eligibility: {
    zoneAandAbis: {
      title:
        'Vous êtes éligible au dispositif du BRS <u>en zone A et Abis</u>.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    zoneB1: {
      title:
        'Vous êtes éligible au dispositif du BRS <u>en zone tendue (A, Abis et B1)</u>.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    zoneB2andC: {
      title:
        'Vous êtes éligible au dispositif du BRS <u>dans toute la France</u>!',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    notEligible: {
      title: "Vous n'êtes pas éligible au dispositif du BRS.",
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    isOwner: {
      title:
        "En tant que propriétaire, vous n'êtes pas éligible au dispositif du BRS.",
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  },
  firstName: {
    label: 'Prénom',
    errorDataTestId: 'input-first-name-error-message',
    errorMessage: 'Veuillez saisir votre prénom',
  },
  lastName: {
    label: 'Nom de famille',
    errorDataTestId: 'input-last-name-error-message',
    errorMessage: 'Veuillez saisir votre nom de famille',
  },
  email: {
    label: 'Adresse email',
    errorDataTestId: 'input-email-error-message',
    errorMessage: 'Veuillez saisir votre adresse email',
  },
  phone: {
    label: 'Numéro de téléphone',
    errorDataTestId: 'input-phone-error-message',
    errorMessage:
      'Veuillez saisir un numéro de téléphone valide. Le format attendu est: +33122334455',
  },
  connection: {
    title: 'Mise en relation',
    connectionCtaText:
      'Si vous le souhaitez, nous pouvons vous mettre en relation avec les professionnels du Bail Réel Solidaire. Pour cela, vous pouvez cliquer sur le bouton "Étape suivante" ci-dessous et renseigner vos informations personnelles.',
  },
  exitSimulatorText:
    'Si vous ne souhaitez pas continuer, vous pouvez quitter le simulateur en cliquant ',
  location: {
    label: 'À quel endroit souhaitez-vous acheter votre logement ? *',
    placeholder: 'Exemple: Quimper, Paris, Lyon, etc.',
    errorMessage: 'Veuillez saisir un lieu valide.',
    errorDataTestId: 'location-autocomplete-error-message',
    dataTestId: 'location-autocomplete',
  },
  housingType: {
    label: `Quel type de logement recherchez-vous ?`,
    errorDataTestId: 'select-housing-type-error-message',
    options: [
      {
        value: undefined,
        label: 'Veuillez sélectionner une option',
      },
      {
        value: 'T1',
        label: 'T1 (1 pièce)',
      },
      {
        value: 'T2',
        label: 'T2 (2 pièces)',
      },
      {
        value: 'T3',
        label: 'T3 (3 pièces)',
      },
      {
        value: 'T4',
        label: 'T4 (4 pièces)',
      },
      {
        value: 'T5',
        label: 'T5 (5 pièces) ou plus grand',
      },
    ],
    errorMessage: 'Veuillez sélectionner une option',
  },
  contribution: {
    label: 'Quel est le montant de votre apport ?',
    errorDataTestId: 'input-contribution-error-message',
    errorMessage: 'Veuillez saisir un chiffre supérieur à 0.',
    inputDataTestId: 'input-contribution',
  },
  resources: {
    label:
      'Quelle est la somme des salaires nets mensuels et autres ressources mensuelles que touchent chaque personnes de votre ménage ?',
    errorDataTestId: 'input-resources-error-message',
    errorMessage: 'Veuillez saisir un chiffre supérieur à 0.',
    inputDataTestId: 'input-resources',
  },
};

const calculateAge = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();

  const currentMonth = today.getMonth();
  const birthMonth = birth.getMonth();

  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
};

export const defineCategory = (
  householdSize: number,
  hasDisability: boolean,
  dependantsAmount?: number,
  birthday?: string,
  coBuyerBirthday?: string,
): number => {
  let category = 1;
  let ageSum = 56;

  if (birthday && coBuyerBirthday) {
    ageSum = calculateAge(birthday) + calculateAge(coBuyerBirthday);
  }

  if (
    householdSize >= 6 ||
    (householdSize === 5 && dependantsAmount === 4) ||
    (householdSize === 5 && hasDisability)
  ) {
    category = 6;
  } else if (
    householdSize === 5 ||
    (householdSize === 4 && dependantsAmount === 3) ||
    (householdSize === 4 && hasDisability)
  ) {
    category = 5;
  } else if (
    householdSize === 4 ||
    (householdSize === 3 && dependantsAmount === 2) ||
    (householdSize === 3 && hasDisability)
  ) {
    category = 4;
  } else if (
    householdSize === 3 ||
    (householdSize === 2 && dependantsAmount === 1) ||
    (householdSize === 2 && ageSum <= 55) ||
    (householdSize == 2 && hasDisability)
  ) {
    category = 3;
  } else if (
    (householdSize === 2 && dependantsAmount === 0 && ageSum > 55) || // 2 personnes ne comportant aucune personne à charge hors jeunes ménages
    (householdSize === 1 && hasDisability)
  ) {
    category = 2;
  }

  return category;
};

export const defineEligibleZone = (
  taxableIncome: number,
  householdSize: number,
  hasDisability: boolean,
  dependantsAmount?: number,
  birthday?: string,
  coBuyerBirthday?: string,
): EligibilityCategory => {
  const category = defineCategory(
    householdSize,
    hasDisability,
    dependantsAmount,
    birthday,
    coBuyerBirthday,
  );

  const eligibilityCategory = eligibilityData[category - 1];

  const zoneAandAbisTreshold =
    householdSize < 7
      ? eligibilityCategory.zoneAandAbis
      : eligibilityCategory.zoneAandAbis +
        (householdSize - 6) * eligibilityData[6].zoneAandAbis;

  const zoneB1Treshold =
    householdSize < 7
      ? eligibilityCategory.zoneB1
      : eligibilityCategory.zoneB1 +
        (householdSize - 6) * eligibilityData[6].zoneB1;

  const zoneB2andCTreshold =
    householdSize < 7
      ? eligibilityCategory.zoneB2andC
      : eligibilityCategory.zoneB2andC +
        (householdSize - 6) * eligibilityData[6].zoneB2andC;

  return {
    category,
    eligibleZoneAandAbis: taxableIncome < zoneAandAbisTreshold,
    eligibleZoneB1: taxableIncome < zoneB1Treshold,
    eligibleZoneB2andC: taxableIncome < eligibilityCategory.zoneB2andC,
  };
};
