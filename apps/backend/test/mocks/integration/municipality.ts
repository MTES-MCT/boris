import { MunicipalityEntity } from 'src/infrastructure/municipality/municipality.entity';
import { paris, finistere } from './departement';

export const parisMunicipality = new MunicipalityEntity(
  'Paris',
  '75056',
  'A',
  paris,
);
export const quimperMunicipality = new MunicipalityEntity(
  'Quimper',
  '29232',
  'A',
  finistere,
);

export const mockMunicipalityRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
  findOneByInseeCode: jest.fn(),
};
