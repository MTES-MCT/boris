import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MAX_PAGE_SIZE } from 'src/application/common/pagination';
import { ApiPaginatedResponse } from 'src/infrastructure/decorators/apiPaginatedResponse';
import { PaginationDTO } from 'src/infrastructure/common/dtos/pagination.dto';
import { BrsDiffusionWebsiteView } from 'src/application/brs-diffusion-website/views/brs-diffusion-website.view';
import { IdDTO } from 'src/infrastructure/common/dtos/id.dto';
import { FindAllBrsDiffusionWebsitesByDepartementUsecase } from 'src/application/brs-diffusion-website/usecases/findAllByDepartement.usecase';

@Controller('api/departements')
@ApiTags('Sites web de diffusion BRS')
export class GetBrsDiffusionWebsitesByDepartementApiController {
  constructor(
    private readonly findAllBrsDiffusionWebsitesByDepartementUsecase: FindAllBrsDiffusionWebsitesByDepartementUsecase,
  ) {}

  @Get(':id/brs-diffusion-websites')
  @ApiPaginatedResponse(BrsDiffusionWebsiteView)
  @ApiOperation({
    summary: 'Récupérer tous les sites web de diffusion BRS par département',
  })
  index(
    @Query() { page = 1, pageSize = MAX_PAGE_SIZE }: PaginationDTO,
    @Param() { id }: IdDTO,
  ) {
    return this.findAllBrsDiffusionWebsitesByDepartementUsecase.execute({
      page,
      pageSize,
      departementId: id,
    });
  }
}
