import { IsString, MaxLength, MinLength } from 'class-validator';

export class TwoFactorCodeDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  public code: string;
}
