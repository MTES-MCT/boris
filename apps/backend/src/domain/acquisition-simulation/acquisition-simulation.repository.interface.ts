import { AcquisitionSimulationEntity } from 'src/infrastructure/acquisition-simulation/acquisition-simulation.entity';

export interface AcquisitionSimulationRepositoryInterface {
  save(
    acquisitionSimulation: AcquisitionSimulationEntity,
  ): Promise<AcquisitionSimulationEntity>;
  findById(id: string): Promise<AcquisitionSimulationEntity | null>;
}
