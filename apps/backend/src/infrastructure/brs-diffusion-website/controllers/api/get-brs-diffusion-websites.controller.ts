import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { MAX_PAGE_SIZE } from 'src/application/common/pagination';
import { ApiPaginatedResponse } from 'src/infrastructure/decorators/apiPaginatedResponse';
import { PaginationDTO } from 'src/infrastructure/common/dtos/pagination.dto';
import { FindAllBrsDiffusionWebsitesUsecase } from 'src/application/brs-diffusion-website/usecases/findAll.usecase';
import { BrsDiffusionWebsiteView } from 'src/application/brs-diffusion-website/views/brs-diffusion-website.view';
import { GetAllBrsDiffusionWebsitesDTO } from '../../dtos/getAll.dto';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';

@Controller('api/brs-diffusion-websites')
@ApiTags('Sites web de diffusion BRS')
export class GetBrsDiffusionWebsitesApiController {
  constructor(
    private readonly findAllBrsDiffusionWebsitesUsecase: FindAllBrsDiffusionWebsitesUsecase,
  ) {}

  @Get()
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiPaginatedResponse(BrsDiffusionWebsiteView)
  @ApiOperation({ summary: 'Récupérer tous les sites web de diffusion BRS' })
  index(
    @Query() { page = 1, pageSize = MAX_PAGE_SIZE }: PaginationDTO,
    @Query() { latitude, longitude, radius }: GetAllBrsDiffusionWebsitesDTO,
  ) {
    return this.findAllBrsDiffusionWebsitesUsecase.execute({
      page,
      pageSize,
      latitude,
      longitude,
      radius,
    });
  }
}
