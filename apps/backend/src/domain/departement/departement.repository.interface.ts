import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';

export interface DepartementRepositoryInterface {
  save(departement: DepartementEntity): Promise<DepartementEntity>;
  findOneByName(name: string): Promise<DepartementEntity | null>;
  findOneByZipcode(zipcode: number): Promise<DepartementEntity | null>;
}
