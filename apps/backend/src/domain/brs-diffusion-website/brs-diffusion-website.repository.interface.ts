import {
  BrsDiffusionWebsiteEntity,
  BrsDiffusionWebsiteEntityWithDistance,
} from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.entity';
import { PaginationProps } from '../common/paginationProps';

export interface BrsDiffusionWebsiteRepositoryInterface {
  save(
    brsDiffusionWebsite: BrsDiffusionWebsiteEntity,
  ): Promise<BrsDiffusionWebsiteEntity>;
  findAll(
    paginationProps: PaginationProps,
  ): Promise<[BrsDiffusionWebsiteEntity[], number]>;
  findById(id: string): Promise<BrsDiffusionWebsiteEntity | null>;
  delete(id: string): Promise<void>;
  findAllByLocation(
    paginationProps: PaginationProps,
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<[BrsDiffusionWebsiteEntityWithDistance[], number]>;
  findAllByBounds(
    paginationProps: PaginationProps,
    northEastLat: number,
    northEastLng: number,
    southWestLat: number,
    southWestLng: number
  ): Promise<[BrsDiffusionWebsiteEntity[], number]>;
  findAllByRegion(
    paginationProps: PaginationProps,
    regionId: string,
  ): Promise<[BrsDiffusionWebsiteEntity[], number]>;
  findAllByDepartement(
    paginationProps: PaginationProps,
    departementId: string,
  ): Promise<[BrsDiffusionWebsiteEntity[], number]>;
}
