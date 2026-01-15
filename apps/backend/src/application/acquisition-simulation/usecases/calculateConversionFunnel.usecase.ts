import { Inject } from '@nestjs/common';
import { AcquisitionSimulationCalculateFunnelConversionView } from '../views/acquisition-simulation-calculate-conversion-tunnel.view';
import { AcquisitionSimulationRepositoryInterface } from 'src/domain/acquisition-simulation/acquisition-simulation.repository.interface';

export class CalculateAcquisitionSimulationConversionFunnelUsecase {
  constructor(
    @Inject('AcquisitionSimulationRepositoryInterface')
    private readonly acquisitionSimulationRepository: AcquisitionSimulationRepositoryInterface,
  ) {}

  public async execute(): Promise<AcquisitionSimulationCalculateFunnelConversionView> {
    const {
      totalHouseInformations,
      totalOwnContribution,
      totalBuyingFees,
      totalLoanInformations,
      totalBrsHousingFees,
    } = await this.acquisitionSimulationRepository.calculateConversionFunnel();

    return new AcquisitionSimulationCalculateFunnelConversionView(
      totalHouseInformations,
      totalOwnContribution,
      totalBuyingFees,
      totalLoanInformations,
      totalBrsHousingFees,
    );
  }
}
