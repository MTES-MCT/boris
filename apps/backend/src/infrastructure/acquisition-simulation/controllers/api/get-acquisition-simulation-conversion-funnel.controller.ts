import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';
import { CalculateAcquisitionSimulationConversionFunnelUsecase } from 'src/application/acquisition-simulation/usecases/calculateConversionFunnel.usecase';
import { AcquisitionSimulationCalculateFunnelConversionView } from 'src/application/acquisition-simulation/views/acquisition-simulation-calculate-conversion-tunnel.view';

@Controller('api/acquisition-simulations')
@ApiTags("Simulations d'acquisition")
export class GetAcquisitionSimulationConversionFunnelController {
  constructor(
    private readonly calculateAcquisitionSimulationConversionFunnelUsecase: CalculateAcquisitionSimulationConversionFunnelUsecase,
  ) {}

  @Get('/conversion-funnel')
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiResponse({
    status: 200,
    description: "Données du funnel de conversion du simulateur d'acquisition",
    type: AcquisitionSimulationCalculateFunnelConversionView,
  })
  @ApiOperation({
    summary:
      "Récupérer les données du funnel de conversion du simulateur d'acquisition",
  })
  index() {
    return this.calculateAcquisitionSimulationConversionFunnelUsecase.execute();
  }
}
