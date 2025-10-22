import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsPositive } from 'class-validator';
import {
  CondominiumFeesFrequency,
  HousingType,
  PtzType,
} from 'src/domain/acquisition-simulation/acquisition-simulation.interface';
import { BrsZone } from 'src/domain/brs-zone/brz-zone.type';

export class UpdateAcquisitionSimulationDTO {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public housingPrice?: number;

  @ApiProperty()
  @IsOptional()
  @IsIn(['A', 'Abis', 'B1', 'B2', 'C'])
  public brsZone?: BrsZone;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public surface?: number;

  @ApiProperty()
  @IsOptional()
  @IsIn(['new', 'old'])
  public housingType?: HousingType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public ownContribution?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public notaryFees?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public oneTimeExpenses?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public interestRate?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public loanDuration?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public inHousePeopleAmount?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public fiscalIncome?: number;

  @ApiProperty()
  @IsOptional()
  @IsIn(['collectif', 'individuel'])
  public ptzType?: PtzType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public brsFees?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public yearlyPropertyTax?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public yearlyHouseingInsurance?: number;

  @ApiProperty()
  @IsIn(['yearly', 'monthly', 'trimestrial'])
  @IsOptional()
  public condominiumFeesFrequency?: CondominiumFeesFrequency;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public condominiumFees?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public monthlyExpenses?: number;
}
