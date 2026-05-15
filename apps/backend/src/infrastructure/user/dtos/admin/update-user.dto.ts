import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from 'src/domain/user/user-role.enum';

const normalizeOfsIds = ({ value }: { value?: string | string[] }) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return Array.isArray(value) ? value : [value];
};

export class UpdateUserDTO {
  @IsEmail()
  public email: string;

  @IsEnum(UserRole)
  public role: UserRole;

  @Transform(normalizeOfsIds)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public ofsIds?: string[];
}
