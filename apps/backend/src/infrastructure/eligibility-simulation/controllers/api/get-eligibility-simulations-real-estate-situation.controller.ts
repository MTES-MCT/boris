import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { GroupByEligibilitySimulationRealEstateSituationUsecase } from 'src/application/eligibility-simulation/usecases/group-by-real-estate-situation.usecase';
import { EligibilitySimulationGroupByFieldView } from 'src/application/eligibility-simulation/views/group-by-field.view';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';

@Controller('api/eligibility-simulations')
@ApiTags("Simulations d'éligibilité")
export class GetEligibilitySimulationsRealEstateSituationApiController {
  constructor(
    private readonly groupByRealEstateSituationUsecase: GroupByEligibilitySimulationRealEstateSituationUsecase,
  ) {}

  @Get('real-estate-situation')
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiResponse({
    status: 200,
    description: "Simulations d'éligibilité groupées par situation immobilière",
    type: EligibilitySimulationGroupByFieldView,
  })
  @ApiOperation({
    summary:
      "Récupérer les simulations d'éligibilité groupées par situation immobilière",
  })
  index() {
    return this.groupByRealEstateSituationUsecase.execute();
  }
}
