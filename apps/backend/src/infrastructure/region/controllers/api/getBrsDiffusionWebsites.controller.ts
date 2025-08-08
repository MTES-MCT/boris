import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MAX_PAGE_SIZE } from 'src/application/common/pagination';
import { ApiPaginatedResponse } from 'src/infrastructure/decorators/apiPaginatedResponse';
import { PaginationDTO } from 'src/infrastructure/common/dtos/pagination.dto';
import { BrsDiffusionWebsiteView } from 'src/application/brs-diffusion-website/views/brs-diffusion-website.view';
import { IdDTO } from 'src/infrastructure/common/dtos/id.dto';
import { FindAllBrsDiffusionWebsitesByRegionUsecase } from 'src/application/brs-diffusion-website/usecases/findAllByRegion.usecase';

@Controller('api/regions')
@ApiTags('Sites web de diffusion BRS')
export class GetBrsDiffusionWebsitesByRegionApiController {
  constructor(
    private readonly findAllBrsDiffusionWebsitesByRegionUsecase: FindAllBrsDiffusionWebsitesByRegionUsecase,
  ) {}

  @Get(':id/brs-diffusion-websites')
  @ApiPaginatedResponse(BrsDiffusionWebsiteView)
  @ApiOperation({
    summary: 'Récupérer tous les sites web de diffusion BRS par région',
  })
  index(
    @Query() { page = 1, pageSize = MAX_PAGE_SIZE }: PaginationDTO,
    @Param() { id }: IdDTO,
  ) {
    return this.findAllBrsDiffusionWebsitesByRegionUsecase.execute({
      page,
      pageSize,
      regionId: id,
    });
  }
}
