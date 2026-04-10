import { Test, TestingModule } from '@nestjs/testing';
import { GroupByEligibilitySimulationBrsKnowledgeUsecase } from 'src/application/eligibility-simulation/usecases/group-by-brs-knowledge.usecase';
import { EligibilitySimulationGroupByFieldView } from 'src/application/eligibility-simulation/views/group-by-field.view';
import { mockEligibilitySimulationRepository } from 'test/mocks/integration/eligibility-simulation';

describe('GroupByEligibilitySimulationBrsKnowledgeUsecase', () => {
  let useCase: GroupByEligibilitySimulationBrsKnowledgeUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupByEligibilitySimulationBrsKnowledgeUsecase,
        {
          provide: 'EligibilitySimulationRepositoryInterface',
          useValue: mockEligibilitySimulationRepository,
        },
      ],
    }).compile();

    useCase = module.get<GroupByEligibilitySimulationBrsKnowledgeUsecase>(
      GroupByEligibilitySimulationBrsKnowledgeUsecase,
    );
  });

  it('should group by brsKnowledge and return a view with data', async () => {
    const mockResults = [
      { brsKnowledge: 'Oui', count: '10' },
      { brsKnowledge: 'Non', count: '5' },
    ];

    mockEligibilitySimulationRepository.groupByBrsKnowledge.mockResolvedValue(
      mockResults,
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(EligibilitySimulationGroupByFieldView);
    expect(result.data).toEqual(mockResults);
    expect(
      mockEligibilitySimulationRepository.groupByBrsKnowledge,
    ).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array when no results are found', async () => {
    mockEligibilitySimulationRepository.groupByBrsKnowledge.mockResolvedValue(
      [],
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(EligibilitySimulationGroupByFieldView);
    expect(result.data).toEqual([]);
    expect(
      mockEligibilitySimulationRepository.groupByBrsKnowledge,
    ).toHaveBeenCalledTimes(1);
  });
});
