import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDTO } from 'src/infrastructure/common/dtos/pagination.dto';

export class PortalContactFiltersDto extends PaginationDTO {
  @IsOptional()
  @IsString()
  public location?: string;

  @IsOptional()
  @IsString()
  public contact?: string;
}

export class DistributorPortalContactFiltersDto extends PaginationDTO {
  @IsOptional()
  @IsUUID()
  public ofsId?: string;
}

export class ExportPortalContactFiltersDto {
  @IsOptional()
  @IsString()
  public location?: string;

  @IsOptional()
  @IsString()
  public contact?: string;

  @IsOptional()
  @IsDateString()
  public startDate?: string;

  @IsOptional()
  @IsDateString()
  public endDate?: string;
}
