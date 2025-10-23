import { BrsZone } from 'src/domain/brs-zone/brz-zone.type';

export type HousingType = 'new' | 'old';
export type PtzType = 'collectif' | 'individuel';
export type CondominiumFeesFrequency = 'yearly' | 'monthly' | 'trimestrial';

export interface AcquisitionSimulationInterface {
  id: string;
  housingPrice?: number;
  brsZone?: BrsZone;
  surface?: number;
  housingType?: HousingType;
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
  createdAt: Date;
  updatedAt: Date;
}
