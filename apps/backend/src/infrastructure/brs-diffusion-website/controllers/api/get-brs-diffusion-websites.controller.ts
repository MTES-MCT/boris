import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MAX_PAGE_SIZE } from 'src/application/common/pagination';
import { ApiPaginatedResponse } from 'src/infrastructure/decorators/apiPaginatedResponse';
import { PaginationDTO } from 'src/infrastructure/common/dtos/pagination.dto';
import { FindAllBrsDiffusionWebsitesUsecase } from 'src/application/brs-diffusion-website/usecases/findAll.usecase';
import { BrsDiffusionWebsiteView } from 'src/application/brs-diffusion-website/views/brs-diffusion-website.view';

@Controller('api/brs-diffusion-websites')
@ApiTags('Sites web de diffusion BRS')
export class GetBrsDiffusionWebsitesApiController {
  constructor(
    private readonly findAllBrsDiffusionWebsitesUsecase: FindAllBrsDiffusionWebsitesUsecase,
  ) {}

  @Get()
  @ApiPaginatedResponse(BrsDiffusionWebsiteView)
  @ApiOperation({ summary: 'Récupérer tous les sites web de diffusion BRS' })
  index(@Query() { page = 1, pageSize = MAX_PAGE_SIZE }: PaginationDTO) {
    return this.findAllBrsDiffusionWebsitesUsecase.execute({ page, pageSize });
  }
}
