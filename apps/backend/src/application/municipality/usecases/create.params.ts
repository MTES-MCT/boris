import { BrsZone } from 'src/domain/brs-zone/brz-zone.type';

export interface CreateMunicipalityParams {
  name: string;
  inseeCode: string;
  zone: BrsZone;
}
