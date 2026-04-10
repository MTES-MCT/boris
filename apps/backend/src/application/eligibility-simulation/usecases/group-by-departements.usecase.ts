import { Inject } from '@nestjs/common';
import { EligibilitySimulationRepositoryInterface } from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';
import { EligibilitySimulationGroupByDepartementsView } from '../views/eligibility-simulation-group-by-departements.view';

export class GroupEligibilitySimulationsByDepartementsUsecase {
  constructor(
    @Inject('EligibilitySimulationRepositoryInterface')
    private readonly eligibilitySimulationRepository: EligibilitySimulationRepositoryInterface,
  ) {}

  public async execute(): Promise<EligibilitySimulationGroupByDepartementsView> {
    const result =
      await this.eligibilitySimulationRepository.groupByDepartements();

    return new EligibilitySimulationGroupByDepartementsView(result);
  }
}
