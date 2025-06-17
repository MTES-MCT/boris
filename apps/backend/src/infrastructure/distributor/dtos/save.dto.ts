import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SaveDistriburorDTO {
  @ApiProperty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public websiteUrl: string;
}
