import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString, Min } from 'class-validator';
import { UsersSort } from 'src/domain/user/user.repository.interface';
import { MAX_PAGE_SIZE } from 'src/application/common/pagination';
import { IsInt, Max } from 'class-validator';

export class UsersFiltersDTO {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  public page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  @IsOptional()
  public pageSize?: number = MAX_PAGE_SIZE;

  @IsString()
  @IsOptional()
  public role?: string;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @IsBoolean()
  @IsOptional()
  public isActive?: boolean;

  @IsString()
  @IsOptional()
  public ofsId?: string;

  @IsString()
  @IsOptional()
  public search?: string;

  @IsIn(['email', 'lastLoginAtDesc', 'lastLoginAtAsc'])
  @IsOptional()
  public sort?: UsersSort;
}
