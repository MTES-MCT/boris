import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class InviteDistributorDto {
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  @MaxLength(200)
  name: string;
  @IsEmail() @MaxLength(254) email: string;
}
export class LinkDistributorDto {
  @IsUUID() distributorId: string;
}
export class AcceptDistributorInvitationDto {
  @IsString() @MinLength(40) @MaxLength(100) token: string;
  @IsOptional() @IsString() @MinLength(12) @MaxLength(128) password?: string;
  @IsOptional() @IsUUID() distributorId?: string;
  @IsOptional() @IsBoolean() createNew?: boolean;
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10000)
  @IsUUID('all', { each: true })
  reviewedMatchIds?: string[];
}
