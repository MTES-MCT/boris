import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';
import { CalculateConversionFunnelUsecase } from 'src/application/landbot-customer/usecases/calculateConversionFunnel.usecase';
import { LandbotCustomerCalculateFunnelConversionView } from 'src/application/landbot-customer/views/landbot-customer-calculate-conversion-tunnel.view';

@Controller('api/landbot-customers')
@ApiTags("Simulations d'éligibilité")
export class GetLandbotCustomersConversionFunnelController {
  constructor(
    private readonly calculateConversionFunnelUsecase: CalculateConversionFunnelUsecase,
  ) {}

  @Get('/conversion-funnel')
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiResponse({
    status: 200,
    description: "Données du funnel de conversion du simulateur d'éligibilité",
    type: LandbotCustomerCalculateFunnelConversionView,
  })
  @ApiOperation({
    summary:
      "Récupérer les données du funnel de conversion du simulateur d'éligibilité",
  })
  index() {
    return this.calculateConversionFunnelUsecase.execute();
  }
}
