import { DepartementInterface } from '../departement/departement.interface';
import { RegionInterface } from '../region/region.interface';

export interface BrsDiffusionWebsiteInterface {
  id?: string;
  source: string;
  distributorName: string;
  ofsName: string;
  city: string;
  zipcode: string;
  address: string;
  inseeCode: string;
  latitude: number;
  longitude: number;
  region: RegionInterface;
  departement: DepartementInterface;
}
