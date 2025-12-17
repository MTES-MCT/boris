import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { GroupByRegionsUsecase } from 'src/application/landbot-customer/usecases/groupByRegions.usecase';
import { LandbotCustomerGroupByRegionsView } from 'src/application/landbot-customer/views/landbot-customer-group-by-regions.view';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';

@Controller('api/landbot-customers')
@ApiTags("Simulations d'éligibilité")
export class GetLandbotCustomersGrouppedByRegionsApiController {
  constructor(private readonly groupByRegionsUsecase: GroupByRegionsUsecase) {}

  @Get('simulations/by-regions')
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiResponse({
    status: 200,
    description: 'Nombre de simulations groupées par régions',
    type: LandbotCustomerGroupByRegionsView,
  })
  @ApiOperation({
    summary: 'Récupérer le nombre de simulations groupées par régions',
  })
  index() {
    return this.groupByRegionsUsecase.execute({});
  }
}
