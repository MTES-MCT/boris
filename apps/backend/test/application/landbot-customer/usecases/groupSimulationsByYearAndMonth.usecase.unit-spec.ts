import { Test, TestingModule } from '@nestjs/testing';
import { GroupSimulationsByYearAndMonthUsecase } from 'src/application/landbot-customer/usecases/groupSimulationsByYearAndMonth.usecase';
import { LandbotCustomerGroupSimulationsByYearAndMonthView } from 'src/application/landbot-customer/views/landbot-custommer-group-simulations-by-year-and-month.view';
import {
  mockGroupSimulationsByYearAndMonthResults,
  mockLandbotCustomerRepository,
} from 'test/mocks/integration/landbot-customer';

describe('GroupSimulationsByYearAndMonthUsecase', () => {
  let useCase: GroupSimulationsByYearAndMonthUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupSimulationsByYearAndMonthUsecase,
        {
          provide: 'LandbotCustomerRepositoryInterface',
          useValue: mockLandbotCustomerRepository,
        },
      ],
    }).compile();

    useCase = module.get<GroupSimulationsByYearAndMonthUsecase>(
      GroupSimulationsByYearAndMonthUsecase,
    );
  });

  it('should group simulations by year and month and return a view', async () => {
    mockLandbotCustomerRepository.groupSimulationsByYearAndMonth.mockResolvedValue(
      mockGroupSimulationsByYearAndMonthResults,
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(
      LandbotCustomerGroupSimulationsByYearAndMonthView,
    );
    expect(result.data).toEqual(mockGroupSimulationsByYearAndMonthResults);
    expect(
      mockLandbotCustomerRepository.groupSimulationsByYearAndMonth,
    ).toHaveBeenCalledTimes(1);
  });

  it('should return an empty view when no simulations are found', async () => {
    mockLandbotCustomerRepository.groupSimulationsByYearAndMonth.mockResolvedValue(
      [],
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(
      LandbotCustomerGroupSimulationsByYearAndMonthView,
    );
    expect(result.data).toEqual([]);
    expect(
      mockLandbotCustomerRepository.groupSimulationsByYearAndMonth,
    ).toHaveBeenCalledTimes(1);
  });
});
