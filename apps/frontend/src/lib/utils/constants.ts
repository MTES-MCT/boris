import type {
  EligibilityData,
  MapBounds,
  Statistic,
} from '$lib/utils/definitions';
import { formatEuro } from './formatters';

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

export const eligibilityDataTable = {
  theads: [
    'Nb de personnes destinées à occuper le logement',
    'Zone A',
    'Zone B1',
    'Zone B2 et C',
  ],
  tbodies: [
    [
      'Personne seule',
      formatEuro(eligibilityData[0].zoneAandAbis),
      formatEuro(eligibilityData[0].zoneB1),
      formatEuro(eligibilityData[0].zoneB2andC),
    ],
    [
      '2 personnes ne comportant aucune personne à charge hors jeunes ménages <br> <b>ou</b> 1 personne seule en situation de handicap',
      formatEuro(eligibilityData[1].zoneAandAbis),
      formatEuro(eligibilityData[1].zoneB1),
      formatEuro(eligibilityData[1].zoneB2andC),
    ],
    [
      '3 personnes <br> <b>ou</b> 1 personne seule avec 1 personne à charge <br> <b>ou</b> Jeune ménage: 2 personnes dont la somme des âges ne dépasse pas 55 ans <br> <b>ou</b> 2 personnes dont au moins 1 est en situation de handicap',
      formatEuro(eligibilityData[2].zoneAandAbis),
      formatEuro(eligibilityData[2].zoneB1),
      formatEuro(eligibilityData[2].zoneB2andC),
    ],
    [
      '4 personnes <br> <b>ou</b> 1 personne seule avec 2 personnes à charge <br> <b>ou</b> 3 personnes dont au moins 1 est en situation de handicap',
      formatEuro(eligibilityData[3].zoneAandAbis),
      formatEuro(eligibilityData[3].zoneB1),
      formatEuro(eligibilityData[3].zoneB2andC),
    ],
    [
      '5 personnes <br> <b>ou</b> 1 personne avec 3 personnes à charge <br> <b>ou</b> 4 personnes dont au moins 1 est en situation de handicap',
      formatEuro(eligibilityData[4].zoneAandAbis),
      formatEuro(eligibilityData[4].zoneB1),
      formatEuro(eligibilityData[4].zoneB2andC),
    ],
    [
      '6 personnes <br> <b>ou</b> 1 personne seule avec 4 personnes à charge <br> <b>ou</b> 5 personnes dont au moins 1 est en situation de handicap',
      formatEuro(eligibilityData[5].zoneAandAbis),
      formatEuro(eligibilityData[5].zoneB1),
      formatEuro(eligibilityData[5].zoneB2andC),
    ],
    [
      'Par personne supplémentaire',
      formatEuro(eligibilityData[6].zoneAandAbis),
      formatEuro(eligibilityData[6].zoneB1),
      formatEuro(eligibilityData[6].zoneB2andC),
    ],
  ],
};

export const statistics: Statistic[] = [
  {
    amount: '380 000 €',
    subtitle: "d'argent public investi sur notre plateforme.",
    content: '',
  },
  {
    amount: '12 000',
    subtitle: 'simulations',
    content: 'dont 90% concernent des ménages éligibles.',
  },
  {
    amount: '4 000',
    subtitle: 'ménages recontactés',
    content:
      "après simulation d'éligibilité pour avoir les clés de la poursuite de leur projets (dont 65% ne connaissait pas le BRS avant BoRiS)",
  },
  {
    amount: '100 à 150',
    subtitle: "ménages avec un projet d'achat",
    content: '',
  },
];

export const defaultPagination = {
  page: 1,
  pageSize: 24,
};

// Paris coordinates
export const defaultCoords: { latitude: number; longitude: number } = {
  latitude: 46.227638,
  longitude: 2.213749,
};

export const parisCoords: { latitude: number; longitude: number } = {
  latitude: 48.5,
  longitude: 2.2,
};

export const defaultBounds: MapBounds = {
  northEastLat: 52.37559917665913,
  northEastLng: 12.524414062500002,
  southWestLat: 39.30029918615029,
  southWestLng: -8.085937500000002,
};

export const defaultRadius = 5;

export const defaultZoomDesktop = 6;
export const defaultZoomMobile = 5;

export const contactEmail = 'nathan.gaudelet@beta.gouv.fr';
