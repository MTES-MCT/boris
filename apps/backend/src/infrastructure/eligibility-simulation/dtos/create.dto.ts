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
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      if (value.toLowerCase() === 'true') return true;
      if (value.toLowerCase() === 'false') return false;
    }
    return undefined;
  })
  @IsBoolean()
  @IsOptional()
  public hasDisability?: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
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
