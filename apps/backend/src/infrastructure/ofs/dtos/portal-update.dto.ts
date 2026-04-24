import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

const trimValue = ({ value }: { value?: string }) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();

  return trimmed === '' ? undefined : trimmed;
};

export class PortalUpdateOfsDto {
  @Transform(trimValue)
  @IsString()
  @IsNotEmpty()
  public name: string;

  @Transform(trimValue)
  @IsEmail()
  @IsOptional()
  public email?: string;

  @Transform(trimValue)
  @IsString()
  @IsOptional()
  public phone?: string;

  @Transform(trimValue)
  @IsUrl({ require_protocol: true })
  @IsOptional()
  public websiteUrl?: string;
}
