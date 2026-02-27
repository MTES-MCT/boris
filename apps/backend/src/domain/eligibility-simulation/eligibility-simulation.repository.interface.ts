import { EligibilitySimulationEntity } from 'src/infrastructure/eligibility-simulation/eligibility-simulation.entity';

export interface EligibilitySimulationRepositoryInterface {
  save(
    eligibilitySimulation: EligibilitySimulationEntity,
  ): Promise<EligibilitySimulationEntity>;
  findById(id: string): Promise<EligibilitySimulationEntity | null>;
}
