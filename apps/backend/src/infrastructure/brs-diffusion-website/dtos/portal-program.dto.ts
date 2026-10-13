import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
} from 'class-validator';
import { BrsHousingType } from 'src/domain/brs-diffusion-website/brs-diffusion-website.interface';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;
const optional = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() || null : value;

export class PortalProgramDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  public programName: string;

  @Transform(trim)
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  public source: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  public address: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  public city: string;

  @Transform(optional)
  @IsOptional()
  @Matches(/^[0-9][0-9ABab][0-9]{3}$/)
  public inseeCode?: string | null;

  @Transform(optional)
  @IsOptional()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/)
  public deliveryMonth?: string | null;

  @Transform(optional)
  @IsOptional()
  @IsUUID()
  public distributorId?: string | null;

  @IsIn(['new', 'old'])
  public housingType: BrsHousingType = 'new';
}
