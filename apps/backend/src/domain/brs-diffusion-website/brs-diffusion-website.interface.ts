import { DepartementInterface } from '../departement/departement.interface';
import { DistributorInterface } from '../distributor/distributor.interface';
import { OfsInterface } from '../ofs/ofs.interface';
import { RegionInterface } from '../region/region.interface';

export type BrsHousingType = 'new' | 'old';

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
  ofs?: OfsInterface | null;
  distributor?: DistributorInterface | null;
  housingType: BrsHousingType;
}
