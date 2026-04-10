import { Test, TestingModule } from '@nestjs/testing';
import { CalculateEligibilitySimulationConversionFunnelUsecase } from 'src/application/eligibility-simulation/usecases/calculate-conversion-funnel.usecase';
import { EligibilitySimulationCalculateConversionFunnelView } from 'src/application/eligibility-simulation/views/eligibility-simulation-calculate-conversion-funnel.view';
import { mockEligibilitySimulationRepository } from 'test/mocks/integration/eligibility-simulation';
import { EligibilitySimulationConversionFunnelResult } from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';

describe('CalculateEligibilitySimulationConversionFunnelUsecase', () => {
  let useCase: CalculateEligibilitySimulationConversionFunnelUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalculateEligibilitySimulationConversionFunnelUsecase,
        {
          provide: 'EligibilitySimulationRepositoryInterface',
          useValue: mockEligibilitySimulationRepository,
        },
      ],
    }).compile();

    useCase = module.get<CalculateEligibilitySimulationConversionFunnelUsecase>(
      CalculateEligibilitySimulationConversionFunnelUsecase,
    );
  });

  it('should calculate conversion funnel', async () => {
    const mockConversionFunnelResult: EligibilitySimulationConversionFunnelResult =
      {
        totalSimulations: 105,
        totalHouseholdProvided: 105,
        totalEligible: 84,
        totalConnectionWish: 54,
        totalEmailProvided: 32,
        totalDesiredCityProvided: 22,
      };

    mockEligibilitySimulationRepository.calculateConversionFunnel.mockResolvedValue(
      mockConversionFunnelResult,
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(
      EligibilitySimulationCalculateConversionFunnelView,
    );
    expect(result.totalSimulations).toEqual(
      mockConversionFunnelResult.totalSimulations,
    );
    expect(result.totalHouseholdProvided).toEqual(
      mockConversionFunnelResult.totalHouseholdProvided,
    );
    expect(result.totalEligible).toEqual(
      mockConversionFunnelResult.totalEligible,
    );
    expect(result.totalConnectionWish).toEqual(
      mockConversionFunnelResult.totalConnectionWish,
    );
    expect(result.totalEmailProvided).toEqual(
      mockConversionFunnelResult.totalEmailProvided,
    );
    expect(result.totalDesiredCityProvided).toEqual(
      mockConversionFunnelResult.totalDesiredCityProvided,
    );
  });
});
