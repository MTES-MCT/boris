import { Inject } from '@nestjs/common';
import { EligibilitySimulationRepositoryInterface } from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';
import { EligibilitySimulationCalculateConversionFunnelView } from '../views/eligibility-simulation-calculate-conversion-funnel.view';

export class CalculateEligibilitySimulationConversionFunnelUsecase {
  constructor(
    @Inject('EligibilitySimulationRepositoryInterface')
    private readonly eligibilitySimulationRepository: EligibilitySimulationRepositoryInterface,
  ) {}

  public async execute(): Promise<EligibilitySimulationCalculateConversionFunnelView> {
    const {
      totalSimulations,
      totalHouseholdProvided,
      totalEligible,
      totalConnectionWish,
      totalEmailProvided,
      totalDesiredCityProvided,
    } = await this.eligibilitySimulationRepository.calculateConversionFunnel();

    return new EligibilitySimulationCalculateConversionFunnelView(
      totalSimulations,
      totalHouseholdProvided,
      totalEligible,
      totalConnectionWish,
      totalEmailProvided,
      totalDesiredCityProvided,
    );
  }
}
