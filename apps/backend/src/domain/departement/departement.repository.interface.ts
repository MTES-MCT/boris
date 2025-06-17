import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { PaginationProps } from '../pagination/paginationProps';

export interface DepartementRepositoryInterface {
  save(departement: DepartementEntity): Promise<DepartementEntity>;
  findOneByName(name: string): Promise<DepartementEntity | null>;
  findOneByCode(code: string): Promise<DepartementEntity | null>;
  findManyByNames(name: string[]): Promise<DepartementEntity[] | []>;
  findAll(
    paginationProps: PaginationProps,
  ): Promise<[DepartementEntity[], number]>;
}
