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

export const mockedBrsDiffusionWebsiteRepository = {
  save: jest.fn(),
};
