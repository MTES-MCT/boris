import { Test, TestingModule } from '@nestjs/testing';
import { GetPublicEligibilityStatisticsUsecase } from 'src/application/eligibility-simulation/usecases/get-public-statistics.usecase';
import { mockEligibilitySimulationRepository } from 'test/mocks/integration/eligibility-simulation';

describe('GetPublicEligibilityStatisticsUsecase', () => {
  let usecase: GetPublicEligibilityStatisticsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPublicEligibilityStatisticsUsecase,
        {
          provide: 'EligibilitySimulationRepositoryInterface',
          useValue: mockEligibilitySimulationRepository,
        },
      ],
    }).compile();

    usecase = module.get(GetPublicEligibilityStatisticsUsecase);
    jest.clearAllMocks();
  });

  it('returns the repository result for the requested perimeter', async () => {
    const result = {
      updatedAt: '2026-08-27',
      totals: {
        simulations: 12,
        eligible: 9,
        contactable: null,
        geolocated: 12,
      },
      regions: [],
      zones: [],
      householdSizes: [],
      propertySituations: [],
      incomeRanges: [],
      employmentStatuses: [],
      housingTypes: [],
      brsKnowledge: [],
      breakdownTotals: {
        householdSizes: 0,
        propertySituations: 0,
        incomeRanges: 0,
        employmentStatuses: 0,
        housingTypes: 0,
        brsKnowledge: 0,
      },
      filters: { departements: [], postalCodes: [] },
    };
    mockEligibilitySimulationRepository.getPublicStatistics.mockResolvedValue(
      result,
    );

    await expect(
      usecase.execute({ departementCode: '75', postalCode: '75001' }),
    ).resolves.toEqual(result);
    expect(
      mockEligibilitySimulationRepository.getPublicStatistics,
    ).toHaveBeenCalledWith({ departementCode: '75', postalCode: '75001' });
  });

  it('rejects a perimeter containing fewer than five simulations', async () => {
    mockEligibilitySimulationRepository.getPublicStatistics.mockResolvedValue(
      null,
    );

    await expect(
      usecase.execute({ departementCode: '75', postalCode: '75002' }),
    ).rejects.toThrow(
      'Les statistiques ne sont pas publiées pour les périmètres de moins de 5 simulations',
    );
  });
});
