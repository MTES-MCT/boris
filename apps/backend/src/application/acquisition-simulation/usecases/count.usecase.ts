import { Inject } from '@nestjs/common';
import { AcquisitionSimulationRepositoryInterface } from 'src/domain/acquisition-simulation/acquisition-simulation.repository.interface';

export class CountAcquisitionSimulationsUsecase {
  constructor(
    @Inject('AcquisitionSimulationRepositoryInterface')
    private readonly acquisitionSimulationRepository: AcquisitionSimulationRepositoryInterface,
  ) {}

  public async execute(): Promise<number> {
    return this.acquisitionSimulationRepository.count();
  }
}
