import type { OfsView } from '$lib/utils/api-types';

export const ofss: OfsView[] = [
  {
    id: '086d854f-3d94-4adc-98cf-13b8b9e01462',
    name: 'OFIS',
    websiteUrl: null,
    phone: null,
    email: null,
    departements: [
      {
        id: '634ab950-c60b-4021-b865-d0941bf613fd',
        name: 'Haute-Savoie',
        code: '74',
      },
    ],
    regions: [
      {
        id: '4c56344e-a30b-4c98-86b3-f3a619d65be0',
        name: 'Auvergne-Rhône-Alpes',
      },
    ],
    distributors: [
      {
        id: '8a2d2886-5bec-4e9c-8af8-4893d8cc4025',
        name: 'Haute-Savoie Habitat',
        websiteUrl:
          'https://www.hautesavoiehabitat.fr/nous-connaitre/nos-marques-et-filiales/ofis/',
      },
    ],
  },
  {
    id: 'be74a186-b935-4d88-8d40-1fe388863c15',
    name: 'La Coop Foncière Méditerranée ',
    websiteUrl: null,
    phone: null,
    email: null,
    departements: [],
    regions: [
      {
        id: '3f2a978c-f6d5-4148-97ae-88e669544db1',
        name: "Provence-Alpes-Côte d'Azur",
      },
    ],
    distributors: [
      {
        id: '4f59c056-7eda-4e66-b03c-c23f8f4ddfb9',
        name: 'Grand Delta Habitat',
        websiteUrl: 'https://www.granddelta.fr/',
      },
      {
        id: '68e73767-f3c7-4f3f-94ed-649437d9343d',
        name: 'Maison Familiale de Provence',
        websiteUrl: 'https://maison-familiale-de-provence.fr/',
      },
    ],
  },
  {
    id: 'a16b756a-5df5-404d-a374-644d89576622',
    name: 'Foncière Solucia Territoires',
    websiteUrl: null,
    phone: '06 50 59 31 05',
    email: 'contact@ofs-fst.fr',
    departements: [],
    regions: [
      {
        id: '1bdb7c19-a40c-479d-8756-39e1c224e914',
        name: 'Bretagne',
      },
    ],
    distributors: [],
  },
  {
    id: '7d56679f-0153-4f5e-967a-099235ec9528',
    name: 'Foncier Coopératif Malouin',
    websiteUrl: 'https://www.foncier-cooperatif-malouin.coop/',
    phone: null,
    email: 'contact.fcm@keredes.coop',
    departements: [
      {
        id: '8fb92e67-2a0b-4745-8b1e-e0a76e1e84d2',
        name: 'Ille-et-Vilaine',
        code: '35',
      },
    ],
    regions: [
      {
        id: '1bdb7c19-a40c-479d-8756-39e1c224e914',
        name: 'Bretagne',
      },
    ],
    distributors: [],
  },
];

export const expectedResult = [
  {
    name: 'Auvergne-Rhône-Alpes',
    ofss: [
      {
        id: '086d854f-3d94-4adc-98cf-13b8b9e01462',
        name: 'OFIS',
        websiteUrl: null,
        phone: null,
        email: null,
        departements: [
          {
            id: '634ab950-c60b-4021-b865-d0941bf613fd',
            name: 'Haute-Savoie',
            code: '74',
          },
        ],
        regions: [
          {
            id: '4c56344e-a30b-4c98-86b3-f3a619d65be0',
            name: 'Auvergne-Rhône-Alpes',
          },
        ],
        distributors: [
          {
            id: '8a2d2886-5bec-4e9c-8af8-4893d8cc4025',
            name: 'Haute-Savoie Habitat',
            websiteUrl:
              'https://www.hautesavoiehabitat.fr/nous-connaitre/nos-marques-et-filiales/ofis/',
          },
        ],
      },
    ],
    totalOfss: 1,
  },
  {
    name: 'Bretagne',
    ofss: [
      {
        id: '7d56679f-0153-4f5e-967a-099235ec9528',
        name: 'Foncier Coopératif Malouin',
        websiteUrl: 'https://www.foncier-cooperatif-malouin.coop/',
        phone: null,
        email: 'contact.fcm@keredes.coop',
        departements: [
          {
            id: '8fb92e67-2a0b-4745-8b1e-e0a76e1e84d2',
            name: 'Ille-et-Vilaine',
            code: '35',
          },
        ],
        regions: [
          {
            id: '1bdb7c19-a40c-479d-8756-39e1c224e914',
            name: 'Bretagne',
          },
        ],
        distributors: [],
      },
      {
        id: 'a16b756a-5df5-404d-a374-644d89576622',
        name: 'Foncière Solucia Territoires',
        websiteUrl: null,
        phone: '06 50 59 31 05',
        email: 'contact@ofs-fst.fr',
        departements: [],
        regions: [
          {
            id: '1bdb7c19-a40c-479d-8756-39e1c224e914',
            name: 'Bretagne',
          },
        ],
        distributors: [],
      },
    ],
    totalOfss: 2,
  },
  {
    name: "Provence-Alpes-Côte d'Azur",
    ofss: [
      {
        id: 'be74a186-b935-4d88-8d40-1fe388863c15',
        name: 'La Coop Foncière Méditerranée ',
        websiteUrl: null,
        phone: null,
        email: null,
        departements: [],
        regions: [
          {
            id: '3f2a978c-f6d5-4148-97ae-88e669544db1',
            name: "Provence-Alpes-Côte d'Azur",
          },
        ],
        distributors: [
          {
            id: '4f59c056-7eda-4e66-b03c-c23f8f4ddfb9',
            name: 'Grand Delta Habitat',
            websiteUrl: 'https://www.granddelta.fr/',
          },
          {
            id: '68e73767-f3c7-4f3f-94ed-649437d9343d',
            name: 'Maison Familiale de Provence',
            websiteUrl: 'https://maison-familiale-de-provence.fr/',
          },
        ],
      },
    ],
    totalOfss: 1,
  },
];
