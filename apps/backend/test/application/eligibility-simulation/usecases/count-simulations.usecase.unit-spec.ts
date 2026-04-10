import { Test, TestingModule } from '@nestjs/testing';
import { CountEligibilitySimulationsUsecase } from 'src/application/eligibility-simulation/usecases/count-simulations.usecase';
import { mockEligibilitySimulationRepository } from 'test/mocks/integration/eligibility-simulation';

describe('CountEligibilitySimulationsUsecase', () => {
  let useCase: CountEligibilitySimulationsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountEligibilitySimulationsUsecase,
        {
          provide: 'EligibilitySimulationRepositoryInterface',
          useValue: mockEligibilitySimulationRepository,
        },
      ],
    }).compile();

    useCase = module.get<CountEligibilitySimulationsUsecase>(
      CountEligibilitySimulationsUsecase,
    );
  });

  it('should count simulations and return the count', async () => {
    mockEligibilitySimulationRepository.groupSimulationsByYearAndMonth.mockResolvedValue(
      [
        { year: 2024, month: 2, count: 12 },
        { year: 2024, month: 3, count: 42 },
      ],
    );

    const result = await useCase.execute({ year: 2024, month: 3 });

    expect(result).toBe(42);
    expect(
      mockEligibilitySimulationRepository.groupSimulationsByYearAndMonth,
    ).toHaveBeenCalledTimes(1);
  });

  it('should return 0 when no simulations are found', async () => {
    mockEligibilitySimulationRepository.groupSimulationsByYearAndMonth.mockResolvedValue(
      [{ year: 2024, month: 2, count: 12 }],
    );

    const result = await useCase.execute({ year: 2024, month: 3 });

    expect(result).toBe(0);
    expect(
      mockEligibilitySimulationRepository.groupSimulationsByYearAndMonth,
    ).toHaveBeenCalledTimes(1);
  });
});
