import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { GetPublicEligibilityStatisticsUsecase } from 'src/application/eligibility-simulation/usecases/get-public-statistics.usecase';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';
import { PublicEligibilityStatisticsDto } from '../../dtos/public-statistics.dto';

@Controller('api/eligibility-simulations')
@ApiTags("Simulations d'éligibilité")
export class GetPublicEligibilityStatisticsApiController {
  constructor(
    private readonly getPublicEligibilityStatisticsUsecase: GetPublicEligibilityStatisticsUsecase,
  ) {}

  @Get('public-statistics')
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: "Récupérer les statistiques publiques du simulateur d'éligibilité",
  })
  public index(@Query() filters: PublicEligibilityStatisticsDto) {
    return this.getPublicEligibilityStatisticsUsecase.execute(filters);
  }
}
