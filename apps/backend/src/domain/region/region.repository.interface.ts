import { RegionEntity } from 'src/infrastructure/region/region.entity';
import { RegionInterface } from './region.interface';

export interface RegionRepositoryInterface {
  save(region: RegionInterface): Promise<RegionEntity>;
  findByName(name: string): Promise<RegionEntity | null>;
}
