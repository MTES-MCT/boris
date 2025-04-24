import type { OFS } from '$lib/utils/definitions';

export const OFSs: OFS[] = [
  {
    nom: 'OFS1',
    region: 'bretagne',
    departements: "Cotes d'armor, finistere",
    lien: 'https://ofs.random',
    telephone: '123456789',
    commercialisateur: 'commercialisateur',
  },
  {
    nom: 'OFS2',
    region: 'bretagne',
    departements: 'morbihan',
    lien: 'https://ofs.random',
    telephone: '123456789',
    commercialisateur: 'commercialisateur',
  },
  {
    nom: 'OFS3',
    region: 'Ile de france',
    departements: 'Paris',
    lien: 'https://ofs.random',
    telephone: '123456789',
    commercialisateur: 'commercialisateur',
  },
  {
    nom: 'OFS4',
    region: 'Ile de france',
    departements: 'Paris, Seinte saint Denis',
    lien: 'https://ofs.random',
    telephone: '123456789',
    commercialisateur: 'commercialisateur',
  },
  {
    nom: 'OFS5',
    region: 'Ile de france, bretagne',
    departements: 'Paris, Seinte saint Denis',
    lien: 'https://ofs.random',
    telephone: '123456789',
    commercialisateur: 'commercialisateur',
  },
  {
    nom: 'OFS6',
    region: 'Occitanie',
    departements: 'Gard',
    lien: 'https://ofs.random1, https://ofs.random2',
    telephone: '123456789',
    commercialisateur: 'commercialisateur1, commercialisateur2',
  },
];

export const expectedResult = [
  {
    name: 'bretagne',
    OFSs: [
      {
        nom: 'OFS1',
        region: 'bretagne',
        departements: "BRS Cotes d'armor, BRS finistere",
        lien: 'https://ofs.random',
        telephone: '123456789',
        commercialisateur: 'commercialisateur',
        formattedCommercialisateurs: [
          {
            lien: 'https://ofs.random',
            nom: 'commercialisateur',
          },
        ],
      },
      {
        nom: 'OFS2',
        region: 'bretagne',
        departements: 'BRS morbihan',
        lien: 'https://ofs.random',
        telephone: '123456789',
        commercialisateur: 'commercialisateur',
        formattedCommercialisateurs: [
          {
            lien: 'https://ofs.random',
            nom: 'commercialisateur',
          },
        ],
      },
      {
        nom: 'OFS5',
        region: 'Ile de france, bretagne',
        departements: 'BRS Paris, BRS Seinte saint Denis',
        lien: 'https://ofs.random',
        telephone: '123456789',
        commercialisateur: 'commercialisateur',
        formattedCommercialisateurs: [
          {
            lien: 'https://ofs.random',
            nom: 'commercialisateur',
          },
        ],
      },
    ],
    totalOFSs: 3,
  },
  {
    name: 'Ile de france',
    OFSs: [
      {
        nom: 'OFS3',
        region: 'Ile de france',
        departements: 'BRS Paris',
        lien: 'https://ofs.random',
        telephone: '123456789',
        commercialisateur: 'commercialisateur',
        formattedCommercialisateurs: [
          {
            lien: 'https://ofs.random',
            nom: 'commercialisateur',
          },
        ],
      },
      {
        nom: 'OFS4',
        region: 'Ile de france',
        departements: 'BRS Paris, BRS Seinte saint Denis',
        lien: 'https://ofs.random',
        telephone: '123456789',
        commercialisateur: 'commercialisateur',
        formattedCommercialisateurs: [
          {
            lien: 'https://ofs.random',
            nom: 'commercialisateur',
          },
        ],
      },
      {
        nom: 'OFS5',
        region: 'Ile de france, bretagne',
        departements: 'BRS Paris, BRS Seinte saint Denis',
        lien: 'https://ofs.random',
        telephone: '123456789',
        commercialisateur: 'commercialisateur',
        formattedCommercialisateurs: [
          {
            lien: 'https://ofs.random',
            nom: 'commercialisateur',
          },
        ],
      },
    ],
    totalOFSs: 3,
  },
  {
    name: 'Occitanie',
    OFSs: [
      {
        nom: 'OFS6',
        region: 'Occitanie',
        departements: 'BRS Gard',
        lien: 'https://ofs.random1, https://ofs.random2',
        telephone: '123456789',
        commercialisateur: 'commercialisateur1, commercialisateur2',
        formattedCommercialisateurs: [
          {
            lien: 'https://ofs.random1',
            nom: 'commercialisateur1',
          },
          {
            lien: 'https://ofs.random2',
            nom: 'commercialisateur2',
          },
        ],
      },
    ],
    totalOFSs: 1,
  },
];
