import { HousingType } from 'src/domain/acquisition-simulation/acquisition-simulation.interface';
import { BrsZone } from 'src/domain/brs-zone/brz-zone.type';

export interface CreateAcquisitionSimulationParams {
  housingPrice: number;
  brsZone: BrsZone;
  surface: number;
  housingType: HousingType;
}
