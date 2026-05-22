import { DepartementInterface } from '../departement/departement.interface';
import { RegionInterface } from '../region/region.interface';

export interface BrsDiffusionWebsiteInterface {
  id?: string;
  source: string;
  distributorName: string;
  ofsName: string;
  programName?: string | null;
  city: string;
  zipcode: string;
  address: string;
  inseeCode: string;
  deliveryMonth?: string | null;
  latitude: number;
  longitude: number;
  region: RegionInterface;
  departement: DepartementInterface;
}
