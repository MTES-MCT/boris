import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';

export const finistere = new DepartementEntity('Finistère', 29);
export const paris = new DepartementEntity('Paris', 75);

export const mockDepartementRepository = {
  save: jest.fn(),
  findOneBy: jest.fn(),
  findOneByName: jest.fn(),
  findOneByZipcode: jest.fn(),
};
