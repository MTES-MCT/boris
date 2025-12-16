import { Test, TestingModule } from '@nestjs/testing';
import { GroupByDepartementsUsecase } from 'src/application/landbot-customer/usecases/groupByDepartements.usecase';
import { LandbotCustomerGroupByDepartementsView } from 'src/application/landbot-customer/views/landbot-customer-group-by-departements.view';
import {
  mockLandbotCustomerRepository,
  mockGroupByDepartementsResults,
} from 'test/mocks/integration/landbot-customer';

describe('GroupByDepartementsUsecase', () => {
  let useCase: GroupByDepartementsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupByDepartementsUsecase,
        {
          provide: 'LandbotCustomerRepositoryInterface',
          useValue: mockLandbotCustomerRepository,
        },
      ],
    }).compile();

    useCase = module.get<GroupByDepartementsUsecase>(
      GroupByDepartementsUsecase,
    );
  });

  it('should group by departements and return a view with data', async () => {
    mockLandbotCustomerRepository.groupByDepartements.mockResolvedValue(
      mockGroupByDepartementsResults,
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(LandbotCustomerGroupByDepartementsView);
    expect(result.data).toEqual(mockGroupByDepartementsResults);
    expect(
      mockLandbotCustomerRepository.groupByDepartements,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.groupByDepartements,
    ).toHaveBeenCalledWith();
  });

  it('should return an empty array when no results are found', async () => {
    mockLandbotCustomerRepository.groupByDepartements.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(LandbotCustomerGroupByDepartementsView);
    expect(result.data).toEqual([]);
    expect(
      mockLandbotCustomerRepository.groupByDepartements,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.groupByDepartements,
    ).toHaveBeenCalledWith();
  });
});
