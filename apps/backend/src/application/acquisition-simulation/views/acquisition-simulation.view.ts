import { ApiProperty } from '@nestjs/swagger';
import {
  CondominiumFeesFrequency,
  HousingType,
  PtzType,
} from 'src/domain/acquisition-simulation/acquisition-simulation.interface';
import { BrsZone } from 'src/domain/brs-zone/brz-zone.type';

export class AcquisitionSimulationView {
  @ApiProperty({ example: '5d33fedc-7a06-48a4-b53d-05bf2da446dc' })
  public id: string;

  @ApiProperty({ example: 250000 })
  public housingPrice?: number;

  @ApiProperty({ example: 'A' })
  public brsZone?: BrsZone;

  @ApiProperty({ example: 75 })
  public surface?: number;

  @ApiProperty({ example: 'new' })
  public housingType?: HousingType;

  @ApiProperty({ example: 50000 })
  public ownContribution?: number;

  @ApiProperty({ example: 8000 })
  public notaryFees?: number;

  @ApiProperty({ example: 2000 })
  public oneTimeExpenses?: number;

  @ApiProperty({ example: 3.5 })
  public interestRate?: number;

  @ApiProperty({ example: 20 })
  public loanDuration?: number;

  @ApiProperty({ example: 2 })
  public inHousePeopleAmount?: number;

  @ApiProperty({ example: 45000 })
  public fiscalIncome?: number;

  @ApiProperty({ example: 'collectiv' })
  public ptzType?: PtzType;

  @ApiProperty({ example: 1500 })
  public brsFees?: number;

  @ApiProperty({ example: 1200 })
  public yearlyPropertyTax?: number;

  @ApiProperty({ example: 300 })
  public yearlyHouseingInsurance?: number;

  @ApiProperty({ example: 'monthly' })
  public condominiumFeesFrequency?: CondominiumFeesFrequency;

  @ApiProperty({ example: 150 })
  public condominiumFees?: number;

  @ApiProperty({ example: 2000 })
  public monthlyExpenses?: number;

  @ApiProperty({ example: new Date() })
  public createdAt?: Date;

  @ApiProperty({ example: new Date() })
  public updatedAt?: Date;

  constructor(
    id: string,
    housingPrice?: number,
    brsZone?: BrsZone,
    surface?: number,
    housingType?: HousingType,
    ownContribution?: number,
    notaryFees?: number,
    oneTimeExpenses?: number,
    interestRate?: number,
    loanDuration?: number,
    inHousePeopleAmount?: number,
    fiscalIncome?: number,
    ptzType?: PtzType,
    brsFees?: number,
    yearlyPropertyTax?: number,
    yearlyHouseingInsurance?: number,
    condominiumFeesFrequency?: CondominiumFeesFrequency,
    condominiumFees?: number,
    monthlyExpenses?: number,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.housingPrice = housingPrice;
    this.brsZone = brsZone;
    this.surface = surface;
    this.housingType = housingType;
    this.ownContribution = ownContribution;
    this.notaryFees = notaryFees;
    this.oneTimeExpenses = oneTimeExpenses;
    this.interestRate = interestRate;
    this.loanDuration = loanDuration;
    this.inHousePeopleAmount = inHousePeopleAmount;
    this.fiscalIncome = fiscalIncome;
    this.ptzType = ptzType;
    this.brsFees = brsFees;
    this.yearlyPropertyTax = yearlyPropertyTax;
    this.yearlyHouseingInsurance = yearlyHouseingInsurance;
    this.condominiumFeesFrequency = condominiumFeesFrequency;
    this.condominiumFees = condominiumFees;
    this.monthlyExpenses = monthlyExpenses;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
