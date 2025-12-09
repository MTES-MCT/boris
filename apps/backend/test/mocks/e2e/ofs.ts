import { OfsView } from 'src/application/ofs/views/ofs.view';
import { MAX_PAGE_SIZE, Pagination } from 'src/application/common/pagination';

export const ofss: Pagination<OfsView> = {
  items: [
    {
      id: expect.any(String),
      name: 'Archipel Habitat',
      websiteUrl:
        'https://www.archipel-habitat.fr/trouver-un-logement/acheter-un-logement/programmes-en-cours',
      phone: null,
      email: null,
      producesBrs: false,
      isPartner: false,
      departements: [
        {
          code: '35',
          id: expect.any(String),
          name: 'Ille-et-Vilaine',
        },
      ],
      regions: [
        {
          id: expect.any(String),
          name: 'Bretagne',
        },
      ],
      distributors: [],
    },
    {
      id: expect.any(String),
      name: 'La Coop Foncière Bretonne ',
      websiteUrl: null,
      phone: null,
      email: null,
      producesBrs: false,
      isPartner: false,
      departements: [
        {
          code: '29',
          id: expect.any(String),
          name: 'Finistère',
        },
      ],
      regions: [
        {
          id: expect.any(String),
          name: 'Bretagne',
        },
      ],
      distributors: [
        {
          id: expect.any(String),
          name: 'Maison Familiale de Quimper',
          websiteUrl: 'https://maison-familiale-de-quimper.fr/',
        },
        {
          id: expect.any(String),
          name: 'Grand Delta Habitat',
          websiteUrl: 'https://www.granddelta.fr/',
        },
      ],
    },
  ],
  totalCount: 2,
  page: 1,
  pageSize: MAX_PAGE_SIZE,
  pagesCount: 1,
  hasPreviousPage: false,
  hasNextPage: false,
};
