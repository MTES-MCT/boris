import type { EligibilityData, Statistic } from '$lib/utils/definitions';

export const eligibilityData: EligibilityData[] = [
  {
    category: 'Catégorie 1',
    value: 1,
    options: ['1 seule personne'],
    zoneAandAbis: 38508,
    zoneB1: 38508,
    zoneB2andC: 33479,
  },
  {
    category: 'Catégorie 2',
    value: 2,
    options: [
      '2 personnes ne comportant aucune personne à charge hors jeunes ménages',
      '1 personne seule en situation de handicap',
    ],
    zoneAandAbis: 57555,
    zoneB1: 57555,
    zoneB2andC: 44710,
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
    zoneAandAbis: 75447,
    zoneB1: 69183,
    zoneB2andC: 53766,
  },
  {
    category: 'Catégorie 4',
    value: 4,
    options: [
      '4 personnes',
      '1 personne seule avec 2 personnes à charge',
      '3 personnes dont au moins 1 est en situation de handicap',
    ],
    zoneAandAbis: 90078,
    zoneB1: 82871,
    zoneB2andC: 64910,
  },
  {
    category: 'Catégorie 5',
    value: 5,
    options: [
      '5 personnes',
      '1 personne avec 3 personnes à charge',
      '4 personnes dont au moins 1 est en situation de handicap',
    ],
    zoneAandAbis: 107173,
    zoneB1: 98101,
    zoneB2andC: 76357,
  },
  {
    category: 'Catégorie 6',
    value: 6,
    options: [
      '6 personnes',
      '1 personne seule avec 4 personnes à charge',
      '5 personnes dont au moins 1 est en situation de handicap',
    ],
    zoneAandAbis: 120598,
    zoneB1: 110396,
    zoneB2andC: 86055,
  },
  {
    category: 'Personne supplémentaire',
    value: 7,
    options: [],
    zoneAandAbis: 13440,
    zoneB1: 12301,
    zoneB2andC: 9599,
  },
];

export const statistics: Statistic[] = [
  {
    amount: '380 000 €',
    subtitle: 'd’argent public investi sur notre plateforme.',
    content: '',
  },
  {
    amount: '7 000',
    subtitle: 'simulations',
    content: 'dont 90% concernent des ménages éligibles.',
  },
  {
    amount: '2 000',
    subtitle: 'ménages recontactés',
    content:
      'après simulation d’éligibilité pour avoir les clés de la poursuite de leur projets (dont 65% ne connaissait pas le BRS avant BoRiS)',
  },
  {
    amount: '70',
    subtitle: 'organismes de foncier solidaire partenaires',
    content: '',
  },
];
