import type { EligibilityData, Statistic } from '$lib/utils/definitions';

export const eligibilityData: EligibilityData[] = [
  {
    category: 'Cat 1',
    value: 1,
    options: ['1 seule personne'],
    zoneAandAbis: 38508,
    zoneB1: 38508,
    zoneB2andC: 33479,
  },
  {
    category: 'Cat 2',
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
    category: 'Cat 3',
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
    category: 'Cat 4',
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
    category: 'Cat 5',
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
    category: 'Cat 6',
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
    number: 600,
    subtitle: 'simulations',
    content: 'dont 87% concernent des ménages éligibles dans toute la France.',
  },
  {
    number: 200,
    subtitle: 'mises en relation avec des ménages intéressés',
    content:
      'dont 66% qui ne connaissaient pas le BRS avant. 45% en région PACA / 20% en région IDF / 10% dans le 69 et le 74 / 25% dilués dans le reste de la France.',
  },
  {
    number: 90,
    subtitle: 'échanges téléphoniques',
    content: '',
  },
  {
    number: 20,
    subtitle: 'ménages en chemin vers l’accession',
    content: '',
  },
];
