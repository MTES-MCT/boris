import { RegionEntity } from 'src/infrastructure/region/region.entity';
import { PaginationProps } from '../pagination/paginationProps';
import { SaveRegionParams } from 'src/application/region/usecases/save.params';

export interface RegionRepositoryInterface {
  save(region: SaveRegionParams): Promise<RegionEntity>;
  findOneByName(name: string): Promise<RegionEntity | null>;
  findManyByNames(name: string[]): Promise<RegionEntity[] | []>;
  findAll(paginationProps: PaginationProps): Promise<[RegionEntity[], number]>;
}
