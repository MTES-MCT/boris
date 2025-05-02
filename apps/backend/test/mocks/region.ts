import { RegionEntity } from 'src/infrastructure/region/region.entity';

export const bretagne = new RegionEntity('Bretagne');
export const ileDeFrance = new RegionEntity('Île de France');

export const mockRegionRepository = {
  save: jest.fn(),
  findOneBy: jest.fn(),
  findBy: jest.fn(),
  findOneByName: jest.fn(),
  findManyByNames: jest.fn(),
};
