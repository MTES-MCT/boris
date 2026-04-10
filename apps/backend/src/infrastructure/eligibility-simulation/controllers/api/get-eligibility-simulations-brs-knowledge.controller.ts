import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { GroupByEligibilitySimulationBrsKnowledgeUsecase } from 'src/application/eligibility-simulation/usecases/group-by-brs-knowledge.usecase';
import { EligibilitySimulationGroupByFieldView } from 'src/application/eligibility-simulation/views/group-by-field.view';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';

@Controller('api/eligibility-simulations')
@ApiTags("Simulations d'éligibilité")
export class GetEligibilitySimulationsBrsKnowledgeApiController {
  constructor(
    private readonly groupByBrsKnowledgeUsecase: GroupByEligibilitySimulationBrsKnowledgeUsecase,
  ) {}

  @Get('brs-knowledge')
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiResponse({
    status: 200,
    description: "Simulations d'éligibilité groupées par connaissance du BRS",
    type: EligibilitySimulationGroupByFieldView,
  })
  @ApiOperation({
    summary:
      "Récupérer les simulations d'éligibilité groupées par connaissance du BRS",
  })
  index() {
    return this.groupByBrsKnowledgeUsecase.execute();
  }
}
