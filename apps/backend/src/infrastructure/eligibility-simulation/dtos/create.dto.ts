import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateEligibilitySimulationDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  public householdSize: number;

  @ApiProperty()
  @Transform(({ value }) => {
    return typeof value === 'boolean';
  })
  @IsBoolean()
  @IsOptional()
  public hasDisablity?: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public dependantsAmount?: number;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  public birthday?: Date;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  public coBuyerBirthday?: Date;
}
