import { Inject } from '@nestjs/common';
import { EligibilitySimulationRepositoryInterface } from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';
import { EligibilitySimulationGroupByFieldView } from '../views/eligibility-simulation-group-by-field.view';

export class GroupByEligibilityStatsUsecase {
  constructor(
    @Inject('EligibilitySimulationRepositoryInterface')
    private readonly eligibilitySimulationRepository: EligibilitySimulationRepositoryInterface,
  ) {}

  public async execute(): Promise<EligibilitySimulationGroupByFieldView> {
    const result =
      await this.eligibilitySimulationRepository.groupByEligibilityStats();

    return new EligibilitySimulationGroupByFieldView(result);
  }
}
