import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { bretagne } from './region';

export const finistere = new DepartementEntity('Finistère', '29', bretagne);
export const paris = new DepartementEntity('Paris', '75', bretagne);

export const mockDepartementRepository = {
  save: jest.fn(),
  findOneBy: jest.fn(),
  findOneByName: jest.fn(),
  findOneByCode: jest.fn(),
};
