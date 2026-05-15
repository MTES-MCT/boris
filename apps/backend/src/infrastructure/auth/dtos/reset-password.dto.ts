import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  public token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(12)
  public password: string;
}
