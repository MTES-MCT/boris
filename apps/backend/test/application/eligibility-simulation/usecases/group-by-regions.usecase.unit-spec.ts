import { Test, TestingModule } from '@nestjs/testing';
import { GroupEligibilitySimulationsByRegionsUsecase } from 'src/application/eligibility-simulation/usecases/group-by-regions.usecase';
import { EligibilitySimulationGroupByRegionsView } from 'src/application/eligibility-simulation/views/eligibility-simulation-group-by-regions.view';
import { mockEligibilitySimulationRepository } from 'test/mocks/integration/eligibility-simulation';

describe('GroupEligibilitySimulationsByRegionsUsecase', () => {
  let useCase: GroupEligibilitySimulationsByRegionsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupEligibilitySimulationsByRegionsUsecase,
        {
          provide: 'EligibilitySimulationRepositoryInterface',
          useValue: mockEligibilitySimulationRepository,
        },
      ],
    }).compile();

    useCase = module.get<GroupEligibilitySimulationsByRegionsUsecase>(
      GroupEligibilitySimulationsByRegionsUsecase,
    );
  });

  it('should group by regions and return a view with data and total', async () => {
    const mockResults = [
      { regionName: 'Bretagne', regionCode: '53', count: '10' },
      { regionName: 'Ile-de-France', regionCode: '11', count: '15' },
    ];

    mockEligibilitySimulationRepository.groupByRegions.mockResolvedValue([
      mockResults,
      25,
    ]);

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(EligibilitySimulationGroupByRegionsView);
    expect(result.data).toEqual(mockResults);
    expect(result.total).toBe(25);
    expect(
      mockEligibilitySimulationRepository.groupByRegions,
    ).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array and 0 total when no results are found', async () => {
    mockEligibilitySimulationRepository.groupByRegions.mockResolvedValue([
      [],
      0,
    ]);

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(EligibilitySimulationGroupByRegionsView);
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
    expect(
      mockEligibilitySimulationRepository.groupByRegions,
    ).toHaveBeenCalledTimes(1);
  });
});
