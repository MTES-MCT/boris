import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class SaveOfsDTO {
  @ApiProperty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public websiteUrl: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public email: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public departementNames: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public regionNames: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public distributorIds: string[];
}
