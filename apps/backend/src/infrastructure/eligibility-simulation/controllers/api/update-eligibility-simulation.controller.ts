import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';
import { UpdateEligibilitySimulationDTO } from '../../dtos/update.dto';
import { UpdateEligibilitySimulationUsecase } from 'src/application/eligibility-simulation/usecases/update.usecase';
import { EligibilitySimulationView } from 'src/application/eligibility-simulation/views/eligibility-simulation.view';

@Controller('api/eligibility-simulations')
@ApiTags("Simulations d'éligibilité")
export class UpdateEligibilitySimulationApiController {
  constructor(
    private readonly updateEligibilitySimulationUsecase: UpdateEligibilitySimulationUsecase,
  ) {}

  @Put(':id')
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiResponse({ status: 201, type: EligibilitySimulationView })
  @ApiOperation({ summary: "Mettre à jour une simulation d'éligibilité" })
  public async updateEligibilitySimulation(
    @Param('id') id: string,
    @Body() body: UpdateEligibilitySimulationDTO,
  ) {
    return await this.updateEligibilitySimulationUsecase.execute({
      id,
      ...body,
    });
  }
}
