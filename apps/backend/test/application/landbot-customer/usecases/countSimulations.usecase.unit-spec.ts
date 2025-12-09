import { Test, TestingModule } from '@nestjs/testing';
import { CountSimulationsUsecase } from 'src/application/landbot-customer/usecases/countSimulations.usecase';
import { CountSimulationsParams } from 'src/application/landbot-customer/usecases/countSimulations.params';
import { mockLandbotCustomerRepository } from 'test/mocks/integration/landbot-customer';

describe('CountSimulationsUsecase', () => {
  let useCase: CountSimulationsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountSimulationsUsecase,
        {
          provide: 'LandbotCustomerRepositoryInterface',
          useValue: mockLandbotCustomerRepository,
        },
      ],
    }).compile();

    useCase = module.get<CountSimulationsUsecase>(CountSimulationsUsecase);
  });

  it('should count simulations and return the count', async () => {
    const expectedCount = 42;
    const params: CountSimulationsParams = { year: 2024, month: 3 };
    mockLandbotCustomerRepository.countSimulations.mockResolvedValue(
      expectedCount,
    );

    const result = await useCase.execute(params);

    expect(result).toBe(expectedCount);
    expect(
      mockLandbotCustomerRepository.countSimulations,
    ).toHaveBeenCalledTimes(1);
    expect(mockLandbotCustomerRepository.countSimulations).toHaveBeenCalledWith(
      params.year,
      params.month,
    );
  });

  it('should return 0 when no simulations are found', async () => {
    const params: CountSimulationsParams = { year: 2024, month: 3 };
    mockLandbotCustomerRepository.countSimulations.mockResolvedValue(0);

    const result = await useCase.execute(params);

    expect(result).toBe(0);
    expect(
      mockLandbotCustomerRepository.countSimulations,
    ).toHaveBeenCalledTimes(1);
    expect(mockLandbotCustomerRepository.countSimulations).toHaveBeenCalledWith(
      params.year,
      params.month,
    );
  });
});
