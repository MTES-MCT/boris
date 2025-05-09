import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllOfssUsecase } from 'src/application/ofs/usecases/getAll.usecase';
import { MAX_PAGE_SIZE } from 'src/application/pagination/pagination';
import { PaginationDTO } from 'src/infrastructure/pagination/pagination.dto';

@Controller('api/ofss')
@ApiTags('OFS')
export class GetAllController {
  constructor(private readonly getAllOfssUsecase: GetAllOfssUsecase) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les OFS' })
  public index(@Query() { page = 1, pageSize = MAX_PAGE_SIZE }: PaginationDTO) {
    return this.getAllOfssUsecase.execute({ page, pageSize });
  }
}
