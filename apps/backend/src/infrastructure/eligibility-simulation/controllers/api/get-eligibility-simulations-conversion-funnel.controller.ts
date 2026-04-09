import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CalculateEligibilitySimulationConversionFunnelUsecase } from 'src/application/eligibility-simulation/usecases/calculate-conversion-funnel.usecase';
import { EligibilitySimulationCalculateConversionFunnelView } from 'src/application/eligibility-simulation/views/eligibility-simulation-calculate-conversion-funnel.view';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';

@Controller('api/eligibility-simulations')
@ApiTags("Simulations d'éligibilité")
export class GetEligibilitySimulationsConversionFunnelApiController {
  constructor(
    private readonly calculateEligibilitySimulationConversionFunnelUsecase: CalculateEligibilitySimulationConversionFunnelUsecase,
  ) {}

  @Get('conversion-funnel')
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiResponse({
    status: 200,
    description: "Données du funnel de conversion du simulateur d'éligibilité",
    type: EligibilitySimulationCalculateConversionFunnelView,
  })
  @ApiOperation({
    summary:
      "Récupérer les données du funnel de conversion du simulateur d'éligibilité",
  })
  public async index() {
    const result =
      await this.calculateEligibilitySimulationConversionFunnelUsecase.execute();

    return {
      totalSimulations: result.totalSimulations,
      totalHouseholdProvided: result.totalHouseholdProvided,
      totalEligible: result.totalEligible,
      totalConnectionWish: result.totalConnectionWish,
      totalEmailProvided: result.totalEmailProvided,
      totalDesiredCityProvided: result.totalDesiredCityProvided,
    };
  }
}
