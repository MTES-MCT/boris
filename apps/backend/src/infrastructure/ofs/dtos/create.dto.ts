import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOfsDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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
  @Transform(({ value }) => {
    return typeof value === 'boolean';
  })
  @IsBoolean()
  @IsOptional()
  public producesBrs: boolean;

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
