import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { BrsHousingType } from 'src/domain/brs-diffusion-website/brs-diffusion-website.interface';

const emptyStringToUndefined = ({ value }: { value?: string }) =>
  value === '' ? undefined : value;

const emptyStringToNull = ({ value }: { value?: string }) =>
  value === '' ? null : value;

export class UpdateBrsDiffusionWebsiteDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public source: string;

  @ApiProperty({ required: false, nullable: true })
  @Transform(emptyStringToNull)
  @IsString()
  @IsOptional()
  public distributorName?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @Transform(emptyStringToNull)
  @IsString()
  @IsOptional()
  public ofsName?: string | null;

  @ApiProperty({ required: false })
  @Transform(emptyStringToUndefined)
  @IsString()
  @IsOptional()
  public programName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public address: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public inseeCode?: string;

  @ApiProperty({ required: false, example: '2027-03' })
  @Transform(emptyStringToUndefined)
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/)
  @IsOptional()
  public deliveryMonth?: string;

  @ApiProperty({ required: false })
  @Transform(emptyStringToNull)
  @IsUUID()
  @IsOptional()
  public ofsId?: string | null;

  @ApiProperty({ required: false })
  @Transform(emptyStringToNull)
  @IsUUID()
  @IsOptional()
  public distributorId?: string | null;

  @ApiProperty({ enum: ['new', 'old'] })
  @IsIn(['new', 'old'])
  public housingType: BrsHousingType;
}
