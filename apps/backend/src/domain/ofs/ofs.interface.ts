import { DepartementInterface } from '../departement/departement.interface';
import { DistributorInterface } from '../distributor/distributor.interface';
import { RegionInterface } from '../region/region.interface';

export interface OfsInterface {
  id?: string;
  name: string;
  phone: string | null;
  websiteUrl: string | null;
  email: string | null;
  regions: RegionInterface[];
  departements: DepartementInterface[];
  distributors: DistributorInterface[];
}
