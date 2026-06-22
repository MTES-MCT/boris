import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  public currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(12)
  public newPassword: string;
}
