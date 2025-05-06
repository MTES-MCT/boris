import { DepartementInterface } from '../departement/departement.interface';
import { RegionInterface } from '../region/region.interface';

export interface OfsInterface {
  id?: string;
  name: string;
  phone: string;
  websiteUrl: string;
  region?: RegionInterface;
  departements?: DepartementInterface[];
}
