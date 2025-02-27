import { DepartementInterface } from '../departement/departement.interface';

export interface RegionInterface {
  id?: string;
  name: string;
  departements?: DepartementInterface[];
}
