import { DepartementInterface } from '../departement/departement.interface';
import { OfsInterface } from '../ofs/ofs.interface';

export interface RegionInterface {
  id?: string;
  name: string;
  departements: DepartementInterface[];
  ofss: OfsInterface[];
  createdAt: Date;
  updatedAt: Date;
}
