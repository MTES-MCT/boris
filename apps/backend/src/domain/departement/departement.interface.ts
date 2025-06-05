import { OfsInterface } from '../ofs/ofs.interface';
import { RegionInterface } from '../region/region.interface';

export interface DepartementInterface {
  id?: string;
  name: string;
  code: string;
  region: RegionInterface;
  ofss: OfsInterface[];
  createdAt: Date;
  updatedAt: Date;
}
