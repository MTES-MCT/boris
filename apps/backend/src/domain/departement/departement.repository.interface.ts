import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { PaginationProps } from '../common/paginationProps';

export interface DepartementRepositoryInterface {
  save(departement: DepartementEntity): Promise<DepartementEntity>;
  findOneByName(name: string): Promise<DepartementEntity | null>;
  findOneByCode(code: string): Promise<DepartementEntity | null>;
  findManyByNames(name: string[]): Promise<DepartementEntity[] | []>;
  findOneByInseeCode(inseeCode: string): Promise<DepartementEntity | null>;
  findAll(
    paginationProps: PaginationProps,
  ): Promise<[DepartementEntity[], number]>;
}
