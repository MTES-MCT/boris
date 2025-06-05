import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';
import { PaginationProps } from '../pagination/paginationProps';

export interface DistributorRepositoryInterface {
  save(distributor: DistributorEntity): Promise<DistributorEntity>;
  findAll(
    paginationProps: PaginationProps,
  ): Promise<[DistributorEntity[], number]>;
  findManyByIds(ids: string[]): Promise<DistributorEntity[]>;
}
