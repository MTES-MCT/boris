import { IsOptional, IsString } from 'class-validator';
import { PaginationDTO } from 'src/infrastructure/common/dtos/pagination.dto';

export class AdminProgramsFiltersDTO extends PaginationDTO {
  @IsString()
  @IsOptional()
  public search?: string;
}
