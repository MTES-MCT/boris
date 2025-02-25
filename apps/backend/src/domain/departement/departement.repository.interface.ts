import { DepartementInterface } from './departement.interface';

export interface DepartementRepositoryInterface {
  save(departement: DepartementInterface): Promise<DepartementInterface>;
}
