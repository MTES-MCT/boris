import { Inject } from '@nestjs/common';
import { AcquisitionSimulationRepositoryInterface } from 'src/domain/acquisition-simulation/acquisition-simulation.repository.interface';
import { CreateAcquisitionSimulationParams } from './create.params';
import { AcquisitionSimulationView } from '../views/acquisition-simulation.view';
import { AcquisitionSimulationEntity } from 'src/infrastructure/acquisition-simulation/acquisition-simulation.entity';

export class CreateAcquisitionSimulationUsecase {
  constructor(
    @Inject('AcquisitionSimulationRepositoryInterface')
    private readonly acquisitionSimulationRepository: AcquisitionSimulationRepositoryInterface,
  ) {}

  public async execute(
    params: CreateAcquisitionSimulationParams,
  ): Promise<AcquisitionSimulationView> {
    const { housingPrice, brsZone, surface, housingType } = params;

    const acquisitionSimulation =
      await this.acquisitionSimulationRepository.save(
        new AcquisitionSimulationEntity(
          housingPrice,
          brsZone,
          surface,
          housingType,
        ),
      );

    return new AcquisitionSimulationView(
      acquisitionSimulation.id,
      acquisitionSimulation.housingPrice,
      acquisitionSimulation.brsZone,
      acquisitionSimulation.surface,
      acquisitionSimulation.housingType,
    );
  }
}
