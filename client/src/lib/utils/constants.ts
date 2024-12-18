import type { EligibilityData, Statistic } from '$lib/utils/definitions';

export const eligibilityData: EligibilityData[] = [
  {
    category: 'Cat 1',
    value: 1,
    options: ['1 seule personne'],
    zoneAandAbis: 37581,
    zoneB1: 37581,
    zoneB2andC: 32673,
  },
  {
    category: 'Cat 2',
    value: 2,
    options: [
      '2 personnes ne comportant aucune personne à charge hors jeunes ménages',
      '1 personne seule en situation de handicap',
    ],
    zoneAandAbis: 56169,
    zoneB1: 56169,
    zoneB2andC: 43633,
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
    zoneAandAbis: 73630,
    zoneB1: 67517,
    zoneB2andC: 52471,
  },
  {
    category: 'Cat 4',
    value: 4,
    options: [
      '4 personnes',
      '1 personne seule avec 2 personnes à charge',
      '3 personnes dont au moins 1 est en situation de handicap',
    ],
    zoneAandAbis: 87909,
    zoneB1: 80875,
    zoneB2andC: 63347,
  },
  {
    category: 'Cat 5',
    value: 5,
    options: [
      '5 personnes',
      '1 personne avec 3 personnes à charge',
      '4 personnes dont au moins 1 est en situation de handicap',
    ],
    zoneAandAbis: 104592,
    zoneB1: 95739,
    zoneB2andC: 74518,
  },
  {
    category: 'Cat 6',
    value: 6,
    options: [
      '6 personnes',
      '1 personne seule avec 4 personnes à charge',
      '5 personnes dont au moins 1 est en situation de handicap',
    ],
    zoneAandAbis: 117694,
    zoneB1: 107738,
    zoneB2andC: 83983,
  },
  {
    category: 'Personne supplémentaire',
    value: 7,
    options: [],
    zoneAandAbis: 13116,
    zoneB1: 12005,
    zoneB2andC: 9368,
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
