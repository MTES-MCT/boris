import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AccountNameDto {
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @MaxLength(100)
  firstName?: string | null;
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @MaxLength(100)
  lastName?: string | null;
}
export class InviteOfsMemberDto {
  @IsEmail() @MaxLength(254) email: string;
}
export class InspectOfsInvitationDto {
  @IsString() @MinLength(40) @MaxLength(100) token: string;
}
export class AcceptOfsInvitationDto extends InspectOfsInvitationDto {
  @IsOptional() @IsString() @MinLength(12) @MaxLength(128) password?: string;
  @IsOptional() @IsString() @MaxLength(100) firstName?: string;
  @IsOptional() @IsString() @MaxLength(100) lastName?: string;
}
