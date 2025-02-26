import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';

export interface DepartementRepositoryInterface {
  save(departement: DepartementEntity): Promise<DepartementEntity>;
}
