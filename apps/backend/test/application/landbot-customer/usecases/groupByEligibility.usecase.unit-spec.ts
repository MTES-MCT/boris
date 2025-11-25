import { Test, TestingModule } from '@nestjs/testing';
import { GroupByEligibilityUsecase } from 'src/application/landbot-customer/usecases/groupByEligibility.usecase';
import { LandbotCustomerGroupByFieldView } from 'src/application/landbot-customer/views/landbot-customer-group-by-field.view';

import {
  mockLandbotCustomerRepository,
  mockGroupByEligibilityResults,
} from 'test/mocks/integration/landbot-customer';

describe('GroupByEligibilityUsecase', () => {
  let useCase: GroupByEligibilityUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupByEligibilityUsecase,
        {
          provide: 'LandbotCustomerRepositoryInterface',
          useValue: mockLandbotCustomerRepository,
        },
      ],
    }).compile();

    useCase = module.get<GroupByEligibilityUsecase>(GroupByEligibilityUsecase);
  });

  it('should group by eligibility and return a view with data', async () => {
    mockLandbotCustomerRepository.groupByEligibility.mockResolvedValue(
      mockGroupByEligibilityResults,
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(LandbotCustomerGroupByFieldView);
    expect(result.data).toEqual(mockGroupByEligibilityResults);
    expect(
      mockLandbotCustomerRepository.groupByEligibility,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.groupByEligibility,
    ).toHaveBeenCalledWith();
  });

  it('should return an empty array when no results are found', async () => {
    mockLandbotCustomerRepository.groupByEligibility.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(LandbotCustomerGroupByFieldView);
    expect(result.data).toEqual([]);
    expect(
      mockLandbotCustomerRepository.groupByEligibility,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.groupByEligibility,
    ).toHaveBeenCalledWith();
  });
});
