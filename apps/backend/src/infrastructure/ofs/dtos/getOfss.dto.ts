import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationDTO } from 'src/infrastructure/common/dtos/pagination.dto';

export class GetOfssDTO extends PaginationDTO {
  @ApiProperty()
  @Transform(({ value }) => {
    return value == 'true';
  })
  @IsBoolean()
  @IsOptional()
  public isPartner?: string | boolean;
}
