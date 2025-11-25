import { DepartementInterface } from '../departement/departement.interface';
import { OfsInterface } from '../ofs/ofs.interface';

export type RegionCode =
  | '01'
  | '02'
  | '03'
  | '04'
  | '06'
  | '11'
  | '24'
  | '27'
  | '28'
  | '32'
  | '44'
  | '52'
  | '53'
  | '75'
  | '76'
  | '84'
  | '93'
  | '94';

export interface RegionInterface {
  id?: string;
  name: string;
  departements: DepartementInterface[];
  code: RegionCode;
  ofss: OfsInterface[];
  createdAt: Date;
  updatedAt: Date;
}
