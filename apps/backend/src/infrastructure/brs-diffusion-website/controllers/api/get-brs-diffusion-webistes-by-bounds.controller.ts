import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MAX_PAGE_SIZE } from 'src/application/common/pagination';
import { ApiPaginatedResponse } from 'src/infrastructure/decorators/apiPaginatedResponse';
import { PaginationDTO } from 'src/infrastructure/common/dtos/pagination.dto';
import { BrsDiffusionWebsiteView } from 'src/application/brs-diffusion-website/views/brs-diffusion-website.view';
import { FindAllBrsDiffusionWebsitesByBoundsUsecase } from 'src/application/brs-diffusion-website/usecases/findAllByBounds.usecase';
import { GetAllBrsDiffusionWebsitesByBoundsDTO } from '../../dtos/getAllByBounds';

@Controller('api/brs-diffusion-websites-by-bounds')
@ApiTags('Sites web de diffusion BRS')
export class GetBrsDiffusionWebsitesByBoundsApiController {
  constructor(
    private readonly findAllBrsDiffusionByBoundsWebsitesUsecase: FindAllBrsDiffusionWebsitesByBoundsUsecase,
  ) {}

  @Get()
  @ApiPaginatedResponse(BrsDiffusionWebsiteView)
  @ApiOperation({
    summary:
      'Récupérer tous les sites web de diffusion BRS dans un rectangle défini par deux coordonnées géographiques.',
  })
  index(
    @Query() { page = 1, pageSize = MAX_PAGE_SIZE }: PaginationDTO,
    @Query()
    {
      northEastLat,
      northEastLng,
      southWestLat,
      southWestLng,
    }: GetAllBrsDiffusionWebsitesByBoundsDTO,
  ) {
    return this.findAllBrsDiffusionByBoundsWebsitesUsecase.execute({
      page,
      pageSize,
      northEastLat,
      northEastLng,
      southWestLat,
      southWestLng,
    });
  }
}
