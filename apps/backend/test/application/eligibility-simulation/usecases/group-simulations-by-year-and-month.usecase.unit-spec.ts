import { Test, TestingModule } from '@nestjs/testing';
import { GroupEligibilitySimulationsByYearAndMonthUsecase } from 'src/application/eligibility-simulation/usecases/group-simulations-by-year-and-month.usecase';
import { EligibilitySimulationGroupSimulationsByYearAndMonthView } from 'src/application/eligibility-simulation/views/eligibility-simulation-group-simulations-by-year-and-month.view';
import { mockEligibilitySimulationRepository } from 'test/mocks/integration/eligibility-simulation';

describe('GroupEligibilitySimulationsByYearAndMonthUsecase', () => {
  let useCase: GroupEligibilitySimulationsByYearAndMonthUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupEligibilitySimulationsByYearAndMonthUsecase,
        {
          provide: 'EligibilitySimulationRepositoryInterface',
          useValue: mockEligibilitySimulationRepository,
        },
      ],
    }).compile();

    useCase = module.get<GroupEligibilitySimulationsByYearAndMonthUsecase>(
      GroupEligibilitySimulationsByYearAndMonthUsecase,
    );
  });

  it('should group simulations by year and month and return a view', async () => {
    const mockResults = [
      { year: 2024, month: 1, count: 10 },
      { year: 2024, month: 2, count: 20 },
    ];

    mockEligibilitySimulationRepository.groupSimulationsByYearAndMonth.mockResolvedValue(
      mockResults,
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(
      EligibilitySimulationGroupSimulationsByYearAndMonthView,
    );
    expect(result.data).toEqual(mockResults);
    expect(
      mockEligibilitySimulationRepository.groupSimulationsByYearAndMonth,
    ).toHaveBeenCalledTimes(1);
  });

  it('should return an empty view when no simulations are found', async () => {
    mockEligibilitySimulationRepository.groupSimulationsByYearAndMonth.mockResolvedValue(
      [],
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(
      EligibilitySimulationGroupSimulationsByYearAndMonthView,
    );
    expect(result.data).toEqual([]);
    expect(
      mockEligibilitySimulationRepository.groupSimulationsByYearAndMonth,
    ).toHaveBeenCalledTimes(1);
  });
});
