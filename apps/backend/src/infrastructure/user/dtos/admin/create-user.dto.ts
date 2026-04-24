import { Transform } from 'class-transformer';
import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

const normalizeOfsIds = ({ value }: { value?: string | string[] }) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return Array.isArray(value) ? value : [value];
};

export class CreateUserDTO {
  @IsEmail()
  public email: string;

  @IsString()
  public role: string;

  @Transform(normalizeOfsIds)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public ofsIds?: string[];
}
