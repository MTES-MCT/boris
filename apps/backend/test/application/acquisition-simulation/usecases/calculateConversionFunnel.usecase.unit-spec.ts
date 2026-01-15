import { Test, TestingModule } from '@nestjs/testing';
import { CalculateAcquisitionSimulationConversionFunnelUsecase } from 'src/application/acquisition-simulation/usecases/calculateConversionFunnel.usecase';
import { AcquisitionSimulationCalculateFunnelConversionView } from 'src/application/acquisition-simulation/views/acquisition-simulation-calculate-conversion-tunnel.view';
import { mockAcquisitionSimulationRepository } from 'test/mocks/integration/acquisition-simulation';

describe('CalculateAcquisitionSimulationConversionFunnelUsecase', () => {
  let useCase: CalculateAcquisitionSimulationConversionFunnelUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalculateAcquisitionSimulationConversionFunnelUsecase,
        {
          provide: 'AcquisitionSimulationRepositoryInterface',
          useValue: mockAcquisitionSimulationRepository,
        },
      ],
    }).compile();

    useCase = module.get<CalculateAcquisitionSimulationConversionFunnelUsecase>(
      CalculateAcquisitionSimulationConversionFunnelUsecase,
    );
  });

  it('should return conversion funnel data with proper view format', async () => {
    const mockConversionFunnelResult = {
      totalHouseInformations: 105,
      totalOwnContribution: 100,
      totalBuyingFees: 84,
      totalLoanInformations: 54,
      totalBrsHousingFees: 32,
    };

    mockAcquisitionSimulationRepository.calculateConversionFunnel.mockResolvedValue(
      mockConversionFunnelResult,
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(
      AcquisitionSimulationCalculateFunnelConversionView,
    );
    expect(result.totalHouseInformations).toBe(105);
    expect(result.totalOwnContribution).toBe(100);
    expect(result.totalBuyingFees).toBe(84);
    expect(result.totalLoanInformations).toBe(54);
    expect(result.totalBrsHousingFees).toBe(32);
    expect(
      mockAcquisitionSimulationRepository.calculateConversionFunnel,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockAcquisitionSimulationRepository.calculateConversionFunnel,
    ).toHaveBeenCalledWith();
  });
});
