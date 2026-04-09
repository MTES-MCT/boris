import { Test, TestingModule } from '@nestjs/testing';
import { GroupByEligibilityStatsUsecase } from 'src/application/eligibility-simulation/usecases/group-by-eligibility-stats.usecase';
import { EligibilitySimulationGroupByFieldView } from 'src/application/eligibility-simulation/views/eligibility-simulation-group-by-field.view';
import { mockEligibilitySimulationRepository } from 'test/mocks/integration/eligibility-simulation';

describe('GroupByEligibilityStatsUsecase', () => {
  let useCase: GroupByEligibilityStatsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupByEligibilityStatsUsecase,
        {
          provide: 'EligibilitySimulationRepositoryInterface',
          useValue: mockEligibilitySimulationRepository,
        },
      ],
    }).compile();

    useCase = module.get<GroupByEligibilityStatsUsecase>(
      GroupByEligibilityStatsUsecase,
    );
  });

  it('should group by eligibility and return a view with data', async () => {
    const mockResults = [
      { eligibility: 'A_AND_ABIS', count: '10' },
      { eligibility: 'B1', count: '5' },
      { eligibility: 'B2_AND_C', count: '3' },
      { eligibility: 'NONE', count: '2' },
    ];

    mockEligibilitySimulationRepository.groupByEligibilityStats.mockResolvedValue(
      mockResults,
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(EligibilitySimulationGroupByFieldView);
    expect(result.data).toEqual(mockResults);
    expect(
      mockEligibilitySimulationRepository.groupByEligibilityStats,
    ).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array when no results are found', async () => {
    mockEligibilitySimulationRepository.groupByEligibilityStats.mockResolvedValue(
      [],
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(EligibilitySimulationGroupByFieldView);
    expect(result.data).toEqual([]);
    expect(
      mockEligibilitySimulationRepository.groupByEligibilityStats,
    ).toHaveBeenCalledTimes(1);
  });
});
