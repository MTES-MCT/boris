import { LocationInterface } from '../location/location.interface';
import { OfsInterface } from '../ofs/ofs.interface';
import { RegionInterface } from '../region/region.interface';

export interface DepartementInterface {
  id?: string;
  name: string;
  code: string;
  region: RegionInterface;
  ofss: OfsInterface[];
  locations: LocationInterface[];
  createdAt: Date;
  updatedAt: Date;
}
