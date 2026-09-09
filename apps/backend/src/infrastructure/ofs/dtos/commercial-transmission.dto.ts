import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { CommercialTransmissionScopeType } from '../commercial-transmission.entity';

export class CreateCommercialTransmissionDto {
  @IsUUID()
  public distributorId: string;

  @IsOptional()
  @IsEnum(CommercialTransmissionScopeType)
  public scopeType?: CommercialTransmissionScopeType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public inseeCodes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public departementCodes?: string[];

  @IsOptional()
  @IsBoolean()
  public isActive?: boolean;
}

export class UpdateCommercialTransmissionDto {
  @IsOptional()
  @IsEnum(CommercialTransmissionScopeType)
  public scopeType?: CommercialTransmissionScopeType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public inseeCodes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public departementCodes?: string[];

  @IsOptional()
  @IsBoolean()
  public isActive?: boolean;
}
