import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CreateEligibilitySimulationDTO } from '../../dtos/create.dto';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';
import { CreateEligibilitySimulationUsecase } from 'src/application/eligibility-simulation/usecases/create.usecase';
import { EligibilitySimulationView } from 'src/application/eligibility-simulation/views/eligibility-simulation.view';

@Controller('api/eligibility-simulations')
@ApiTags("Simulations d'éligibilité")
export class CreateEligibilitySimulationApiController {
  constructor(
    private readonly createEligibilitySimulationUsecase: CreateEligibilitySimulationUsecase,
  ) {}

  @Post()
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiResponse({ status: 201, type: EligibilitySimulationView })
  @ApiOperation({ summary: "Créer une simulation d'éligibilité" })
  public async createEligibilitySimulation(
    @Body() body: CreateEligibilitySimulationDTO,
  ) {
    return await this.createEligibilitySimulationUsecase.execute(body);
  }
}
