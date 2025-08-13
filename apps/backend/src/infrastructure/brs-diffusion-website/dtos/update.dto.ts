import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBrsDiffusionWebsiteDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public source: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public distributorName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public ofsName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public city: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public inseeCode: string;
}
