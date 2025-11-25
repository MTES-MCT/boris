import { Test, TestingModule } from '@nestjs/testing';
import { GroupByRealEstateSituationUsecase } from 'src/application/landbot-customer/usecases/groupByRealEstateSituation.usecase';
import { LandbotCustomerGroupByFieldView } from 'src/application/landbot-customer/views/landbot-customer-group-by-field.view';

import {
  mockLandbotCustomerRepository,
  mockGroupByRealEstateSituationResults,
} from 'test/mocks/integration/landbot-customer';

describe('GroupByRealEstateSituationUsecase', () => {
  let useCase: GroupByRealEstateSituationUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupByRealEstateSituationUsecase,
        {
          provide: 'LandbotCustomerRepositoryInterface',
          useValue: mockLandbotCustomerRepository,
        },
      ],
    }).compile();

    useCase = module.get<GroupByRealEstateSituationUsecase>(
      GroupByRealEstateSituationUsecase,
    );
  });

  it('should group by realEstateSituation and return a view with data', async () => {
    mockLandbotCustomerRepository.groupByRealEstateSituation.mockResolvedValue(
      mockGroupByRealEstateSituationResults,
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(LandbotCustomerGroupByFieldView);
    expect(result.data).toEqual(mockGroupByRealEstateSituationResults);
    expect(
      mockLandbotCustomerRepository.groupByRealEstateSituation,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.groupByRealEstateSituation,
    ).toHaveBeenCalledWith();
  });

  it('should return an empty array when no results are found', async () => {
    mockLandbotCustomerRepository.groupByRealEstateSituation.mockResolvedValue(
      [],
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(LandbotCustomerGroupByFieldView);
    expect(result.data).toEqual([]);
    expect(
      mockLandbotCustomerRepository.groupByRealEstateSituation,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.groupByRealEstateSituation,
    ).toHaveBeenCalledWith();
  });
});
