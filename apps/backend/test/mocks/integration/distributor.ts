import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';

export const distributor1 = new DistributorEntity(
  'Commercialisateur de bretagne',
  'https://boris.beta.gouv.fr',
  [],
);

export const distributor2 = new DistributorEntity(
  "Commercialisateur d'Ile-de-France",
  'https://idf.beta.gouv.fr',
  [],
);

export const mockDistributorRepository = {
  save: jest.fn(),
  findBy: jest.fn(),
  findAll: jest.fn(),
  findManyByIds: jest.fn(),
};
