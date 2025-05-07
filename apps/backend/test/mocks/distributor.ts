import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';

export const distributor1 = new DistributorEntity(
  'Commercialisateur de bretagne',
  'https://boris.beta.gouv.fr',
  [],
);

export const mockDistributorRepository = {
  // save: jest.fn(),
};
