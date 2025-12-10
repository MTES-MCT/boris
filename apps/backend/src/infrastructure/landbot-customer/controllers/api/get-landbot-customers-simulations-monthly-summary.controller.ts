import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { GroupSimulationsByYearAndMonthUsecase } from 'src/application/landbot-customer/usecases/groupSimulationsByYearAndMonth.usecase';
import { LandbotCustomerGroupSimulationsByYearAndMonthView } from 'src/application/landbot-customer/views/landbot-custommer-group-simulations-by-year-and-month.view';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';

@Controller('api/landbot-customers')
@ApiTags('Nombre de simulations par mois')
export class GetLandbotCustomersSimulationsMonthlySummaryApiController {
  constructor(
    private readonly groupSimulationsByYearAndMonthUsecase: GroupSimulationsByYearAndMonthUsecase,
  ) {}

  @Get('simulations/monthly-summary')
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiResponse({
    status: 200,
    description: 'Nombre de simulations par mois',
    type: LandbotCustomerGroupSimulationsByYearAndMonthView,
  })
  @ApiOperation({ summary: 'Récupérer le nombre de simulations par mois' })
  index() {
    return this.groupSimulationsByYearAndMonthUsecase.execute();
  }
}
