import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
