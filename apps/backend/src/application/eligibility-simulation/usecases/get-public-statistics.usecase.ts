import { Inject, Injectable } from '@nestjs/common';
import {
  EligibilitySimulationRepositoryInterface,
  PublicEligibilityStatisticsFilters,
  PublicEligibilityStatisticsResult,
} from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';

@Injectable()
export class GetPublicEligibilityStatisticsUsecase {
  constructor(
    @Inject('EligibilitySimulationRepositoryInterface')
    private readonly eligibilitySimulationRepository: EligibilitySimulationRepositoryInterface,
  ) {}

  public execute(
    filters: PublicEligibilityStatisticsFilters,
  ): Promise<PublicEligibilityStatisticsResult> {
    return this.eligibilitySimulationRepository.getPublicStatistics(filters);
  }
}
