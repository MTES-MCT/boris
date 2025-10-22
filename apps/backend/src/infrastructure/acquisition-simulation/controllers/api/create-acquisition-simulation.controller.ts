import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAcquisitionSimulationDTO } from '../../dtos/create.dto';

import { CreateAcquisitionSimulationUsecase } from 'src/application/acquisition-simulation/usecases/create.usecase';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';
import { AcquisitionSimulationView } from 'src/application/acquisition-simulation/views/acquisition-simulation.view';

@Controller('api/acquisition-simulations')
@ApiTags("Simulations d'acquisition")
export class CreateAcquisitionSimulationApiController {
  constructor(
    private readonly createAcquisitionSimulationUsecase: CreateAcquisitionSimulationUsecase,
  ) {}

  @Post()
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiResponse({ status: 201, type: AcquisitionSimulationView })
  @ApiOperation({ summary: "Créer une simulation d'acquisition" })
  public async createAcquisitionSimulation(
    @Body() body: CreateAcquisitionSimulationDTO,
  ) {
    return await this.createAcquisitionSimulationUsecase.execute(body);
  }
}
