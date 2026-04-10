import { Inject } from '@nestjs/common';
import { EligibilitySimulationRepositoryInterface } from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';
import { EligibilitySimulationGroupByRegionsView } from '../views/eligibility-simulation-group-by-regions.view';

export class GroupEligibilitySimulationsByRegionsUsecase {
  constructor(
    @Inject('EligibilitySimulationRepositoryInterface')
    private readonly eligibilitySimulationRepository: EligibilitySimulationRepositoryInterface,
  ) {}

  public async execute(): Promise<EligibilitySimulationGroupByRegionsView> {
    const [result, total] =
      await this.eligibilitySimulationRepository.groupByRegions();

    return new EligibilitySimulationGroupByRegionsView(result, total);
  }
}
