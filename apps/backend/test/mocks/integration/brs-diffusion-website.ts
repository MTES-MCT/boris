import { BrsDiffusionWebsiteEntity } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.entity';
import { bretagne } from './region';
import { finistere } from './departement';

export const mockedBrsDiffusionWebsite = new BrsDiffusionWebsiteEntity(
  'https://source.fr',
  'Commercialisateur',
  'OFS',
  'Quimper',
  '29000',
  '29, Finistère, Bretagne',
  '29',
  48.111111,
  4.111111,
  bretagne,
  finistere,
);

export const mockedBrsDiffusionWebsiteRawWithDistance = {
  brs_diffusion_website_id: 'a4bd26b9-c2da-4eb0-b6de-9ea5d9df67e7',
  brs_diffusion_website_source: 'https://www.archipel-habitat.fr/programmes/',
  brs_diffusion_website_distributorName: 'Archipel Habitat',
  brs_diffusion_website_ofsName: 'Archipel Habitat',
  brs_diffusion_website_city: 'Troyes',
  brs_diffusion_website_zipcode: '10000',
  brs_diffusion_website_address: '10, Aube, Grand Est',
  brs_diffusion_website_inseeCode: '10387',
  brs_diffusion_website_latitude: 48.292817,
  brs_diffusion_website_longitude: 4.075149,
  brs_diffusion_website_createdAt: new Date('2025-08-06T14:39:16.603Z'),
  brs_diffusion_website_updatedAt: new Date('2025-08-06T14:39:16.603Z'),
  brs_diffusion_website_regionId: 'be589f1d-5d3a-4686-9aed-6285ceba4388',
  brs_diffusion_website_departementId: 'd577598e-e00c-4493-8baf-9eda51e877dd',
  region_id: 'be589f1d-5d3a-4686-9aed-6285ceba4388',
  region_name: 'Grand Est',
  region_createdAt: new Date('2025-06-19T07:51:42.242Z'),
  region_updatedAt: new Date('2025-06-19T07:51:42.242Z'),
  departement_id: 'd577598e-e00c-4493-8baf-9eda51e877dd',
  departement_name: 'Aube',
  departement_code: '10',
  departement_createdAt: new Date('2025-06-19T07:51:42.245Z'),
  departement_updatedAt: new Date('2025-06-19T07:51:42.245Z'),
  departement_regionId: 'be589f1d-5d3a-4686-9aed-6285ceba4388',
  distance: 141640.13685538957,
};

export const mockedBrsDiffusionWebsiteRepository = {
  save: jest.fn(),
  findAll: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  }),
  findOne: jest.fn(),
  findById: jest.fn(),
  delete: jest.fn(),
  findAllByLocation: jest.fn(),
  findAllByRegion: jest.fn(),
  findAllByDepartement: jest.fn(),
};
