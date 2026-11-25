import { IsString, Matches } from 'class-validator';
import { EnrollmentPasswordDto } from './enrollment-password.dto';

export class DisableTwoFactorDto extends EnrollmentPasswordDto {
  @IsString()
  @Matches(/^[0-9]{6}$/)
  code: string;
}
