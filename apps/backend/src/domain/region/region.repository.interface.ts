import { RegionEntity } from 'src/infrastructure/region/region.entity';
import { RegionInterface } from './region.interface';

export interface RegionRepositoryInterface {
  save(region: RegionInterface): Promise<RegionEntity>;
  findOneByName(name: string): Promise<RegionEntity | null>;
  findManyByNames(name: string[]): Promise<RegionEntity[] | []>;
}
