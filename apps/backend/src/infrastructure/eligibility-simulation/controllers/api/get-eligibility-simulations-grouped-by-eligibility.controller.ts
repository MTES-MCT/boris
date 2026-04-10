import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { GroupByEligibilityStatsUsecase } from 'src/application/eligibility-simulation/usecases/group-by-eligibility-stats.usecase';
import { EligibilitySimulationGroupByFieldView } from 'src/application/eligibility-simulation/views/eligibility-simulation-group-by-field.view';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';

@Controller('api/eligibility-simulations')
@ApiTags("Simulations d'éligibilité")
export class GetEligibilitySimulationsGroupedByEligibilityApiController {
  constructor(
    private readonly groupByEligibilityStatsUsecase: GroupByEligibilityStatsUsecase,
  ) {}

  @Get('eligibility')
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiResponse({
    status: 200,
    description: "Simulations d'éligibilité groupées par zone d'éligibilité",
    type: EligibilitySimulationGroupByFieldView,
  })
  @ApiOperation({
    summary: "Récupérer les simulations d'éligibilité groupées par zone",
  })
  public async index() {
    return await this.groupByEligibilityStatsUsecase.execute();
  }
}
