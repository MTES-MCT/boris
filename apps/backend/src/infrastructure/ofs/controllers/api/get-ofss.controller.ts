import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindAllOfssUsecase } from 'src/application/ofs/usecases/findAll.usecase';
import { MAX_PAGE_SIZE } from 'src/application/pagination/pagination';
import { ApiPaginatedResponse } from 'src/infrastructure/decorators/apiPaginatedResponse';
import { PaginationDTO } from 'src/infrastructure/common/dtos/pagination.dto';
import { OfsView } from 'src/application/ofs/views/ofs.view';

@Controller('api/ofss')
@ApiTags('OFS')
export class GetOfssApiController {
  constructor(private readonly findAllOfssUsecase: FindAllOfssUsecase) {}

  @Get()
  @ApiPaginatedResponse(OfsView)
  @ApiOperation({ summary: 'Récupérer tous les OFS' })
  index(@Query() { page = 1, pageSize = MAX_PAGE_SIZE }: PaginationDTO) {
    return this.findAllOfssUsecase.execute({ page, pageSize });
  }
}
