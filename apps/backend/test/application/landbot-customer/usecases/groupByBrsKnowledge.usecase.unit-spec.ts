import { Test, TestingModule } from '@nestjs/testing';
import { GroupByBrsKnowledgeUsecase } from 'src/application/landbot-customer/usecases/groupByBrsKnowledge.usecase';
import { LandbotCustomerGroupByFieldView } from 'src/application/landbot-customer/views/landbot-customer-group-by-field.view';

import {
  mockLandbotCustomerRepository,
  mockGroupByBrsKnowledgeResults,
} from 'test/mocks/integration/landbot-customer';

describe('GroupByBrsKnowledgeUsecase', () => {
  let useCase: GroupByBrsKnowledgeUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupByBrsKnowledgeUsecase,
        {
          provide: 'LandbotCustomerRepositoryInterface',
          useValue: mockLandbotCustomerRepository,
        },
      ],
    }).compile();

    useCase = module.get<GroupByBrsKnowledgeUsecase>(
      GroupByBrsKnowledgeUsecase,
    );
  });

  it('should group by brsKnowledge and return a view with data', async () => {
    mockLandbotCustomerRepository.groupByBrsKnowledge.mockResolvedValue(
      mockGroupByBrsKnowledgeResults,
    );

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(LandbotCustomerGroupByFieldView);
    expect(result.data).toEqual(mockGroupByBrsKnowledgeResults);
    expect(
      mockLandbotCustomerRepository.groupByBrsKnowledge,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.groupByBrsKnowledge,
    ).toHaveBeenCalledWith();
  });

  it('should return an empty array when no results are found', async () => {
    mockLandbotCustomerRepository.groupByBrsKnowledge.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toBeInstanceOf(LandbotCustomerGroupByFieldView);
    expect(result.data).toEqual([]);
    expect(
      mockLandbotCustomerRepository.groupByBrsKnowledge,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockLandbotCustomerRepository.groupByBrsKnowledge,
    ).toHaveBeenCalledWith();
  });
});
