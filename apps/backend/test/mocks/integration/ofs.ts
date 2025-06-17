import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { finistere, paris } from './departement';
import { bretagne } from './region';
import { distributor1 } from './distributor';

export const ofs1 = new OfsEntity(
  'La foncière de Bretagne',
  '0203040506',
  'https://boris.beta.gouv.fr',
  'ofs@bretagne.fr',
  [finistere, paris],
  [bretagne],
  [distributor1],
);

export const ofs2 = new OfsEntity(
  'La foncière de Paris',
  '0102030405',
  'https://ofs-paris.fr',
  'ofs@paris.fr',
  [paris],
  [],
  [],
);

export const mockOfsRepository = {
  save: jest.fn(),
  findAll: jest.fn(),
  findOneBy: jest.fn(),
  findById: jest.fn(),
  delete: jest.fn(),
};
