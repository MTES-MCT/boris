import { Test, TestingModule } from '@nestjs/testing';
import { GroupByEligibilitySimulationRealEstateSituationUsecase } from 'src/application/eligibility-simulation/usecases/group-by-real-estate-situation.usecase';
import { EligibilitySimulationGroupByFieldView } from 'src/application/eligibility-simulation/views/group-by-field.view';
import { mockEligibilitySimulationRepository } from 'test/mocks/integration/eligibility-simulation';

describe('GroupByEligibilitySimulationRealEstateSituationUsecase', () => {
  let useCase: GroupByEligibilitySimulationRealEstateSituationUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupByEligibilitySimulationRealEstateSituationUsecase,
        {
          provide: 'EligibilitySimulationRepositoryInterface',
          useValue: mockEligibilitySimulationRepository,
        },
      ],
    }).compile();

    useCase =
      module.get<GroupByEligibilitySimulationRealEstateSituationUsecase>(
        GroupByEligibilitySimulationRealEstateSituationUsecase,
      );
  });

  it('should group by realEstateSituation and return a view with data', async () => {
    const mockResults = [
      { realEstateSituation: "propriétaire d'un logement", count: '10' },
      { realEstateSituation: 'hebergé·e', count: '5' },
    ];

    mockEligibilitySimulationRepository.groupByRealEstateSituation.mockResolvedValue(
      mockResults,
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(EligibilitySimulationGroupByFieldView);
    expect(result.data).toEqual(mockResults);
    expect(
      mockEligibilitySimulationRepository.groupByRealEstateSituation,
    ).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array when no results are found', async () => {
    mockEligibilitySimulationRepository.groupByRealEstateSituation.mockResolvedValue(
      [],
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(EligibilitySimulationGroupByFieldView);
    expect(result.data).toEqual([]);
    expect(
      mockEligibilitySimulationRepository.groupByRealEstateSituation,
    ).toHaveBeenCalledTimes(1);
  });
});
