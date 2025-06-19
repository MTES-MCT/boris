import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';

export const distributor1 = new DistributorEntity(
  'Commercialisateur de bretagne',
  'https://boris.beta.gouv.fr',
  [],
);

export const distributor2 = new DistributorEntity(
  'Commercialisateur de normandie',
  'https://boris.beta.gouv.fr',
  [],
);

export const mockDistributorRepository = {
  save: jest.fn(),
  findBy: jest.fn(),
  findAll: jest.fn(),
  findManyByIds: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};
