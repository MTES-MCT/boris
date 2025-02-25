import { RegionInterface } from './region.interface';

export interface RegionRepositoryInterface {
  save(region: RegionInterface): Promise<RegionInterface>;
}
