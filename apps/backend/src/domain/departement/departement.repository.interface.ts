import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';

export interface DepartementRepositoryInterface {
  save(departement: DepartementEntity): Promise<DepartementEntity>;
  findOneByName(name: string): Promise<DepartementEntity | null>;
  findOneByCode(code: string): Promise<DepartementEntity | null>;
}
