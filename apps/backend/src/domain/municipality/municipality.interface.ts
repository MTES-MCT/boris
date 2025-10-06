import { BrsZone } from '../brs-zone/brz-zone.type';
import { DepartementInterface } from '../departement/departement.interface';

export interface MunicipalityInterface {
  id?: string;
  name: string;
  departement: DepartementInterface;
  inseeCode: string;
  zone: BrsZone;
  createdAt: Date;
  updatedAt: Date;
}
