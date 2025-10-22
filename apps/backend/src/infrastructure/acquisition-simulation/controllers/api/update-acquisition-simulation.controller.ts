import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';
import { AcquisitionSimulationView } from 'src/application/acquisition-simulation/views/acquisition-simulation.view';
import { UpdateAcquisitionSimulationDTO } from '../../dtos/update.dto';
import { UpdateAcquisitionSimulationUsecase } from 'src/application/acquisition-simulation/usecases/update.usecase';

@Controller('api/acquisition-simulations')
@ApiTags("Simulations d'acquisition")
export class UpdateAcquisitionSimulationApiController {
  constructor(
    private readonly updateAcquisitionSimulationUsecase: UpdateAcquisitionSimulationUsecase,
  ) {}

  @Put(':id')
  @ApiSecurity('Api key')
  @UseGuards(ApiKeyGuard)
  @ApiResponse({ status: 201, type: AcquisitionSimulationView })
  @ApiOperation({ summary: "Mettre à jour une simulation d'acquisition" })
  public async updateAcquisitionSimulation(
    @Param('id') id: string,
    @Body() body: UpdateAcquisitionSimulationDTO,
  ) {
    return await this.updateAcquisitionSimulationUsecase.execute({
      id,
      ...body,
    });
  }
}
