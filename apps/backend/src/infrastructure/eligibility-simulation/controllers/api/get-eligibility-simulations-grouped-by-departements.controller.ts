import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { GroupEligibilitySimulationsByDepartementsUsecase } from 'src/application/eligibility-simulation/usecases/group-by-departements.usecase';
import { EligibilitySimulationGroupByDepartementsView } from 'src/application/eligibility-simulation/views/eligibility-simulation-group-by-departements.view';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';

@Controller('api/eligibility-simulations')
@ApiTags("Simulations d'éligibilité")
export class GetEligibilitySimulationsGroupedByDepartementsApiController {
  constructor(
    private readonly groupEligibilitySimulationsByDepartementsUsecase: GroupEligibilitySimulationsByDepartementsUsecase,
  ) {}

  @Get('simulations/by-departements')
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiResponse({
    status: 200,
    description: 'Nombre de simulations groupées par départements',
    type: EligibilitySimulationGroupByDepartementsView,
  })
  @ApiOperation({
    summary: 'Récupérer le nombre de simulations groupées par départements',
  })
  index() {
    return this.groupEligibilitySimulationsByDepartementsUsecase.execute();
  }
}
