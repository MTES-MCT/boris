import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
    return this.getStatistics(filters);
  }

  private async getStatistics(
    filters: PublicEligibilityStatisticsFilters,
  ): Promise<PublicEligibilityStatisticsResult> {
    const statistics =
      await this.eligibilitySimulationRepository.getPublicStatistics(filters);

    if (!statistics) {
      throw new NotFoundException(
        'Les statistiques ne sont pas publiées pour les périmètres de moins de 5 simulations',
      );
    }

    return statistics;
  }
}
