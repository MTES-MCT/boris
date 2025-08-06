import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBrsDiffusionWebsiteDTO {
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
}
