import { RegionEntity } from 'src/infrastructure/region/region.entity';
import { OfsInterface } from '../ofs/ofs.interface';

export interface DepartementInterface {
  id?: string;
  name: string;
  code: string;
  region: RegionEntity;
  ofss: OfsInterface[];
}
