import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { DepartementInterface } from './departement.interface';

export interface DepartementRepositoryInterface {
  save(departement: DepartementInterface): Promise<DepartementEntity>;
  findOneByName(name: string): Promise<DepartementEntity | null>;
  findOneByCode(code: string): Promise<DepartementEntity | null>;
}
