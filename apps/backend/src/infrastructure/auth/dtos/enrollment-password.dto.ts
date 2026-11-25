import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class EnrollmentPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  currentPassword: string;
}
