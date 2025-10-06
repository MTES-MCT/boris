import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetMunicipalityByInseeCodeDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public inseeCode: string;
}
