import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { GroupEligibilitySimulationsByYearAndMonthUsecase } from 'src/application/eligibility-simulation/usecases/group-simulations-by-year-and-month.usecase';
import { EligibilitySimulationGroupSimulationsByYearAndMonthView } from 'src/application/eligibility-simulation/views/eligibility-simulation-group-simulations-by-year-and-month.view';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';

@Controller('api/eligibility-simulations')
@ApiTags("Simulations d'éligibilité")
export class GetEligibilitySimulationsMonthlySummaryApiController {
  constructor(
    private readonly groupEligibilitySimulationsByYearAndMonthUsecase: GroupEligibilitySimulationsByYearAndMonthUsecase,
  ) {}

  @Get('simulations/monthly-summary')
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiResponse({
    status: 200,
    description: 'Nombre de simulations par mois',
    type: EligibilitySimulationGroupSimulationsByYearAndMonthView,
  })
  @ApiOperation({
    summary: 'Récupérer le nombre de simulations groupées par mois',
  })
  index() {
    return this.groupEligibilitySimulationsByYearAndMonthUsecase.execute();
  }
}
