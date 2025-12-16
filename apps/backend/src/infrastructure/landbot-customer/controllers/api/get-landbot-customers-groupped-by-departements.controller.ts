import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { GroupByDepartementsUsecase } from 'src/application/landbot-customer/usecases/groupByDepartements.usecase';
import { LandbotCustomerGroupByDepartementsView } from 'src/application/landbot-customer/views/landbot-customer-group-by-departements.view';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';

@Controller('api/landbot-customers')
@ApiTags("Simulations d'éligibilité")
export class GetLandbotCustomersGrouppedByDepartementsApiController {
  constructor(
    private readonly groupByDepartementsUsecase: GroupByDepartementsUsecase,
  ) {}

  @Get('statistics/by-departements')
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiResponse({
    status: 200,
    description: 'Nombre de simulations groupées par départements',
    type: LandbotCustomerGroupByDepartementsView,
  })
  @ApiOperation({
    summary: 'Récupérer le nombre de simulations groupées par départements',
  })
  index() {
    return this.groupByDepartementsUsecase.execute();
  }
}
