import { Inject } from '@nestjs/common';
import { EligibilitySimulationRepositoryInterface } from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';
import { EligibilitySimulationGroupSimulationsByYearAndMonthView } from '../views/eligibility-simulation-group-simulations-by-year-and-month.view';

export class GroupEligibilitySimulationsByYearAndMonthUsecase {
  constructor(
    @Inject('EligibilitySimulationRepositoryInterface')
    private readonly eligibilitySimulationRepository: EligibilitySimulationRepositoryInterface,
  ) {}

  public async execute(): Promise<EligibilitySimulationGroupSimulationsByYearAndMonthView> {
    const result =
      await this.eligibilitySimulationRepository.groupSimulationsByYearAndMonth();

    return new EligibilitySimulationGroupSimulationsByYearAndMonthView(result);
  }
}
