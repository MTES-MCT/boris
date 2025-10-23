import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
import {
  CondominiumFeesFrequency,
  HousingType,
  PtzType,
} from 'src/domain/acquisition-simulation/acquisition-simulation.interface';
import { BrsZone } from 'src/domain/brs-zone/brz-zone.type';

export class UpdateAcquisitionSimulationDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public housingPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['A', 'Abis', 'B1', 'B2', 'C'])
  public brsZone?: BrsZone;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public surface?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['new', 'old'])
  public housingType?: HousingType;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(-1)
  public ownContribution?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public notaryFees?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(-1)
  public oneTimeExpenses?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public interestRate?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public loanDuration?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public inHousePeopleAmount?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(-1)
  public fiscalIncome?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['collectif', 'individuel'])
  public ptzType?: PtzType;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  public brsFees?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(-1)
  public yearlyPropertyTax?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(-1)
  public yearlyHouseingInsurance?: number;

  @ApiPropertyOptional()
  @IsIn(['yearly', 'monthly', 'trimestrial'])
  @IsOptional()
  public condominiumFeesFrequency?: CondominiumFeesFrequency;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(-1)
  public condominiumFees?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(-1)
  public monthlyExpenses?: number;
}
