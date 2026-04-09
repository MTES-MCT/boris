import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { GroupEligibilitySimulationsByRegionsUsecase } from 'src/application/eligibility-simulation/usecases/group-by-regions.usecase';
import { EligibilitySimulationGroupByRegionsView } from 'src/application/eligibility-simulation/views/eligibility-simulation-group-by-regions.view';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';

@Controller('api/eligibility-simulations')
@ApiTags("Simulations d'éligibilité")
export class GetEligibilitySimulationsGroupedByRegionsApiController {
  constructor(
    private readonly groupEligibilitySimulationsByRegionsUsecase: GroupEligibilitySimulationsByRegionsUsecase,
  ) {}

  @Get('simulations/by-regions')
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiResponse({
    status: 200,
    description: 'Nombre de simulations groupées par régions',
    type: EligibilitySimulationGroupByRegionsView,
  })
  @ApiOperation({
    summary: 'Récupérer le nombre de simulations groupées par régions',
  })
  index() {
    return this.groupEligibilitySimulationsByRegionsUsecase.execute();
  }
}
