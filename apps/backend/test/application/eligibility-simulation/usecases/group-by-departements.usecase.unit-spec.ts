import { Test, TestingModule } from '@nestjs/testing';
import { GroupEligibilitySimulationsByDepartementsUsecase } from 'src/application/eligibility-simulation/usecases/group-by-departements.usecase';
import { EligibilitySimulationGroupByDepartementsView } from 'src/application/eligibility-simulation/views/eligibility-simulation-group-by-departements.view';
import { mockEligibilitySimulationRepository } from 'test/mocks/integration/eligibility-simulation';

describe('GroupEligibilitySimulationsByDepartementsUsecase', () => {
  let useCase: GroupEligibilitySimulationsByDepartementsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupEligibilitySimulationsByDepartementsUsecase,
        {
          provide: 'EligibilitySimulationRepositoryInterface',
          useValue: mockEligibilitySimulationRepository,
        },
      ],
    }).compile();

    useCase = module.get<GroupEligibilitySimulationsByDepartementsUsecase>(
      GroupEligibilitySimulationsByDepartementsUsecase,
    );
  });

  it('should group by departements and return a view with data', async () => {
    const mockResults = [
      { departementCode: '29', count: '10' },
      { departementCode: '75', count: '5' },
    ];

    mockEligibilitySimulationRepository.groupByDepartements.mockResolvedValue(
      mockResults,
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(EligibilitySimulationGroupByDepartementsView);
    expect(result.data).toEqual(mockResults);
    expect(
      mockEligibilitySimulationRepository.groupByDepartements,
    ).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array when no results are found', async () => {
    mockEligibilitySimulationRepository.groupByDepartements.mockResolvedValue(
      [],
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(EligibilitySimulationGroupByDepartementsView);
    expect(result.data).toEqual([]);
    expect(
      mockEligibilitySimulationRepository.groupByDepartements,
    ).toHaveBeenCalledTimes(1);
  });
});
