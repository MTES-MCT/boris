import type { OFS } from '$routes/organismes-fonciers-solidaires/definitions';

// ---------------------------------------
// TEMPORAIRE: À SUPPRIMER QUAND NOUS AURONS TOUS LES DEPARTEMENTS
// ---------------------------------------
export const OFSs: OFS[] = [
  {
    nom: 'OFS1',
    region: 'bretagne',
    departements: "Cotes d'armor, finistere, ",
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
];
// ---------------------------------------

export const expectedResult = [
  {
    name: 'bretagne',
    OFSs: [
      {
        nom: 'OFS1',
        region: 'bretagne',
        departements: "Cotes d'armor, finistere, ",
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
        nom: 'OFS5',
        region: 'Ile de france, bretagne',
        departements: 'Paris, Seinte saint Denis',
        lien: 'https://ofs.random',
        telephone: '123456789',
        commercialisateur: 'commercialisateur',
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
    ],
    totalOFSs: 3,
  },
];

// ---------------------------------------
// TEMPORAIRE: À REMETTRE QUAND NOUS AURONS TOUS LES DEPARTEMENTS
// ---------------------------------------
// export const OFSs: OFS[] = [
//   {
//     nom: 'OFS1',
//     region: 'bretagne',
//     departements: "Cotes d'armor, finistere, ",
//     lien: 'https://ofs.random',
//     telephone: '123456789',
//   },
//   {
//     nom: 'OFS2',
//     region: 'bretagne',
//     departements: 'morbihan',
//     lien: 'https://ofs.random',
//     telephone: '123456789',
//   },
//   {
//     nom: 'OFS3',
//     region: 'Ile de france',
//     departements: 'Paris',
//     lien: 'https://ofs.random',
//     telephone: '123456789',
//   },
//   {
//     nom: 'OFS4',
//     region: 'Ile de france',
//     departements: 'Paris, Seinte saint Denis',
//     lien: 'https://ofs.random',
//     telephone: '123456789',
//   },
// ];

// export const expectedResult = [
//   {
//     name: 'bretagne',
//     departements: [
//       {
//         name: "Cotes d'armor",
//         OFSs: [
//           {
//             nom: 'OFS1',
//             region: 'bretagne',
//             departements: "Cotes d'armor, finistere, ",
//             lien: 'https://ofs.random',
//             telephone: '123456789',
//           },
//         ],
//         totalOFSs: 1,
//       },
//       {
//         name: 'finistere',
//         OFSs: [
//           {
//             nom: 'OFS1',
//             region: 'bretagne',
//             departements: "Cotes d'armor, finistere, ",
//             lien: 'https://ofs.random',
//             telephone: '123456789',
//           },
//         ],
//         totalOFSs: 1,
//       },
//       {
//         name: 'morbihan',
//         OFSs: [
//           {
//             nom: 'OFS2',
//             region: 'bretagne',
//             departements: 'morbihan',
//             lien: 'https://ofs.random',
//             telephone: '123456789',
//           },
//         ],
//         totalOFSs: 1,
//       },
//     ],
//     totalOFSs: 3,
//   },
//   {
//     name: 'Ile de france',
//     departements: [
//       {
//         name: 'Paris',
//         OFSs: [
//           {
//             nom: 'OFS3',
//             region: 'Ile de france',
//             departements: 'Paris',
//             lien: 'https://ofs.random',
//             telephone: '123456789',
//           },
//           {
//             nom: 'OFS4',
//             region: 'Ile de france',
//             departements: 'Paris, Seinte saint Denis',
//             lien: 'https://ofs.random',
//             telephone: '123456789',
//           },
//         ],
//         totalOFSs: 2,
//       },
//       {
//         name: 'Seinte saint Denis',
//         OFSs: [
//           {
//             nom: 'OFS4',
//             region: 'Ile de france',
//             departements: 'Paris, Seinte saint Denis',
//             lien: 'https://ofs.random',
//             telephone: '123456789',
//           },
//         ],
//         totalOFSs: 1,
//       },
//     ],
//     totalOFSs: 3,
//   },
// ];
// ---------------------------------------
