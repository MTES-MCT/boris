import {
  CondominiumFeesFrequency,
  HousingType,
  PtzType,
} from 'src/domain/acquisition-simulation/acquisition-simulation.interface';
import { BrsZone } from 'src/domain/brs-zone/brz-zone.type';

export interface UpdateAcquisitionSimulationParams {
  housingPrice?: number;
  brsZone?: BrsZone;
  surface?: number;
  housingType?: HousingType;
  id: string;
  ownContribution?: number;
  notaryFees?: number;
  oneTimeExpenses?: number;
  interestRate?: number;
  loanDuration?: number;
  inHousePeopleAmount?: number;
  fiscalIncome?: number;
  ptzType?: PtzType;
  brsFees?: number;
  yearlyPropertyTax?: number;
  yearlyHouseingInsurance?: number;
  condominiumFeesFrequency?: CondominiumFeesFrequency;
  condominiumFees?: number;
  monthlyExpenses?: number;
}
