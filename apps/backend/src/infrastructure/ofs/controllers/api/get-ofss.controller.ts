import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FindAllOfssUsecase } from 'src/application/ofs/usecases/findAll.usecase';
import { MAX_PAGE_SIZE } from 'src/application/common/pagination';
import { ApiPaginatedResponse } from 'src/infrastructure/decorators/apiPaginatedResponse';
import { PaginationDTO } from 'src/infrastructure/common/dtos/pagination.dto';
import { OfsView } from 'src/application/ofs/views/ofs.view';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';

@Controller('api/ofss')
@ApiTags('OFS')
export class GetOfssApiController {
  constructor(private readonly findAllOfssUsecase: FindAllOfssUsecase) {}

  @Get()
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiPaginatedResponse(OfsView)
  @ApiOperation({ summary: 'Récupérer tous les OFS' })
  index(@Query() { page = 1, pageSize = MAX_PAGE_SIZE }: PaginationDTO) {
    return this.findAllOfssUsecase.execute({ page, pageSize });
  }
}
