import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { finistere, paris } from './departement';
import { bretagne } from './region';

export const ofs1 = new OfsEntity(
  'La foncière de Bretagne',
  '0203040506',
  'https://boris.beta.gouv.fr',
  'ofs@bretagne.fr',
  [finistere, paris],
  [bretagne],
  [],
);

export const mockOfsRepository = {
  save: jest.fn(),
};

export const e2eOfss = {};
