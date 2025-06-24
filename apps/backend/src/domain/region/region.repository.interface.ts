import { RegionEntity } from 'src/infrastructure/region/region.entity';
import { PaginationProps } from '../common/paginationProps';

export interface RegionRepositoryInterface {
  save(region: RegionEntity): Promise<RegionEntity>;
  findOneByName(name: string): Promise<RegionEntity | null>;
  findManyByNames(name: string[]): Promise<RegionEntity[] | []>;
  findAll(paginationProps: PaginationProps): Promise<[RegionEntity[], number]>;
}
