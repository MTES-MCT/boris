import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { HousingType } from 'src/domain/acquisition-simulation/acquisition-simulation.interface';
import { BrsZone } from 'src/domain/brs-zone/brz-zone.type';

export class CreateAcquisitionSimulationDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  public housingPrice: number;

  @ApiProperty()
  @IsIn(['A', 'Abis', 'B1', 'B2', 'C'])
  @IsNotEmpty()
  public brsZone: BrsZone;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  public surface: number;

  @ApiProperty()
  @IsIn(['new', 'old'])
  @IsNotEmpty()
  public housingType: HousingType;
}
