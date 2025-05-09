import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'src/application/pagination/pagination';
import { PaginationDTO } from 'src/infrastructure/pagination/pagination.dto';

@Controller('api/ofss')
@ApiTags('OFS')
export class GetOfssController {
  constructor() {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les OFS' })
  public index(@Query() { page, pageSize }: PaginationDTO) {
    console.log(page);
    console.log(pageSize);
    return new Pagination([1, 2, 3, 4, 5], 5, { page: 1, pageSize: 2 });
  }
}
